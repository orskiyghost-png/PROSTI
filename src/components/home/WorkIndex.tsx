import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { projects } from '../../content/projects'
import s from './WorkIndex.module.css'

const base = import.meta.env.BASE_URL
const featured = projects.slice(0, 3)

export default function WorkIndex() {
  const sectionRef = useRef<HTMLElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [image, setImage] = useState(featured[0])

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const section = sectionRef.current
    const preview = previewRef.current
    if (!section || !preview) return

    const xTo = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3.out' })

    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect()
      xTo(event.clientX - rect.left)
      yTo(event.clientY - rect.top)
    }
    const onLeave = () => {
      gsap.to(preview, { autoAlpha: 0, scale: 0.94, duration: 0.25, ease: 'power2.out' })
    }
    const onEnter = () => {
      gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power3.out' })
    }

    section.addEventListener('pointermove', onMove, { passive: true })
    section.addEventListener('pointerleave', onLeave)
    const rows = [...section.querySelectorAll<HTMLElement>('[data-preview]')]
    rows.forEach((row) => row.addEventListener('pointerenter', onEnter))

    return () => {
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      rows.forEach((row) => row.removeEventListener('pointerenter', onEnter))
    }
  }, [])

  return (
    <section ref={sectionRef} className={s.section} aria-labelledby="index-heading">
      <header className={s.head}>
        <p className="micro">Selected work</p>
        <h2 id="index-heading" className={s.title}>ИЗБРАННОЕ</h2>
        <p className={s.note}>Четыре направления. Один способ думать. Все проекты ниже — концепты.</p>
      </header>

      <ul className={s.list}>
        {featured.map((project) => (
          <li key={project.slug}>
            <Link
              to={`/works/${project.slug}`}
              className={s.row}
              data-preview
              onPointerEnter={() => setImage(project)}
              onFocus={() => setImage(project)}
            >
              <span className={s.name}>{project.title}</span>
              <span className={s.thumb} aria-hidden="true">
                <img src={`${base}${project.cover}`} alt="" loading="lazy" width="640" height="800" />
              </span>
              <span className={`${s.meta} micro`}>{project.direction} — CONCEPT</span>
              <span className={s.arrow} aria-hidden="true">↗</span>
            </Link>
          </li>
        ))}
      </ul>

      <Link to="/works" className={s.all}>
        Все работы <span aria-hidden="true">→</span>
      </Link>

      <div ref={previewRef} className={s.preview} aria-hidden="true">
        <img ref={imageRef} src={`${base}${image.cover}`} alt="" width="640" height="800" />
        <span className={`${s.previewLabel} micro`}>{image.title} · CONCEPT</span>
      </div>
    </section>
  )
}
