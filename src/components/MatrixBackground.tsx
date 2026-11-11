import { useEffect, useRef, useState } from 'react'
import { createCodepenMatrix, loadCodepenMatrixFont, type CodepenMatrixRenderer } from '../effects/codepenMatrix'

const FRAME_INTERVAL = 1000 / 30
const MAX_PIXELS = 1_800_000

/** Nick Matantsev's actual CRT/Matrix Pen, with lifecycle-only React adaptation. */
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
    let lastDraw = 0
    let lastStep = 0
    let elapsed = 0

    function pause() {
      if (frame !== undefined) cancelAnimationFrame(frame)
      frame = undefined
    }

    function animate(timestamp: number) {
      frame = undefined
      if (disposed || !effect || document.hidden || reducedMotion.matches) return
      if (timestamp - lastDraw >= FRAME_INTERVAL) {
        const delta = Math.min(0.05, Math.max(0, (timestamp - lastStep) / 1000))
        elapsed += delta
        lastStep = timestamp
        lastDraw = timestamp - ((timestamp - lastDraw) % FRAME_INTERVAL)
        effect.frame(delta, elapsed)
      }
      frame = requestAnimationFrame(animate)
    }

    function syncMotion() {
      pause()
      if (disposed || !effect || document.hidden || reducedMotion.matches) return
      lastDraw = performance.now()
      lastStep = lastDraw
      frame = requestAnimationFrame(animate)
    }

    function drawFrozen() {
      if (!effect || disposed) return
      // Settle upstream alpha-.2 phosphor without advancing glyphs or TV time.
      for (let index = 0; index < 12; index += 1) effect.frame(0, elapsed)
    }

    function resize() {
      if (disposed || !effect) return
      const box = canvas!.getBoundingClientRect()
      const width = Math.max(1, Math.round(box.width || window.innerWidth))
      const height = Math.max(1, Math.round(box.height || window.innerHeight))
      const density = Math.min(1.5, window.devicePixelRatio || 1, Math.sqrt(MAX_PIXELS / (width * height)))
      effect.resize(width * density, height * density)
      drawFrozen()
      syncMotion()
    }

    function lost(event: Event) {
      event.preventDefault()
      pause()
      effect?.destroy()
      effect = undefined
      if (!disposed) setRenderer('unavailable')
    }

    canvas.addEventListener('webglcontextlost', lost)
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : undefined
    observer?.observe(canvas)
    window.addEventListener('resize', resize, { passive: true })
    document.addEventListener('visibilitychange', syncMotion)
    reducedMotion.addEventListener('change', syncMotion)

    void (async () => {
      try {
        await loadCodepenMatrixFont()
        if (disposed) return
        effect = createCodepenMatrix(canvas)
        effect.frame(1 / 60, elapsed)
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
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', syncMotion)
      reducedMotion.removeEventListener('change', syncMotion)
      canvas.removeEventListener('webglcontextlost', lost)
      effect?.destroy()
    }
  }, [])

  return <div className="matrix-background" data-effect="codepen-unframework-pqorjJ" data-renderer={renderer} aria-hidden="true" inert>
    <canvas ref={canvasRef} className="matrix-rain" />
  </div>
}
