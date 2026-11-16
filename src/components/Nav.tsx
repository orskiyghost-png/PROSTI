import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { navLinks } from './links'
import s from './Nav.module.css'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => close(), [pathname, close])

  useEffect(() => {
    document.body.classList.toggle('is-locked', open)
    if (!open) return
    panelRef.current?.querySelector<HTMLElement>('a')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
      if (e.key === 'Tab' && panelRef.current && btnRef.current) {
        const items = [...panelRef.current.querySelectorAll<HTMLElement>('a'), btnRef.current]
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('is-locked')
    }
  }, [open])

  const items = navLinks.filter((l) => l.to !== '/')

  return (
    <>
      <Link to="/" className={`${s.brand} micro`} aria-label="SURKOV — на главную">
        [ SURKOV ]
      </Link>
      <nav className={s.corners} aria-label="Основная навигация">
        {items.map((l, i) => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => `${s.corner} ${s[`c${i}`]} micro ${isActive ? s.active : ''}`}>
            <span className={s.num}>[ {l.n} ]</span> {l.label}
          </NavLink>
        ))}
      </nav>

      <button
        ref={btnRef}
        type="button"
        className={`${s.toggle} micro`}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Close' : 'Menu'}
      </button>
      <div
        id="mobile-menu"
        ref={panelRef}
        className={`${s.panel} ${open ? s.open : ''}`}
        aria-hidden={!open}
      >
        <p className={`${s.panelHead} micro`}>Навигация / {navLinks.length.toString().padStart(2, '0')}</p>
        <ul className={s.list}>
          {navLinks.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => `${s.big} ${isActive ? s.active : ''}`} onClick={close}>
                <span className="micro">{l.n}</span>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
