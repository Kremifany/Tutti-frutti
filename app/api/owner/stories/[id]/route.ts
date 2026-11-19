import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { storyEvent } from '@/lib/schema'
import { getSession } from '@/lib/session'
import { saveStoryPoster } from '@/lib/story-upload'

async function requireOwner() {
  const session = await getSession()
  if (!session || session.user.role !== 'owner') return null
  return session
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireOwner())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: 'missing' }, { status: 400 })

  const [existing] = await db.select().from(storyEvent).where(eq(storyEvent.id, id)).limit(1)
  if (!existing) return NextResponse.json({ error: 'missing' }, { status: 404 })

  const contentType = request.headers.get('content-type') || ''
  const patch: { titleRu?: string; titleEn?: string; endsAt?: Date; active?: boolean; imageUrl?: string; updatedAt: Date } = {
    updatedAt: new Date(),
  }

  if (contentType.includes('multipart/form-data')) {
    const form = await request.formData().catch(() => null)
    if (!form) return NextResponse.json({ error: 'missing' }, { status: 400 })
    const titleRu = String(form.get('titleRu') || '').trim()
    const titleEn = String(form.get('titleEn') || '').trim()
    const endsAtRaw = String(form.get('endsAt') || '').trim()
    const activeRaw = form.get('active')
    if (titleRu) patch.titleRu = titleRu
    if (titleEn) patch.titleEn = titleEn
    if (/^\d{4}-\d{2}-\d{2}$/.test(endsAtRaw)) {
      const endsAt = new Date(`${endsAtRaw}T23:59:59`)
      if (!Number.isNaN(endsAt.getTime())) patch.endsAt = endsAt
    }
    if (activeRaw !== null) patch.active = String(activeRaw) === 'true'
    const file = form.get('image')
    if (file instanceof File && file.size > 0) {
      try {
        patch.imageUrl = await saveStoryPoster(file)
      } catch {
        return NextResponse.json({ error: 'upload' }, { status: 400 })
      }
    }
  } else {
    const body = await request.json().catch(() => null) as { titleRu?: string; titleEn?: string; endsAt?: string; active?: boolean } | null
    if (!body) return NextResponse.json({ error: 'missing' }, { status: 400 })
    if (typeof body.titleRu === 'string' && body.titleRu.trim()) patch.titleRu = body.titleRu.trim()
    if (typeof body.titleEn === 'string' && body.titleEn.trim()) patch.titleEn = body.titleEn.trim()
    if (typeof body.endsAt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.endsAt)) {
      const endsAt = new Date(`${body.endsAt}T23:59:59`)
      if (!Number.isNaN(endsAt.getTime())) patch.endsAt = endsAt
    }
    if (typeof body.active === 'boolean') patch.active = body.active
  }

  const [row] = await db.update(storyEvent).set(patch).where(eq(storyEvent.id, id)).returning()
  return NextResponse.json(row)
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireOwner())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: 'missing' }, { status: 400 })
  await db.delete(storyEvent).where(eq(storyEvent.id, id))
  return NextResponse.json({ ok: true })
}
