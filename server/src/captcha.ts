import { randomBytes } from 'node:crypto'
import { create, randomInt } from 'altcha-lib/frameworks/fastify'
import { deriveKey } from 'altcha-lib/algorithms/pbkdf2'
export function createCaptcha() {
  const used = new Map<string, number>()
  const claim = (key: string) => {
    const now = Date.now()
    for (const [id, expires] of used) if (expires <= now) used.delete(id)
    if (used.has(key) || used.size >= 20000) return false
    used.set(key, now + 660000)
    return true
  }
  return create({
    hmacSignatureSecret: randomBytes(32).toString('hex'),
    hmacKeySignatureSecret: randomBytes(32).toString('hex'),
    deriveKey,
    createChallengeParameters: () => ({ algorithm: 'PBKDF2/SHA-256', cost: 1000, counter: randomInt(250, 750), expiresAt: new Date(Date.now() + 600000) }),
    store: { get: key => used.get(key), set: key => claim(key), setIfAbsent: key => claim(key) },
  })
}
