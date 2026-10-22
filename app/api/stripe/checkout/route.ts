import { and, eq, inArray } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { namesAlreadyRegistered } from '@/lib/child-names'
import { isClassSlug } from '@/lib/classes'
import { db } from '@/lib/db'
import { child } from '@/lib/schema'
import { getSession } from '@/lib/session'
import { pricingTableOffers, stripeClient } from '@/lib/stripe'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => null) as { activity?: string; priceId?: string; childIds?: string[] } | null
  const activity = body?.activity && isClassSlug(body.activity) ? body.activity : null
  const priceId = body?.priceId || ''
  const childIds = (body?.childIds || []).filter((id) => /^[0-9a-f-]{36}$/i.test(id))
  if (!activity || !/^price_[A-Za-z0-9]+$/.test(priceId) || !childIds.length) return NextResponse.json({ error: 'missing' }, { status: 400 })

  const rows = await db.select({ id: child.id, name: child.name }).from(child).where(and(eq(child.userId, session.user.id), inArray(child.id, childIds), eq(child.paid, false)))
  if (rows.length !== childIds.length) return NextResponse.json({ error: 'missing' }, { status: 400 })
  const paid = await db.select({ name: child.name }).from(child).where(and(eq(child.userId, session.user.id), eq(child.activity, activity), eq(child.paid, true)))
  const registered = namesAlreadyRegistered(rows.map((row) => row.name), paid.map((row) => row.name))
  if (registered.length) return NextResponse.json({ error: 'registered', names: registered }, { status: 409 })
  const offers = await pricingTableOffers(activity)
  if (!offers.some((offer) => offer.priceId === priceId)) return NextResponse.json({ error: 'missing' }, { status: 400 })

  const stripe = stripeClient()
  if (!stripe) return NextResponse.json({ error: 'missing' }, { status: 400 })
  const stripePrice = await stripe.prices.retrieve(priceId)
  const reference = `${session.user.id}|${activity}|${childIds.join(',')}`
  if (reference.length > 200) return NextResponse.json({ error: 'missing' }, { status: 400 })
  const origin = new URL(request.url).origin
  const checkout = await stripe.checkout.sessions.create({
    mode: stripePrice.type === 'recurring' ? 'subscription' : 'payment',
    customer_email: session.user.email,
    client_reference_id: reference,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/account`,
    cancel_url: `${origin}/activities/${activity}`,
  })
  if (!checkout.url) return NextResponse.json({ error: 'missing' }, { status: 500 })
  return NextResponse.json({ url: checkout.url })
}
