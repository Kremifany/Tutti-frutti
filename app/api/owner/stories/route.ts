import { randomUUID } from 'node:crypto'
import { asc } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { storyEvent } from '@/lib/schema'
import { getSession } from '@/lib/session'
import { isPricingTableId } from '@/lib/stripe'
import { saveStoryPoster } from '@/lib/story-upload'

async function requireOwner() {
  const session = await getSession()
  if (!session || session.user.role !== 'owner') return null
  return session
}

export async function GET() {
  if (!(await requireOwner())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const rows = await db.select().from(storyEvent).orderBy(asc(storyEvent.endsAt))
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  if (!(await requireOwner())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const form = await request.formData().catch(() => null)
  if (!form) return NextResponse.json({ error: 'missing' }, { status: 400 })

  const titleRu = String(form.get('titleRu') || '').trim()
  const titleEn = String(form.get('titleEn') || '').trim()
  const stripePricingTableId = String(form.get('stripePricingTableId') || '').trim()
  const endsAtRaw = String(form.get('endsAt') || '').trim()
  const file = form.get('image')
  if (!titleRu || !titleEn || !/^\d{4}-\d{2}-\d{2}$/.test(endsAtRaw) || !(file instanceof File)) {
    return NextResponse.json({ error: 'missing' }, { status: 400 })
  }
  if (stripePricingTableId && !isPricingTableId(stripePricingTableId)) {
    return NextResponse.json({ error: 'missing' }, { status: 400 })
  }
  const endsAt = new Date(`${endsAtRaw}T23:59:59`)
  if (Number.isNaN(endsAt.getTime())) return NextResponse.json({ error: 'missing' }, { status: 400 })

  let imageUrl = ''
  try {
    imageUrl = await saveStoryPoster(file)
  } catch {
    return NextResponse.json({ error: 'upload' }, { status: 400 })
  }

  const now = new Date()
  const [row] = await db.insert(storyEvent).values({
    id: randomUUID(),
    titleRu,
    titleEn,
    datesRu: '',
    datesEn: '',
    stripePricingTableId,
    imageUrl,
    endsAt,
    active: true,
    createdAt: now,
    updatedAt: now,
  }).returning()
  return NextResponse.json(row)
}
