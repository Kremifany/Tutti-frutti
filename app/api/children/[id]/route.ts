import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { child } from '@/lib/schema'
import { getSession } from '@/lib/session'

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  const [row] = await db.update(child).set({ paid: true }).where(and(eq(child.id, id), eq(child.userId, session.user.id))).returning()
  if (!row) return NextResponse.json({ error: 'missing' }, { status: 404 })
  return NextResponse.json(row)
}
