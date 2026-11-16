import { useState, type FormEvent } from 'react'
import HalftoneImage from '../components/HalftoneImage'
import { config } from '../config'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import s from './Contact.module.css'

const base = import.meta.env.BASE_URL

type FieldErrors = { name?: string; email?: string; message?: string }
type Status = { kind: 'idle' | 'pending' | 'error' | 'info' | 'success'; message: string }

export default function Contact() {
  useDocumentTitle('Contact — SURKOV')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle', message: '' })

  const pendingContacts = !config.email && !config.telegram && !config.phone
  const hasDirect = Boolean(config.email || config.telegram || config.phone)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    const nextErrors: FieldErrors = {}

    if (name.length < 2) nextErrors.name = 'Укажите имя — минимум 2 символа.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Укажите email в формате name@domain.ru.'
    if (message.length < 10) nextErrors.message = 'Опишите задачу — минимум 10 символов.'

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setStatus({ kind: 'error', message: 'Проверьте поля формы.' })
      const first = nextErrors.name ? 'field-name' : nextErrors.email ? 'field-email' : 'field-message'
      requestAnimationFrame(() => document.getElementById(first)?.focus())
      return
    }

    if (config.formEndpoint) {
      setStatus({ kind: 'pending', message: 'Отправляю сообщение…' })
      try {
        const response = await fetch(config.formEndpoint, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        })
        if (!response.ok) throw new Error(String(response.status))
        form.reset()
        setStatus({ kind: 'success', message: 'Сообщение отправлено. Отвечу на указанный email.' })
      } catch {
        setStatus({ kind: 'error', message: 'Не удалось отправить. Попробуйте позже или напишите напрямую.' })
      }
      return
    }

    if (config.email) {
      const subject = encodeURIComponent(`Проект — ${name}`)
      const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`)
      window.location.href = `mailto:${config.email}?subject=${subject}&body=${body}`
      setStatus({ kind: 'info', message: 'Открываю почтовый клиент. Автоматической отправки нет.' })
      return
    }

    setStatus({
      kind: 'error',
      message: 'Приём сообщений не настроен. Форма ничего не отправила. Контакты будут добавлены позже.',
    })
  }

  return (
    <article className={s.page}>
      <header className={s.head}>
        <div className={`${s.meta} micro`}>
          <span>[ 04 ] / Contact</span>
          <span>Open for projects — 2026</span>
        </div>
        <h1 className={s.title} lang="en">CONTACT</h1>
        <div className={s.rule} aria-hidden="true" />
        <p className={s.lead}>
          Открыт к новым задачам: сайты, интерфейсы, приложения. Расскажите, что нужно сделать.
        </p>
      </header>

      <div className={s.info}>
        <section className={s.infoBlock} aria-labelledby="info-heading">
          <p className="micro">; INFO</p>
          <h2 id="info-heading" className={s.infoTitle}>ПРЯМАЯ СВЯЗЬ</h2>
          <dl className={s.infoList}>
            <div>
              <dt className="micro">Имя</dt>
              <dd>{config.name}</dd>
            </div>
            <div>
              <dt className="micro">Страна</dt>
              <dd>{config.country}{config.city ? ` / ${config.city}` : ''}</dd>
            </div>
            {config.email && (
              <div>
                <dt className="micro">Email</dt>
                <dd><a href={`mailto:${config.email}`}>{config.email}</a></dd>
              </div>
            )}
            {config.telegram && (
              <div>
                <dt className="micro">Telegram</dt>
                <dd><a href={config.telegram}>{config.telegram}</a></dd>
              </div>
            )}
            {config.phone && (
              <div>
                <dt className="micro">Телефон</dt>
                <dd><a href={`tel:${config.phone.replace(/\s/g, '')}`}>{config.phone}</a></dd>
              </div>
            )}
            {config.socials.map((social) => (
              <div key={social.label}>
                <dt className="micro">{social.label}</dt>
                <dd><a href={social.url}>{social.url}</a></dd>
              </div>
            ))}
            {pendingContacts && (
              <div className={s.pending}>
                <dt className="micro">Email / TG / Tel</dt>
                <dd>будет добавлено</dd>
              </div>
            )}
          </dl>
          {!hasDirect && (
            <p className={`${s.infoNote} micro`}>
              Заказчик ещё не подтвердил контакты. Ничего не выдумываю: почта, Telegram и телефон появятся здесь.
            </p>
          )}
        </section>

        <figure className={s.figure}>
          <HalftoneImage
            src={`${base}media/contact-figure.webp`}
            alt="Анонимная фигура в длинном плаще идёт спиной вперёд с листом бумаги под рукой"
            width={900}
            height={1200}
            className={s.figureImage}
          />
          <figcaption className="micro">FIG. 02 — STAND-IN / CONCEPT</figcaption>
        </figure>
      </div>

      <section className={s.band} aria-labelledby="band-heading">
        <div className={s.bandHead}>
          <p className="micro">[ 04.1 ] / Note</p>
          <h2 id="band-heading" className={s.bandTitle}>ОТКРЫТ К НОВЫМ ЗАДАЧАМ</h2>
          <p className={`${s.bandNote} micro`}>Один человек. Четыре направления. Прямой разговор.</p>
        </div>
        <HalftoneImage
          src={`${base}media/contact-crowd.webp`}
          alt="Панорама: люди в тёмных капюшонах стоят спиной среди бетонных руин под бледным небом"
          width={2100}
          height={900}
          className={s.bandImage}
          invert
        />
      </section>

      <section className={s.formSection} aria-labelledby="form-heading">
        <div className={s.formHead}>
          <p className="micro">[ 04.2 ] / Form</p>
          <h2 id="form-heading" className={s.formTitle}>НАПИСАТЬ</h2>
          <p className={s.formNote}>
            Коротко о задаче, сроках и ссылках. Поля с ошибками подсвечиваются подписью под линией.
          </p>
        </div>

        <form className={s.form} noValidate onSubmit={onSubmit}>
          <div className={s.field}>
            <label className="micro" htmlFor="field-name">Имя</label>
            <input
              id="field-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'error-name' : undefined}
            />
            {errors.name && <p id="error-name" className={`${s.error} micro`}>{errors.name}</p>}
          </div>

          <div className={s.field}>
            <label className="micro" htmlFor="field-email">Email</label>
            <input
              id="field-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'error-email' : undefined}
            />
            {errors.email && <p id="error-email" className={`${s.error} micro`}>{errors.email}</p>}
          </div>

          <div className={s.field}>
            <label className="micro" htmlFor="field-message">Сообщение</label>
            <textarea
              id="field-message"
              name="message"
              rows={5}
              required
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'error-message' : undefined}
            />
            {errors.message && <p id="error-message" className={`${s.error} micro`}>{errors.message}</p>}
          </div>

          <div className={s.actions}>
            <button type="submit" className={s.submit}>
              Отправить <span aria-hidden="true">↗</span>
            </button>
            <p className={`${s.status} ${s[status.kind]} micro`} role="status" aria-live="polite">
              {status.message}
            </p>
          </div>
        </form>
      </section>
    </article>
  )
}
