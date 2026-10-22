import { NextResponse } from 'next/server'
import { isClassSlug } from '@/lib/classes'
import { pricingTableOffers } from '@/lib/stripe'

export async function GET(request: Request) {
  const activity = new URL(request.url).searchParams.get('activity') || ''
  if (!isClassSlug(activity)) return NextResponse.json([])
  return NextResponse.json(await pricingTableOffers(activity))
}
