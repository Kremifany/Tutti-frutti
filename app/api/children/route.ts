import { randomUUID } from 'node:crypto'
import { and, eq, isNull } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { childNames } from '@/lib/child-names'
import { CLASS_PRICE, classDateFromChoice, isClassSlug } from '@/lib/classes'
import { db } from '@/lib/db'
import { child, product } from '@/lib/schema'
import { importPaidCheckouts } from '@/lib/purchases'
import { getSession } from '@/lib/session'

export async function GET(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  if (new URL(request.url).searchParams.get('list') === 'names') {
    const rows = await db.select({ name: child.name }).from(child).where(eq(child.userId, session.user.id))
    return NextResponse.json(childNames(rows.map((row) => row.name)))
  }
  await importPaidCheckouts(session.user.id).catch(() => {})
  const rows = await db.select().from(child).where(and(eq(child.userId, session.user.id), eq(child.paid, true)))
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => null) as { name?: string; names?: string[]; age?: string; notes?: string; activity?: string; startsAt?: string; paid?: boolean; productId?: string } | null
  if (Array.isArray(body?.names) && !body.startsAt && !body.productId) {
    const activity = body.activity && isClassSlug(body.activity) ? body.activity : null
    const names = childNames(body.names)
    if (!activity || !names.length) return NextResponse.json({ error: 'missing' }, { status: 400 })
    await db.delete(child).where(and(eq(child.userId, session.user.id), eq(child.activity, activity), eq(child.paid, false), isNull(child.stripeSessionId)))
    const rows = []
    for (const name of names) {
      const [row] = await db.insert(child).values({
        id: randomUUID(),
        userId: session.user.id,
        name,
        age: '—',
        activity,
        paid: false,
      }).returning()
      rows.push(row)
    }
    return NextResponse.json(rows)
  }
  if (body?.productId) {
    const name = childNames(body.name)[0]
    if (!name) return NextResponse.json({ error: 'missing' }, { status: 400 })
    const [item] = await db.select().from(product).where(and(eq(product.id, body.productId), eq(product.active, true)))
    if (!item || !isClassSlug(item.activity) || item.startsAt.getTime() <= Date.now()) return NextResponse.json({ error: 'missing' }, { status: 400 })
    const [existing] = await db.select().from(child).where(and(eq(child.userId, session.user.id), eq(child.productId, item.id), eq(child.name, name)))
    if (existing) return NextResponse.json(existing)
    const [row] = await db.insert(child).values({
      id: randomUUID(),
      userId: session.user.id,
      name,
      age: '—',
      activity: item.activity,
      productId: item.id,
      startsAt: item.startsAt,
      amount: item.amount,
      paid: false,
    }).returning()
    return NextResponse.json(row)
  }
  const name = body?.name?.trim()
  const age = body?.age?.trim()
  const activity = body?.activity && isClassSlug(body.activity) ? body.activity : null
  const startsAt = activity && body?.startsAt ? classDateFromChoice(activity, body.startsAt) : null
  if (!name || !age || !activity || !startsAt) return NextResponse.json({ error: 'missing' }, { status: 400 })
  const [row] = await db.insert(child).values({
    id: randomUUID(),
    userId: session.user.id,
    name,
    age,
    notes: body?.notes?.trim() || null,
    activity,
    startsAt,
    amount: CLASS_PRICE,
    paid: body?.paid === true,
  }).returning()
  return NextResponse.json(row)
}
