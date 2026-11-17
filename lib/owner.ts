import { randomUUID } from 'node:crypto'
import { hashPassword } from 'better-auth/crypto'
import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { account, user } from '@/lib/schema'

export function ownerEmail() {
  const raw = process.env.OWNER_EMAIL?.trim() ?? ''
  return raw.replace(/^['"]|['"]$/g, '').trim().toLowerCase()
}

export function isOwnerEmail(email?: string | null) {
  const owner = ownerEmail()
  return Boolean(owner && email && email.trim().toLowerCase() === owner)
}

export function ownerPassword() {
  const raw = process.env.OWNER_PASSWORD?.trim() ?? ''
  return raw.replace(/^['"]|['"]$/g, '').trim()
}

export async function promoteOwner(userId: string) {
  await db.update(user).set({ role: 'owner', updatedAt: new Date() }).where(eq(user.id, userId))
}

export async function ensureOwnerLogin() {
  const email = ownerEmail()
  const password = ownerPassword()
  if (!email || password.length < 8) return
  const hash = await hashPassword(password)
  const now = new Date()
  const rows = await db.select({ id: user.id }).from(user).where(sql`lower(${user.email}) = ${email}`).limit(1)
  let id = rows[0]?.id
  if (!id) {
    id = randomUUID()
    await db.insert(user).values({ id, name: 'Owner', email, emailVerified: true, role: 'owner', createdAt: now, updatedAt: now })
  } else {
    await promoteOwner(id)
  }
  const credentials = await db.select({ id: account.id }).from(account).where(and(eq(account.userId, id), eq(account.providerId, 'credential'))).limit(1)
  if (!credentials[0]) {
    await db.insert(account).values({
      id: randomUUID(),
      accountId: id,
      providerId: 'credential',
      userId: id,
      password: hash,
      createdAt: now,
      updatedAt: now,
    })
    return
  }
  await db.update(account).set({ accountId: id, password: hash, updatedAt: now }).where(eq(account.id, credentials[0].id))
}
