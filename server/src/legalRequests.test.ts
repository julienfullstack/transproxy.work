import assert from 'node:assert/strict'
import { randomBytes, randomUUID } from 'node:crypto'
import { spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { Pool } from 'pg'
import { createApp, type WaitlistStore } from './app.js'
import { decryptEmail, emailDigest, encryptEmail } from './crypto.js'
import {
  createLegalRequestMaintenance, decryptLegalPayload, encryptLegalPayload,
  legalEmailLookup, LEGAL_NOTICE_VERSION, listLegalRequests, normalizeLegalInput,
  operateLegalRequest, postgresLegalRequestStore, purgeExpiredLegalRequests,
  readLegalRequest, type EncryptedLegalRequest, type LegalRequestStore,
} from './legalRequests.js'
import { requirePrivateTerminal } from './legalRequestsOperator.js'
import { migrate } from './migrate.js'

const encryptionKey = randomBytes(32)
const lookupKey = randomBytes(32)
const origin = 'https://transproxy.org'
const headers = { origin, 'content-type': 'application/json' }
const body = {
  category: 'privacy-access', email: 'request@example.invalid',
  url: 'https://transproxy.org/#/privacy', description: 'Please review this synthetic privacy request.',
}
const input = normalizeLegalInput(body)!
const payload = { ...input, operatorNotes: [] }

function fixture(overrides: Partial<Parameters<typeof createApp>[0]> = {}) {
  const entries: EncryptedLegalRequest[] = []
  let waitlistActions = 0
  const store: WaitlistStore = {
    health: async () => {}, insert: async () => { waitlistActions += 1 }, removeById: async () => { waitlistActions += 1 },
  }
  const legalRequestStore: LegalRequestStore = { insert: async entry => { entries.push(entry) } }
  const app = createApp({ store, legalRequestStore, encryptionKey, lookupKey, allowedOrigins: [origin], ...overrides })
  return { app, entries, waitlistActions: () => waitlistActions }
}

test('request encryption uses fresh authenticated purpose-bound envelopes and a separate lookup context', () => {
  const id = randomUUID()
  const first = encryptLegalPayload(payload, id, encryptionKey)
  const second = encryptLegalPayload(payload, id, encryptionKey)
  assert.notEqual(first, second)
  assert.deepEqual(decryptLegalPayload(first, id, encryptionKey), payload)
  assert.ok(!first.includes(body.email))
  assert.throws(() => decryptLegalPayload(first, randomUUID(), encryptionKey))
  assert.throws(() => decryptLegalPayload(first, id, randomBytes(32)))
  const parts = first.split('.')
  parts[2] = Buffer.from('changed').toString('base64url')
  assert.throws(() => decryptLegalPayload(parts.join('.'), id, encryptionKey))
  assert.throws(() => decryptLegalPayload('v1.bad.payload.bad', id, encryptionKey))
  assert.throws(() => decryptLegalPayload(encryptEmail(body.email, id, encryptionKey), id, encryptionKey))
  assert.throws(() => decryptEmail(first, id, encryptionKey))
  assert.notEqual(legalEmailLookup(body.email, lookupKey), emailDigest(body.email, lookupKey))
  assert.equal(legalEmailLookup(' Request@Example.Invalid ', lookupKey), legalEmailLookup(body.email, lookupKey))
})

test('request API stores only an encrypted bounded payload and opaque metadata; receipts reveal no membership or submitted fields', async (t) => {
  const { app, entries, waitlistActions } = fixture()
  t.after(() => app.close())
  const first = await app.inject({ method: 'POST', url: '/api/legal-requests', headers, payload: { ...body, email: ' Request@Example.Invalid ' } })
  const second = await app.inject({ method: 'POST', url: '/api/legal-requests', headers, payload: body })
  assert.equal(first.statusCode, 201)
  assert.equal(second.statusCode, 201)
  assert.deepEqual(Object.keys(first.json()).sort(), ['ok', 'reference'])
  assert.match(first.json().reference, /^[0-9a-f-]{36}$/)
  assert.notEqual(first.json().reference, second.json().reference)
  assert.equal(entries.length, 2)
  const saved = entries[0]!
  assert.deepEqual(Object.keys(saved).sort(), ['emailLookup', 'encryptedPayload', 'id', 'noticeVersion'])
  assert.equal(saved.noticeVersion, LEGAL_NOTICE_VERSION)
  assert.equal(saved.id, first.json().reference)
  assert.deepEqual(decryptLegalPayload(saved.encryptedPayload, saved.id, encryptionKey), payload)
  for (const value of [body.email, body.description, body.url]) {
    assert.ok(!JSON.stringify(saved).includes(value))
    assert.ok(!first.body.includes(value))
  }
  assert.equal(waitlistActions(), 0)
  assert.equal(first.headers['cache-control'], 'no-store')
  assert.equal((await app.inject({ url: '/api/legal-requests', headers: { origin } })).statusCode, 404)
  assert.equal((await app.inject({ url: `/api/legal-requests/${saved.id}`, headers: { origin } })).statusCode, 404)
})

test('request validation rejects extra fields, attachments, controls, unsafe URL syntax and invalid categories without persistence', async (t) => {
  const { app, entries } = fixture({ legalRequestRateLimit: 60 })
  t.after(() => app.close())
  const missingEmail = { category: body.category, description: body.description }
  for (const invalid of [
    missingEmail, { ...body, category: 'unknown' }, { ...body, category: false },
    { ...body, email: 'not-email' }, { ...body, email: 'x@example.invalid\nHeader' },
    { ...body, email: 'x'.repeat(255) }, { ...body, description: '   short   ' },
    { ...body, description: 'x'.repeat(4001) }, { ...body, description: 'Private\u0000control text' },
    { ...body, description: 'Private\u001bcontrol text' },
    { ...body, url: 'javascript:alert(1)' }, { ...body, url: 'data:text/plain,private' },
    { ...body, url: 'http://transproxy.org/privacy' }, { ...body, url: 'https://user:password@example.invalid/' },
    { ...body, url: 'https://example.invalid/\nunsafe' }, { ...body, url: 'https://example.invalid/' + 'x'.repeat(2048) },
    { ...body, attachment: 'must reject' }, { ...body, screenshot: {} }, { ...body, dateOfBirth: '1990-03-14' },
  ]) {
    assert.equal((await app.inject({ method: 'POST', url: '/api/legal-requests', headers, payload: invalid })).statusCode, 400)
  }
  assert.equal(entries.length, 0)
  const valid = await app.inject({ method: 'POST', url: '/api/legal-requests', headers, payload: { ...body, url: '', description: '  First line.\r\nSecond line.  ' } })
  assert.equal(valid.statusCode, 201)
  const saved = entries[0]!
  assert.equal(decryptLegalPayload(saved.encryptedPayload, saved.id, encryptionKey).description, 'First line.\nSecond line.')
})

test('request Origin/JSON/body limits are enforced separately from the smaller waiting-list limit; URLs are never fetched', async (t) => {
  const { app, entries } = fixture({ legalRequestRateLimit: 20 })
  t.after(() => app.close())
  const originalFetch = globalThis.fetch
  let fetches = 0
  globalThis.fetch = (async () => { fetches += 1; throw new Error('Unexpected network request') }) as typeof fetch
  t.after(() => { globalThis.fetch = originalFetch })
  for (const badOrigin of [undefined, 'null', 'https://unapproved.invalid']) {
    assert.equal((await app.inject({ method: 'POST', url: '/api/legal-requests', headers: { 'content-type': 'application/json', ...(badOrigin ? { origin: badOrigin } : {}) }, payload: body })).statusCode, 403)
  }
  const preflight = await app.inject({ method: 'OPTIONS', url: '/api/legal-requests', headers: { origin } })
  assert.equal(preflight.statusCode, 204)
  assert.equal(preflight.headers['access-control-allow-origin'], origin)
  assert.equal((await app.inject({ method: 'POST', url: '/api/legal-requests', headers: { origin, 'content-type': 'text/plain' }, payload: JSON.stringify(body) })).statusCode, 415)
  assert.equal((await app.inject({ method: 'POST', url: '/api/legal-requests', headers, payload: { ...body, description: 'x'.repeat(30_000) } })).statusCode, 413)
  assert.equal((await app.inject({ method: 'POST', url: '/api/legal-requests', headers, payload: { ...body, url: 'https://127.0.0.1/private-do-not-fetch', description: '症'.repeat(3900) } })).statusCode, 201)
  assert.equal((await app.inject({ method: 'POST', url: '/api/waitlist', headers, payload: { email: 'x'.repeat(3000) } })).statusCode, 413)
  assert.equal(entries.length, 1)
  assert.equal(fetches, 0)
})

test('request rate limiting expires, trusts only configured ingress and remains independent of signup', async (t) => {
  let time = Date.UTC(2026, 10, 11)
  const { app } = fixture({ clock: () => time, legalRequestRateLimit: 1, legalRequestRateWindowMs: 1000 })
  t.after(() => app.close())
  assert.equal((await app.inject({ method: 'POST', url: '/api/legal-requests', headers, payload: body })).statusCode, 201)
  const denied = await app.inject({ method: 'POST', url: '/api/legal-requests', headers: { ...headers, 'x-forwarded-for': '203.0.113.4' }, payload: body })
  assert.equal(denied.statusCode, 429)
  assert.equal(denied.headers['retry-after'], '1')
  time += 1001
  assert.equal((await app.inject({ method: 'POST', url: '/api/legal-requests', headers, payload: body })).statusCode, 201)
  const trusted = fixture({ legalRequestRateLimit: 1, trustProxy: 2 })
  t.after(() => trusted.app.close())
  const submit = (forwarded: string) => trusted.app.inject({ method: 'POST', url: '/api/legal-requests', remoteAddress: '172.18.0.5', headers: { ...headers, 'x-forwarded-for': forwarded }, payload: body })
  assert.equal((await submit('203.0.113.1, 172.18.0.4')).statusCode, 201)
  assert.equal((await submit('203.0.113.2, 172.18.0.4')).statusCode, 201)
  assert.equal((await submit('198.51.100.1, 203.0.113.1, 172.18.0.4')).statusCode, 429)
})

test('honeypot receipts and storage failures reveal no private fields or internal errors', async (t) => {
  const { app, entries } = fixture()
  t.after(() => app.close())
  const honey = await app.inject({ method: 'POST', url: '/api/legal-requests', headers, payload: { ...body, website: 'bot.invalid' } })
  assert.equal(honey.statusCode, 201)
  assert.equal(entries.length, 0)
  const failing = fixture({ legalRequestStore: { insert: async () => { throw new Error(`PRIVATE ${body.email} ${body.description}`) } } })
  t.after(() => failing.app.close())
  const error = await failing.app.inject({ method: 'POST', url: '/api/legal-requests', headers, payload: body })
  assert.equal(error.statusCode, 503)
  assert.ok(!error.body.includes('PRIVATE'))
  assert.ok(!error.body.includes(body.email))
  assert.ok(!error.body.includes(body.description))
})

test('private operator payload access refuses redirected terminals before opening a database', async () => {
  assert.throws(() => requirePrivateTerminal(false, true))
  assert.throws(() => requirePrivateTerminal(true, false))
  requirePrivateTerminal(true, true)
  const result = await new Promise<{ code: number | null; output: string }>((resolve, reject) => {
    const child = spawn(process.execPath, [new URL('../dist/legalRequestsOperator.js', import.meta.url).pathname, 'show', randomUUID()], { env: {}, stdio: ['ignore', 'pipe', 'pipe'] })
    let output = ''
    child.stdout.on('data', data => { output += data.toString() })
    child.stderr.on('data', data => { output += data.toString() })
    child.on('error', reject)
    child.on('close', code => resolve({ code, output }))
  })
  assert.equal(result.code, 1)
  assert.match(result.output, /^Private request operation failed\./)
  assert.ok(!result.output.includes('Error:'))
})

async function databaseFixture(t: { after(fn: () => Promise<void>): void }) {
  const admin = new Pool({ connectionString: process.env.TEST_DATABASE_URL })
  const schema = `legal_test_${randomBytes(8).toString('hex')}`
  await admin.query(`CREATE SCHEMA ${schema}`)
  const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL, options: `-c search_path=${schema}`, max: 6 })
  t.after(async () => { await pool.end(); await admin.query(`DROP SCHEMA ${schema} CASCADE`); await admin.end() })
  return { pool }
}

