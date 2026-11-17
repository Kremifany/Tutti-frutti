import { headers } from 'next/headers'
import { auth } from './auth'
import { isOwnerEmail, promoteOwner } from './owner'

export async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.role === 'owner' || !isOwnerEmail(session.user.email)) return session
  await promoteOwner(session.user.id)
  return { ...session, user: { ...session.user, role: 'owner' } }
}
