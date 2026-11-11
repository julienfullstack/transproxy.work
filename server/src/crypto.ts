import { createCipheriv, createDecipheriv, createHmac, randomBytes } from 'node:crypto'

const aad = (id: string) => Buffer.from(`transproxy:waitlist:v1:${id}`, 'utf8')

export function readKey(value: string | undefined, name: string): Buffer {
  if (!value || !/^[a-fA-F0-9]{64}$/.test(value)) {
    throw new Error(`${name} must contain 32 random bytes encoded as 64 hexadecimal characters`)
  }
  return Buffer.from(value, 'hex')
}

/** A versioned authenticated envelope. The plaintext and key never enter Postgres. */
export function encryptEmail(email: string, id: string, key: Buffer): string {
  const nonce = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, nonce)
  cipher.setAAD(aad(id))
  const ciphertext = Buffer.concat([cipher.update(email, 'utf8'), cipher.final()])
  return ['v1', nonce.toString('base64url'), ciphertext.toString('base64url'), cipher.getAuthTag().toString('base64url')].join('.')
}

/** Operator-only utility; no HTTP route exposes decryption. */
export function decryptEmail(envelope: string, id: string, key: Buffer): string {
  const [version, nonce, ciphertext, tag, extra] = envelope.split('.')
  if (version !== 'v1' || !nonce || !ciphertext || !tag || extra !== undefined) {
    throw new Error('Invalid encrypted email envelope')
  }
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(nonce, 'base64url'))
  decipher.setAAD(aad(id))
  decipher.setAuthTag(Buffer.from(tag, 'base64url'))
  return Buffer.concat([decipher.update(Buffer.from(ciphertext, 'base64url')), decipher.final()]).toString('utf8')
}

export function emailDigest(email: string, key: Buffer): string {
  return createHmac('sha256', key).update(`transproxy:waitlist:v1:${email}`, 'utf8').digest('hex')
}
