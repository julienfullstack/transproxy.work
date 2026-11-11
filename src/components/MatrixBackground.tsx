import { useEffect, useRef } from 'react'

const FRAME_INTERVAL = 1000 / 30
const MAX_PIXELS = 1_500_000
const MAX_DPR = 1.5
const HUES = [135, 180, 225, 300] as const
const GLYPHS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>[]{}=+-*/:;アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'

type Column = {
  x: number
  y: number
  speed: number
  hue: number
  glyphs: string[]
  shift: number
}

function seededRandom(seed: number) {
  let value = seed >>> 0 || 1
  return () => {
    value ^= value << 13
    value ^= value >>> 17
    value ^= value << 5
    return (value >>> 0) / 0x1_0000_0000
  }
}

/** Decorative local canvas; its layout and glass overlays are owned by the app. */
export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !context) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let disposed = false
    let frame: number | undefined
    let width = 0
    let height = 0
    let scale = 0
    let fontSize = 16
    let cellHeight = 20
    let columns: Column[] = []
    let background: CanvasGradient | string = '#02100d'
    let grain: CanvasPattern | null = null
    let lastDraw = 0
    let lastStep = 0
    let runningTime = 0

    function pause() {
      if (frame !== undefined) cancelAnimationFrame(frame)
      frame = undefined
    }

    function draw() {
      if (disposed) return
      context!.globalAlpha = 1
      context!.shadowBlur = 0
      context!.fillStyle = background
      context!.fillRect(0, 0, width, height)
      context!.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
      context!.textBaseline = 'top'
      context!.textAlign = 'left'

      for (const column of columns) {
        const glyphShift = (column.shift + Math.floor(runningTime * 0.7)) % column.glyphs.length
        for (let index = column.glyphs.length - 1; index >= 0; index -= 1) {
          const y = Math.floor(column.y - index * cellHeight)
          if (y < -cellHeight || y > height) continue
          const isHead = index === 0
          const tail = 1 - index / column.glyphs.length
          context!.globalAlpha = isHead ? 0.44 : 0.26 * tail * tail
          context!.fillStyle = `hsl(${column.hue} 78% ${isHead ? 78 : 58}%)`
          // Glow belongs only to the moving head, keeping the many tail glyphs
          // cheap to draw and avoiding a bright full-screen bloom.
          context!.shadowBlur = isHead ? fontSize * 0.42 : 0
          context!.shadowColor = `hsl(${column.hue} 75% 55%)`
          context!.fillText(column.glyphs[(index + glyphShift) % column.glyphs.length]!, column.x, y)
        }
      }

      context!.shadowBlur = 0
      if (grain) {
        // The tile is generated once per resize, so TV grain stays static
        // instead of flashing new random pixels on every animation frame.
        context!.globalAlpha = 0.18
        context!.fillStyle = grain
        context!.fillRect(0, 0, width, height)
      }
      context!.globalAlpha = 1
    }

    function animate(timestamp: number) {
      frame = undefined
      if (disposed || document.hidden || reducedMotion.matches) return
      if (timestamp - lastDraw >= FRAME_INTERVAL) {
        const step = Math.min(0.1, Math.max(0, (timestamp - lastStep) / 1000))
        runningTime += step
        lastStep = timestamp
        lastDraw = timestamp - ((timestamp - lastDraw) % FRAME_INTERVAL)
        for (const column of columns) {
          column.y += column.speed * step
          if (column.y - column.glyphs.length * cellHeight > height) column.y = -cellHeight
        }
        draw()
      }
      frame = requestAnimationFrame(animate)
    }

    function syncMotion() {
      pause()
      if (disposed || document.hidden) return
      if (reducedMotion.matches) {
        draw()
        return
      }
      lastDraw = performance.now()
      lastStep = lastDraw
      frame = requestAnimationFrame(animate)
    }

    function resize() {
      if (disposed) return
      const bounds = canvas!.getBoundingClientRect()
      const nextWidth = Math.max(1, Math.round(bounds.width || window.innerWidth))
      const nextHeight = Math.max(1, Math.round(bounds.height || window.innerHeight))
      const nextScale = Math.min(MAX_DPR, window.devicePixelRatio || 1, Math.sqrt(MAX_PIXELS / (nextWidth * nextHeight)))
      if (nextWidth === width && nextHeight === height && nextScale === scale) return
      width = nextWidth
      height = nextHeight
      scale = nextScale
      canvas!.width = Math.max(1, Math.floor(width * scale))
      canvas!.height = Math.max(1, Math.floor(height * scale))
      context!.setTransform(canvas!.width / width, 0, 0, canvas!.height / height, 0, 0)
      fontSize = Math.max(14, Math.min(18, width / 90))
      cellHeight = fontSize * 1.25
      const columnWidth = Math.max(fontSize * 0.76, width / 140)
      const random = seededRandom((width * 73856093) ^ (height * 19349663))
      columns = Array.from({ length: Math.ceil(width / columnWidth) }, (_, index) => {
        const length = 7 + Math.floor(random() * 19)
        return {
          x: Math.floor(index * columnWidth),
          y: Math.floor(random() * height),
          speed: 18 + random() * 48,
          hue: HUES[Math.floor(random() * HUES.length)]!,
          glyphs: Array.from({ length }, () => GLYPHS[Math.floor(random() * GLYPHS.length)]!),
          shift: Math.floor(random() * length),
        }
      })
      runningTime = 0
      const gradient = context!.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#02100d')
      gradient.addColorStop(0.6, '#031a17')
      gradient.addColorStop(1, '#002a2a')
      background = gradient

      const tile = document.createElement('canvas')
      tile.width = 96
      tile.height = 96
      const tileContext = tile.getContext('2d')
      if (tileContext) {
        const pixels = tileContext.createImageData(tile.width, tile.height)
        for (let index = 0; index < pixels.data.length; index += 4) {
          const light = random() > 0.5 ? 210 : 18
          pixels.data[index] = light
          pixels.data[index + 1] = light
          pixels.data[index + 2] = light
          pixels.data[index + 3] = Math.floor(random() * 38)
        }
        tileContext.putImageData(pixels, 0, 0)
        grain = context!.createPattern(tile, 'repeat')
      }
      // Seed heads throughout the viewport before scheduling any animation, so
      // initial and reduced-motion renders already contain visible code.
      draw()
      syncMotion()
    }

    resize()
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : undefined
    observer?.observe(canvas)
    window.addEventListener('resize', resize, { passive: true })
    document.addEventListener('visibilitychange', syncMotion)
    reducedMotion.addEventListener('change', syncMotion)

    return () => {
      disposed = true
      pause()
      observer?.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', syncMotion)
      reducedMotion.removeEventListener('change', syncMotion)
    }
  }, [])

  return <div className="matrix-background" aria-hidden="true" inert>
    <canvas ref={canvasRef} className="matrix-rain" />
    <div className="matrix-scanlines" />
    <div className="matrix-vignette" />
  </div>
}
