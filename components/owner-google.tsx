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

let googleScript: Promise<void> | null = null
let prompting = false

function googleIdentity() {
  return (window as Window & { google?: GoogleIdentity }).google?.accounts.id
}

function loadGoogleScript() {
  if (googleIdentity()) return Promise.resolve()
  if (googleScript) return googleScript
  googleScript = new Promise((resolve, reject) => {
    const found = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]')
    const script = found || document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      googleScript = null
      reject(new Error('Google sign-in did not load'))
    }
    if (!found) document.head.appendChild(script)
    else if (googleIdentity()) resolve()
  })
  return googleScript
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
    let active = true
    loadGoogleScript().then(() => {
      const google = googleIdentity()
      if (!active || !google || prompting) return
      prompting = true
      google.initialize({
        client_id: clientId,
        auto_select: true,
        cancel_on_tap_outside: true,
        context: 'use',
        itp_support: true,
        callback: async (response: { credential?: string }) => {
          prompting = false
          const token = response.credential || ''
          if (!active || emailFromIdToken(token) !== owner) return
          const result = await fetch('/api/owner-google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: token }),
          })
          if (result.ok) window.location.href = '/dashboard'
        },
      })
      google.prompt((notification) => {
        if (notification.isDisplayMoment?.() || notification.isDisplayed?.()) {
          google.cancel()
          prompting = false
        }
      })
    }).catch(() => {})
    return () => {
      active = false
      if (!prompting) return
      googleIdentity()?.cancel()
      prompting = false
    }
  }, [isPending, session, clientId, ownerEmail])

  return null
}
