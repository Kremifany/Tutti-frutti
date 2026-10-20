import { desc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { child, user } from '@/lib/schema'
import { getSession } from '@/lib/session'

export async function GET() {
  const session = await getSession()
  if (!session || session.user.role !== 'owner') return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const rows = await db.select({
    id: child.id,
    parent: user.name,
    child: child.name,
    email: user.email,
    activity: child.activity,
    startsAt: child.startsAt,
    amount: child.amount,
    paid: child.paid,
  }).from(child).innerJoin(user, eq(child.userId, user.id)).where(eq(child.paid, true)).orderBy(desc(child.createdAt))
  return NextResponse.json(rows)
}
