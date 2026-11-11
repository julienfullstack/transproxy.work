import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'
import { Pool } from 'pg'
import { readKey } from './crypto.js'
import { legalEmailLookup, listLegalRequests, operateLegalRequest, purgeExpiredLegalRequests, readLegalRequest, type LegalOperatorAction } from './legalRequests.js'

export function requirePrivateTerminal(inputIsTTY: boolean | undefined, outputIsTTY: boolean | undefined): void {
  if (!inputIsTTY || !outputIsTTY) throw new Error('A private interactive terminal is required')
}

async function main() {
  const [command = 'list', id, value] = process.argv.slice(2)
  if (!['list', 'find', 'show', 'status', 'close', 'hold', 'release-hold', 'purge', 'sweep'].includes(command)) throw new Error('Invalid operation')
  // Listing/sweeping prints only operational metadata/counts. Every operation
  // that reveals a payload or accepts private notes requires a private TTY.
  if (!['list', 'sweep'].includes(command)) requirePrivateTerminal(process.stdin.isTTY, process.stdout.isTTY)
  if (!process.env.DATABASE_URL) throw new Error('Private database configuration is required')
  const key = readKey(process.env.WAITLIST_ENCRYPTION_KEY, 'WAITLIST_ENCRYPTION_KEY')
  const lookupKey = readKey(process.env.WAITLIST_LOOKUP_KEY, 'WAITLIST_LOOKUP_KEY')
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1, connectionTimeoutMillis: 5000 })
  let terminal: ReturnType<typeof createInterface> | undefined
  const question = async (prompt: string) => {
    terminal ??= createInterface({ input: process.stdin, output: process.stdout })
    return terminal.question(prompt)
  }
  try {
    if (command === 'list') {
      process.stdout.write(`${JSON.stringify(await listLegalRequests(pool), null, 2)}\n`)
      return
    }
    if (command === 'sweep') {
      process.stdout.write(`Expired private requests removed: ${await purgeExpiredLegalRequests(pool)}\n`)
      return
    }
    if (command === 'find') {
      const email = (await question('Reply email (private terminal only): ')).trim().toLowerCase()
      if (email.length > 254 || !/^[^\s@\x00-\x1f\x7f]+@[^\s@\x00-\x1f\x7f]+\.[^\s@\x00-\x1f\x7f]+$/.test(email)) throw new Error('Invalid input')
      process.stdout.write(`${JSON.stringify(await listLegalRequests(pool, legalEmailLookup(email, lookupKey)), null, 2)}\n`)
      return
    }
    if (!id) throw new Error('A reference is required')
    if (command === 'show') {
      const entry = await readLegalRequest(pool, id, key)
      // JSON escaping prevents submitted text from controlling the terminal.
      process.stdout.write(entry ? `${JSON.stringify(entry, null, 2)}\n` : 'Request not found.\n')
      return
    }
    let action: LegalOperatorAction
    if (command === 'status') {
      if (value !== 'reviewing' && value !== 'awaiting_verification') throw new Error('Invalid status')
      action = { type: 'status', status: value, note: (await question('Optional private note: ')).trim() || undefined }
    } else if (command === 'close') {
      action = { type: 'close', note: (await question('Optional private resolution note: ')).trim() || undefined }
    } else if (command === 'hold') {
      if (!value) throw new Error('An expiry is required')
      action = { type: 'hold', until: new Date(value), reason: await question('Necessary legal-hold reason (10–1000 characters): ') }
    } else if (command === 'release-hold') {
      action = { type: 'release-hold', reason: await question('Reason for releasing the hold (10–1000 characters): ') }
    } else {
      const confirmation = await question(`This deletes only this request record. Type PURGE ${id} to confirm: `)
      if (confirmation !== `PURGE ${id}`) throw new Error('Confirmation did not match')
      action = { type: 'purge' }
    }
    const completed = await operateLegalRequest(pool, id, action, key)
    process.stdout.write(completed ? 'Private request operation completed.\n' : 'Request not found.\n')
  } finally {
    terminal?.close()
    await pool.end()
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(() => {
    // Never print thrown database/provider errors or private input.
    process.stderr.write('Private request operation failed. Check the command, private terminal and runtime configuration.\n')
    process.exitCode = 1
  })
}
