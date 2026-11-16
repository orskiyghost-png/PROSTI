import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../motion/useReducedMotion'
import s from './HalftoneImage.module.css'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  invert?: boolean
}

const TAU = Math.PI * 2

export default function HalftoneImage({ src, alt, width, height, className, invert = false }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const source = new Image()
    source.decoding = 'async'
    let alive = true
    let ready = false
    let progress = reduced ? 1 : 0
    let raf = 0
    let trigger: ScrollTrigger | undefined

    const sample = document.createElement('canvas')
    const sampleContext = sample.getContext('2d', { willReadFrequently: true })

    const draw = () => {
      raf = 0
      const rect = wrap.getBoundingClientRect()
      if (!alive || !rect.width || !rect.height || !ready || !sampleContext) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const pixelWidth = Math.round(rect.width * dpr)
      const pixelHeight = Math.round(rect.height * dpr)
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth
        canvas.height = pixelHeight
      }

      const sampleWidth = 360
      const sampleHeight = Math.max(1, Math.round(sampleWidth * (rect.height / rect.width)))
      if (sample.width !== sampleWidth || sample.height !== sampleHeight) {
        sample.width = sampleWidth
        sample.height = sampleHeight
      }
      sampleContext.clearRect(0, 0, sampleWidth, sampleHeight)
      sampleContext.drawImage(source, 0, 0, sampleWidth, sampleHeight)
      const pixels = sampleContext.getImageData(0, 0, sampleWidth, sampleHeight).data

      context.clearRect(0, 0, pixelWidth, pixelHeight)
      context.fillStyle = invert ? '#EDEBE6' : '#0B0B0B'
      const cell = (11.5 - progress * 8) * dpr
      const radiusMax = cell * 0.66

      for (let y = 0; y < pixelHeight; y += cell) {
        for (let x = 0; x < pixelWidth; x += cell) {
          const sx = Math.min(sampleWidth - 1, Math.floor((x / pixelWidth) * sampleWidth))
          const sy = Math.min(sampleHeight - 1, Math.floor((y / pixelHeight) * sampleHeight))
          const index = (sy * sampleWidth + sx) * 4
          const luminance = (pixels[index] * 0.299 + pixels[index + 1] * 0.587 + pixels[index + 2] * 0.114) / 255
          const density = invert ? luminance : 1 - luminance
          const radius = radiusMax * Math.pow(density, 0.78)
          if (radius < 0.45) continue
          context.beginPath()
          context.arc(x + cell / 2, y + cell / 2, radius, 0, TAU)
          context.fill()
        }
      }
      wrap.classList.add(s.ready)
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }

    const onResize = () => {
      if (!ready) return
      schedule()
    }
    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(wrap)

    source.src = src
    source
      .decode()
      .then(() => {
        if (!alive) return
        ready = true
        schedule()
      })
      .catch(() => {})

    if (!reduced) {
      trigger = ScrollTrigger.create({
        trigger: wrap,
        start: 'top 92%',
        end: 'bottom 58%',
        scrub: 0.7,
        onUpdate: (self) => {
          progress = self.progress
          schedule()
        },
      })
    }

    return () => {
      alive = false
      source.removeAttribute('src')
      ready = false
      if (raf) cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      trigger?.kill()
    }
  }, [invert, reduced, src])

  return (
    <div ref={wrapRef} className={`${s.wrap} ${invert ? s.invert : ''} ${className ?? ''}`}>
      <img className={s.fallback} src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
      <canvas ref={canvasRef} className={s.canvas} aria-hidden="true" />
    </div>
  )
}
