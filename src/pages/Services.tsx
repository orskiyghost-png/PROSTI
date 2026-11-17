import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import s from './Services.module.css'

const base = import.meta.env.BASE_URL

const services = [
  {
    title: 'UI UX',
    do: 'Исследование, сценарии, структура, прототипы и дизайн-система.',
    get: 'Карту пользовательских путей, wireframes, интерактивный прототип и UI-kit.',
    format: 'Продуктовый спринт или проект целиком.',
  },
  {
    title: 'Web Design',
    do: 'Арт-дирекшн, сетка, типографика, фото и движение для сайта.',
    get: 'Макеты всех экранов, адаптивные композиции и правила системы.',
    format: 'Лендинг, портфолио или корпоративный сайт.',
  },
  {
    title: 'Web Development',
    do: 'Сборка на React и TypeScript, анимации GSAP, WebGL и доступность.',
    get: 'Production-код, адаптив, проверку в браузерах и fallback без WebGL.',
    format: 'Вёрстка по макету или полный цикл дизайн + код.',
  },
  {
    title: 'App Design',
    do: 'Мобильные сценарии, компоненты, состояния и прототип.',
    get: 'Макеты для iOS и Android, спецификации и библиотеку компонентов.',
    format: 'MVP или следующая итерация продукта.',
  },
]

export default function Services() {
  useDocumentTitle('Services — SURKOV')
  const [open, setOpen] = useState<number | null>(0)

  return (
    <article className={s.page}>
      <div className={s.texture} aria-hidden="true">
        <img src={`${base}media/tex-services.webp`} alt="" width="2048" height="2048" loading="lazy" decoding="async" />
      </div>

      <header className={s.head}>
        <div className={`${s.meta} micro`}>
          <span>Services</span>
          <span>Four directions — no prices</span>
        </div>
        <h1 className={s.title} lang="en">SERVICES</h1>
        <div className={s.rule} aria-hidden="true" />
        <p className={s.lead}>
          Четыре направления. Беру задачу целиком или подключаюсь к команде на конкретном этапе.
        </p>
      </header>

      <section className={s.listSection} aria-labelledby="services-list-heading">
        <h2 id="services-list-heading" className="micro">Направления</h2>
        <ol className={s.list}>
          {services.map((service, index) => {
            const isOpen = open === index
            const panelId = `service-panel-${index}`
            const buttonId = `service-button-${index}`
            return (
              <li key={service.title} className={s.item}>
                <h3 className={s.itemHeading}>
                  <button
                    id={buttonId}
                    type="button"
                    className={s.trigger}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : index)}
                  >
                    <span className={s.name}>{service.title}</span>
                    <span className={`${s.toggle} ${isOpen ? s.toggleOpen : ''}`} aria-hidden="true">
                      <span />
                      <span />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={s.panel}
                  hidden={!isOpen}
                >
                  <div className={s.panelGrid}>
                    <div>
                      <p className={`${s.panelLabel} micro`}>Что делаю</p>
                      <p>{service.do}</p>
                    </div>
                    <div>
                      <p className={`${s.panelLabel} micro`}>Что получаете</p>
                      <p>{service.get}</p>
                    </div>
                    <div>
                      <p className={`${s.panelLabel} micro`}>Формат</p>
                      <p>{service.format}</p>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      <section className={s.cta} aria-labelledby="services-cta-heading">
        <p className="micro">Next</p>
        <h2 id="services-cta-heading" className={s.ctaTitle}>НУЖЕН<br />ПРОЕКТ?</h2>
        <Link to="/contact" className={s.ctaLink}>Обсудить задачу <span aria-hidden="true">↗</span></Link>
      </section>
    </article>
  )
}
