import { createElement } from 'react'
import 'altcha/external'
import 'altcha/altcha.css'
import pbkdf2WorkerUrl from 'altcha/workers/pbkdf2?url'

// The external build needs an explicitly registered, same-origin worker.
(globalThis as typeof globalThis & { $altcha: { algorithms: Map<string, () => Worker> } }).$altcha.algorithms.set('PBKDF2/SHA-256', () => new Worker(pbkdf2WorkerUrl))

export function Captcha() {
  return createElement('altcha-widget', { challenge: `${window.__API_BASE__ ?? ''}/api/captcha/challenge`, name: 'altcha', theme: 'dark' })
}
