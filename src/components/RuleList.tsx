import { Link } from 'react-router-dom'
import s from './RuleList.module.css'

type Item = { key: string; index: string; label: string; meta?: string; to?: string }

export default function RuleList({ items }: { items: Item[] }) {
  return (
    <ul className={s.list}>
      {items.map((it) => {
        const body = (
          <>
            <span className="micro">{it.index}</span>
            <span className={s.label}>{it.label}</span>
            {it.meta && <span className={`${s.meta} micro`}>{it.meta}</span>}
          </>
        )
        return (
          <li key={it.key}>
            {it.to ? <Link to={it.to} className={s.row}>{body}</Link> : <div className={s.row}>{body}</div>}
          </li>
        )
      })}
    </ul>
  )
}
