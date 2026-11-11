import { useState } from 'react'
import type { FormEvent } from 'react'
import { NeonBackdrop } from './NeonBackdrop'

function latestEligibleBirthDate() {
  const today = new Date()
  const year = today.getUTCFullYear() - 18
  const month = today.getUTCMonth()
  const cutoff = new Date(Date.UTC(year, month, today.getUTCDate()))
  if (cutoff.getUTCMonth() !== month) cutoff.setUTCDate(0)
  return cutoff.toISOString().slice(0, 10)
}

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
        body: JSON.stringify({email: data.get('email'), dateOfBirth: data.get('dateOfBirth'), adult: data.get('adult') === 'on', consent: data.get('consent') === 'on', termsAccepted: data.get('termsAccepted') === 'on', website: data.get('website') || ''}),
        signal: AbortSignal.timeout(15000),
      })
      const result: unknown = await response.json().catch(() => null)
      if (!response.ok) {
        const explanation = result && typeof result === 'object' && 'message' in result && typeof result.message === 'string' ? result.message : ''
        throw new Error(response.status === 429 ? 'Too many attempts. Please try again later.' : response.status === 400 && explanation ? explanation : 'Could not save your email. Please try again.')
      }
      if (!result || typeof result !== 'object' || !('ok' in result) || result.ok !== true) throw new Error('Could not save your email. Please try again.')
      setState('success')
      setMessage('You’re on the waiting list. We’ll contact you about invitations and launch updates.')
      form.reset()
    } catch (error) {
      setState('error')
      setMessage(error instanceof Error && !['TimeoutError', 'TypeError'].includes(error.name) ? error.message : 'Could not connect. Please try again.')
    }
  }
  return <form id="waitlist" className="waitlist-form" onSubmit={submit} aria-label="Join waiting list">
    <div className="waitlist-fields">
      <div className="field"><label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" autoComplete="email" maxLength={254} required disabled={state === 'sending'} /></div>
      <div className="field"><label htmlFor="dateOfBirth">Date of birth</label>
        <input id="dateOfBirth" name="dateOfBirth" type="date" autoComplete="bday" max={latestEligibleBirthDate()} required disabled={state === 'sending'} /></div>
    </div>
    <div className="hp-field" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
    <label className="check"><input type="checkbox" name="adult" required disabled={state === 'sending'} /><span>I am 18 or older.</span></label>
    <label className="check"><input type="checkbox" name="consent" required disabled={state === 'sending'} /><span>I explicitly consent to TransProxy using my email and interest in this health-related project for waiting-list administration, invitations and launch updates. <a href="#/privacy">Privacy</a> · <a href="#/health-privacy">Health data privacy</a></span></label>
    <label className="check"><input type="checkbox" name="termsAccepted" required disabled={state === 'sending'} /><span>I agree to the <a href="#/terms">Website &amp; Waiting-list Terms</a>.</span></label>
    <button className="submit-button" type="submit" disabled={state === 'sending'}><NeonBackdrop /><span>{state === 'sending' ? 'Joining…' : 'Join waiting list'}</span></button>
    <p className={`form-result ${state === 'error' ? 'error' : ''}`} role={state === 'error' ? 'alert' : 'status'} aria-live="polite">{message}</p>
  </form>
}
