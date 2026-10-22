'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { ArrowRight, LockKeyhole } from 'lucide-react'
import { GoogleButton } from '@/components/google-button'
import { useLang } from '@/components/language'
import { authClient } from '@/lib/auth-client'
import { safeNextPath } from '@/lib/classes'
import { destinationForRole } from '@/lib/roles'

const text = {
  ru: {
    eyebrow: 'Личный кабинет',
    title: 'С возвращением',
    accent: 'в tutti-frutti.',
    lead: 'Войдите, чтобы управлять записями и видеть расписание занятий.',
    email: 'Email',
    password: 'Пароль',
    passwordPlaceholder: 'Ваш пароль',
    submit: 'Войти',
    noAccount: 'Ещё нет аккаунта?',
    create: 'Зарегистрироваться',
    secure: 'Безопасный вход для родителей',
    google: 'Войти через Google',
    googleUnavailable: 'Google ещё не подключён. Добавьте ключи в .env.local.',
    failed: 'Не удалось войти. Проверьте email и пароль.',
  },
  en: {
    eyebrow: 'Personal account',
    title: 'Welcome back',
    accent: 'to tutti-frutti.',
    lead: 'Sign in to manage enrollments and see the class schedule.',
    email: 'Email',
    password: 'Password',
    passwordPlaceholder: 'Your password',
    submit: 'Sign in',
    noAccount: 'No account yet?',
    create: 'Register',
    secure: 'A safe sign-in for parents',
    google: 'Continue with Google',
    googleUnavailable: 'Google is not connected yet. Add the keys to .env.local.',
    failed: 'Could not sign in. Check the email and password.',
  },
}

function SignInForm() {
  const { lang } = useLang()
  const t = text[lang]
  const router = useRouter()
  const next = safeNextPath(useSearchParams().get('next'))
  const { data: session, isPending } = authClient.useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!isPending && session && next) router.replace(next)
  }, [isPending, session, next, router])

  return (
    <main className="form-page">
      <div className="form-wrap">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.title}<br /><em>{t.accent}</em></h1>
        <p className="form-lead">{t.lead}</p>
        <GoogleButton label={t.google} unavailable={t.googleUnavailable} callbackURL={next || '/auth/continue'} />
        <label>{t.email}<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
        <label>{t.password}<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={t.passwordPlaceholder} /></label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button form-button" disabled={busy} onClick={async () => {
          setBusy(true)
          setError('')
          const result = await authClient.signIn.email({ email, password })
          setBusy(false)
          if (result.error) setError(t.failed)
          else router.push(next || destinationForRole(result.data?.user.role))
        }}>{t.submit} <ArrowRight size={17} /></button>
        <p className="form-foot">{t.noAccount} <Link href={next ? `/register?next=${encodeURIComponent(next)}` : '/register'}>{t.create}</Link></p>
        <p className="secure-note"><LockKeyhole size={14} /> {t.secure}</p>
      </div>
    </main>
  )
}

export default function SignInPage() {
  return <Suspense><SignInForm /></Suspense>
}
