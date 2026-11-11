import { useState } from 'react'
import type { FormEvent } from 'react'

export function WaitlistForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    const data = new FormData(form)
    setState('sending')
    setMessage('')
    try {
      const response = await fetch(`${window.__API_BASE__ ?? ''}/api/waitlist`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email: data.get('email'), adult: data.get('adult') === 'on', consent: data.get('consent') === 'on', website: data.get('website') || ''}),
        signal: AbortSignal.timeout(15000),
      })
      if (!response.ok) throw new Error(response.status === 429 ? 'Too many attempts. Please try again later.' : 'Could not save your email. Please try again.')
      const result: unknown = await response.json()
      if (!result || typeof result !== 'object' || !('ok' in result) || result.ok !== true) throw new Error('Could not save your email. Please try again.')
      setState('success')
      setMessage('You’re on the waiting list. We’ll contact you about invitations and launch updates.')
      form.reset()
    } catch (error) {
      setState('error')
      setMessage(error instanceof Error && !['TimeoutError', 'TypeError'].includes(error.name) ? error.message : 'Could not connect. Please try again.')
    }
  }
  return <form className="waitlist-form" onSubmit={submit} aria-label="Join waiting list">
    <label htmlFor="email">Email address</label>
    <input id="email" name="email" type="email" autoComplete="email" maxLength={254} required disabled={state === 'sending'} />
    <div className="hp-field" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
    <label className="check"><input type="checkbox" name="adult" required disabled={state === 'sending'} /><span>I am 18 or older.</span></label>
    <label className="check"><input type="checkbox" name="consent" required disabled={state === 'sending'} /><span>I agree to receive TransProxy invitations and launch updates by email. <a href="#privacy">Waiting-list privacy</a></span></label>
    <button className="submit-button" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Joining…' : 'Join waiting list'}</button>
    <p className={`form-result ${state === 'error' ? 'error' : ''}`} role={state === 'error' ? 'alert' : 'status'} aria-live="polite">{message}</p>
  </form>
}
