import { NextResponse } from 'next/server'
import { isClassSlug } from '@/lib/classes'
import { classPrices } from '@/lib/stripe'
import { getSession } from '@/lib/session'

export async function GET(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const activity = new URL(request.url).searchParams.get('activity') || ''
  if (!isClassSlug(activity)) return NextResponse.json([])
  const rows = await classPrices(activity)
  return NextResponse.json(rows)
}
