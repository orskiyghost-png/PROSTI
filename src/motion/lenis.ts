import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initLenis(): () => void {
  const pointerQuery = window.matchMedia('(pointer: fine)')
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  let lenis: Lenis | undefined
  let destroyed = false

  const onTick = (time: number) => lenis?.raf(time * 1000)

  const destroyLenis = () => {
    if (!lenis) return
    gsap.ticker.remove(onTick)
    lenis.destroy()
    lenis = undefined
  }

  const updateMode = () => {
    if (destroyed) return

    if (!pointerQuery.matches || motionQuery.matches) {
      destroyLenis()
      return
    }

    if (lenis) return

    lenis = new Lenis({ syncTouch: false, autoRaf: false })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(onTick)
  }

  pointerQuery.addEventListener('change', updateMode)
  motionQuery.addEventListener('change', updateMode)
  updateMode()

  return () => {
    if (destroyed) return
    destroyed = true
    pointerQuery.removeEventListener('change', updateMode)
    motionQuery.removeEventListener('change', updateMode)
    destroyLenis()
  }
}
