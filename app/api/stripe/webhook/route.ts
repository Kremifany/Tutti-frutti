import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { saveCheckoutSession } from '@/lib/purchases'
import { stripeClient } from '@/lib/stripe'

export async function POST(request: Request) {
  const stripe = stripeClient()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = request.headers.get('stripe-signature')
  if (!stripe || !secret || !signature) return NextResponse.json({ error: 'missing' }, { status: 400 })

  const payload = await request.text()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret)
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }
  if (event.type !== 'checkout.session.completed') return NextResponse.json({ received: true })

  await saveCheckoutSession(event.data.object)
  return NextResponse.json({ received: true })
}
