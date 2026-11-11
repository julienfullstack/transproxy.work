import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import type { Pool } from 'pg'
import { decryptEmail } from './crypto.js'

export const WELCOME_SUBJECT = 'You’re on the TransProxy waiting list'
export const WELCOME_TEXT = [
  'You’re on the TransProxy waiting list.',
  'Membership is invite-only and in development. We’ll email you about invitations and launch updates. Joining does not create an account or guarantee access.',
  'Your date of birth was used only to check that you are 18 or older. We do not store it.',
].join('\n\n')

export type MailConfig = { apiKey: string; from: string; siteUrl: string }
export type WelcomeEmail = { from: string; to: string[]; subject: string; text: string; html: string; headers: Record<string, string> }
export type SendResult = { ok: true } | { ok: false; retryable: boolean }
export type MailSender = (payload: WelcomeEmail, idempotencyKey: string) => Promise<SendResult>

export function readMailConfig(env: NodeJS.ProcessEnv): MailConfig | undefined {
  if (!env.RESEND_API_KEY || !env.WAITLIST_FROM_EMAIL) return undefined
  const from = env.WAITLIST_FROM_EMAIL.trim()
  if (!from.includes('@') || /[\r\n]/.test(from) || from.length > 200) throw new Error('Invalid private mail configuration')
  const url = new URL(env.SITE_URL ?? 'https://transproxy.org')
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || (url.pathname !== '/' && url.pathname !== '')) {
    throw new Error('SITE_URL must be an HTTPS origin')
  }
  return { apiKey: env.RESEND_API_KEY, from: from.includes('<') ? from : `TransProxy <${from}>`, siteUrl: url.origin }
}

function signature(value: string, key: Buffer): string {
  return createHmac('sha256', key).update(`transproxy:waitlist:unsubscribe:v1:${value}`, 'utf8').digest('base64url')
}

export function createUnsubscribeToken(id: string, expiresAt: Date, key: Buffer): string {
  const value = `v1.${id}.${Math.floor(expiresAt.getTime() / 1000)}`
  return `${value}.${signature(value, key)}`
}

