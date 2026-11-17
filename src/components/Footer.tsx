import { Link } from 'react-router-dom'
import { config } from '../config'
import s from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.head}>
        <Link to="/" className={s.brand}>SURKOV</Link>
        <p className={`${s.role} micro`}>{config.role}</p>
      </div>
      <div className={`${s.row} micro`}>
        <span>© {config.nameLatin} — {config.country}{config.city ? `, ${config.city}` : ''}</span>
        <span>Все работы — CONCEPT</span>
      </div>
    </footer>
  )
}
