import { Link } from 'react-router-dom'
import { config } from '../config'
import { navLinks } from './links'
import s from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className={s.footer}>
      <div className={`${s.row} micro`}>
        <span>[ SURKOV ] — {config.role}</span>
        <span>{config.country} / {config.city || 'город — TBA'}</span>
        <span>Все работы на сайте — CONCEPT</span>
      </div>
      <ul className={`${s.links} micro`}>
        {navLinks.map((l) => (
          <li key={l.to}>
            <Link to={l.to}>{l.n} {l.label}</Link>
          </li>
        ))}
      </ul>
      <p className={s.mega} aria-hidden="true">SURKOV</p>
      <div className={`${s.row} micro`}>
        <span>© {year} {config.nameLatin}</span>
        <span>Set in Inter Tight &amp; JetBrains Mono</span>
        <span>Edition 0.1 / Print error</span>
      </div>
    </footer>
  )
}