export function verifyUnsubscribeToken(token: string, key: Buffer, now = Date.now()): string | null {
  const match = /^(v1\.([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.(\d{10,12}))\.([A-Za-z0-9_-]{43})$/.exec(token)
  if (!match) return null
  const expected = Buffer.from(signature(match[1]!, key))
  const received = Buffer.from(match[4]!)
  if (received.length !== expected.length || !timingSafeEqual(expected, received)) return null
  const expiry = Number(match[3]) * 1000
  return Number.isSafeInteger(expiry) && expiry > now ? match[2]! : null
}

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

export function welcomeEmail(config: MailConfig, email: string, token: string): WelcomeEmail {
  const unsubscribeUrl = `${config.siteUrl}/api/waitlist/unsubscribe?token=${encodeURIComponent(token)}`
  const paragraphs = WELCOME_TEXT.split('\n\n').map((paragraph) => `<p style="margin:0 0 20px;color:#f7f7fc;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;">${escapeHtml(paragraph)}</p>`).join('')
  // Solid dark fallbacks and table geometry remain usable without gradients.
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"></head>
<body bgcolor="#080d19" style="margin:0;padding:0;background-color:#080d19;color:#f7f7fc;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#080d19" style="width:100%;background-color:#080d19;margin:0;padding:0;"><tr><td align="center" style="padding:40px 16px;">
<!--[if mso]><table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#161e2d" style="width:100%;max-width:560px;background-color:#161e2d;background-image:linear-gradient(135deg,#1a2433 0%,#161e2d 52%,#2e2335 100%);border:1px solid #00e5ff;border-right-color:#ff3fc8;border-bottom-color:#ff3fc8;border-radius:8px;box-shadow:0 0 24px #00e5ff20,0 0 36px #ff3fc81a;border-spacing:0;">
<tr><td style="padding:16px 24px;border-bottom:1px solid #00e5ff55;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="color:#f7f7fc;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:18px;font-weight:700;letter-spacing:2px;">TransProxy</td><td align="right" width="48" style="color:#00e5ff;font-size:15px;line-height:18px;letter-spacing:4px;"><span aria-hidden="true">&#9632;<span style="color:#ff3fc8;">&#9632;</span></span></td></tr></table>
</td></tr>
<tr><td style="padding:28px 24px 8px;">
<h1 style="margin:0 0 26px;color:#f7f7fc;font-family:Arial,Helvetica,sans-serif;font-size:30px;line-height:1.15;font-weight:700;letter-spacing:-0.6px;">${escapeHtml(WELCOME_SUBJECT)}</h1>
${paragraphs}
</td></tr>
<tr><td bgcolor="#0f1724" style="padding:20px 24px;background-color:#0f1724;border-top:1px solid #ff3fc844;">
<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;"><a href="${escapeHtml(unsubscribeUrl)}" style="color:#00e5ff;text-decoration:underline;">Leave the TransProxy waiting list</a></p>
<p style="margin:16px 0 0;color:#f7f7fc;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;">cruush technologies LLC (Technosovereign)<br>41 State Street, Suite 112, Albany, NY 12207</p>
</td></tr></table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table></body></html>`
  return {
    from: config.from, to: [email], subject: WELCOME_SUBJECT,
    text: `${WELCOME_TEXT}\n\nLeave the TransProxy waiting list: ${unsubscribeUrl}\n\ncruush technologies LLC (Technosovereign)\n41 State Street, Suite 112, Albany, NY 12207`,
    html,
    headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
  }
}

export function createResendSender(config: MailConfig, fetcher: typeof fetch = fetch): MailSender {
  return async (payload, idempotencyKey) => {
    try {
      const response = await fetcher('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      })
      if (!response.ok) {
        await response.body?.cancel()
        return { ok: false, retryable: response.status === 429 || response.status >= 500 }
      }
      const result: unknown = await response.json()
      return result && typeof result === 'object' && 'id' in result && typeof result.id === 'string' && result.id.length > 0
        ? { ok: true } : { ok: false, retryable: true }
    } catch { return { ok: false, retryable: true } }
  }
}

type ClaimedRow = { id: string; welcome_lease_token: string }
type SendingRow = { id: string; encrypted_email: string; welcome_attempts: number; welcome_first_attempt_at: Date; welcome_token_expires_at: Date }
type WorkerOptions = { pool: Pool; encryptionKey: Buffer; lookupKey: Buffer; config: MailConfig; sender?: MailSender }

export function createMailWorker(options: WorkerOptions) {
  const sender = options.sender ?? createResendSender(options.config)
  let interval: ReturnType<typeof setInterval> | undefined
  let active: Promise<boolean> | undefined
  let stopping = false

  async function runOnce(): Promise<boolean> {
    const lease = randomUUID()
    const claim = await options.pool.query<ClaimedRow>(
      `WITH next_job AS (
         SELECT id FROM waitlist_entries
         WHERE (welcome_status = 'pending' AND welcome_next_attempt_at <= now())
            OR (welcome_status = 'sending' AND welcome_lease_until <= now())
         ORDER BY welcome_next_attempt_at NULLS FIRST
         FOR UPDATE SKIP LOCKED LIMIT 1
       )
       UPDATE waitlist_entries entries SET
         welcome_status = 'sending', welcome_lease_token = $1,
         welcome_lease_until = now() + interval '60 seconds',
         welcome_first_attempt_at = coalesce(welcome_first_attempt_at, now()),
         welcome_attempts = welcome_attempts + 1
       FROM next_job WHERE entries.id = next_job.id
       RETURNING entries.id, entries.welcome_lease_token`, [lease],
    )
    const claimed = claim.rows[0]
    if (!claimed) return false

    const client = await options.pool.connect()
    try {
      await client.query('BEGIN')
      // Serialize deletion against the bounded in-flight send. Once a removal
      // commits, no worker can fetch that row or begin another delivery.
      const selected = await client.query<SendingRow>(
        `SELECT id, encrypted_email, welcome_attempts, welcome_first_attempt_at, welcome_token_expires_at
         FROM waitlist_entries WHERE id = $1 AND welcome_lease_token = $2
           AND welcome_status = 'sending' AND welcome_lease_until > now() FOR UPDATE`, [claimed.id, claimed.welcome_lease_token],
      )
      const row = selected.rows[0]
      if (!row) { await client.query('COMMIT'); return true }

      // Resend retains idempotency keys for 24 hours. Stop uncertain retries
      // before that window expires, including retries after a process restart.
      const tooOld = Date.now() - new Date(row.welcome_first_attempt_at).getTime() >= 23 * 60 * 60 * 1000
      let outcome: SendResult = { ok: false, retryable: false }
      if (!tooOld && row.welcome_attempts <= 8) {
        try {
          const email = decryptEmail(row.encrypted_email, row.id, options.encryptionKey)
          const token = createUnsubscribeToken(row.id, new Date(row.welcome_token_expires_at), options.lookupKey)
          outcome = await sender(welcomeEmail(options.config, email, token), `transproxy-welcome-v1/${row.id}`)
        } catch { outcome = { ok: false, retryable: false } }
      }
      const retry = !outcome.ok && outcome.retryable && row.welcome_attempts < 8 && !tooOld
      const delaySeconds = Math.min(3600, 60 * 2 ** Math.max(0, row.welcome_attempts - 1))
      await client.query(
        `UPDATE waitlist_entries SET welcome_status = $2,
           welcome_sent_at = CASE WHEN $2 = 'sent' THEN now() ELSE welcome_sent_at END,
           welcome_next_attempt_at = CASE WHEN $2 = 'pending' THEN now() + ($3 * interval '1 second') ELSE NULL END,
           welcome_lease_until = NULL, welcome_lease_token = NULL
         WHERE id = $1 AND welcome_lease_token = $4`,
        [row.id, outcome.ok ? 'sent' : retry ? 'pending' : 'failed', delaySeconds, claimed.welcome_lease_token],
      )
      await client.query('COMMIT')
      return true
    } catch {
      await client.query('ROLLBACK').catch(() => {})
      // Leave the durable lease for recovery after expiry; never log the row,
      // decrypted contact, provider error body, keys or unsubscribe token.
      return true
    } finally { client.release() }
  }

  const tick = () => {
    if (stopping || active) return
    active = runOnce().catch(() => false).finally(() => { active = undefined })
  }
  return {
    runOnce,
    start() { if (!interval) { tick(); interval = setInterval(tick, 5000); interval.unref() } },
    async stop() { stopping = true; if (interval) clearInterval(interval); await active },
  }
}

export function unsubscribePage(token: string | undefined, state: 'confirm' | 'removed' | 'invalid'): string {
  const title = state === 'confirm' ? 'Leave the TransProxy waiting list' : state === 'removed' ? 'Waiting-list removal complete' : 'This link is invalid or expired'
  const form = state === 'confirm' && token
    ? `<form method="post" action="/api/waitlist/unsubscribe?token=${encodeURIComponent(token)}"><button type="submit" name="confirm" value="remove">Remove me from the waiting list</button></form>` : ''
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${title}</title><style>body{margin:0;background:#0b0d16;color:#f7f7fc;font-family:Arial,Helvetica,sans-serif}main{max-width:560px;margin:64px auto;padding:24px}h1{font-weight:400;line-height:1.2}button{border:0;background:#00e5ff;color:#0b0d16;padding:14px;font:inherit;cursor:pointer}a{color:#00e5ff}</style></head><body><main><h1>${title}</h1>${form}<p><a href="/">TransProxy</a></p></main></body></html>`
}
