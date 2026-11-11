import assert from 'node:assert/strict'
import { randomBytes, randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { Pool } from 'pg'
import { createApp, postgresStore, type EncryptedEntry, type WaitlistStore } from './app.js'
import { emailDigest, encryptEmail } from './crypto.js'
import { createMailWorker, createResendSender, createUnsubscribeToken, readMailConfig, verifyUnsubscribeToken, welcomeEmail, type MailSender, type WelcomeEmail } from './mail.js'
import { migrate } from './migrate.js'

const encryptionKey = randomBytes(32)
const lookupKey = randomBytes(32)
const origin = 'https://transproxy.org'
const config = { apiKey: 'synthetic-test-key', from: 'TransProxy <waitlist@example.invalid>', siteUrl: origin }
const headers = { origin, 'content-type': 'application/json' }
const body = { email: 'mail-test@example.invalid', dateOfBirth: '1990-03-14', adult: true, consent: true, termsAccepted: true }

test('unsubscribe capabilities contain only opaque ID and expiry, validate signatures, and expire', () => {
  const id = randomUUID()
  const expires = new Date('2027-01-01T00:00:00Z')
  const token = createUnsubscribeToken(id, expires, lookupKey)
  assert.equal(verifyUnsubscribeToken(token, lookupKey, expires.getTime() - 1), id)
  assert.equal(verifyUnsubscribeToken(token, lookupKey, expires.getTime()), null)
  assert.equal(verifyUnsubscribeToken(token, randomBytes(32), expires.getTime() - 1), null)
  assert.equal(verifyUnsubscribeToken(`${token.slice(0, -1)}!`, lookupKey), null)
  assert.equal(verifyUnsubscribeToken(`${token}.extra`, lookupKey), null)
  assert.ok(!token.includes('@'))
  assert.ok(!token.includes(body.email))
})

test('Resend request uses official endpoint, stable idempotency, explicit recipient and unsubscribe headers; failures stay opaque', async () => {
  const id = randomUUID()
  const token = createUnsubscribeToken(id, new Date(Date.now() + 86_400_000), lookupKey)
  const payload = welcomeEmail(config, body.email, token)
  const calls: { url: string; init: RequestInit }[] = []
  const sender = createResendSender(config, (async (url, init) => {
    calls.push({ url: String(url), init: init! })
    return new Response(JSON.stringify({ id: randomUUID() }), { status: 200 })
  }) as typeof fetch)
  assert.deepEqual(await sender(payload, `welcome/${id}`), { ok: true })
  assert.equal(calls[0]!.url, 'https://api.resend.com/emails')
  assert.equal((calls[0]!.init.headers as Record<string, string>)['Idempotency-Key'], `welcome/${id}`)
  const sent = JSON.parse(String(calls[0]!.init.body))
  assert.deepEqual(sent.to, [body.email])
  assert.equal(sent.headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click')
  assert.ok(sent.headers['List-Unsubscribe'].includes(token))
  assert.ok(!JSON.stringify(sent).includes(body.dateOfBirth))
  assert.ok(!sent.html.includes('cruush'))
  assert.ok(!sent.text.includes('first 500'))
  for (const [status, retryable] of [[429, true], [503, true], [403, false], [409, false]] as const) {
    const failed = createResendSender(config, (async () => new Response('PRIVATE PROVIDER BODY', { status })) as typeof fetch)
    assert.deepEqual(await failed(payload, `welcome/${id}`), { ok: false, retryable })
  }
  assert.equal(readMailConfig({}), undefined)
  assert.equal(readMailConfig({ RESEND_API_KEY: 'synthetic' }), undefined)
  assert.equal(readMailConfig({ RESEND_API_KEY: 'synthetic', WAITLIST_FROM_EMAIL: 'waitlist@example.invalid' })?.siteUrl, origin)
  assert.throws(() => readMailConfig({ RESEND_API_KEY: 'synthetic', WAITLIST_FROM_EMAIL: 'x@example.invalid\nBcc: attacker', SITE_URL: origin }))
})

test('unsubscribe GET does not remove; explicit originless form or signed one-click removes; foreign forms and invalid tokens cannot remove', async (t) => {
  const entries = new Map<string, EncryptedEntry>()
  const store: WaitlistStore = {
    health: async () => {},
    insert: async entry => { if (!entries.has(entry.emailDigest)) entries.set(entry.emailDigest, entry) },
    removeById: async id => { for (const [digest, entry] of entries) if (entry.id === id) entries.delete(digest) },
  }
  const app = createApp({ store, encryptionKey, lookupKey, allowedOrigins: [origin] })
  t.after(() => app.close())
  await app.inject({ method: 'POST', url: '/api/waitlist', headers, payload: body })
  const saved = [...entries.values()][0]!
  const token = createUnsubscribeToken(saved.id, new Date(Date.now() + 86_400_000), lookupKey)
  const url = `/api/waitlist/unsubscribe?token=${token}`
  const confirmation = await app.inject({ url })
  assert.equal(confirmation.statusCode, 200)
  assert.ok(confirmation.body.includes('method="post"'))
  assert.ok(!confirmation.body.includes(body.email))
  assert.equal(entries.size, 1)
  assert.equal((await app.inject({ url: '/api/waitlist/unsubscribe?token=invalid' })).statusCode, 400)
  const unconfirmed = await app.inject({ method: 'POST', url, headers: { 'content-type': 'application/x-www-form-urlencoded' }, payload: 'confirm=other' })
  assert.equal(unconfirmed.statusCode, 400)
  assert.equal(entries.size, 1)
  const foreignForm = await app.inject({ method: 'POST', url, headers: { origin: 'https://foreign.example.invalid', 'content-type': 'application/x-www-form-urlencoded' }, payload: 'confirm=remove' })
  assert.equal(foreignForm.statusCode, 400)
  assert.equal(entries.size, 1)
  const removed = await app.inject({ method: 'POST', url, headers: { 'content-type': 'application/x-www-form-urlencoded' }, payload: 'confirm=remove' })
  assert.equal(removed.statusCode, 200)
  assert.equal(entries.size, 0)
  // A token for a deleted record cannot remove a later explicit re-signup.
  await app.inject({ method: 'POST', url: '/api/waitlist', headers, payload: body })
  await app.inject({ method: 'POST', url, headers: { 'content-type': 'application/x-www-form-urlencoded' }, payload: 'List-Unsubscribe=One-Click' })
  assert.equal(entries.size, 1)
  const fresh = [...entries.values()][0]!
  const freshToken = createUnsubscribeToken(fresh.id, new Date(Date.now() + 86_400_000), lookupKey)
  // Chrome sends literal Origin:null for the actual no-referrer confirmation
  // navigation; this differs from both missing and foreign-site Origin.
  const nullOriginForm = await app.inject({ method: 'POST', url: `/api/waitlist/unsubscribe?token=${freshToken}`, headers: { origin: 'null', 'content-type': 'application/x-www-form-urlencoded' }, payload: 'confirm=remove' })
  assert.equal(nullOriginForm.statusCode, 200)
  assert.equal(entries.size, 0)
  await app.inject({ method: 'POST', url: '/api/waitlist', headers, payload: body })
  const next = [...entries.values()][0]!
  const nextToken = createUnsubscribeToken(next.id, new Date(Date.now() + 86_400_000), lookupKey)
  const oneClick = await app.inject({ method: 'POST', url: `/api/waitlist/unsubscribe?token=${nextToken}`, headers: { origin: 'https://mail.example.invalid', 'content-type': 'application/x-www-form-urlencoded' }, payload: 'List-Unsubscribe=One-Click' })
  assert.equal(oneClick.statusCode, 200)
  assert.deepEqual(oneClick.json(), { ok: true })
  assert.equal(entries.size, 0)
})

async function databaseFixture(t: { after(fn: () => Promise<void>): void }) {
  const admin = new Pool({ connectionString: process.env.TEST_DATABASE_URL })
  const schema = `mail_test_${randomBytes(8).toString('hex')}`
  await admin.query(`CREATE SCHEMA ${schema}`)
  const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL, options: `-c search_path=${schema}`, max: 6 })
  t.after(async () => { await pool.end(); await admin.query(`DROP SCHEMA ${schema} CASCADE`); await admin.end() })
  return { pool }
}

