import { asc, eq, ne } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { child, user } from '@/lib/schema'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()
  if (!session || session.user.role !== 'owner') return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const parents = await db.select({
    id: user.id,
    name: user.name,
    email: user.email,
  }).from(user).where(ne(user.role, 'owner')).orderBy(asc(user.name))

  const kids = await db.select({
    userId: child.userId,
    name: child.name,
  }).from(child).innerJoin(user, eq(child.userId, user.id)).where(ne(user.role, 'owner')).orderBy(asc(child.name))

  const byParent = new Map<string, string[]>()
  for (const kid of kids) {
    const list = byParent.get(kid.userId) || []
    if (!list.some((name) => name.toLowerCase() === kid.name.trim().toLowerCase())) list.push(kid.name.trim())
    byParent.set(kid.userId, list)
  }

  return NextResponse.json(parents.map((parent) => ({
    id: parent.id,
    name: parent.name,
    email: parent.email,
    children: byParent.get(parent.id) || [],
  })))
}
