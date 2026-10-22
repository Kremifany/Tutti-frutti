import { randomUUID } from 'node:crypto'
import { and, eq, inArray, isNull } from 'drizzle-orm'
import type Stripe from 'stripe'
import { isClassSlug } from '@/lib/classes'
import { db } from '@/lib/db'
import { child, user } from '@/lib/schema'
import { purchaseFromProduct, stripeClient } from '@/lib/stripe'

export async function saveCheckoutSession(checkout: Stripe.Checkout.Session) {
  const stripe = stripeClient()
  const parts = (checkout.client_reference_id || '').split('|')
  const userId = parts[0]
  const activityHint = parts[1]
  const hasChildList = parts.length >= 3
  const childIds = (parts[2] || '').split(',').map((id) => id.trim()).filter((id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))
  if (!stripe || !userId || checkout.payment_status !== 'paid') return
  const [parent] = await db.select().from(user).where(eq(user.id, userId))
  if (!parent) return

  let named: { name: string }[] = []
  if (hasChildList) {
    if (!childIds.length) return
    named = await db.select({ name: child.name }).from(child).where(and(eq(child.userId, userId), inArray(child.id, childIds)))
    if (!named.length) return
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(checkout.id, { expand: ['data.price.product'], limit: 20 })
  for (const item of lineItems.data) {
    const price = item.price
    const product = price?.product && typeof price.product !== 'string' ? price.product : null
    if (!product || product.deleted) continue
    const purchase = purchaseFromProduct(product, activityHint)
    const activity = purchase.activity || (activityHint && isClassSlug(activityHint) ? activityHint : null)
    if (!hasChildList) {
      const [existing] = await db.select({ id: child.id }).from(child).where(and(eq(child.stripeSessionId, checkout.id), eq(child.stripeProductId, product.id)))
      if (existing) continue
      await db.insert(child).values({
        id: randomUUID(),
        userId: parent.id,
        name: parent.name,
        age: '—',
        activity,
        startsAt: purchase.startsAt,
        paid: true,
        stripeSessionId: checkout.id,
        stripeProductId: product.id,
      })
      continue
    }
    for (const kid of named) {
      const [existing] = await db.select({ id: child.id }).from(child).where(and(eq(child.stripeSessionId, checkout.id), eq(child.stripeProductId, product.id), eq(child.name, kid.name)))
      if (existing) continue
      await db.insert(child).values({
        id: randomUUID(),
        userId: parent.id,
        name: kid.name,
        age: '—',
        activity,
        startsAt: purchase.startsAt,
        paid: true,
        stripeSessionId: checkout.id,
        stripeProductId: product.id,
      })
    }
  }

  if (hasChildList && childIds.length) {
    await db.delete(child).where(and(eq(child.userId, userId), inArray(child.id, childIds), eq(child.paid, false), isNull(child.stripeSessionId)))
  }
}

export async function importPaidCheckouts(userId: string) {
  const stripe = stripeClient()
  if (!stripe) return
  const sessions = await stripe.checkout.sessions.list({ limit: 100 })
  for (const session of sessions.data) {
    const [refUser] = (session.client_reference_id || '').split('|')
    if (refUser !== userId) continue
    await saveCheckoutSession(session)
  }
}