test('Postgres mail migration preserves old rows, deduplicates concurrent signup, and sends only new configured entries', { skip: !process.env.TEST_DATABASE_URL }, async (t) => {
  const { pool } = await databaseFixture(t)
  const legacySql = await readFile(new URL('../sql/001_waitlist.sql', import.meta.url), 'utf8')
  await pool.query(legacySql)
  const legacyId = randomUUID()
  await pool.query('INSERT INTO waitlist_entries (id,email_digest,encrypted_email,consent_version) VALUES ($1,$2,$3,$4)', [legacyId, emailDigest('legacy@example.invalid', lookupKey), encryptEmail('legacy@example.invalid', legacyId, encryptionKey), 'legacy-consent'])
  await migrate(pool)
  await migrate(pool)
  const app = createApp({ store: postgresStore(pool), encryptionKey, lookupKey, allowedOrigins: [origin], queueWelcome: true, rateLimit: 30 })
  t.after(() => app.close())
  const responses = await Promise.all(Array.from({ length: 10 }, () => app.inject({ method: 'POST', url: '/api/waitlist', headers, payload: body })))
  assert.ok(responses.every(response => response.statusCode === 200))
  assert.equal((await app.inject({ method: 'POST', url: '/api/waitlist', headers, payload: { ...body, email: 'legacy@example.invalid' } })).statusCode, 200)
  assert.equal((await pool.query('SELECT welcome_status FROM waitlist_entries WHERE id=$1', [legacyId])).rows[0].welcome_status, 'none')
  const sent: { payload: WelcomeEmail; key: string }[] = []
  const sender: MailSender = async (payload, key) => { sent.push({ payload, key }); return { ok: true } }
  const workers = [createMailWorker({ pool, encryptionKey, lookupKey, config, sender }), createMailWorker({ pool, encryptionKey, lookupKey, config, sender })]
  await Promise.all(workers.map(worker => worker.runOnce()))
  assert.equal(sent.length, 1)
  assert.deepEqual(sent[0]!.payload.to, [body.email])
  assert.ok(!JSON.stringify(sent[0]).includes(body.dateOfBirth))
  const rows = await pool.query('SELECT * FROM waitlist_entries')
  assert.equal(rows.rowCount, 2)
  assert.equal(rows.rows.filter(row => row.welcome_status === 'sent').length, 1)
  assert.ok(!JSON.stringify(rows.rows).includes(body.email))
  assert.ok(!JSON.stringify(rows.rows).includes(body.dateOfBirth))
})

