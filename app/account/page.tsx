import { AccountCabinet } from './cabinet'
import { getSession } from '@/lib/session'

export default async function AccountPage() {
  const session = await getSession()
  return <AccountCabinet name={session?.user.name || ''} />
}