test('real Postgres migration preserves waiting-list rows and concurrent legal submissions persist only ciphertext and separate keyed lookup', { skip: !process.env.TEST_DATABASE_URL }, async (t) => {
  const { pool } = await databaseFixture(t)
  await pool.query(await readFile(new URL('../sql/001_waitlist.sql', import.meta.url), 'utf8'))
  const legacyId = randomUUID()
  const legacyCiphertext = encryptEmail('legacy@example.invalid', legacyId, encryptionKey)
  await pool.query('INSERT INTO waitlist_entries(id,email_digest,encrypted_email,consent_version) VALUES($1,$2,$3,$4)', [legacyId, emailDigest('legacy@example.invalid', lookupKey), legacyCiphertext, 'legacy-version'])
  await migrate(pool)
  await migrate(pool)
  const { app } = fixture({ legalRequestStore: postgresLegalRequestStore(pool), legalRequestRateLimit: 30 })
  t.after(() => app.close())
  const responses = await Promise.all(Array.from({ length: 8 }, () => app.inject({ method: 'POST', url: '/api/legal-requests', headers, payload: body })))
  assert.ok(responses.every(response => response.statusCode === 201))
  assert.equal(new Set(responses.map(response => response.json().reference)).size, 8)
  const rows = (await pool.query('SELECT * FROM legal_requests')).rows
  assert.equal(rows.length, 8)
  for (const row of rows) {
    for (const value of [body.email, body.description, body.url, body.category]) assert.ok(!JSON.stringify(row).includes(value))
    assert.match(row.encrypted_payload, /^v1\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/)
    assert.equal(row.email_lookup, legalEmailLookup(body.email, lookupKey))
    assert.deepEqual(decryptLegalPayload(row.encrypted_payload, row.id, encryptionKey), payload)
    assert.equal(row.notice_version, LEGAL_NOTICE_VERSION)
    assert.ok(row.response_due_at > row.created_at)
  }
  const legacy = (await pool.query('SELECT * FROM waitlist_entries WHERE id=$1', [legacyId])).rows[0]
  assert.equal(legacy.encrypted_email, legacyCiphertext)
  assert.equal(legacy.consent_version, 'legacy-version')
  assert.equal(legacy.welcome_status, 'none')
  const metadata = await listLegalRequests(pool)
  assert.equal(metadata.length, 8)
  assert.ok(!JSON.stringify(metadata).includes('encrypted_payload'))
  assert.ok(!JSON.stringify(metadata).includes('email_lookup'))
  assert.ok(!JSON.stringify(metadata).includes(body.email))
})

