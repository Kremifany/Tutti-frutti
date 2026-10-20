'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { authClient } from '@/lib/auth-client'
import { destinationForRole } from '@/lib/roles'

export default function ContinuePage() {
  const router = useRouter()
  const { data, isPending } = authClient.useSession()

  useEffect(() => {
    if (isPending) return
    router.replace(data ? destinationForRole(data.user.role) : '/sign-in')
  }, [data, isPending, router])

  return null
}
