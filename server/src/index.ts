import { Pool } from 'pg'
import { createApp, postgresStore } from './app.js'
import { readKey } from './crypto.js'
import { migrate } from './migrate.js'
import { createMailWorker, readMailConfig } from './mail.js'

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required')
  const origins = (process.env.CORS_ORIGINS ?? '').split(',').map((value) => value.trim()).filter(Boolean)
  for (const origin of origins) {
    const parsed = new URL(origin)
    if (parsed.origin !== origin || !['https:', 'http:'].includes(parsed.protocol)) throw new Error('CORS_ORIGINS must contain exact HTTP origins')
  }
  const encryptionKey = readKey(process.env.WAITLIST_ENCRYPTION_KEY, 'WAITLIST_ENCRYPTION_KEY')
  const lookupKey = readKey(process.env.WAITLIST_LOOKUP_KEY, 'WAITLIST_LOOKUP_KEY')
  if (origins.length === 0 || encryptionKey.equals(lookupKey)) throw new Error('Private runtime configuration is incomplete')
  const trustedHops = process.env.TRUST_PROXY_HOPS === undefined ? 0 : Number(process.env.TRUST_PROXY_HOPS)
  if (!Number.isInteger(trustedHops) || trustedHops < 0 || trustedHops > 2) throw new Error('TRUST_PROXY_HOPS must be 0, 1 or 2')
  const mailConfig = readMailConfig(process.env)
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5, connectionTimeoutMillis: 5000, idleTimeoutMillis: 30_000 })
  pool.on('error', () => process.stderr.write('Waiting-list database connection unavailable.\n'))
  await migrate(pool)
  const app = createApp({
    store: postgresStore(pool),
    encryptionKey,
    lookupKey,
    allowedOrigins: origins,
    // Set the exact ingress chain length only when API ports are not public.
    trustProxy: trustedHops || false,
    queueWelcome: !!mailConfig,
  })
  const worker = mailConfig ? createMailWorker({ pool, encryptionKey, lookupKey, config: mailConfig }) : undefined
  let stopping = false
  const stop = async () => {
    if (stopping) return
    stopping = true
    await app.close()
    await worker?.stop()
    await pool.end()
  }
  process.on('SIGTERM', () => { void stop().catch(() => { process.exitCode = 1 }) })
  process.on('SIGINT', () => { void stop().catch(() => { process.exitCode = 1 }) })
  const port = Number(process.env.PORT ?? 3001)
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT is invalid')
  await app.listen({ port, host: '0.0.0.0' })
  worker?.start()
  process.stdout.write('TransProxy waiting-list API is listening.\n')
}

main().catch(() => {
  process.stderr.write('TransProxy waiting-list API could not start. Check its private runtime configuration.\n')
  process.exit(1)
})
