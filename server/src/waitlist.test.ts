import assert from 'node:assert/strict'
import { randomBytes, randomUUID } from 'node:crypto'
import { spawn } from 'node:child_process'
import { test } from 'node:test'
import { Pool } from 'pg'
import { CONSENT_VERSION, createApp, postgresStore, type EncryptedEntry, type WaitlistStore } from './app.js'
import { decryptEmail, emailDigest, encryptEmail, readKey } from './crypto.js'
import { ageFromDateOfBirth } from './age.js'
import { migrate } from './migrate.js'

const origin = 'https://transproxy.org'
const encryptionKey = randomBytes(32)
const lookupKey = randomBytes(32)
const body = { email: 'test@example.invalid', dateOfBirth: '1990-03-14', adult: true, consent: true, website: '' }
const headers = { origin, 'content-type': 'application/json' }

function memoryStore() {
  const entries = new Map<string, EncryptedEntry>()
  const store: WaitlistStore = {
    health: async () => {},
    insert: async (entry) => { if (!entries.has(entry.emailDigest)) entries.set(entry.emailDigest, entry) },
    removeById: async (id) => { for (const [digest, entry] of entries) if (entry.id === id) entries.delete(digest) },
  }
  return { store, entries }
}

function fixture(overrides: Partial<Parameters<typeof createApp>[0]> = {}) {
  const { store, entries } = memoryStore()
  const app = createApp({ store, encryptionKey, lookupKey, allowedOrigins: [origin], clock: () => Date.UTC(2026, 10, 10), ...overrides })
  return { app, entries }
}

test('encryption uses distinct random nonces, authenticates ID and rejects tampering', () => {
  const id = randomUUID()
  const first = encryptEmail(body.email, id, encryptionKey)
  const second = encryptEmail(body.email, id, encryptionKey)
  assert.notEqual(first, second)
  assert.ok(!first.includes(body.email))
  assert.equal(decryptEmail(first, id, encryptionKey), body.email)
  assert.throws(() => decryptEmail(first, randomUUID(), encryptionKey))
  assert.throws(() => decryptEmail(first, id, randomBytes(32)))
  const pieces = first.split('.')
  pieces[2] = Buffer.from('replaced').toString('base64url')
  assert.throws(() => decryptEmail(pieces.join('.'), id, encryptionKey))
  assert.throws(() => readKey('invalid', 'TEST_KEY'))
  assert.equal(readKey(encryptionKey.toString('hex'), 'TEST_KEY').length, 32)
  assert.notEqual(emailDigest(body.email, lookupKey), emailDigest(body.email, randomBytes(32)))
})

test('signup stores only encrypted normalized contact, keyed digest and consent version; duplicate response is identical', async (t) => {
  const { app, entries } = fixture()
  t.after(() => app.close())
  const first = await app.inject({ method: 'POST', url: '/api/waitlist', headers, payload: { ...body, email: ' Test@Example.Invalid ' } })
  const duplicate = await app.inject({ method: 'POST', url: '/api/waitlist', headers, payload: body })
  assert.equal(first.statusCode, 200)
  assert.equal(first.body, duplicate.body)
  assert.equal(entries.size, 1)
  const saved = [...entries.values()][0]!
  assert.deepEqual(Object.keys(saved).sort(), ['consentVersion', 'emailDigest', 'encryptedEmail', 'id'])
  assert.equal(saved.consentVersion, CONSENT_VERSION)
  assert.equal(decryptEmail(saved.encryptedEmail, saved.id, encryptionKey), body.email)
  assert.ok(!JSON.stringify(saved).includes(body.email))
  assert.equal(first.headers['cache-control'], 'no-store')
})

test('age and consent must be literal true and email must validate', async (t) => {
  const { app, entries } = fixture({ rateLimit: 30 })
  t.after(() => app.close())
  for (const payload of [
    { ...body, adult: false }, { ...body, consent: false },
    { ...body, adult: 'true' }, { ...body, consent: 1 },
    { email: body.email, adult: true }, { ...body, email: 'missing-at' },
    { ...body, email: 'a@b.invalid\nheader' }, { ...body, email: 'a'.repeat(255) },
    { ...body, medicalRecord: 'must not accept unrelated fields' },
  ]) {
    const result = await app.inject({ method: 'POST', url: '/api/waitlist', headers, payload })
    assert.equal(result.statusCode, 400)
  }
  assert.equal(entries.size, 0)
})

