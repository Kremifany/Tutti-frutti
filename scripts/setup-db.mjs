import { randomUUID } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import pg from 'pg'
import { hashPassword } from 'better-auth/crypto'

const envFile = new URL('../.env.local', import.meta.url)
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) process.env[match[1].trim()] = match[2].trim()
  }
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })

async function waitForDatabase() {
  for (let attempt = 1; attempt <= 30; attempt++) {
    try {
      await pool.query('select 1')
      return
    } catch (error) {
      if (attempt === 30) throw error
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
}

await waitForDatabase()
await pool.query(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'))

const email = (process.env.OWNER_EMAIL || '').toLowerCase()
const password = process.env.OWNER_PASSWORD
if (!email || !password) throw new Error('OWNER_EMAIL and OWNER_PASSWORD are required')

const existing = await pool.query('select id from "user" where lower(email) = $1', [email])
if (existing.rowCount === 0) {
  const id = randomUUID()
  const now = new Date()
  const hash = await hashPassword(password)
  await pool.query(
    `insert into "user" (id, name, email, email_verified, role, created_at, updated_at)
     values ($1, $2, $3, true, 'owner', $4, $4)`,
    [id, 'Owner', email, now],
  )
  await pool.query(
    `insert into account (id, account_id, provider_id, user_id, password, created_at, updated_at)
     values ($1, $2, 'credential', $2, $3, $4, $4)`,
    [randomUUID(), id, hash, now],
  )
  console.log('Owner account created')
} else {
  await pool.query(`update "user" set role = 'owner' where lower(email) = $1`, [email])
  console.log('Owner account already exists')
}

const schedule = [
  ['live-letters', 1, 18, 0, 'Живые буквы'],
  ['grow', 3, 17, 45, 'Расти'],
  ['consonance', 5, 17, 0, 'Созвучие'],
  ['animal-kingdom', 6, 10, 0, 'Царство животных'],
  ['storytelling', 6, 10, 0, 'Интерактивный сторителлинг'],
]

function upcomingDates(weekday, hours, minutes, count = 8) {
  const dates = []
  let cursor = new Date(Date.now() - 1000)
  for (let index = 0; index < count; index++) {
    const date = new Date(cursor)
    date.setSeconds(0, 0)
    const delta = (weekday - date.getDay() + 7) % 7
    date.setDate(date.getDate() + delta)
    date.setHours(hours, minutes, 0, 0)
    if (date.getTime() <= cursor.getTime()) date.setDate(date.getDate() + 7)
    dates.push(date)
    cursor = date
  }
  return dates
}

await pool.query('update product set active = false where starts_at <= now()')
for (const [slug, weekday, hours, minutes, name] of schedule) {
  for (const date of upcomingDates(weekday, hours, minutes)) {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const id = `${slug}-${date.getFullYear()}-${month}-${day}`
    await pool.query(
      `insert into product (id, activity, name, starts_at, active)
       values ($1, $2, $3, $4, true)
       on conflict (id) do update set name = excluded.name, starts_at = excluded.starts_at, active = true`,
      [id, slug, name, date],
    )
  }
}
console.log('Class dates saved as products')

await pool.end()
