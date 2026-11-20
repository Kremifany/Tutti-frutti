import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { isClassSlug } from '@/lib/classes'
import { db } from '@/lib/db'
import { storyEvent } from '@/lib/schema'
import { isPricingTableId, offersFromPricingTable, pricingTableOffers } from '@/lib/stripe'

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const activity = params.get('activity') || ''
  const storyId = params.get('story') || ''
  if (!isClassSlug(activity)) return NextResponse.json([])

  if (activity === 'storytelling') {
    if (!/^[0-9a-f-]{36}$/i.test(storyId)) return NextResponse.json([])
    const [row] = await db.select({
      pricingTableId: storyEvent.stripePricingTableId,
      active: storyEvent.active,
    }).from(storyEvent).where(eq(storyEvent.id, storyId)).limit(1)
    if (!row?.active || !isPricingTableId(row.pricingTableId)) return NextResponse.json([])
    return NextResponse.json(await offersFromPricingTable(row.pricingTableId, activity))
  }

  return NextResponse.json(await pricingTableOffers(activity))
}