test('DOB checks real UTC birthdays and rejects incomplete, future and impossible dates without saving DOB', async (t) => {
  const { app, entries } = fixture({ rateLimit: 30 })
  t.after(() => app.close())
  const { dateOfBirth: _date, ...missing } = body
  for (const payload of [missing, ...['', '2008-11-11', '2027-01-01', '2008-02-30', '2007-02-29', '2000-13-01', '2000-00-10', '2000-01-00', '2000-1-01', '1905-11-09'].map(dateOfBirth => ({ ...body, dateOfBirth }))]) {
    const response = await app.inject({ method: 'POST', url: '/api/waitlist', headers, payload })
    assert.equal(response.statusCode, 400)
  }
  assert.equal(entries.size, 0)
  const exact = await app.inject({ method: 'POST', url: '/api/waitlist', headers, payload: { ...body, dateOfBirth: '2008-11-10' } })
  assert.equal(exact.statusCode, 200)
  assert.ok(!JSON.stringify([...entries.values()]).includes('2008-11-10'))
  assert.equal(ageFromDateOfBirth('2008-02-29', new Date('2026-02-28T23:59:59Z')), 17)
  assert.equal(ageFromDateOfBirth('2008-02-29', new Date('2026-03-01T00:00:00Z')), 18)
  assert.equal(ageFromDateOfBirth('2007-02-29', new Date('2026-03-01T00:00:00Z')), null)
})

test('CORS preflight allows only configured origins and JSON is mandatory', async (t) => {
  const { app, entries } = fixture()
  t.after(() => app.close())
  const preflight = await app.inject({ method: 'OPTIONS', url: '/api/waitlist', headers: { origin, 'access-control-request-method': 'POST' } })
  assert.equal(preflight.statusCode, 204)
  assert.equal(preflight.headers['access-control-allow-origin'], origin)
  for (const badOrigin of [undefined, 'https://malicious.invalid', 'https://transproxy.org.malicious.invalid']) {
    const result = await app.inject({ method: 'POST', url: '/api/waitlist', headers: { 'content-type': 'application/json', ...(badOrigin ? { origin: badOrigin } : {}) }, payload: body })
    assert.equal(result.statusCode, 403)
    assert.equal(result.headers['access-control-allow-origin'], undefined)
  }
  const nonJson = await app.inject({ method: 'POST', url: '/api/waitlist', headers: { origin, 'content-type': 'text/plain' }, payload: JSON.stringify(body) })
  assert.equal(nonJson.statusCode, 415)
  const oversize = await app.inject({ method: 'POST', url: '/api/waitlist', headers, payload: { ...body, email: 'a'.repeat(3000) } })
  assert.equal(oversize.statusCode, 413)
  assert.equal(entries.size, 0)
})

test('rate limiting has expiry and ignores untrusted forwarding headers', async (t) => {
  let time = Date.UTC(2026, 10, 10)
  const { app } = fixture({ rateLimit: 1, clock: () => time })
  t.after(() => app.close())
  const first = await app.inject({ method: 'POST', url: '/api/waitlist', headers, payload: body })
  assert.equal(first.statusCode, 200)
  const limited = await app.inject({ method: 'POST', url: '/api/waitlist', headers: { ...headers, 'x-forwarded-for': '203.0.113.10' }, payload: body })
  assert.equal(limited.statusCode, 429)
  assert.equal(limited.headers['retry-after'], '60')
  time += 60_001
  const next = await app.inject({ method: 'POST', url: '/api/waitlist', headers, payload: body })
  assert.equal(next.statusCode, 200)
})

test('two-hop trusted ingress separates real clients and ignores spoofed earlier addresses', async (t) => {
  const { app } = fixture({ rateLimit: 1, trustProxy: 2 })
  t.after(() => app.close())
  const signup = (forwarded: string) => app.inject({
    method: 'POST', url: '/api/waitlist', remoteAddress: '172.18.0.5',
    headers: { ...headers, 'x-forwarded-for': forwarded }, payload: body,
  })
  assert.equal((await signup('203.0.113.1, 172.18.0.4')).statusCode, 200)
  assert.equal((await signup('203.0.113.2, 172.18.0.4')).statusCode, 200)
  assert.equal((await signup('198.51.100.44, 203.0.113.1, 172.18.0.4')).statusCode, 429)
})

