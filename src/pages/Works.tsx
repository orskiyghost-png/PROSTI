import { useRef, useState, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { projects, projectDirections } from '../content/projects'
import { useReducedMotion } from '../motion/useReducedMotion'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import s from './Works.module.css'

const base = import.meta.env.BASE_URL
const pad = (n: number) => String(n).padStart(2, '0')
const dimensions = (ratio: string) => {
  const [w, h] = ratio.split('/').map((part) => Number(part.trim()))
  return { width: 1600, height: Math.round((1600 * h) / w) }
}

export default function Works() {
  useDocumentTitle('Works — SURKOV')
  const [filter, setFilter] = useState<(typeof projectDirections)[number]>('All')
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null)
  const reduced = useReducedMotion()
  const visible = filter === 'All' ? projects : projects.filter((project) => project.direction === filter)

  const warp = () => {
    const node = displacementRef.current
    if (!node || reduced) return
    gsap.killTweensOf(node)
    gsap.fromTo(
      node,
      { attr: { scale: 0 } },
      { attr: { scale: 30 }, duration: 0.16, ease: 'power2.out', yoyo: true, repeat: 1, repeatDelay: 0.03 },
    )
  }

  const onEnter = (event: PointerEvent<HTMLAnchorElement>) => {
    if (reduced) return
    const image = event.currentTarget.querySelector('img')
    if (image) image.style.filter = 'url(#works-warp)'
    warp()
  }

  const onLeave = (event: PointerEvent<HTMLAnchorElement>) => {
    const image = event.currentTarget.querySelector('img')
    if (image) image.style.filter = ''
    const node = displacementRef.current
    if (node) gsap.killTweensOf(node)
  }

  const onTap = (event: PointerEvent<HTMLAnchorElement>) => {
    if (reduced || event.pointerType === 'mouse') return
    const image = event.currentTarget.querySelector('img')
    if (!image) return
    image.style.filter = 'url(#works-warp)'
    warp()
    window.setTimeout(() => {
      image.style.filter = ''
    }, 520)
  }

  return (
    <article className={s.page}>
      <header className={s.head}>
        <div className={`${s.meta} micro`}>
          <span>[ 02 ] / Works</span>
          <span>Four directions — one system</span>
        </div>
        <h1 className={s.title} lang="en">
          WORKS <span className={`${s.count} micro`}>({pad(projects.length)})</span>
        </h1>
        <div className={s.rule} aria-hidden="true" />
        <p className={s.lead}>
          Концепты первой волны. Четыре направления, четыре разных характера. Все работы помечены CONCEPT.
        </p>
      </header>

      <div className={s.filters} role="group" aria-label="Фильтр работ по направлению">
        {projectDirections.map((direction) => {
          const total = direction === 'All' ? projects.length : projects.filter((p) => p.direction === direction).length
          return (
            <button
              key={direction}
              type="button"
              className={`${s.filter} ${filter === direction ? s.filterActive : ''}`}
              aria-pressed={filter === direction}
              onClick={() => setFilter(direction)}
            >
              {direction === 'All' ? 'Все' : direction}
              <span className="micro">{pad(total)}</span>
            </button>
          )
        })}
      </div>

      <ul className={s.grid}>
        {visible.map((project, index) => {
          const original = projects.indexOf(project)
          const dims = dimensions(project.ratio)
          return (
            <li key={`${filter}-${project.slug}`} className={`${s.item} ${s[`i${index}`]}`}>
              <Link
                to={`/works/${project.slug}`}
                className={s.card}
                onPointerEnter={onEnter}
                onPointerLeave={onLeave}
                onPointerDown={onTap}
                aria-label={`${project.title} — концепт, ${project.direction}`}
              >
                <figure className={s.media} style={{ aspectRatio: project.ratio }}>
                  <img
                    src={`${base}${project.cover}`}
                    alt={`Обложка концепта ${project.title}: ${project.summary}`}
                    width={dims.width}
                    height={dims.height}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className={`${s.view} micro`} aria-hidden="true">View <span>↗</span></span>
                </figure>
                <div className={s.caption}>
                  <span className={`${s.captionIndex} micro`}>{pad(original + 1)} / {project.direction}</span>
                  <h2 className={s.name}>{project.title}</h2>
                  <span className={`${s.captionMeta} micro`}>CONCEPT / {project.year}</span>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

      <p className={`${s.status} micro`} aria-live="polite">
        Показано: {pad(visible.length)} / {pad(projects.length)}
      </p>

      <div className={s.next}>
        <p className="micro">Не нашли направление?</p>
        <Link to="/services" className={s.nextLink}>Смотреть услуги <span aria-hidden="true">↗</span></Link>
      </div>

      <svg className={s.filterSvg} aria-hidden="true" focusable="false">
        <filter id="works-warp" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="2" seed="7" result="noise" />
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
    </article>
  )
}
