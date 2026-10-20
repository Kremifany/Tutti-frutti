import { redirect } from 'next/navigation'
import { StripePricingTable } from '@/components/stripe-pricing-table'
import { checkoutPath, isClassSlug } from '@/lib/classes'
import { getSession } from '@/lib/session'
import { pricingTableFor } from '@/lib/stripe'

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ activity?: string }> }) {
  const { activity: requested = '' } = await searchParams
  if (!isClassSlug(requested)) redirect('/#activities')
  const session = await getSession()
  if (!session) redirect(`/sign-in?next=${encodeURIComponent(checkoutPath(requested))}`)
  const stripe = pricingTableFor(requested)
  return <StripePricingTable activity={requested} publishableKey={stripe.publishableKey} pricingTableId={stripe.pricingTableId} clientReferenceId={session.user.id} customerEmail={session.user.email} />
}
