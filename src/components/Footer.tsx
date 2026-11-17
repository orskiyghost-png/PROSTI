import { Link } from 'react-router-dom'
import { config } from '../config'
import { navLinks } from './links'
import s from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.head}>
        <Link to="/" className={s.brand}>SURKOV</Link>
        <p className={`${s.role} micro`}>{config.role}</p>
      </div>
      <nav aria-label="Навигация в подвале">
        <ul className={`${s.links} micro`}>
          {navLinks.map((l) => (
            <li key={l.to}>
              <Link to={l.to}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={`${s.row} micro`}>
        <span>© {config.nameLatin} — {config.country}{config.city ? `, ${config.city}` : ''}</span>
        <span>Все работы — CONCEPT</span>
      </div>
    </footer>
  )
}
