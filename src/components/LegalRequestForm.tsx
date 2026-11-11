import { BioFrame } from './BioFrame'
import { useState } from 'react'
import type { FormEvent } from 'react'

const CATEGORIES = [
  ['privacy-access', 'Access my information'],
  ['privacy-correction', 'Correct my information'],
  ['privacy-deletion', 'Delete my information'],
  ['consent-withdrawal', 'Withdraw consent'],
  ['content-removal', 'Content correction or removal'],
  ['general-contact', 'General contact'],
] as const

export function LegalRequestForm() {
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
      const response = await fetch(`${window.__API_BASE__ ?? ''}/api/legal-requests`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: data.get('category'), email: data.get('email'), url: data.get('url') || undefined, description: data.get('description'), website: data.get('website') || '' }),
        signal: AbortSignal.timeout(15000),
      })
      const result: unknown = await response.json().catch(() => null)
      if (response.status === 429) throw new Error('Too many requests. Please try again later.')
      if (!response.ok || !result || typeof result !== 'object' || !('ok' in result) || result.ok !== true || !('reference' in result) || typeof result.reference !== 'string' || !/^[0-9a-f-]{36}$/.test(result.reference)) throw new Error('Your request could not be saved. Check the fields and try again.')
      setState('success')
      setMessage(`Request received. Your reference is ${result.reference}. This does not automatically release or delete information. We may contact you to verify your request.`)
      form.reset()
    } catch (error) {
      setState('error')
      setMessage(error instanceof Error && !['TimeoutError', 'TypeError'].includes(error.name) ? error.message : 'Could not connect. Please try again.')
    }
  }
  const sending = state === 'sending'
  return <form className="legal-request-form glass-panel bio-pane" aria-label="Privacy, removal and contact request" onSubmit={submit}><BioFrame compact />
    <div className="field"><label htmlFor="legal-category">Request type</label><select id="legal-category" name="category" required disabled={sending} defaultValue=""><option value="" disabled>Select a request type</option>{CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
    <div className="field"><label htmlFor="legal-email">Reply email</label><input id="legal-email" name="email" type="email" autoComplete="email" maxLength={254} required disabled={sending} /></div>
    <div className="field"><label htmlFor="legal-url">Content URL <span className="optional-label">Optional · HTTPS</span></label><input id="legal-url" name="url" type="url" inputMode="url" maxLength={2048} pattern="https://.*" disabled={sending} /></div>
    <div className="field"><label htmlFor="legal-description">Your request</label><textarea id="legal-description" name="description" minLength={10} maxLength={4000} rows={6} required disabled={sending} aria-describedby="legal-form-privacy" /></div>
    <div className="hp-field" aria-hidden="true"><label htmlFor="legal-website">Website</label><input id="legal-website" name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
    <p className="form-processing-notice" id="legal-form-privacy">Do not include medical records, identity documents, passwords or payment details. No attachments are accepted. We use your reply address and request to handle this submission, as explained in our <a href="#/privacy">Privacy Notice</a> and <a href="#/health-privacy">Consumer Health Privacy Policy</a>.</p>
    <button className="submit-button bio-action" type="submit" disabled={sending}><BioFrame compact /><span>{sending ? 'Sending…' : 'Send request'}</span></button>
    <p className={`form-result ${state === 'error' ? 'error' : ''}`} role={state === 'error' ? 'alert' : 'status'} aria-live="polite">{message}</p>
  </form>
}
