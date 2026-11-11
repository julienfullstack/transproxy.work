/** Refract only the backdrop. Foreground text and controls are never filtered. */
export function GlassMaterial() {
  return <svg className="glass-filter-definitions" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="transproxy-glass" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="1" seed="7" result="glass-surface" />
        <feGaussianBlur in="glass-surface" stdDeviation="3" result="smooth-surface" />
        <feDisplacementMap in="SourceGraphic" in2="smooth-surface" scale="18" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="transproxy-prism" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.014" numOctaves="1" seed="11" result="prism-map" />
        <feGaussianBlur in="prism-map" stdDeviation="4" result="smooth-prism" />
        <feDisplacementMap in="SourceGraphic" in2="smooth-prism" scale="26" xChannelSelector="R" yChannelSelector="G" result="refracted" />
        <feOffset in="refracted" dx="1.5" dy=".5" result="red-offset" />
        <feColorMatrix in="red-offset" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
        <feOffset in="refracted" dx="-1.5" dy="-.5" result="cyan-offset" />
        <feColorMatrix in="cyan-offset" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="cyan" />
        <feBlend in="red" in2="cyan" mode="screen" />
      </filter>
    </defs>
  </svg>
}
