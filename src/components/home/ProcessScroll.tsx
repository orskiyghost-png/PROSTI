import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../../motion/useReducedMotion'
import s from './ProcessScroll.module.css'

gsap.registerPlugin(ScrollTrigger)

const base = import.meta.env.BASE_URL
const DESKTOP_FRAMES = 120
const MOBILE_FRAMES = 60
const STAGES = [
  { id: '01', title: 'Research', note: 'Разбор задачи, референсы, ограничения.' },
  { id: '02', title: 'Sketch', note: 'Быстрые формы. Без страха испортить бумагу.' },
  { id: '03', title: 'Art direction', note: 'Типографика, сетка, характер.' },
  { id: '04', title: 'Build', note: 'Код, движение, проверка на устройствах.' },
]
const POSTERS = ['01', '02', '03'].map((n) => `${base}media/process-poster-${n}.webp`)

type Mode = 'frames' | 'posters' | 'static'

function isLowPower() {
  const nav = navigator as Navigator & {
    deviceMemory?: number
    connection?: { saveData?: boolean; effectiveType?: string }
  }
  return Boolean(nav.connection?.saveData) || (nav.deviceMemory !== undefined && nav.deviceMemory < 4)
}

export default function ProcessScroll() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const posterRef = useRef<HTMLImageElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<Mode>('posters')
  const [stage, setStage] = useState(0)
  const stageRef = useRef(0)

  useEffect(() => {
    if (reduced) {
      setMode('static')
      return
    }
    setMode(isLowPower() ? 'posters' : 'frames')
  }, [reduced])

  useEffect(() => {
    if (mode !== 'frames') return
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return

    const mobile = window.matchMedia('(max-width: 767px)').matches
    const count = mobile ? MOBILE_FRAMES : DESKTOP_FRAMES
    const folder = mobile ? 'mobile' : 'desktop'
    const width = mobile ? 640 : 800
    const height = mobile ? 360 : 450
    const frames: HTMLCanvasElement[] = []
    let alive = true
    let current = -1
    let firstDrawn = false

    const url = (index: number) =>
      `${base}media/frames/${folder}/process-${String(index).padStart(4, '0')}.webp`

    const context = canvas.getContext('2d')
    if (!context) return

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(rect.width * dpr))
      canvas.height = Math.max(1, Math.round(rect.height * dpr))
      current = -1
      draw(lastProgress)
    }

    let lastProgress = 0
    const draw = (progress: number) => {
      lastProgress = progress
      const index = Math.round(progress * (count - 1))
      let frame = index
      while (frame > 0 && !frames[frame]) frame -= 1
      if (!frames[frame] || frame === current) return
      current = frame

      const cw = canvas.width
      const ch = canvas.height
      const ctx = context
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, cw, ch)
      const source = frames[frame]
      const scale = Math.max(cw / source.width, ch / source.height)
      ctx.drawImage(source, (cw - source.width * scale) / 2, (ch - source.height * scale) / 2, source.width * scale, source.height * scale)
      if (!firstDrawn) {
        firstDrawn = true
        if (posterRef.current) posterRef.current.style.opacity = '0'
      }

      const nextStage = Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length))
      if (nextStage !== stageRef.current) {
        stageRef.current = nextStage
        setStage(nextStage)
      }
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    resize()

    const downscale = (bitmap: ImageBitmap) => {
      const off = document.createElement('canvas')
      off.width = width
      off.height = height
      const ctx = off.getContext('2d')
      if (!ctx) return off
      ctx.drawImage(bitmap, 0, 0, width, height)
      return off
    }

    const load = async () => {
      const batchSize = 8
      for (let start = 0; start < count; start += batchSize) {
        if (!alive) return
        const batch = Array.from({ length: Math.min(batchSize, count - start) }, (_, i) => start + i)
        await Promise.all(
          batch.map(async (index) => {
            try {
              const response = await fetch(url(index))
              if (!response.ok) return
              const blob = await response.blob()
              const bitmap = await createImageBitmap(blob)
              const off = downscale(bitmap)
              bitmap.close()
              if (!alive) return
              frames[index] = off
            } catch {
              /* keep the poster if a frame cannot be decoded */
            }
          }),
        )
        if (!alive) return
        draw(lastProgress)
      }
    }

    let loading = false
    const startLoading = () => {
      if (loading) return
      loading = true
      void load()
    }
    const loader = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        loader.disconnect()
        startLoading()
      },
      { rootMargin: '75% 0px' },
    )
    loader.observe(section)
    if (section.getBoundingClientRect().top < window.innerHeight * 1.75) {
      loader.disconnect()
      startLoading()
    }

    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => draw(self.progress),
    })

    return () => {
      alive = false
      loader.disconnect()
      resizeObserver.disconnect()
      scrollTrigger.kill()
      frames.length = 0
    }
  }, [mode])

  useEffect(() => {
    if (mode !== 'posters') return
    const section = sectionRef.current
    const layers = frameRef.current?.querySelectorAll<HTMLElement>('[data-poster]')
    if (!section || !layers?.length) return

    gsap.set(layers, { autoAlpha: 0 })
    gsap.set(layers[0], { autoAlpha: 1 })
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const nextStage = Math.min(STAGES.length - 1, Math.floor(self.progress * STAGES.length))
          if (nextStage !== stageRef.current) {
            stageRef.current = nextStage
            setStage(nextStage)
          }
        },
      },
    })
    timeline.to(layers[0], { autoAlpha: 0, duration: 0.34 }).to(layers[1], { autoAlpha: 1, duration: 0.34 })
    timeline.to(layers[1], { autoAlpha: 0, duration: 0.34 }).to(layers[2], { autoAlpha: 1, duration: 0.34 })

    return () => {
      timeline.scrollTrigger?.kill()
      timeline.kill()
      gsap.set(layers, { clearProps: 'opacity,visibility' })
    }
  }, [mode])

  const staticMode = mode === 'static'

  return (
    <section ref={sectionRef} className={`${s.section} ${staticMode ? s.static : ''}`} aria-labelledby="process-heading">
      <div className={s.sticky}>
        <header className={s.head}>
          <p className="micro">Process</p>
          <h2 id="process-heading" className={s.title}>PROCESS</h2>
          <p className={s.lead}>От первого наброска до последнего пикселя. Прокрутите — ролик идёт вперёд и назад.</p>
        </header>

        {staticMode ? (
          <div className={s.staticFrames}>
            {POSTERS.map((src, i) => (
              <figure key={src}>
                <img src={src} alt="Кадр процесса" loading="lazy" width="1280" height="720" />
                <figcaption className="micro">{STAGES[i].title}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div ref={frameRef} className={s.frame}>
            {mode === 'frames' ? (
              <>
                <img ref={posterRef} className={s.poster} src={POSTERS[0]} alt="" width="1280" height="720" />
                <canvas ref={canvasRef} className={s.canvas} aria-hidden="true" />
              </>
            ) : (
              POSTERS.map((src, i) => (
                <img
                  key={src}
                  data-poster
                  className={s.poster}
                  src={src}
                  alt={i === 0 ? 'Кадр процесса: начало работы' : ''}
                  loading="lazy"
                  width="1280"
                  height="720"
                />
              ))
            )}
          </div>
        )}

        <div className={s.hud}>
          <ol className={s.stages}>
            {STAGES.map((item, i) => (
              <li key={item.id} className={`${s.stage} ${i === stage ? s.active : ''}`}>
                <span className={s.stageTitle}>{item.title}</span>
                <span className={s.stageNote}>{item.note}</span>
              </li>
            ))}
          </ol>
          <p className={`${s.counter} micro`}>{staticMode ? 'Static frames' : 'Scroll reversible'}</p>
        </div>
      </div>
    </section>
  )
}