test('real Postgres operator notes remain encrypted; close/purge boundaries and bounded holds are enforced without waiting-list changes', { skip: !process.env.TEST_DATABASE_URL }, async (t) => {
  const { pool } = await databaseFixture(t)
  await migrate(pool)
  const store = postgresLegalRequestStore(pool)
  const add = async () => {
    const id = randomUUID()
    await store.insert({ id, encryptedPayload: encryptLegalPayload(payload, id, encryptionKey), emailLookup: legalEmailLookup(body.email, lookupKey), noticeVersion: LEGAL_NOTICE_VERSION })
    return id
  }
  const now = new Date('2030-01-01T12:00:00Z')
  const day = 86_400_000
  const held = await add()
  await assert.rejects(operateLegalRequest(pool, held, { type: 'hold', until: new Date(now.getTime() + day), reason: '' }, encryptionKey, now))
  await assert.rejects(operateLegalRequest(pool, held, { type: 'hold', until: new Date(now.getTime() + 367 * day), reason: 'Necessary synthetic legal hold' }, encryptionKey, now))
  await operateLegalRequest(pool, held, { type: 'status', status: 'awaiting_verification', note: 'Synthetic identity check pending' }, encryptionKey, now)
  await operateLegalRequest(pool, held, { type: 'hold', until: new Date(now.getTime() + 100 * day), reason: 'Necessary synthetic preservation reason' }, encryptionKey, now)
  await Promise.all([0, 1].map(index => operateLegalRequest(pool, held, { type: 'close', note: `Synthetic close ${index}` }, encryptionKey, now)))
  const read = (await readLegalRequest(pool, held, encryptionKey))!
  assert.equal(read.metadata.status, 'closed')
  assert.equal(read.metadata.purge_after!.getTime(), now.getTime() + 90 * day)
  assert.equal(read.payload.operatorNotes.length, 4)
  assert.ok(!JSON.stringify((await pool.query('SELECT * FROM legal_requests')).rows).includes('Necessary synthetic preservation reason'))
  await assert.rejects(operateLegalRequest(pool, held, { type: 'purge' }, encryptionKey, now))
  assert.equal(await purgeExpiredLegalRequests(pool, new Date(now.getTime() + 91 * day)), 0)
  assert.equal(await purgeExpiredLegalRequests(pool, new Date(now.getTime() + 100 * day)), 1)

  const active = await add()
  const closing = await add()
  await operateLegalRequest(pool, closing, { type: 'close' }, encryptionKey, now)
  assert.equal(await purgeExpiredLegalRequests(pool, new Date(now.getTime() + 90 * day - 1)), 0)
  assert.equal(await purgeExpiredLegalRequests(pool, new Date(now.getTime() + 90 * day)), 1)
  assert.ok(await readLegalRequest(pool, active, encryptionKey))
  const early = await add()
  await operateLegalRequest(pool, early, { type: 'hold', until: new Date(now.getTime() + day), reason: 'Necessary short synthetic legal hold' }, encryptionKey, now)
  await operateLegalRequest(pool, early, { type: 'release-hold', reason: 'Synthetic preservation reason no longer applies' }, encryptionKey, now)
  assert.equal(await operateLegalRequest(pool, early, { type: 'purge' }, encryptionKey, now), true)
  assert.equal(await readLegalRequest(pool, early, encryptionKey), null)
  assert.equal((await pool.query('SELECT count(*) FROM waitlist_entries')).rows[0].count, '0')
})

