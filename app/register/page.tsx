'use client'

import Link from 'next/link'
import { ArrowRight, LockKeyhole } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { GoogleButton } from '@/components/google-button'
import { useLang } from '@/components/language'
import { authClient } from '@/lib/auth-client'
import { classes, isClassSlug, paymentPath, safeNextPath } from '@/lib/classes'

const text = {
  ru: {
    enroll: 'Запись на занятие',
    helloA: 'Давайте',
    helloB: 'познакомимся.',
    helloLead: 'Создайте аккаунт. После этого сохранится запись на выбранную дату.',
    name: 'Ваше имя',
    namePlaceholder: 'Например, Анна',
    password: 'Пароль',
    passwordPlaceholder: 'Минимум 8 символов',
    continue: 'Продолжить',
    haveAccount: 'Уже есть аккаунт?',
    signIn: 'Войти',
    secure: 'Ваши данные защищены и используются только для записи',
    google: 'Продолжить с Google',
    googleUnavailable: 'Google ещё не подключён. Добавьте ключи в .env.local.',
    failed: 'Не удалось создать аккаунт. Проверьте данные или войдите.',
    chooseClass: 'Сначала выберите занятие',
    chooseLead: 'Запись начинается на странице занятия.',
  },
  en: {
    enroll: 'Enroll in a class',
    helloA: 'Let’s get',
    helloB: 'acquainted.',
    helloLead: 'Create an account. The chosen date is saved right after that.',
    name: 'Your name',
    namePlaceholder: 'For example, Anna',
    password: 'Password',
    passwordPlaceholder: 'At least 8 characters',
    continue: 'Continue',
    haveAccount: 'Already have an account?',
    signIn: 'Sign in',
    secure: 'Your data is protected and used only for enrollment',
    google: 'Continue with Google',
    googleUnavailable: 'Google is not connected yet. Add the keys to .env.local.',
    failed: 'Could not create the account. Check the details or sign in.',
    chooseClass: 'Choose a class first',
    chooseLead: 'Registration starts on the class page.',
  },
}

const openClasses = ['live-letters', 'grow', 'consonance', 'animal-kingdom'] as const

function RegisterForm() {
  const params = useSearchParams()
  const requested = params.get('activity') || ''
  const next = safeNextPath(params.get('next'))
  const fromNext = next?.match(/\/activities\/([a-z0-9-]+)/)?.[1] || next?.match(/activity=([a-z0-9-]+)/)?.[1] || ''
  const activity = isClassSlug(requested) ? requested : isClassSlug(fromNext) ? fromNext : null
  const destination = next || (activity ? paymentPath(activity) : null)
  const { lang } = useLang()
  const t = text[lang]
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (session && destination) router.replace(destination)
  }, [session, destination, router])

  if (!destination || !activity) {
    return (
      <main className="form-page">
        <div className="form-wrap">
          <p className="eyebrow">{t.enroll}</p>
          <h1>{t.chooseClass}</h1>
          <p className="form-lead">{t.chooseLead}</p>
          {openClasses.map((slug) => <Link key={slug} href={`/activities/${slug}`} className="primary-button form-button">{classes[slug][lang]} <ArrowRight size={17} /></Link>)}
        </div>
      </main>
    )
  }

  return (
    <main className="form-page">
      <div className="form-wrap">
        <p className="eyebrow">{t.enroll}</p>
        <h1>{t.helloA}<br /><em>{t.helloB}</em></h1>
        <p className="form-lead">{classes[activity][lang]}. {t.helloLead}</p>
        <GoogleButton label={t.google} unavailable={t.googleUnavailable} callbackURL={destination} />
        <label>{t.name}<input value={name} onChange={(event) => setName(event.target.value)} placeholder={t.namePlaceholder} /></label>
        <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
        <label>{t.password}<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={t.passwordPlaceholder} /></label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button form-button" disabled={busy} onClick={async () => {
          setBusy(true)
          setError('')
          const result = await authClient.signUp.email({ email, password, name })
          setBusy(false)
          if (result.error) setError(t.failed)
          else router.push(destination)
        }}>{t.continue} <ArrowRight size={17} /></button>
        <p className="form-foot">{t.haveAccount} <Link href={`/sign-in?next=${encodeURIComponent(destination)}`}>{t.signIn}</Link></p>
        <p className="secure-note"><LockKeyhole size={14} /> {t.secure}</p>
      </div>
    </main>
  )
}

export default function RegisterPage() {
  return <Suspense><RegisterForm /></Suspense>
}
