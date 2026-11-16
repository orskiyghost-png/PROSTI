import { useCallback, useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import s from './RouteTransition.module.css'

type Props = { children: ReactNode }
type Phase = 'idle' | 'covering' | 'revealing' | 'history'

const TRANSITION_DURATION = 0.55

export default function RouteTransition({ children }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const navigateRef = useRef(navigate)
  const veilRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Tween | null>(null)
  const phaseRef = useRef<Phase>('idle')
  const pendingNavigateRef = useRef<(() => void) | null>(null)
  const lastRouteRef = useRef(`${location.pathname}${location.search}`)
  navigateRef.current = navigate

  const focusMain = useCallback(() => {
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [])

  const reveal = useCallback(() => {
    const veil = veilRef.current
    if (!veil) {
      phaseRef.current = 'idle'
      focusMain()
      return
    }

    phaseRef.current = 'revealing'
    timelineRef.current?.kill()
    timelineRef.current = gsap.to(veil, {
      yPercent: -100,
      duration: TRANSITION_DURATION,
      ease: 'power3.inOut',
      onComplete: () => {
        gsap.set(veil, { yPercent: 100 })
        phaseRef.current = 'idle'
        timelineRef.current = null
        focusMain()
      },
    })
  }, [focusMain])

  const cover = useCallback((onComplete: () => void) => {
    const veil = veilRef.current
    if (!veil) {
      onComplete()
      return
    }

    timelineRef.current?.kill()
    phaseRef.current = 'covering'
    timelineRef.current = gsap.fromTo(
      veil,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: TRANSITION_DURATION,
        ease: 'power3.inOut',
        onComplete: () => {
          timelineRef.current = null
          onComplete()
        },
      },
    )
  }, [])

  useLayoutEffect(() => {
    const nextRoute = `${location.pathname}${location.search}`
    if (nextRoute === lastRouteRef.current) return
    lastRouteRef.current = nextRoute

    if (phaseRef.current === 'covering') {
      reveal()
      return
    }
    if (phaseRef.current === 'history') {
      reveal()
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(veilRef.current, { yPercent: 100 })
      phaseRef.current = 'idle'
      return
    }

    cover(reveal)
  }, [location.hash, location.key, location.pathname, location.search, cover, reveal])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
        event.shiftKey || event.altKey || phaseRef.current !== 'idle'
      ) return

      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest('a[href]')
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download') || anchor.getAttribute('rel')?.split(/\s+/).includes('external')) return

      const destination = new URL(anchor.href, window.location.href)
      if (destination.origin !== window.location.origin) return

      const basePath = new URL(import.meta.env.BASE_URL, window.location.origin).pathname
      if (!destination.pathname.startsWith(basePath)) return

      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
      const next = `${destination.pathname}${destination.search}${destination.hash}`
      if (current === next) return
      if (
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search
      ) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      event.preventDefault()
      const route = `${destination.pathname.slice(basePath.length - 1)}${destination.search}${destination.hash}`
      pendingNavigateRef.current = () => navigateRef.current(route)
      cover(() => {
        const commitNavigation = pendingNavigateRef.current
        pendingNavigateRef.current = null
        commitNavigation?.()
      })
    }

    const onPopState = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const nextRoute = `${window.location.pathname}${window.location.search}`
      if (nextRoute === lastRouteRef.current) return
      pendingNavigateRef.current = null
      timelineRef.current?.kill()
      phaseRef.current = 'history'
      gsap.set(veilRef.current, { yPercent: 0 })
    }

    const onMotionChange = (event: MediaQueryListEvent) => {
      if (!event.matches || phaseRef.current === 'idle') return
      timelineRef.current?.kill()
      timelineRef.current = null
      gsap.set(veilRef.current, { yPercent: 100 })
      phaseRef.current = 'idle'
      const commitNavigation = pendingNavigateRef.current
      pendingNavigateRef.current = null
      commitNavigation?.()
      focusMain()
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    document.addEventListener('click', onClick, true)
    window.addEventListener('popstate', onPopState)
    motionQuery.addEventListener('change', onMotionChange)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('popstate', onPopState)
      motionQuery.removeEventListener('change', onMotionChange)
      timelineRef.current?.kill()
      timelineRef.current = null
    }
  }, [cover, focusMain, reveal])

  return (
    <>
      {children}
      <div ref={veilRef} className={s.veil} aria-hidden="true" />
    </>
  )
}
