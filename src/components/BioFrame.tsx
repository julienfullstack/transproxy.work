import { useEffect, useId, useRef, useState } from 'react'

/** Responsive pane edges. The separate backdrop layer frosts what is behind it,
 * while the frame and foreground remain sharp. No raster mockup is overlaid. */
export function BioFrame({ compact = false, card = false }: { compact?: boolean; card?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [size, setSize] = useState({ w: 800, h: 440 })
  const id = useId().replace(/:/g, '')
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ w: entry.contentRect.width, h: entry.contentRect.height })
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  const { w, h } = size
  const cut = compact ? 12 : 24
  const notch = compact || card ? 0 : 12
  const points = [
    [cut, 2], [w * .34, 2], [w * .34 + notch, 2 + notch],
    [w * .68, 2 + notch], [w * .68 + notch, 2], [w - cut, 2],
    [w - 2, cut], [w - 2, h - cut], [w - cut, h - 2],
    [w * .78, h - 2], [w * .78 - notch, h - 2 - notch],
    [w * .39, h - 2 - notch], [w * .39 - notch, h - 2],
    [cut, h - 2], [2, h - cut], [2, cut],
  ]
  const outline = points.map(p => p.join(',')).join(' ')
  const innerOutline = points.map(([x, y]) => `${8 + x * (w - 16) / w},${8 + y * (h - 16) / h}`).join(' ')
  const clip = `polygon(${points.map(([x, y]) => `${x}px ${y}px`).join(',')})`
  const bolts = compact ? [[18, h / 2], [w - 18, h / 2]] : [[28, 32], [w - 28, 32], [28, h - 30], [w - 28, h - 30]]
  return <span ref={ref} className={`bio-frame${compact ? ' bio-frame-compact' : ''}`} aria-hidden="true">
    <span className="bio-frost" style={{ clipPath: clip }} />
    <svg className="bio-edges" width="100%" height="100%" viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d5faff" stopOpacity=".85" />
          <stop offset=".18" stopColor="#4f758a" stopOpacity=".4" />
          <stop offset=".4" stopColor="#efffff" stopOpacity=".8" />
          <stop offset=".62" stopColor="#546578" stopOpacity=".38" />
          <stop offset=".82" stopColor="#ffe4f7" stopOpacity=".85" />
          <stop offset="1" stopColor="#849cac" stopOpacity=".65" />
        </linearGradient>
        <linearGradient id={`${id}-light`} x1="0" y1="0" x2="1" y2=".6">
          <stop stopColor="#00e5ff" /><stop offset=".5" stopColor="#c3faff" stopOpacity=".2" /><stop offset="1" stopColor="#ff3fc8" />
        </linearGradient>
        <radialGradient id={`${id}-metal`} cx=".3" cy=".2" r=".8">
          <stop stopColor="#fff" /><stop offset=".3" stopColor="#c7d7de" /><stop offset=".55" stopColor="#647581" /><stop offset=".78" stopColor="#172632" /><stop offset="1" stopColor="#d6e5eb" />
        </radialGradient>
      </defs>
      <polygon points={outline} fill="none" stroke={`url(#${id}-edge)`} strokeWidth="9" strokeOpacity=".36" strokeLinejoin="round" />
      <polygon points={outline} fill="none" stroke="#e7faff" strokeOpacity=".65" strokeWidth=".8" />
      <polygon points={innerOutline} fill="none" stroke={`url(#${id}-edge)`} strokeWidth="1" />
      {card && <path d="M24 2 H124 L140 14 L124 28 H4 V24 Z" fill="currentColor" fillOpacity=".18" stroke="currentColor" strokeWidth="1.2" />}
      <polygon className="bio-edge-light" points={outline} fill="none" stroke={`url(#${id}-light)`} strokeWidth="1.6" />
      {bolts.map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}>
        <circle r="8" fill={`url(#${id}-metal)`} stroke="#d3e4e9" strokeWidth=".65" />
        <path d="M-3 -2 L3 2 M-2 3 L2 -3" fill="none" stroke="#17222c" strokeWidth="1.7" />
      </g>)}
    </svg>
  </span>
}
