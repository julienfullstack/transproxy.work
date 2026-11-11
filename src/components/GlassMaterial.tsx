/** Refract only the backdrop. Foreground text and controls are never filtered. */
export function GlassMaterial() {
  return <svg className="glass-filter-definitions" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="transproxy-glass" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="1" seed="7" result="glass-surface" />
        <feGaussianBlur in="glass-surface" stdDeviation="3" result="smooth-surface" />
        <feDisplacementMap in="SourceGraphic" in2="smooth-surface" scale="18" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
}
