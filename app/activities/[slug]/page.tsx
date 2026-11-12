import { notFound } from 'next/navigation'
import { ActivityDetail } from '@/components/activity-detail'
import { isClassSlug } from '@/lib/classes'

export default async function ActivityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!isClassSlug(slug)) notFound()
  return <ActivityDetail slug={slug} />
}
