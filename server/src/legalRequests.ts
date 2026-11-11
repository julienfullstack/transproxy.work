import { createCipheriv, createDecipheriv, createHmac, randomBytes, randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import type { Pool } from 'pg'

export const LEGAL_NOTICE_VERSION = 'legal-requests-2026-11-11-v1'
export const LEGAL_BODY_LIMIT = 24 * 1024
export const LEGAL_CATEGORIES = [
  'privacy-access', 'privacy-correction', 'privacy-deletion',
  'consent-withdrawal', 'content-removal', 'general-contact',
] as const
export type LegalCategory = typeof LEGAL_CATEGORIES[number]
export type LegalRequestInput = { category: LegalCategory; email: string; url: string; description: string }
export type LegalRequestPayload = LegalRequestInput & { operatorNotes: { at: string; text: string }[] }
export type EncryptedLegalRequest = { id: string; emailLookup: string; encryptedPayload: string; noticeVersion: string }
export interface LegalRequestStore { insert(entry: EncryptedLegalRequest): Promise<void> }
export type LegalStatus = 'new' | 'reviewing' | 'awaiting_verification' | 'closed'
export type LegalMetadata = {
  id: string; status: LegalStatus; notice_version: string; created_at: Date;
  updated_at: Date; response_due_at: Date; closed_at: Date | null;
  purge_after: Date | null; hold_until: Date | null;
}
const metadataColumns = 'id, status, notice_version, created_at, updated_at, response_due_at, closed_at, purge_after, hold_until'
const forbiddenControls = /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/
const allControls = /[\x00-\x1f\x7f]/
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const aad = (id: string) => Buffer.from(`transproxy:legal-request:payload:v1:${id}`, 'utf8')

export function legalEmailLookup(email: string, key: Buffer): string {
  return createHmac('sha256', key).update(`transproxy:legal-request:email-lookup:v1:${email.trim().toLowerCase()}`, 'utf8').digest('hex')
}

export function encryptLegalPayload(payload: LegalRequestPayload, id: string, key: Buffer): string {
  if (key.length !== 32 || !uuid.test(id)) throw new Error('Invalid private request configuration')
  const nonce = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, nonce)
  cipher.setAAD(aad(id))
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()])
  return ['v1', nonce.toString('base64url'), ciphertext.toString('base64url'), cipher.getAuthTag().toString('base64url')].join('.')
}

export function decryptLegalPayload(envelope: string, id: string, key: Buffer): LegalRequestPayload {
  const pieces = envelope.split('.')
  const [version, nonce, ciphertext, tag] = pieces
  if (key.length !== 32 || !uuid.test(id) || pieces.length !== 4 || version !== 'v1'
    || !nonce || !ciphertext || !tag || ![nonce, ciphertext, tag].every(value => /^[A-Za-z0-9_-]+$/.test(value))
    || Buffer.from(nonce, 'base64url').length !== 12 || Buffer.from(tag, 'base64url').length !== 16) {
    throw new Error('Invalid encrypted request')
  }
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(nonce, 'base64url'))
  decipher.setAAD(aad(id))
  decipher.setAuthTag(Buffer.from(tag, 'base64url'))
  const payload: unknown = JSON.parse(Buffer.concat([decipher.update(Buffer.from(ciphertext, 'base64url')), decipher.final()]).toString('utf8'))
  if (!payload || typeof payload !== 'object' || !('operatorNotes' in payload) || !Array.isArray(payload.operatorNotes)) throw new Error('Invalid encrypted request')
  return payload as LegalRequestPayload
}

export function normalizeLegalInput(body: { category: string; email: string; url?: string; description: string }): LegalRequestInput | null {
  const email = body.email.trim().toLowerCase()
  const description = body.description.replace(/\r\n?/g, '\n').trim()
  if (!LEGAL_CATEGORIES.includes(body.category as LegalCategory) || email.length > 254
    || !/^[^\s@\x00-\x1f\x7f]+@[^\s@\x00-\x1f\x7f]+\.[^\s@\x00-\x1f\x7f]+$/.test(email)
    || description.length < 10 || description.length > 4000 || forbiddenControls.test(description)) return null
  let url = (body.url ?? '').trim()
  if (url) {
    if (url.length > 2048 || allControls.test(url)) return null
    try {
      const parsed = new URL(url)
      if (parsed.protocol !== 'https:' || parsed.username || parsed.password) return null
      url = parsed.href
      if (url.length > 2048) return null
    } catch { return null }
  }
  return { category: body.category as LegalCategory, email, url, description }
}

export function postgresLegalRequestStore(pool: Pool): LegalRequestStore {
  return { async insert(entry) {
    await pool.query(
      'INSERT INTO legal_requests (id,email_lookup,encrypted_payload,notice_version) VALUES ($1,$2,$3,$4)',
      [entry.id, entry.emailLookup, entry.encryptedPayload, entry.noticeVersion],
    )
  } }
}

