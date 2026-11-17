import { betterAuth } from 'better-auth'
import { createAuthMiddleware } from 'better-auth/api'
import { parseSetCookieHeader, toCookieOptions } from 'better-auth/cookies'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { eq } from 'drizzle-orm'
import { db } from './db'
import { ensureOwnerLogin, isOwnerEmail, promoteOwner } from './owner'
import { schema, user } from './schema'

const googleId = process.env.GOOGLE_CLIENT_ID
const googleSecret = process.env.GOOGLE_CLIENT_SECRET
const configuredUrl = process.env.BETTER_AUTH_URL

type SessionPayload = { user?: { id?: string; email?: string; role?: string } }

function sessionUser(payload: unknown) {
  if (!payload || typeof payload !== 'object' || !('user' in payload)) return null
  const user = (payload as SessionPayload).user
  if (!user?.id || !user.email) return null
  return user
}

export const auth = betterAuth({
  appName: 'tutti-frutti',
  baseURL: {
    allowedHosts: [
      'localhost:*',
      '127.0.0.1:*',
      'tutti-frutti-alpha.vercel.app',
      'tutti-frutti-alpha-*.vercel.app',
    ],
    fallback: configuredUrl || 'http://localhost:3000',
  },
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    'http://localhost:*',
    'http://127.0.0.1:*',
    'https://tutti-frutti-alpha.vercel.app',
    'https://tutti-frutti-alpha-*.vercel.app',
    ...(configuredUrl ? [configuredUrl] : []),
  ],
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders: googleId && googleSecret ? {
    google: {
      clientId: googleId,
      clientSecret: googleSecret,
    },
  } : undefined,
  account: googleId && googleSecret ? {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
      requireLocalEmailVerified: false,
    },
  } : undefined,
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'parent',
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const role = isOwnerEmail(user.email) ? 'owner' : 'parent'
          return { data: { ...user, role } }
        },
      },
    },
    session: {
      create: {
        after: async (session) => {
          const rows = await db.select({ email: user.email, role: user.role }).from(user).where(eq(user.id, session.userId)).limit(1)
          const row = rows[0]
          if (row && row.role !== 'owner' && isOwnerEmail(row.email)) await promoteOwner(session.userId)
        },
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== '/sign-in/email') return
      const email = typeof ctx.body === 'object' && ctx.body && 'email' in ctx.body ? String(ctx.body.email || '') : ''
      if (email && !isOwnerEmail(email)) return
      await ensureOwnerLogin()
    }),
    after: createAuthMiddleware(async (ctx) => {
      const returned = ctx.context.returned
      if (!returned) return
      let payload: unknown = returned
      const response = returned instanceof Response ? returned : null
      if (response) {
        const type = response.headers.get('content-type') || ''
        if (!type.includes('json') || !response.ok) return
        try {
          payload = await response.clone().json()
        } catch {
          return
        }
      }
      const account = sessionUser(payload)
      if (!account?.id || account.role === 'owner' || !isOwnerEmail(account.email)) return
      account.role = 'owner'
      await promoteOwner(account.id)
      if (!response || !payload || typeof payload !== 'object') return
      for (const cookie of response.headers.getSetCookie()) {
        for (const [name, attributes] of parseSetCookieHeader(cookie)) {
          ctx.setCookie(name, attributes.value, toCookieOptions(attributes))
        }
      }
      response.headers.forEach((value, name) => {
        if (name.toLowerCase() === 'set-cookie' || name.toLowerCase() === 'content-length') return
        ctx.setHeader(name, value)
      })
      return ctx.json(payload as Record<string, unknown>)
    }),
  },
  plugins: [nextCookies()],
})