test('Postgres retry is durable with stable payload/idempotency and stops before the provider window expires', { skip: !process.env.TEST_DATABASE_URL }, async (t) => {
  const { pool } = await databaseFixture(t)
  await migrate(pool)
  const app = createApp({ store: postgresStore(pool), encryptionKey, lookupKey, allowedOrigins: [origin], queueWelcome: true })
  t.after(() => app.close())
  const signup = await app.inject({ method: 'POST', url: '/api/waitlist', headers, payload: body })
  assert.equal(signup.statusCode, 200)
  const calls: { payload: WelcomeEmail; key: string }[] = []
  const sender: MailSender = async (payload, key) => { calls.push({ payload, key }); return calls.length === 1 ? { ok: false, retryable: true } : { ok: true } }
  await createMailWorker({ pool, encryptionKey, lookupKey, config, sender }).runOnce()
  assert.equal((await pool.query('SELECT welcome_status FROM waitlist_entries')).rows[0].welcome_status, 'pending')
  await pool.query("UPDATE waitlist_entries SET welcome_next_attempt_at=now()-interval '1 second'")
  // A fresh worker instance demonstrates recovery after a process restart.
  await createMailWorker({ pool, encryptionKey, lookupKey, config, sender }).runOnce()
  assert.equal(calls.length, 2)
  assert.deepEqual(calls[0], calls[1])
  assert.equal((await pool.query('SELECT welcome_status,welcome_attempts FROM waitlist_entries')).rows[0].welcome_status, 'sent')
  await app.inject({ method: 'POST', url: '/api/waitlist', headers, payload: { ...body, email: 'expired@example.invalid' } })
  await pool.query("UPDATE waitlist_entries SET welcome_status='sending',welcome_lease_until=now()-interval '1 second',welcome_first_attempt_at=now()-interval '24 hours' WHERE welcome_status='pending'")
  await createMailWorker({ pool, encryptionKey, lookupKey, config, sender }).runOnce()
  assert.equal(calls.length, 2)
  assert.equal((await pool.query("SELECT count(*)::int AS count FROM waitlist_entries WHERE welcome_status='failed'")).rows[0].count, 1)
})

test('removal cancels pending mail and serializes with bounded in-flight send, preventing later retries', { skip: !process.env.TEST_DATABASE_URL }, async (t) => {
  const { pool } = await databaseFixture(t)
  await migrate(pool)
  const store = postgresStore(pool)
  const app = createApp({ store, encryptionKey, lookupKey, allowedOrigins: [origin], queueWelcome: true })
  t.after(() => app.close())
  await app.inject({ method: 'POST', url: '/api/waitlist', headers, payload: body })
  let release!: () => void
  let announce!: () => void
  const gate = new Promise<void>(resolve => { release = resolve })
  const started = new Promise<void>(resolve => { announce = resolve })
  let sends = 0
  const sender: MailSender = async () => { sends += 1; announce(); await gate; return { ok: false, retryable: true } }
  const worker = createMailWorker({ pool, encryptionKey, lookupKey, config, sender })
  const running = worker.runOnce()
  await started
  const id = (await pool.query('SELECT id FROM waitlist_entries')).rows[0].id
  let removalComplete = false
  const removing = store.removeById(id).then(() => { removalComplete = true })
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(removalComplete, false)
  release()
  await running
  await removing
  assert.equal((await pool.query('SELECT count(*)::int AS count FROM waitlist_entries')).rows[0].count, 0)
  await worker.runOnce()
  assert.equal(sends, 1)
  await app.inject({ method: 'POST', url: '/api/waitlist', headers, payload: { ...body, email: 'cancel-before-send@example.invalid' } })
  const pendingId = (await pool.query('SELECT id FROM waitlist_entries')).rows[0].id
  await store.removeById(pendingId)
  await worker.runOnce()
  assert.equal(sends, 1)
})
