import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/sign-in')
  if (session.user.role === 'owner') redirect('/dashboard')
  return children
}
