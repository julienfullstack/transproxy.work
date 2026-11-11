import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { Pool } from 'pg'

export async function migrate(pool: Pool): Promise<void> {
  for (const filename of ['001_waitlist.sql', '002_waitlist_mail.sql']) {
    const sql = await readFile(fileURLToPath(new URL(`../sql/${filename}`, import.meta.url)), 'utf8')
    await pool.query(sql)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 })
  try {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required')
    await migrate(pool)
    process.stdout.write('Waiting-list schema is ready.\n')
  } catch {
    process.stderr.write('Waiting-list migration failed.\n')
    process.exitCode = 1
  } finally { await pool.end() }
}
