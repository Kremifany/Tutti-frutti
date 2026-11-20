import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { StripePricingTable } from '@/components/stripe-pricing-table'
import { checkoutPath, isClassSlug } from '@/lib/classes'
import { getSession } from '@/lib/session'
import { pointClassPaymentsHome, pricingTableFor } from '@/lib/stripe'

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ activity?: string; price?: string; story?: string }> }) {
  const { activity: requested = '', price = '', story = '' } = await searchParams
  if (!isClassSlug(requested)) redirect('/#activities')
  const session = await getSession()
  const priceId = /^price_[A-Za-z0-9]+$/.test(price) ? price : ''
  const storyId = /^[0-9a-f-]{36}$/i.test(story) ? story : ''
  const storyPart = storyId ? `&story=${storyId}` : ''
  const next = priceId ? `${checkoutPath(requested)}&price=${priceId}${storyPart}` : `${checkoutPath(requested)}${storyPart}`
  if (!session) redirect(`/register?next=${encodeURIComponent(next)}`)
  if (requested === 'storytelling' && !storyId) redirect('/activities/storytelling')
  const headerList = await headers()
  const host = headerList.get('x-forwarded-host') || headerList.get('host') || 'localhost:3000'
  const proto = headerList.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
  await pointClassPaymentsHome(requested, `${proto}://${host}`)
  const stripe = pricingTableFor(requested)
  return <StripePricingTable activity={requested} publishableKey={stripe.publishableKey} pricingTableId={stripe.pricingTableId} priceId={priceId} storyId={storyId} />
}