test('honeypot is accepted generically without saving; database failures reveal no details', async (t) => {
  const { app, entries } = fixture()
  t.after(() => app.close())
  const bot = await app.inject({ method: 'POST', url: '/api/waitlist', headers, payload: { ...body, website: 'bot.invalid' } })
  assert.equal(bot.statusCode, 200)
  assert.equal(entries.size, 0)
  const failing = createApp({
    store: { health: async () => { throw new Error('PRIVATE DATABASE DETAILS') }, insert: async () => { throw new Error(`PRIVATE ${body.email}`) }, removeById: async () => {} },
    encryptionKey, lookupKey, allowedOrigins: [origin],
  })
  t.after(() => failing.close())
  const health = await failing.inject({ url: '/api/health' })
  const signup = await failing.inject({ method: 'POST', url: '/api/waitlist', headers, payload: body })
  assert.equal(health.statusCode, 503)
  assert.equal(signup.statusCode, 503)
  assert.ok(!signup.body.includes('PRIVATE'))
  assert.ok(!signup.body.includes(body.email))
  assert.equal((await app.inject({ url: '/api/waitlist' })).statusCode, 404)
})

test('Postgres migration, concurrent deduplication and encrypted persistence', { skip: !process.env.TEST_DATABASE_URL }, async (t) => {
  const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL, max: 4 })
  const schema = `waitlist_test_${randomBytes(8).toString('hex')}`
  await pool.query(`CREATE SCHEMA ${schema}`)
  const scoped = new Pool({ connectionString: process.env.TEST_DATABASE_URL, max: 4, options: `-c search_path=${schema}` })
  t.after(async () => { await scoped.end(); await pool.query(`DROP SCHEMA ${schema} CASCADE`); await pool.end() })
  await migrate(scoped)
  await migrate(scoped)
  const app = createApp({ store: postgresStore(scoped), encryptionKey, lookupKey, allowedOrigins: [origin], rateLimit: 30 })
  t.after(() => app.close())
  const results = await Promise.all(Array.from({ length: 10 }, () => app.inject({ method: 'POST', url: '/api/waitlist', headers, payload: body })))
  assert.ok(results.every((result) => result.statusCode === 200 && result.body === results[0]!.body))
  const stored = await scoped.query('SELECT * FROM waitlist_entries')
  assert.equal(stored.rowCount, 1)
  const row = stored.rows[0]
  assert.equal(decryptEmail(row.encrypted_email, row.id, encryptionKey), body.email)
  assert.ok(!JSON.stringify(row).includes(body.email))
  assert.equal(row.consent_version, CONSENT_VERSION)
  assert.equal((await app.inject({ url: '/api/health' })).statusCode, 200)
  const otherEmail = 'other@example.invalid'
  const second = await app.inject({ method: 'POST', url: '/api/waitlist', headers, payload: { ...body, email: otherEmail } })
  assert.equal(second.statusCode, 200)
  const removal = await new Promise<{ code: number | null; output: string }>((resolve, reject) => {
    const child = spawn(process.execPath, [new URL('../dist/remove.js', import.meta.url).pathname], {
      env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL, WAITLIST_LOOKUP_KEY: lookupKey.toString('hex'), PGOPTIONS: `-c search_path=${schema}` },
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    let output = ''
    child.stdout.on('data', (chunk) => { output += chunk.toString() })
    child.stderr.on('data', (chunk) => { output += chunk.toString() })
    child.on('error', reject)
    child.on('close', (code) => resolve({ code, output }))
    child.stdin.end(body.email)
  })
  assert.equal(removal.code, 0)
  assert.ok(!removal.output.includes(body.email))
  const remaining = await scoped.query('SELECT * FROM waitlist_entries')
  assert.equal(remaining.rowCount, 1)
  assert.equal(decryptEmail(remaining.rows[0].encrypted_email, remaining.rows[0].id, encryptionKey), otherEmail)
})
