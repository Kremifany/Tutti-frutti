import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { idToken?: string } | null
  const idToken = body?.idToken || ''
  const owner = process.env.OWNER_EMAIL?.toLowerCase()
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!idToken || !owner || !clientId) return NextResponse.json({ error: 'missing' }, { status: 400 })

  const info = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`)
  if (!info.ok) return NextResponse.json({ error: 'invalid' }, { status: 401 })
  const payload = await info.json() as { email?: string; aud?: string; email_verified?: string }
  if (payload.aud !== clientId || payload.email?.toLowerCase() !== owner || payload.email_verified === 'false') {
    return NextResponse.json({ error: 'not-owner' }, { status: 403 })
  }

  const url = new URL('/api/auth/sign-in/social', request.url)
  const incoming = await auth.handler(new Request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: new URL(request.url).origin,
      Cookie: request.headers.get('cookie') || '',
    },
    body: JSON.stringify({ provider: 'google', idToken: { token: idToken }, callbackURL: '/dashboard' }),
  }))
  const headers = new Headers()
  incoming.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'set-cookie') headers.append(key, value)
  })
  for (const cookie of incoming.headers.getSetCookie()) headers.append('set-cookie', cookie)
  return new NextResponse(incoming.body, { status: incoming.status, headers })
}
