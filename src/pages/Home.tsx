import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroVisual from '../components/home/HeroVisual'
import WorkIndex from '../components/home/WorkIndex'
import ProcessScroll from '../components/home/ProcessScroll'
import { useReducedMotion } from '../motion/useReducedMotion'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import s from './Home.module.css'

gsap.registerPlugin(ScrollTrigger)

const base = import.meta.env.BASE_URL
const INTRO_KEY = 'surkov-intro'

export default function Home() {
  useDocumentTitle('SURKOV — Design / Development')
  const reduced = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const floatRefs = useRef<HTMLDivElement>(null)
  const manifestRef = useRef<HTMLElement>(null)
  const [intro, setIntro] = useState(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return sessionStorage.getItem(INTRO_KEY) !== 'done'
  })

  useEffect(() => {
    if (!intro) return
    const cover = introRef.current
    const words = nameRef.current?.querySelectorAll<HTMLElement>('[data-word]')
    const floats = floatRefs.current?.querySelectorAll<HTMLElement>('[data-float]')
    if (!cover || !words?.length || !floats?.length) return

    sessionStorage.setItem(INTRO_KEY, 'done')
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        onComplete: () => setIntro(false),
      })
      timeline
        .to(cover, { yPercent: -100, duration: 0.55, ease: 'power4.inOut', delay: 0.15 })
        .to(words, { yPercent: 0, duration: 0.9, stagger: 0.07, ease: 'power3.out' }, '-=0.15')
        .from(floats, { autoAlpha: 0, y: 48, rotate: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=0.55')
    })

    return () => context.revert()
  }, [intro])

  useEffect(() => {
    if (reduced || !heroRef.current) return
    const context = gsap.context(() => {
      gsap.to(`.${s.object}`, {
        yPercent: 9,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
      })
      gsap.to(`.${s.floatA}, .${s.floatB}`, {
        y: (index) => (index === 0 ? -46 : -70),
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 0.8 },
      })
    }, heroRef)
    return () => context.revert()
  }, [reduced])

  useEffect(() => {
    if (reduced || !manifestRef.current) return
    const lines = manifestRef.current.querySelectorAll<HTMLElement>('[data-line]')
    if (!lines.length) return
    const context = gsap.context(() => {
      gsap.fromTo(
        lines,
        { yPercent: 112 },
        {
          yPercent: 0,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: manifestRef.current,
            start: 'top 82%',
            end: 'bottom 55%',
            scrub: 0.7,
          },
        },
      )
    }, manifestRef)
    return () => context.revert()
  }, [reduced])

  return (
    <>
      <section ref={heroRef} className={s.hero} aria-labelledby="home-title">
        {intro && (
          <div ref={introRef} className={s.intro} aria-hidden="true">
            <p className={`${s.introMeta} micro`}>[ SURKOV ] — PORTFOLIO / 2026</p>
            <p className={s.introWord}>PRINT<br />ERROR</p>
            <p className={`${s.introFoot} micro`}>Loading paper — please wait</p>
          </div>
        )}

        <div className={s.heroMeta}>
          <p className="micro">ARTEM SURKOV — DESIGN / DEVELOPMENT</p>
          <p className={`${s.heroRight} micro`}>PORTFOLIO / EDITION 01</p>
        </div>

        <h1 id="home-title" ref={nameRef} className={`${s.mega} ${intro ? s.introActive : ''}`} aria-label="SURKOV">
          <span className={s.mask} aria-hidden="true"><span className={s.word} data-word>SUR</span></span>
          <span className={s.mask} aria-hidden="true"><span className={s.word} data-word>KOV</span></span>
        </h1>

        <div className={s.object}>
          <HeroVisual
            src={`${base}media/hero-object.webp`}
            alt="Скульптура из старого ноутбука и CRT-монитора, экран в статике"
            triggerRef={heroRef}
          />
        </div>

        <div className={s.floats} ref={floatRefs}>
          <figure className={`${s.float} ${s.floatA}`} data-float>
            <img src={`${base}media/float-01.webp`} alt="Фигура в длинном тёмном плаще с капюшоном на белом фоне" width="900" height="1200" />
            <figcaption className="micro">FIG. 01 — SILHOUETTE</figcaption>
          </figure>
          <figure className={`${s.float} ${s.floatB}`} data-float>
            <img src={`${base}media/float-02.webp`} alt="Руки держат лист бумаги над стеклом копира, свет сканера между пальцами" width="900" height="1200" />
            <figcaption className="micro">FIG. 02 — TONER / LIGHT</figcaption>
          </figure>
        </div>

        <div className={s.heroFoot}>
          <p className={`${s.position} `}>Дизайн, который<br />помнят руками.</p>
          <p className={`${s.disciplines} micro`}>UI/UX / WEB / DEV / APP</p>
          <Link to="/works" className={`${s.scrollCue} micro`}>[ SCROLL ] <span aria-hidden="true">↓</span></Link>
        </div>
      </section>

      <WorkIndex />
      <ProcessScroll />

      <section ref={manifestRef} className={s.manifest} aria-labelledby="manifest-heading">
        <div className={s.manifestMeta}>
          <p className="micro">[ 03 ] / Manifest</p>
          <p className={`${s.manifestNote} micro`}>Печать, бумага, жест. Интерфейс должен оставлять след.</p>
        </div>
        <h2 id="manifest-heading" className={s.manifestText} aria-label="Дизайн, который помнят руками.">
          <span className={s.lineMask} aria-hidden="true"><span className={s.line} data-line>ДИЗАЙН,</span></span>
          <span className={s.lineMask} aria-hidden="true"><span className={s.line} data-line>КОТОРЫЙ</span></span>
          <span className={s.lineMask} aria-hidden="true"><span className={s.line} data-line>ПОМНЯТ</span></span>
          <span className={s.lineMask} aria-hidden="true"><span className={s.line} data-line>РУКАМИ.</span></span>
        </h2>
        <p className={`${s.manifestFoot} micro`}>SURKOV / PRINT ERROR — 2026</p>
      </section>

      <section className={s.close} aria-labelledby="close-heading">
        <p className="micro">[ 04 ] / Next</p>
        <h2 id="close-heading" className={s.closeTitle}>LET&apos;S<br />TALK</h2>
        <Link to="/contact" className={s.closeLink}>Обсудить проект <span aria-hidden="true">↗</span></Link>
        <p className={`${s.closeNote} micro`}>Открыт к новым задачам. Контакты — на странице Contact.</p>
      </section>
    </>
  )
}
