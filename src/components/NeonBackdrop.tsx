import { useEffect, useRef, useState } from 'react'
import type { AsyncGssScene } from 'gss-lang'

// Visual source: LukyVj's GSS galaxy button, inspected 2026-11-10.
// https://codepen.io/editor/LukyVj/pen/01a13f4f-03a2-7912-b810-f80a101db33b
// Keep its two spiral arms, 60 emissive stars, core and slow galaxy rotation;
// use TransProxy's blue/pink palette and a much lower pixel density.
const STARS = Array.from({ length: 60 }, (_, index) => {
  const progress = Math.floor(index / 2) / 29
  const radius = 0.22 + progress * 1.88
  const angle = progress * 5.2 + (index % 2) * Math.PI
  const jitter = Math.sin(index * 127.1) * 0.025
  return {
    x: Math.cos(angle) * radius + jitter,
    z: Math.sin(angle) * radius - jitter,
    y: Math.sin(index * 43.7) * 0.025,
    radius: 0.018 + (Math.sin(index * 17.3) + 1) * 0.006,
    hue: 195 + progress * 135,
  }
})

const GALAXY_SOURCE = `
@scene { group#galaxy { sphere#core; ${STARS.map((_, index) => `sphere#star${index};`).join(' ')} } }
scene {
  floor: none;
  background: #000000;
  ambient: 1;
  camera-target: 0 0 0;
  camera-distance: 3.2;
  camera-angle: 0deg 24deg;
  filter: bloom(0.65, 6px);
  dpr: 0.75;
}
#galaxy { animation: orbit 40s linear infinite; }
#core { radius: 0.15; color: #f7f7fc; material: emissive(1.6); }
${STARS.map((star, index) => `#star${index} { translate: ${star.x.toFixed(4)} ${star.y.toFixed(4)} ${star.z.toFixed(4)}; radius: ${star.radius.toFixed(4)}; color: hsl(${star.hue.toFixed(1)} 90% 72%); material: emissive(1.25); }`).join('\n')}
@keyframes orbit { from { rotate-y: 0deg; } to { rotate-y: -360deg; } }
`

// The main waiting-list CTA owns the single GSS context. Extra instances retain
// a lightweight local canvas rather than allocating more raymarching contexts.
let activeGssOwner: symbol | undefined

export function NeonBackdrop() {
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const gssRef = useRef<HTMLCanvasElement>(null)
  const fallbackRef = useRef<HTMLCanvasElement>(null)
  const [renderer, setRenderer] = useState<'loading' | 'gss' | 'fallback'>('loading')

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = gssRef.current
    const fallback = fallbackRef.current
    const context = fallback?.getContext('2d')
    if (!wrapper || !canvas || !fallback || !context) return

    const owner = Symbol('TransProxy GSS CTA')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let scene: AsyncGssScene | undefined
    let disposed = false
    let initialized = false
    let failed = false
    let gssReady = false
    let frame: number | undefined
    let staticFrame: number | undefined
    let width = 1
    let height = 1
    let elapsed = 0
    let last = 0
    const bounds = wrapper.getBoundingClientRect()
    let visible = bounds.bottom > 0 && bounds.top < window.innerHeight

    function cancelFrames() {
      if (frame !== undefined) cancelAnimationFrame(frame)
      if (staticFrame !== undefined) cancelAnimationFrame(staticFrame)
      frame = undefined
      staticFrame = undefined
    }

    function drawFallback() {
      context!.clearRect(0, 0, width, height)
      const unit = height * 0.68
      const rotation = -elapsed * Math.PI / 20
      const core = context!.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, height * 0.7)
      core.addColorStop(0, 'rgba(247,247,252,0.38)')
      core.addColorStop(0.22, 'rgba(255,139,203,0.18)')
      core.addColorStop(1, 'rgba(173,140,255,0)')
      context!.fillStyle = core
      context!.fillRect(0, 0, width, height)
      context!.globalAlpha = 0.72
      for (const star of STARS) {
        const x = star.x * Math.cos(rotation) - star.z * Math.sin(rotation)
        const z = star.x * Math.sin(rotation) + star.z * Math.cos(rotation)
        const color = `hsl(${star.hue} 90% 75%)`
        context!.fillStyle = color
        context!.shadowColor = color
        context!.shadowBlur = 5
        context!.beginPath()
        context!.arc(width / 2 + x * unit, height / 2 + z * unit * 0.42, Math.max(0.7, star.radius * unit), 0, Math.PI * 2)
        context!.fill()
      }
      context!.shadowBlur = 0
      context!.globalAlpha = 1
    }

    function fallbackTick(timestamp: number) {
      frame = undefined
      if (disposed || gssReady || document.hidden || !visible || reducedMotion.matches) return
      if (timestamp - last >= 1000 / 24) {
        elapsed += Math.min(0.1, (timestamp - last) / 1000)
        last = timestamp
        drawFallback()
      }
      frame = requestAnimationFrame(fallbackTick)
    }

    function syncMotion() {
      cancelFrames()
      if (disposed || document.hidden || !visible) { scene?.pause(); return }
      if (gssReady && scene) {
        scene.play()
        // The GSS clock already freezes under reduced motion. Allow its first
        // static render, then stop even its otherwise idle request-frame loop.
        if (reducedMotion.matches) staticFrame = requestAnimationFrame(() => { staticFrame = undefined; scene?.pause() })
      } else {
        drawFallback()
        if (!reducedMotion.matches) { last = performance.now(); frame = requestAnimationFrame(fallbackTick) }
      }
    }

    function useFallback() {
      if (disposed || failed) return
      failed = true
      gssReady = false
      scene?.destroy()
      scene = undefined
      if (activeGssOwner === owner) activeGssOwner = undefined
      setRenderer('fallback')
      syncMotion()
    }

    async function initializeGss() {
      if (initialized || disposed || !visible) return
      initialized = true
      if (activeGssOwner !== undefined) { useFallback(); return }
      activeGssOwner = owner
      try {
        // Vite bundles this pinned package as same-origin assets. No embed
        // script, remote imports, external texture URLs or dynamic JS eval.
        const gss = await import('gss-lang')
        if (disposed) return
        if (gss.softwareRendering()) { useFallback(); return }
        const compiled = gss.compile(GALAXY_SOURCE, { target: 'glsl' })
        if (compiled.textures.length !== 0) throw new Error('External textures are not part of this decoration')
        const mounted = await gss.mountAsync(canvas!, compiled, {
          backend: 'webgl', controls: false, scrollSlider: false, dprPicker: false,
        })
        if (disposed || failed) { mounted.destroy(); return }
        scene = mounted
        gssReady = true
        setRenderer('gss')
        syncMotion()
      } catch { useFallback() }
    }

    function resize() {
      if (disposed) return
      const box = wrapper!.getBoundingClientRect()
      width = Math.max(1, Math.round(box.width))
      height = Math.max(1, Math.round(box.height))
      const density = Math.min(1.5, window.devicePixelRatio || 1, Math.sqrt(90_000 / (width * height)))
      fallback!.width = Math.max(1, Math.floor(width * density))
      fallback!.height = Math.max(1, Math.floor(height * density))
      context!.setTransform(fallback!.width / width, 0, 0, fallback!.height / height, 0, 0)
      syncMotion()
    }

    const fail = () => useFallback()
    const lost = (event: Event) => { event.preventDefault(); useFallback() }
    canvas.addEventListener('gss-error', fail)
    canvas.addEventListener('gss-too-heavy', fail)
    canvas.addEventListener('webglcontextlost', lost)
    const observer = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting)
      if (visible) void initializeGss()
      syncMotion()
    }) : undefined
    observer?.observe(wrapper)
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : undefined
    resizeObserver?.observe(wrapper)
    window.addEventListener('resize', resize, { passive: true })
    document.addEventListener('visibilitychange', syncMotion)
    reducedMotion.addEventListener('change', syncMotion)
    resize()
    void initializeGss()

    return () => {
      disposed = true
      cancelFrames()
      observer?.disconnect()
      resizeObserver?.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', syncMotion)
      reducedMotion.removeEventListener('change', syncMotion)
      canvas.removeEventListener('gss-error', fail)
      canvas.removeEventListener('gss-too-heavy', fail)
      canvas.removeEventListener('webglcontextlost', lost)
      scene?.destroy()
      if (activeGssOwner === owner) activeGssOwner = undefined
    }
  }, [])

  return <span ref={wrapperRef} className="neon-backdrop" data-renderer={renderer} aria-hidden="true" inert>
    <canvas ref={fallbackRef} className="neon-fallback" hidden={renderer === 'gss'} />
    <canvas ref={gssRef} className="neon-gss" hidden={renderer === 'fallback'} />
  </span>
}