type RouteOptions = {
  store?: LegalRequestStore; encryptionKey: Buffer; lookupKey: Buffer;
  allowedOrigins: string[]; clock?: () => number; rateLimit?: number; rateWindowMs?: number;
}
type RequestBody = { category: string; email: string; url?: string; description: string; website?: string }

export function registerLegalRequestRoutes(app: FastifyInstance, options: RouteOptions): void {
  const origins = new Set(options.allowedOrigins)
  const windows = new Map<string, { count: number; reset: number }>()
  const now = options.clock ?? Date.now
  const duration = options.rateWindowMs ?? 10 * 60_000
  const limit = options.rateLimit ?? 5
  app.addHook('onRequest', async (request, reply) => {
    if (request.url.split('?')[0] !== '/api/legal-requests') return
    const origin = request.headers.origin
    if (!origin || !origins.has(origin)) return reply.code(403).send({ ok: false, message: 'This request is not allowed.' })
    reply.header('Access-Control-Allow-Origin', origin).header('Vary', 'Origin')
      .header('Access-Control-Allow-Methods', 'POST, OPTIONS').header('Access-Control-Allow-Headers', 'Content-Type')
    if (request.method !== 'POST') return
    if (!/^application\/json(?:\s*;.*)?$/i.test(request.headers['content-type'] ?? '')) {
      return reply.code(415).send({ ok: false, message: 'Send this request as JSON.' })
    }
    const time = now()
    for (const [ip, window] of windows) if (window.reset <= time) windows.delete(ip)
    if (!windows.has(request.ip) && windows.size >= 20_000) return reply.code(503).send({ ok: false, message: 'Please try again shortly.' })
    const window = windows.get(request.ip) ?? { count: 0, reset: time + duration }
    window.count += 1
    windows.set(request.ip, window)
    if (window.count > limit) {
      reply.header('Retry-After', Math.max(1, Math.ceil((window.reset - time) / 1000)))
      return reply.code(429).send({ ok: false, message: 'Please wait before submitting another request.' })
    }
  })
  app.options('/api/legal-requests', async (_request, reply) => reply.code(204).send())
  app.post<{ Body: RequestBody }>('/api/legal-requests', {
    bodyLimit: LEGAL_BODY_LIMIT,
    schema: { body: {
      type: 'object', additionalProperties: false,
      required: ['category', 'email', 'description'],
      properties: {
        category: { type: 'string', enum: [...LEGAL_CATEGORIES] },
        email: { type: 'string', minLength: 3, maxLength: 254 },
        url: { type: 'string', maxLength: 2048 },
        description: { type: 'string', minLength: 10, maxLength: 4000 },
        website: { type: 'string', maxLength: 512 },
      },
    } },
    errorHandler(error, _request, reply) {
      const failure = error as { statusCode?: number; validation?: unknown }
      if (failure.statusCode === 413) return reply.code(413).send({ ok: false, message: 'This request is too large.' })
      if (failure.statusCode === 415) return reply.code(415).send({ ok: false, message: 'Send this request as JSON.' })
      if (failure.validation || failure.statusCode === 400) return reply.code(400).send({ ok: false, message: 'Check the request type, reply email, optional HTTPS URL and description.' })
      return reply.code(503).send({ ok: false, message: 'Could not save your request. Please try again.' })
    },
  }, async (request, reply) => {
    const input = normalizeLegalInput(request.body)
    if (!input) return reply.code(400).send({ ok: false, message: 'Check the request type, reply email, optional HTTPS URL and description.' })
    const id = randomUUID()
    if (!request.body.website) {
      if (!options.store) throw new Error('Request storage unavailable')
      await options.store.insert({
        id, emailLookup: legalEmailLookup(input.email, options.lookupKey),
        encryptedPayload: encryptLegalPayload({ ...input, operatorNotes: [] }, id, options.encryptionKey),
        noticeVersion: LEGAL_NOTICE_VERSION,
      })
    }
    return reply.code(201).send({ ok: true, reference: id })
  })
}

export async function listLegalRequests(pool: Pool, emailLookup?: string): Promise<LegalMetadata[]> {
  const result = await pool.query<LegalMetadata>(
    `SELECT ${metadataColumns} FROM legal_requests WHERE ${emailLookup ? 'email_lookup = $1' : "status <> 'closed'"} ORDER BY created_at,id LIMIT 100`,
    emailLookup ? [emailLookup] : [],
  )
  return result.rows
}