test('real Postgres maintenance purges on startup and later runs while retaining active requests', { skip: !process.env.TEST_DATABASE_URL }, async (t) => {
  const { pool } = await databaseFixture(t)
  await migrate(pool)
  const add = async () => {
    const id = randomUUID()
    await postgresLegalRequestStore(pool).insert({ id, encryptedPayload: encryptLegalPayload(payload, id, encryptionKey), emailLookup: legalEmailLookup(body.email, lookupKey), noticeVersion: LEGAL_NOTICE_VERSION })
    return id
  }
  const now = Date.UTC(2030, 0, 1)
  const expired = await add()
  await operateLegalRequest(pool, expired, { type: 'close' }, encryptionKey, new Date(now))
  const active = await add()
  let clock = now + 90 * 86_400_000
  const maintenance = createLegalRequestMaintenance(pool, () => clock)
  t.after(() => maintenance.stop())
  await maintenance.start()
  assert.equal(await readLegalRequest(pool, expired, encryptionKey), null)
  assert.ok(await readLegalRequest(pool, active, encryptionKey))
  const later = await add()
  await operateLegalRequest(pool, later, { type: 'close' }, encryptionKey, new Date(clock))
  clock += 90 * 86_400_000
  assert.equal(await maintenance.runOnce(), 1)
  assert.ok(await readLegalRequest(pool, active, encryptionKey))
  await maintenance.stop()
})
