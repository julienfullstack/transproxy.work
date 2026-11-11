/** Shaped red/blue displacement-map technique adapted from Jhey Tompkins:
 * https://codepen.io/jh3y/pen/EajLxJV (MIT; public/licenses/jh3y-liquid-glass.txt).
 * Match our existing polygon instead of importing the demo's draggable dock. */
export function panelDisplacement(width: number, height: number, points: number[][]) {
  const w = Math.max(1, Math.round(width))
  const h = Math.max(1, Math.round(height))
  const rim = Math.min(22, Math.min(w, h) * .08)
  const outline = points.map(p => p.join(',')).join(' ')
  const inside = points.map(([x, y]) => `${rim + x * (w - 2 * rim) / w},${rim + y * (h - 2 * rim) / h}`).join(' ')
  // R encodes horizontal displacement; B encodes vertical displacement.
  // Neutral gray in the center leaves the main reading area undistorted.
  const map = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="r" x1="100%" y1="0%" x2="0%" y2="0%"><stop stop-color="black"/><stop offset="1" stop-color="red"/></linearGradient><linearGradient id="b" x1="0%" y1="0%" x2="0%" y2="100%"><stop stop-color="black"/><stop offset="1" stop-color="blue"/></linearGradient><filter id="soft"><feGaussianBlur stdDeviation="${Math.min(8, rim * .35)}"/></filter></defs><rect width="100%" height="100%" fill="#808080"/><polygon points="${outline}" fill="url(#r)"/><polygon points="${outline}" fill="url(#b)" style="mix-blend-mode:screen"/><polygon points="${inside}" fill="#808080" filter="url(#soft)"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(map)}`
}
