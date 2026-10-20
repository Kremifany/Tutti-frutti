import { redirect } from 'next/navigation'
import { destinationForRole } from '@/lib/roles'
import { getSession } from '@/lib/session'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/sign-in')
  if (session.user.role !== 'owner') redirect(destinationForRole(session.user.role))
  return children
}
