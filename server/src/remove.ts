import { Pool } from 'pg'
import { emailDigest, readKey } from './crypto.js'

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required')
  const key = readKey(process.env.WAITLIST_LOOKUP_KEY, 'WAITLIST_LOOKUP_KEY')
  // Read the contact through stdin, never a command argument or environment
  // variable. Operators should disable terminal echo before entering it.
  let input = ''
  for await (const chunk of process.stdin) {
    input += chunk.toString()
    if (Buffer.byteLength(input) > 1024) throw new Error('Invalid input')
  }
  const email = input.trim().toLowerCase()
  if (email.length > 254 || !/^[^\s@\x00-\x1f\x7f]+@[^\s@\x00-\x1f\x7f]+\.[^\s@\x00-\x1f\x7f]+$/.test(email)) throw new Error('Invalid input')
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1, connectionTimeoutMillis: 5000 })
  try {
    await pool.query('DELETE FROM waitlist_entries WHERE email_digest = $1', [emailDigest(email, key)])
    process.stdout.write('Waiting-list removal completed.\n')
  } finally { await pool.end() }
}

main().catch(() => {
  process.stderr.write('Waiting-list removal failed. Check the input and private runtime configuration.\n')
  process.exitCode = 1
})
