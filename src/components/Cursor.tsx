import { useEffect, useRef, useState } from 'react'
import s from './Cursor.module.css'

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  const [enabled] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches)

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return
    document.body.classList.add('has-cursor')
    const move = (e: PointerEvent) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      const t = e.target as Element | null
      el.classList.toggle(s.hover, !!t?.closest('a, button'))
      el.classList.add(s.visible)
    }
    const leave = () => el.classList.remove(s.visible)
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div ref={ref} className={s.cursor} aria-hidden="true">
      <span className={s.dot} />
    </div>
  )
}
