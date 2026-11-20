import { asc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { storyEvent } from '@/lib/schema'

export async function GET() {
  const rows = await db.select({
    id: storyEvent.id,
    titleRu: storyEvent.titleRu,
    titleEn: storyEvent.titleEn,
    stripePricingTableId: storyEvent.stripePricingTableId,
    imageUrl: storyEvent.imageUrl,
    endsAt: storyEvent.endsAt,
  }).from(storyEvent).where(eq(storyEvent.active, true)).orderBy(asc(storyEvent.endsAt))
  return NextResponse.json(rows)
}
