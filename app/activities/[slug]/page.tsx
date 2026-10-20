import { ActivityDetail } from '@/components/activity-detail'

export default async function ActivityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ActivityDetail slug={slug} />
}
