import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import s from './PageStub.module.css'

type Props = {
  index: string
  section: string
  title: string
  lead?: string
  back?: { to: string; label: string }
  children?: ReactNode
}

export default function PageStub({ index, section, title, lead, back = { to: '/', label: 'На главную' }, children }: Props) {
  return (
    <section className={s.stub}>
      <p className={`${s.meta} micro`}>
        <span>[ {index} ] / {section}</span>
        <span>Edition 0.1 — в работе</span>
      </p>
      <h1 className={s.title} lang="en">{title}</h1>
      <hr className={s.rule} />
      {lead && <p className={s.lead}>{lead}</p>}
      {children}
      <Link to={back.to} className={s.back}>
        <span className="micro">←</span> {back.label}
      </Link>
    </section>
  )
}
