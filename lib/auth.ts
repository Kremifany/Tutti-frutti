import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { db } from './db'
import { schema } from './schema'

const googleId = process.env.GOOGLE_CLIENT_ID
const googleSecret = process.env.GOOGLE_CLIENT_SECRET
const ownerEmail = process.env.OWNER_EMAIL?.toLowerCase()
const configuredUrl = process.env.BETTER_AUTH_URL

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
          const role = ownerEmail && user.email.toLowerCase() === ownerEmail ? 'owner' : 'parent'
          return { data: { ...user, role } }
        },
      },
    },
  },
  plugins: [nextCookies()],
})
