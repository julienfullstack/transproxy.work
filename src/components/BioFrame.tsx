import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { panelDisplacement } from '../effects/panelDisplacement'

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
  const bevel = Math.min(14, h / 8, w / 12)
  const insetPoints = points.map(([x, y]) => [bevel + x * (w - bevel * 2) / w, bevel + y * (h - bevel * 2) / h])
  const bevelPath = `M${points.map(p => p.join(' ')).join('L')}Z M${insetPoints.map(p => p.join(' ')).join('L')}Z`
  const rimClip = `polygon(evenodd, ${[...points, points[0], ...insetPoints, insetPoints[0], points[0]].map(([x, y]) => `${x}px ${y}px`).join(',')})`
  const displacement = panelDisplacement(w, h, points)
  const lens = `url("#${id}-lens")`
  return <span ref={ref} style={{ '--panel-lens': lens } as CSSProperties} className={`bio-frame${compact ? ' bio-frame-compact' : ''}`} aria-hidden="true">
    <span className="bio-frost" style={{ clipPath: clip }} />
    <span className="bio-glass-rim" style={{ clipPath: rimClip, backdropFilter: `${lens} blur(.5px) saturate(140%)`, WebkitBackdropFilter: `${lens} blur(.5px) saturate(140%)` }} />
    <svg className="bio-edges" width="100%" height="100%" viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <filter id={`${id}-lens`} x="0" y="0" width={w} height={h} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feImage href={displacement} x="0" y="0" width={w} height={h} preserveAspectRatio="none" result="edge-map" />
          <feDisplacementMap in="SourceGraphic" in2="edge-map" scale="-100" xChannelSelector="R" yChannelSelector="B" result="pink-pass" />
          <feDisplacementMap in="SourceGraphic" in2="edge-map" scale="-88" xChannelSelector="R" yChannelSelector="B" result="cyan-pass" />
          {/* Complementary cyan and pink bands, sharing blue to avoid a green/yellow fringe. */}
          <feColorMatrix in="pink-pass" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 .5 0 0  0 0 0 1 0" result="pink" />
          <feColorMatrix in="cyan-pass" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 .5 0 0  0 0 0 1 0" result="cyan" />
          <feComposite in="pink" in2="cyan" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
        </filter>
        <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#52edff" stopOpacity=".85" />
          <stop offset=".18" stopColor="#4f758a" stopOpacity=".4" />
          <stop offset=".4" stopColor="#efffff" stopOpacity=".8" />
          <stop offset=".62" stopColor="#546578" stopOpacity=".38" />
          <stop offset=".82" stopColor="#ff65df" stopOpacity=".85" />
          <stop offset="1" stopColor="#849cac" stopOpacity=".65" />
        </linearGradient>
        <linearGradient id={`${id}-light`} x1="0" y1="0" x2="1" y2=".6">
          <stop stopColor="#00e5ff" /><stop offset=".5" stopColor="#7540ff" stopOpacity="1" /><stop offset="1" stopColor="#ff00c8" />
        </linearGradient>
        <linearGradient id={`${id}-prism`} x1="0" y1="0" x2="1" y2=".85">
          <stop offset="0" stopColor="#00e5ff" stopOpacity="1" />
          <stop offset=".16" stopColor="#efffff" stopOpacity=".15" />
          <stop offset=".32" stopColor="#7540ff" stopOpacity=".45" />
          <stop offset=".45" stopColor="#ff00c8" stopOpacity=".95" />
          <stop offset=".58" stopColor="#efffff" stopOpacity="0" />
          <stop offset=".76" stopColor="#00e5ff" stopOpacity=".4" />
          <stop offset="1" stopColor="#ff00c8" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={`${id}-bevel`} x1="0" y1="0" x2=".7" y2="1">
          <stop offset="0" stopColor="#52edff" stopOpacity=".38" />
          <stop offset=".12" stopColor="#52edff" stopOpacity=".08" />
          <stop offset=".45" stopColor="#08121f" stopOpacity=".4" />
          <stop offset=".72" stopColor="#47eaff" stopOpacity=".06" />
          <stop offset="1" stopColor="#ff65df" stopOpacity=".3" />
        </linearGradient>
      </defs>
      <g className="bio-glass-depth">
        <path d={bevelPath} fill={`url(#${id}-bevel)`} fillRule="evenodd" />
        <path className="bio-prism-band" d={bevelPath} fill={`url(#${id}-prism)`} fillRule="evenodd" />
        <polygon points={insetPoints.map(p => p.join(',')).join(' ')} fill="none" stroke="#06101d" strokeOpacity=".8" strokeWidth="3" />
        <polygon points={insetPoints.map(p => p.join(',')).join(' ')} fill="none" stroke={`url(#${id}-edge)`} strokeOpacity=".8" strokeWidth=".8" />
      </g>
      <polygon points={outline} fill="none" stroke={`url(#${id}-edge)`} strokeWidth="9" strokeOpacity=".36" strokeLinejoin="round" />
      <polygon points={outline} fill="none" stroke="#e7faff" strokeOpacity=".65" strokeWidth=".8" />
      <polygon points={innerOutline} fill="none" stroke={`url(#${id}-edge)`} strokeWidth="1" />
      <polygon className="bio-edge-light" points={outline} fill="none" stroke={`url(#${id}-light)`} strokeWidth="1.8" />
    </svg>
    {card && <span className="bio-flag-frost">
      <svg width="140" height="28" viewBox="0 0 140 28">
        <path d="M24 2 H124 L140 14 L124 28 H4 V24 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </span>}
  </span>
}
