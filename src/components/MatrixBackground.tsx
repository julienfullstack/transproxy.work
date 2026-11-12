import { useEffect, useRef, useState } from 'react'

/**
 * Nick Matantsev's falling-code rain (codepen.io/unframework/pen/pqorjJ, MIT),
 * recorded once from the site's own renderer at 30 fps as a seamless 20-second
 * loop. Playing it as a video keeps the rain smooth without redrawing a WebGL
 * canvas under the frosted glass on every frame.
 */
export function MatrixBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [renderer, setRenderer] = useState<'loading' | 'video' | 'unavailable'>('loading')

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let disposed = false
    let intersects = true
    let scrolling = false
    let scrollTimer: ReturnType<typeof setTimeout> | undefined

    function shouldPlay() {
      const fullscreen = document.fullscreenElement
      return !disposed && !document.hidden && intersects && !scrolling && !reducedMotion.matches
        && (!fullscreen || fullscreen.contains(video!))
    }

    function syncMotion() {
      if (shouldPlay()) {
        if (video!.paused) void video!.play().catch(() => undefined)
      } else if (!video!.paused) {
        video!.pause()
      }
    }

    function onScroll() {
      if (!scrolling) {
        scrolling = true
        document.documentElement.dataset.scrolling = 'true'
        syncMotion()
      }
      if (scrollTimer !== undefined) clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => {
        scrollTimer = undefined
        scrolling = false
        delete document.documentElement.dataset.scrolling
        syncMotion()
      }, 180)
    }

    function ready() {
      if (!disposed) setRenderer('video')
      syncMotion()
    }

    function failed() {
      if (!disposed) setRenderer('unavailable')
    }

    const intersection = new IntersectionObserver(entries => {
      intersects = entries.some(entry => entry.isIntersecting)
      syncMotion()
    })
    intersection.observe(video)
    video.addEventListener('loadeddata', ready)
    video.addEventListener('error', failed)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onScroll, { passive: true })
    window.addEventListener('touchmove', onScroll, { passive: true })
    document.addEventListener('visibilitychange', syncMotion)
    document.addEventListener('fullscreenchange', syncMotion)
    reducedMotion.addEventListener('change', syncMotion)
    if (video.readyState >= 2) ready()

    return () => {
      disposed = true
      video.pause()
      if (scrollTimer !== undefined) clearTimeout(scrollTimer)
      delete document.documentElement.dataset.scrolling
      intersection.disconnect()
      video.removeEventListener('loadeddata', ready)
      video.removeEventListener('error', failed)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onScroll)
      window.removeEventListener('touchmove', onScroll)
      document.removeEventListener('visibilitychange', syncMotion)
      document.removeEventListener('fullscreenchange', syncMotion)
      reducedMotion.removeEventListener('change', syncMotion)
    }
  }, [])

  return <div className="matrix-background" data-effect="codepen-unframework-pqorjJ" data-renderer={renderer} aria-hidden="true" inert>
    <video
      ref={videoRef}
      className="matrix-rain"
      src="/media/matrix-rain.mp4"
      poster="/media/matrix-rain-poster.jpg"
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      disableRemotePlayback
      tabIndex={-1}
    />
  </div>
}
