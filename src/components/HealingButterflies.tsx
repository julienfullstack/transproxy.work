import { useEffect, useRef, useState } from 'react'
import '../effects/healingButterflies.css'

// Actual structure from yoksel's “Butterflies drink dark matter” public Pen.
// https://codepen.io/yoksel/pen/BZwWOO — MIT; wing artwork: CC BY 3.0.
// One of the original three cubes keeps the requested accents restrained.
const CUBES = [1] as const
const SIDES = ['back', 'left', 'right', 'top', 'bottom', 'front'] as const

export function HealingButterflies() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(true)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const bounds = wrapper.getBoundingClientRect()
    let visible = bounds.bottom > 0 && bounds.top < window.innerHeight

    function syncMotion() {
      setPaused(document.hidden || reducedMotion.matches || !visible)
    }

    const observer = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting)
      syncMotion()
    }) : undefined
    observer?.observe(wrapper)
    document.addEventListener('visibilitychange', syncMotion)
    reducedMotion.addEventListener('change', syncMotion)
    syncMotion()

    return () => {
      observer?.disconnect()
      document.removeEventListener('visibilitychange', syncMotion)
      reducedMotion.removeEventListener('change', syncMotion)
    }
  }, [])

  return <div ref={wrapperRef} className="healing-butterflies" data-effect="codepen-yoksel-BZwWOO" data-paused={paused} aria-hidden="true" inert>
    <div className="container">
      {CUBES.map(cube => <div className={`cube cube--${cube}`} key={cube}>
        {SIDES.map(side => <div className={`side side--${side}`} key={side}>
          <div className={`spot spot--${side}`} />
        </div>)}
      </div>)}
    </div>
  </div>
}
