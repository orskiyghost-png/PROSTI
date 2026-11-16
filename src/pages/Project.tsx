import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectCover from '../components/ProjectCover'
import { findProject, projects } from '../content/projects'
import { useReducedMotion } from '../motion/useReducedMotion'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import NotFound from './NotFound'
import s from './Project.module.css'

gsap.registerPlugin(ScrollTrigger)

const base = import.meta.env.BASE_URL

export default function Project() {
  const { slug } = useParams()
  const project = findProject(slug)
  const reduced = useReducedMotion()
  const rootRef = useRef<HTMLElement>(null)
  useDocumentTitle(project ? `${project.title} — SURKOV` : '404 — SURKOV')

  useEffect(() => {
    if (reduced || !rootRef.current || !project) return
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { y: 32, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              toggleActions: 'play reverse play reverse',
            },
          },
        )
      })
    }, rootRef)
    return () => context.revert()
  }, [project, reduced])

  if (!project) return <NotFound />

  const index = projects.indexOf(project)
  const next = projects[(index + 1) % projects.length]

  return (
    <article ref={rootRef} className={s.page}>
      <header className={s.head}>
        <div className={`${s.meta} micro`}>
          <Link to="/works" className={s.back}>← Works</Link>
          <span>[ 02.{String(index + 1).padStart(2, '0')} ] / Project</span>
          <span>CONCEPT</span>
        </div>
        <h1 className={s.title} lang="en">{project.title}</h1>
        <div className={s.rule} aria-hidden="true" />
        <p className={s.lead}>{project.summary}</p>
      </header>

      <figure className={s.cover}>
        <ProjectCover
          key={project.slug}
          src={`${base}${project.cover}`}
          alt={`Обложка концепта ${project.title}: ${project.summary}`}
          ratio={project.ratio}
        />
        <figcaption className={`${s.coverCaption} micro`}>
          <span>Cover — {project.title}</span>
          <span>CONCEPT / {project.year}</span>
        </figcaption>
      </figure>

      <dl className={s.passport}>
        <div>
          <dt className="micro">Год</dt>
          <dd>{project.year}</dd>
        </div>
        <div>
          <dt className="micro">Роль</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt className="micro">Направление</dt>
          <dd>{project.direction}</dd>
        </div>
        <div>
          <dt className="micro">Статус</dt>
          <dd>CONCEPT</dd>
        </div>
      </dl>

      <section className={s.story} aria-labelledby="task-heading">
        <div className={s.storyLabel} data-reveal>
          <p className="micro">[ 01 ] / Task</p>
          <h2 id="task-heading" className={s.storyTitle}>ЗАДАЧА</h2>
        </div>
        <div className={s.storyBody}>
          <p className={s.task} data-reveal>{project.task}</p>
          <div className={s.solution} data-reveal>
            <p className="micro">Решение</p>
            <p>{project.solution}</p>
          </div>
        </div>
      </section>

      <section className={s.screens} aria-labelledby="screens-heading">
        <div className={s.screensHead} data-reveal>
          <p className="micro">[ 02 ] / Screens</p>
          <h2 id="screens-heading" className={s.sectionTitle}>ЭКРАНЫ</h2>
          <p className={s.sectionNote}>
            Схема интерфейса собрана в коде. Фото — обложка концепта, не готовый экран.
          </p>
        </div>

        <div className={s.screenGrid}>
          <figure className={s.screenFigure} data-reveal>
            <img
              src={`${base}${project.cover}`}
              alt=""
              width="1600"
              height="1200"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="micro">FRAME 01 — COVER / CONCEPT</figcaption>
          </figure>

          <div className={s.uiScreen} data-reveal>
            <div className={`${s.uiBar} micro`}>
              <span>{project.title}</span>
              <span>UI / CONCEPT</span>
            </div>
            <div className={s.uiBody}>
              <p className={`${s.uiMeta} micro`}>{project.direction} — {project.year}</p>
              <p className={s.uiTitle}>{project.title}</p>
              <div className={s.uiRule} />
              <ul className={s.uiRows}>
                {project.system.slice(0, 3).map((item, rowIndex) => (
                  <li key={item}>
                    <span className="micro">{String(rowIndex + 1).padStart(2, '0')}</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className={s.uiImage}>
                <img
                  src={`${base}${project.cover}`}
                  alt=""
                  width="1200"
                  height="900"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <div className={`${s.uiFoot} micro`}>
              <span>CONCEPT</span>
              <span>[ 0{index + 1} / 0{projects.length} ]</span>
            </div>
          </div>
        </div>
      </section>

      <section className={s.system} aria-labelledby="system-heading">
        <div className={s.systemHead} data-reveal>
          <p className="micro">[ 03 ] / System</p>
          <h2 id="system-heading" className={s.systemTitle}>СИСТЕМА</h2>
        </div>
        <ul className={s.systemList}>
          {project.system.map((item, systemIndex) => (
            <li key={item} data-reveal>
              <span className="micro">{String(systemIndex + 1).padStart(2, '0')}</span>
              <p>{item}</p>
            </li>
          ))}
        </ul>
      </section>

      <nav className={s.next} aria-label="Следующий проект">
        <p className="micro">Следующий проект</p>
        <Link to={`/works/${next.slug}`} className={s.nextLink}>
          <span>{next.title}</span>
          <span className={s.nextMeta}><span className="micro">{next.direction} / CONCEPT</span> ↗</span>
        </Link>
      </nav>
    </article>
  )
}