export async function readLegalRequest(pool: Pool, id: string, key: Buffer): Promise<{ metadata: LegalMetadata; payload: LegalRequestPayload } | null> {
  if (!uuid.test(id)) throw new Error('Invalid reference')
  const result = await pool.query<LegalMetadata & { encrypted_payload: string }>(`SELECT ${metadataColumns},encrypted_payload FROM legal_requests WHERE id=$1`, [id])
  const row = result.rows[0]
  if (!row) return null
  const { encrypted_payload, ...metadata } = row
  return { metadata, payload: decryptLegalPayload(encrypted_payload, id, key) }
}

export type LegalOperatorAction =
  | { type: 'status'; status: 'reviewing' | 'awaiting_verification'; note?: string }
  | { type: 'close'; note?: string }
  | { type: 'hold'; until: Date; reason: string }
  | { type: 'release-hold'; reason: string }
  | { type: 'purge' }

export async function operateLegalRequest(pool: Pool, id: string, action: LegalOperatorAction, key: Buffer, now = new Date()): Promise<boolean> {
  if (!uuid.test(id) || !Number.isFinite(now.getTime())) throw new Error('Invalid operation')
  const note = action.type === 'hold' || action.type === 'release-hold' ? action.reason : action.type !== 'purge' ? action.note : undefined
  if (note !== undefined && (note.trim().length < 1 || note.length > 1000 || forbiddenControls.test(note))) throw new Error('Invalid operator note')
  if ((action.type === 'hold' || action.type === 'release-hold') && (note?.trim().length ?? 0) < 10) throw new Error('A hold reason is required')
  if (action.type === 'hold' && (!Number.isFinite(action.until.getTime()) || action.until <= now || action.until.getTime() > now.getTime() + 366 * 86_400_000)) throw new Error('Hold expiry must be within one year')
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await client.query<LegalMetadata & { encrypted_payload: string }>(`SELECT ${metadataColumns},encrypted_payload FROM legal_requests WHERE id=$1 FOR UPDATE`, [id])
    const row = result.rows[0]
    if (!row) { await client.query('COMMIT'); return false }
    if (action.type === 'purge') {
      if (row.hold_until && new Date(row.hold_until) > now) throw new Error('Active legal hold prevents purge')
      await client.query('DELETE FROM legal_requests WHERE id=$1', [id])
    } else {
      if (action.type === 'status' && row.status === 'closed') throw new Error('Closed requests cannot be reopened by this operation')
      const payload = decryptLegalPayload(row.encrypted_payload, id, key)
      const summary = action.type === 'status' ? `Status: ${action.status}` : action.type === 'hold' ? `Hold until ${action.until.toISOString()}` : action.type === 'release-hold' ? 'Hold released' : 'Closed'
      payload.operatorNotes.push({ at: now.toISOString(), text: `${summary}${note ? ` — ${note.trim()}` : ''}` })
      if (payload.operatorNotes.length > 200) throw new Error('Operator note limit reached')
      const encrypted = encryptLegalPayload(payload, id, key)
      const status = action.type === 'status' ? action.status : action.type === 'close' ? 'closed' : row.status
      const closedAt = action.type === 'close' ? row.closed_at ?? now : row.closed_at
      const purgeAfter = action.type === 'close' ? row.purge_after ?? new Date(now.getTime() + 90 * 86_400_000) : row.purge_after
      const holdUntil = action.type === 'hold' ? action.until : action.type === 'release-hold' ? null : row.hold_until
      await client.query(
        'UPDATE legal_requests SET encrypted_payload=$2,status=$3,updated_at=$4,closed_at=$5,purge_after=$6,hold_until=$7 WHERE id=$1',
        [id, encrypted, status, now, closedAt, purgeAfter, holdUntil],
      )
    }
    await client.query('COMMIT')
    return true
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {})
    throw error
  } finally { client.release() }
}

export async function purgeExpiredLegalRequests(pool: Pool, now = new Date()): Promise<number> {
  const result = await pool.query(
    "DELETE FROM legal_requests WHERE status='closed' AND purge_after <= $1 AND (hold_until IS NULL OR hold_until <= $1)", [now],
  )
  return result.rowCount ?? 0
}

export function createLegalRequestMaintenance(pool: Pool, clock: () => number = Date.now) {
  let interval: ReturnType<typeof setInterval> | undefined
  let active: Promise<number> | undefined
  let stopping = false
  const runOnce = () => {
    active ??= purgeExpiredLegalRequests(pool, new Date(clock())).finally(() => { active = undefined })
    return active
  }
  return {
    runOnce,
    async start() {
      if (interval || stopping) return
      await runOnce()
      if (!stopping) interval = setInterval(() => {
        void runOnce().catch(() => { process.stderr.write('Private request retention maintenance unavailable.\n') })
      }, 60 * 60_000)
      interval?.unref()
    },
    async stop() { stopping = true; if (interval) clearInterval(interval); await active },
  }
}
