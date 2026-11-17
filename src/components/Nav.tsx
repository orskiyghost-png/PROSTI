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
      <header className={s.bar}>
        <Link to="/" className={`${s.brand} micro`} aria-label="SURKOV — на главную">
          SURKOV
        </Link>
        <nav className={s.nav} aria-label="Основная навигация">
          {items.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `${s.link} micro ${isActive ? s.active : ''}`}
            >
              {l.label}
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
      </header>

      <div
        id="mobile-menu"
        ref={panelRef}
        className={`${s.panel} ${open ? s.open : ''}`}
        aria-hidden={!open}
      >
        <p className={`${s.panelHead} micro`}>Навигация</p>
        <ul className={s.list}>
          {navLinks.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => `${s.big} ${isActive ? s.active : ''}`} onClick={close}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
