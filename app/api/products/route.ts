import { and, asc, eq, gt } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { isClassSlug } from '@/lib/classes'
import { db } from '@/lib/db'
import { product } from '@/lib/schema'

export async function GET(request: Request) {
  const activity = new URL(request.url).searchParams.get('activity') || ''
  if (!isClassSlug(activity)) return NextResponse.json([])
  const rows = await db.select().from(product).where(and(eq(product.activity, activity), eq(product.active, true), gt(product.startsAt, new Date()))).orderBy(asc(product.startsAt))
  return NextResponse.json(rows)
}
