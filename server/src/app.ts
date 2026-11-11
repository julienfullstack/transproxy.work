import { randomUUID } from 'node:crypto'
import Fastify from 'fastify'
import type { Pool } from 'pg'
import { emailDigest, encryptEmail } from './crypto.js'

export const CONSENT_VERSION = 'waitlist-2026-11-10'
const accepted = { ok: true, message: 'Your waiting-list request has been received.' } as const

export type EncryptedEntry = {
  id: string
  emailDigest: string
  encryptedEmail: string
  consentVersion: string
}

export interface WaitlistStore {
  health(): Promise<void>
  insert(entry: EncryptedEntry): Promise<void>
}

export function postgresStore(pool: Pool): WaitlistStore {
  return {
    async health() { await pool.query('SELECT 1') },
    async insert(entry) {
      await pool.query(
        'INSERT INTO waitlist_entries (id, email_digest, encrypted_email, consent_version) VALUES ($1, $2, $3, $4) ON CONFLICT (email_digest) DO NOTHING',
        [entry.id, entry.emailDigest, entry.encryptedEmail, entry.consentVersion],
      )
    },
  }
}

type AppOptions = {
  store: WaitlistStore
  encryptionKey: Buffer
  lookupKey: Buffer
  allowedOrigins: string[]
  trustProxy?: number | boolean
  rateLimit?: number
  rateWindowMs?: number
  clock?: () => number
}

type SignupBody = { email: string; adult: boolean; consent: boolean; website?: string }

export function createApp(options: AppOptions) {
  if (options.encryptionKey.length !== 32 || options.lookupKey.length !== 32) throw new Error('Waitlist keys must be 32 bytes')
  if (options.encryptionKey.equals(options.lookupKey)) throw new Error('Waitlist encryption and lookup keys must be different')
  if (options.allowedOrigins.length === 0) throw new Error('At least one allowed origin is required')
  const trustedHops = typeof options.trustProxy === 'number' ? options.trustProxy : undefined

  const app = Fastify({
    logger: false,
    bodyLimit: 2048,
    trustProxy: trustedHops !== undefined ? (_address, hop) => hop < trustedHops : (options.trustProxy === true),
    ajv: { customOptions: { coerceTypes: false, removeAdditional: false } },
  })
  const origins = new Set(options.allowedOrigins)
  const windows = new Map<string, { count: number; reset: number }>()
  const now = options.clock ?? Date.now
  const limit = options.rateLimit ?? 10
  const duration = options.rateWindowMs ?? 60_000

  app.addHook('onRequest', async (request, reply) => {
    reply.header('Cache-Control', 'no-store')
    reply.header('X-Content-Type-Options', 'nosniff')
    reply.header('X-Frame-Options', 'DENY')
    reply.header('Referrer-Policy', 'no-referrer')
    reply.header('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'")
    if (request.url.split('?')[0] !== '/api/waitlist') return

    const origin = request.headers.origin
    if (origin && !origins.has(origin)) {
      return reply.code(403).send({ ok: false, message: 'This request is not allowed.' })
    }
    if (origin) {
      reply.header('Access-Control-Allow-Origin', origin)
      reply.header('Vary', 'Origin')
      reply.header('Access-Control-Allow-Methods', 'POST, OPTIONS')
      reply.header('Access-Control-Allow-Headers', 'Content-Type')
    }
    if (request.method === 'OPTIONS') return
    if (request.method !== 'POST') return
    // Browser signups must carry an approved Origin. JSON-only requests prevent
    // simple cross-origin forms; an Origin is not an anti-bot credential.
    if (!origin) return reply.code(403).send({ ok: false, message: 'This request is not allowed.' })
    if (!/^application\/json(?:\s*;.*)?$/i.test(request.headers['content-type'] ?? '')) {
      return reply.code(415).send({ ok: false, message: 'Send this request as JSON.' })
    }

    const time = now()
    for (const [ip, window] of windows) if (window.reset <= time) windows.delete(ip)
    // Bound memory even under distributed traffic. Existing windows are never
    // evicted to make room for a new address, so churn cannot bypass limits.
    if (!windows.has(request.ip) && windows.size >= 20_000) {
      return reply.code(503).send({ ok: false, message: 'Please try again shortly.' })
    }
    const window = windows.get(request.ip) ?? { count: 0, reset: time + duration }
    window.count += 1
    windows.set(request.ip, window)
    if (window.count > limit) {
      reply.header('Retry-After', Math.max(1, Math.ceil((window.reset - time) / 1000)))
      return reply.code(429).send({ ok: false, message: 'Please wait a minute before trying again.' })
    }
  })

  app.setErrorHandler((error, _request, reply) => {
    // Do not return validation values, database details, request bodies or errors
    // to logs. Only fixed text leaves this boundary.
    const failure = error as { statusCode?: number; validation?: unknown }
    if (failure.statusCode === 413) return reply.code(413).send({ ok: false, message: 'This request is too large.' })
    if (failure.statusCode === 415) return reply.code(415).send({ ok: false, message: 'Send this request as JSON.' })
    if (failure.validation || failure.statusCode === 400) return reply.code(400).send({ ok: false, message: 'Enter a valid email and confirm both choices.' })
    return reply.code(503).send({ ok: false, message: 'The waiting list is temporarily unavailable. Please try again.' })
  })

  app.get('/api/health', async (_request, reply) => {
    try { await options.store.health(); return { ok: true } }
    catch { return reply.code(503).send({ ok: false }) }
  })

  app.options('/api/waitlist', async (_request, reply) => reply.code(204).send())

  app.post<{ Body: SignupBody }>('/api/waitlist', {
    schema: {
      body: {
        type: 'object', additionalProperties: false,
        required: ['email', 'adult', 'consent'],
        properties: {
          email: { type: 'string', minLength: 3, maxLength: 254 },
          adult: { type: 'boolean', const: true },
          consent: { type: 'boolean', const: true },
          website: { type: 'string', maxLength: 512 },
        },
      },
    },
  }, async (request, reply) => {
    if (request.body.website) return reply.code(200).send(accepted)
    const email = request.body.email.trim().toLowerCase()
    if (!/^[^\s@\x00-\x1f\x7f]+@[^\s@\x00-\x1f\x7f]+\.[^\s@\x00-\x1f\x7f]+$/.test(email)) {
      return reply.code(400).send({ ok: false, message: 'Enter a valid email address.' })
    }
    const id = randomUUID()
    await options.store.insert({
      id,
      emailDigest: emailDigest(email, options.lookupKey),
      encryptedEmail: encryptEmail(email, id, options.encryptionKey),
      consentVersion: CONSENT_VERSION,
    })
    return reply.code(200).send(accepted)
  })

  return app
}
