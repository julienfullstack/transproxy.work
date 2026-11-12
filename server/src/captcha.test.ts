import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { test } from 'node:test'
import { createApp } from './app.js'
import { proof } from './captcha-fixture.test.js'

test('CAPTCHA rejects missing, malformed and replayed proof before storing signup', async t => {
  let inserts = 0
  const app = createApp({ store: {health: async () => {}, insert: async () => { inserts++ }, removeById: async () => {}}, encryptionKey: randomBytes(32), lookupKey: randomBytes(32), allowedOrigins: ['https://transproxy.org'], rateLimit: 30 })
  t.after(() => app.close())
  const headers = { origin: 'https://transproxy.org' }
  const body = { email: 'test@example.invalid', dateOfBirth: '1990-01-01', adult: true, consent: true, termsAccepted: true }
  for (const altcha of [undefined, 'invalid']) {
    assert.equal((await app.inject({method: 'POST', url: '/api/waitlist', headers, payload: {...body, ...(altcha ? {altcha} : {})}})).statusCode, 403)
  }
  const altcha = await proof(app)
  const results = await Promise.all([1,2].map(() => app.inject({method: 'POST', url: '/api/waitlist', headers, payload: {...body, altcha}})))
  assert.deepEqual(results.map(r => r.statusCode).sort(), [200,403])
  assert.equal(inserts, 1)
})
