import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useReducedMotion } from '../motion/useReducedMotion'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import s from './NotFound.module.css'

export default function NotFound() {
  useDocumentTitle('404 — SURKOV')
  const reduced = useReducedMotion()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null)

  useEffect(() => {
    if (reduced) return
    const title = titleRef.current
    const displacement = displacementRef.current
    if (!title || !displacement) return

    const enter = () => {
      title.style.filter = 'url(#notfound-warp)'
      gsap.killTweensOf(displacement)
      gsap.fromTo(
        displacement,
        { attr: { scale: 0 } },
        { attr: { scale: 42 }, duration: 0.22, ease: 'power2.out', yoyo: true, repeat: 1 },
      )
    }
    const leave = () => {
      title.style.filter = ''
      gsap.killTweensOf(displacement)
      gsap.set(displacement, { attr: { scale: 0 } })
    }

    title.addEventListener('pointerenter', enter)
    title.addEventListener('pointerleave', leave)
    return () => {
      title.removeEventListener('pointerenter', enter)
      title.removeEventListener('pointerleave', leave)
      title.style.filter = ''
    }
  }, [reduced])

  return (
    <section className={s.page}>
      <div className={`${s.meta} micro`}>
        <span>[ 404 ] / Not found</span>
        <span>Page not printed</span>
      </div>

      <h1 ref={titleRef} className={s.title} aria-label="404">
        <span aria-hidden="true">4</span>
        <span aria-hidden="true">0</span>
        <span aria-hidden="true">4</span>
      </h1>

      <div className={s.rule} aria-hidden="true" />

      <div className={s.body}>
        <p className={s.lead}>
          Страница не напечаталась. Такого адреса нет — возможно, лист зажевало.
        </p>
        <Link to="/" className={s.link}>На главную <span aria-hidden="true">↗</span></Link>
      </div>

      <p className={`${s.foot} micro`}>SURKOV / PRINT ERROR — 404 / END OF PAPER</p>

      <svg className={s.filterSvg} aria-hidden="true" focusable="false">
        <filter id="notfound-warp" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap
            ref={displacementRef}
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </section>
  )
}
