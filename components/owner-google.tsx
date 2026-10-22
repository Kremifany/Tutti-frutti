'use client'

import { useEffect } from 'react'
import { authClient } from '@/lib/auth-client'

const pauseKey = 'tf-owner-google-pause'

export function pauseOwnerGoogle() {
  sessionStorage.setItem(pauseKey, '1')
  navigator.credentials?.preventSilentAccess?.()
}

export function resumeOwnerGoogle() {
  sessionStorage.removeItem(pauseKey)
}

type PromptMoment = {
  isDisplayMoment?: () => boolean
  isDisplayed?: () => boolean
}

type GoogleIdentity = {
  accounts: {
    id: {
      initialize: (config: Record<string, unknown>) => void
      prompt: (callback: (notification: PromptMoment) => void) => void
      cancel: () => void
    }
  }
}

function emailFromIdToken(token: string) {
  try {
    const part = token.split('.')[1]
    if (!part) return ''
    const payload = JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/'))) as { email?: string }
    return (payload.email || '').toLowerCase()
  } catch {
    return ''
  }
}

export function OwnerGoogle({ clientId, ownerEmail }: { clientId: string; ownerEmail: string }) {
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    const owner = ownerEmail.toLowerCase()
    if (isPending || session || !clientId || !owner || sessionStorage.getItem(pauseKey)) return
    let cancelled = false
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = () => {
      if (cancelled) return
      const google = (window as Window & { google?: GoogleIdentity }).google
      if (!google) return
      google.accounts.id.initialize({
        client_id: clientId,
        auto_select: true,
        cancel_on_tap_outside: true,
        context: 'use',
        itp_support: true,
        callback: async (response: { credential?: string }) => {
          const token = response.credential || ''
          if (emailFromIdToken(token) !== owner) return
          const result = await fetch('/api/owner-google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: token }),
          })
          if (result.ok) window.location.href = '/dashboard'
        },
      })
      google.accounts.id.prompt((notification) => {
        if (notification.isDisplayMoment?.() || notification.isDisplayed?.()) google.accounts.id.cancel()
      })
    }
    document.head.appendChild(script)
    return () => { cancelled = true }
  }, [isPending, session, clientId, ownerEmail])

  return null
}
