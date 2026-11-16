import { useEffect, useRef, useState, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mesh, Plane, Program, Renderer, Texture } from 'ogl'
import { useReducedMotion } from '../../motion/useReducedMotion'
import s from './HeroVisual.module.css'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  src: string
  alt: string
  triggerRef: RefObject<HTMLElement | null>
}

const vertex = `
  attribute vec3 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragment = `
  precision highp float;
  uniform sampler2D tMap;
  uniform float uTime;
  uniform float uScroll;
  uniform float uIntro;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec2 uv = vUv;
    float n = noise(uv * 4.0 + uTime * 0.035) - 0.5;
    float amount = 0.055 * uScroll + 0.14 * uIntro;
    uv += n * amount;
    uv = clamp(uv, vec2(0.002), vec2(0.998));
    vec3 color = texture2D(tMap, uv).rgb;
    float grey = dot(color, vec3(0.299, 0.587, 0.114));
    gl_FragColor = vec4(vec3(grey), 1.0);
  }
`

export default function HeroVisual({ src, alt, triggerRef }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reduced) {
      setReady(false)
      return
    }

    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    let renderer: Renderer
    try {
      renderer = new Renderer({ canvas, alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) })
    } catch {
      return
    }
    if (!renderer.gl) return

    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)

    const geometry = new Plane(gl, { width: 2, height: 2 })
    const texture = new Texture(gl, { image: new Uint8Array([255, 255, 255, 255]), width: 1, height: 1 })
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        tMap: { value: texture },
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uIntro: { value: 1 },
      },
      transparent: true,
    })
    const mesh = new Mesh(gl, { geometry, program })

    let alive = true
    let introTween: gsap.core.Tween | undefined
    let scrollTrigger: ScrollTrigger | undefined

    const size = () => {
      const rect = wrap.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      renderer.dpr = Math.min(window.devicePixelRatio || 1, 2)
      renderer.setSize(rect.width, rect.height)
    }
    size()

    const resizeObserver = new ResizeObserver(size)
    resizeObserver.observe(wrap)

    const tick = (time: number) => {
      if (!alive) return
      program.uniforms.uTime.value = time
      renderer.render({ scene: mesh })
    }
    gsap.ticker.add(tick)

    const image = new Image()
    image.decoding = 'async'
    image.src = src
    image
      .decode()
      .then(() => {
        if (!alive) return
        texture.image = image
        texture.needsUpdate = true
        setReady(true)
        introTween = gsap.to(program.uniforms.uIntro, { value: 0, duration: 1.1, ease: 'power3.out', delay: 0.05 })
      })
      .catch(() => {})

    if (triggerRef.current) {
      scrollTrigger = ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
        onUpdate: (self) => {
          program.uniforms.uScroll.value = self.progress
        },
      })
    }

    return () => {
      alive = false
      resizeObserver.disconnect()
      introTween?.kill()
      scrollTrigger?.kill()
      gsap.ticker.remove(tick)
      renderer.gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [reduced, src, triggerRef])

  return (
    <div ref={wrapRef} className={s.wrap}>
      <img className={`${s.fallback} ${ready ? s.hidden : ''}`} src={src} alt={alt} width="1024" height="1024" />
      {!reduced && <canvas ref={canvasRef} className={`${s.canvas} ${ready ? s.visible : ''}`} aria-hidden="true" />}
    </div>
  )
}
