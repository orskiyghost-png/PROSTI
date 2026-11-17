import { Link } from 'react-router-dom'
import HalftoneImage from '../components/HalftoneImage'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import s from './About.module.css'

const base = import.meta.env.BASE_URL

const principles = [
  {
    title: 'Структура раньше стиля',
    text: 'Сначала сценарии, сетка и иерархия. Потом характер: шрифт, фактура, движение.',
  },
  {
    title: 'Один эффект на экран',
    text: 'Дисторшн, видео и мегатипографика не спорят. Главный эффект ведёт, остальное поддерживает.',
  },
  {
    title: 'Движение объясняет',
    text: 'Анимация показывает связь между состояниями. Если её убрать, смысл не должен потеряться.',
  },
  {
    title: 'Проверка на устройстве',
    text: 'Макет живёт, пока работает на телефоне, с клавиатуры и без WebGL.',
  },
]

const tools = [
  'Figma',
  'Illustrator',
  'Photoshop',
  'After Effects',
  'HTML и CSS',
  'TypeScript',
  'React',
  'GSAP',
  'WebGL',
  'Git',
]

export default function About() {
  useDocumentTitle('About — SURKOV')
  return (
    <article className={s.page}>
      <header className={s.head}>
        <div className={`${s.meta} micro`}>
          <span>About</span>
          <span>Artem Surkov — Edition</span>
        </div>

        <h1 className={s.title} lang="en">ABOUT</h1>
        <div className={s.rule} aria-hidden="true" />

        <div className={s.intro}>
          <div className={s.introText}>
            <p className={s.lead}>
              Дизайнер интерфейсов и разработчик. Делаю сайты, приложения и системы, которые хочется трогать.
            </p>
            <div className={s.body}>
              <p>Живу и работаю в России.</p>
              <p>
                Четыре направления: UI UX, веб-дизайн, фронтенд и приложения. Один способ думать:
                сначала структура, потом характер, потом движение.
              </p>
              <p>
                Люблю бумагу, бетон, плохую печать и хорошие сетки. Интерфейс должен оставлять след —
                не только на экране.
              </p>
            </div>
          </div>

          <figure className={s.portrait}>
            <HalftoneImage
              src={`${base}media/about-portrait.webp`}
              alt="Анонимный портрет со спины: человек в чёрной куртке перед стеной с бумажными эскизами"
              width={900}
              height={1200}
              className={s.portraitImage}
            />
            <figcaption className={`${s.portraitCaption} micro`}>
              <span>FIG — STAND-IN</span>
              <span>Не реальное фото</span>
            </figcaption>
          </figure>
        </div>
      </header>

      <section className={s.approach} aria-labelledby="approach-heading">
        <div className={s.sectionHead}>
          <p className="micro">Approach</p>
          <h2 id="approach-heading" className={s.sectionTitle}>ПОДХОД</h2>
          <p className={s.sectionNote}>Четыре правила, по которым собирается каждая работа.</p>
        </div>

        <ol className={s.principles}>
          {principles.map((item) => (
            <li key={item.title} className={s.principle}>
              <h3 className={s.principleTitle}>{item.title}</h3>
              <p className={s.principleText}>{item.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.tools} aria-labelledby="tools-heading">
        <div className={s.toolsHead}>
          <p className="micro">Toolkit</p>
          <h2 id="tools-heading" className={s.toolsTitle}>ИНСТРУМЕНТЫ</h2>
          <p className={s.toolsNote}>Набор меняется под задачу. Эти — рабочие.</p>
        </div>
        <ul className={`${s.toolList} micro`}>
          {tools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </section>

      <div className={s.next}>
        <p className="micro">Дальше — работы</p>
        <Link to="/works" className={s.nextLink}>
          Смотреть работы <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  )
}
