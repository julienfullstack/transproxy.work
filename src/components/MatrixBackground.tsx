import { useEffect, useRef, useState } from 'react'
import { createCodepenMatrix, loadCodepenMatrixFont, type CodepenMatrixRenderer } from '../effects/codepenMatrix'

const FRAME_INTERVAL = 1000 / 10
const MAX_PIXELS = 450_000

/** Nick Matantsev's actual falling-code logic, with flat blue/pink rendering. */
export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [renderer, setRenderer] = useState<'loading' | 'webgl' | 'unavailable'>('loading')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let effect: CodepenMatrixRenderer | undefined
    let disposed = false
    let frame: number | undefined
    let timer: ReturnType<typeof setTimeout> | undefined
    let lastStep = 0
    let elapsed = 0
    let intersects = true

    function visible() {
      const fullscreen = document.fullscreenElement
      return !document.hidden && intersects && (!fullscreen || fullscreen.contains(canvas!))
    }

    function pause() {
      if (frame !== undefined) cancelAnimationFrame(frame)
      frame = undefined
      if (timer !== undefined) clearTimeout(timer)
      timer = undefined
    }

    function animate(timestamp: number) {
      frame = undefined
      if (disposed || !effect || !visible() || reducedMotion.matches) return
      const delta = Math.min(0.25, Math.max(0, (timestamp - lastStep) / 1000))
      elapsed += delta
      lastStep = timestamp
      effect.frame(delta, elapsed)
      // Let the new canvas/glass composite present before starting the idle gap.
      // A slow composite must not immediately trigger another expensive redraw.
      frame = requestAnimationFrame(() => {
        frame = undefined
        if (disposed || !visible() || reducedMotion.matches) return
        timer = setTimeout(() => {
          timer = undefined
          frame = requestAnimationFrame(animate)
        }, FRAME_INTERVAL)
      })
    }

    function syncMotion() {
      pause()
      if (disposed || !effect || !visible()) return
      drawFrozen()
      if (reducedMotion.matches) return
      lastStep = performance.now()
      frame = requestAnimationFrame(animate)
    }

    function drawFrozen() {
      if (!effect || disposed || !visible()) return
      // Render the existing glyphs without advancing their source simulation.
      effect.frame(0, elapsed)
    }

    function resize() {
      if (disposed || !effect) return
      const box = canvas!.getBoundingClientRect()
      const width = Math.max(1, Math.round(box.width || window.innerWidth))
      const height = Math.max(1, Math.round(box.height || window.innerHeight))
      const density = Math.min(0.75, window.devicePixelRatio || 1, Math.sqrt(MAX_PIXELS / (width * height)))
      effect.resize(width * density, height * density)
      syncMotion()
    }

    function lost(event: Event) {
      event.preventDefault()
      pause()
      effect?.destroy()
      effect = undefined
      if (!disposed) setRenderer('unavailable')
    }

    const intersection = new IntersectionObserver(entries => {
      intersects = entries.some(entry => entry.isIntersecting)
      syncMotion()
    })
    intersection.observe(canvas)
    canvas.addEventListener('webglcontextlost', lost)
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : undefined
    observer?.observe(canvas)
    window.addEventListener('resize', resize, { passive: true })
    document.addEventListener('visibilitychange', syncMotion)
    document.addEventListener('fullscreenchange', syncMotion)
    reducedMotion.addEventListener('change', syncMotion)

    void (async () => {
      try {
        await loadCodepenMatrixFont()
        if (disposed) return
        effect = createCodepenMatrix(canvas)
        resize()
        setRenderer('webgl')
      } catch {
        effect?.destroy()
        effect = undefined
        if (!disposed) setRenderer('unavailable')
      }
    })()

    return () => {
      disposed = true
      pause()
      observer?.disconnect()
      intersection.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', syncMotion)
      document.removeEventListener('fullscreenchange', syncMotion)
      reducedMotion.removeEventListener('change', syncMotion)
      canvas.removeEventListener('webglcontextlost', lost)
      effect?.destroy()
    }
  }, [])

  return <div className="matrix-background" data-effect="codepen-unframework-pqorjJ" data-renderer={renderer} aria-hidden="true" inert>
    <canvas ref={canvasRef} className="matrix-rain" />
  </div>
}
