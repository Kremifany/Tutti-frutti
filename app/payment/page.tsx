'use client'

import Link from 'next/link'
import { Check, CreditCard } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { useLang } from '@/components/language'
import { authClient } from '@/lib/auth-client'
import { childNames } from '@/lib/child-names'
import { classes, isClassSlug, paymentPath, upcomingClassDates, type ClassSlug } from '@/lib/classes'

const text = {
  ru: {
    done: 'Готово',
    enrolled: 'Вы записаны!',
    sent: 'Оплата прошла. Занятие и дата сохранены в кабинете.',
    open: 'Открыть кабинет',
    payment: 'Оплата',
    secure: 'Демо-оплата',
    confirmA: 'Оплатите',
    confirmB: 'занятие.',
    date: 'Дата занятия',
    child: 'Имя ребёнка',
    childPlaceholder: 'Например, Маша',
    add: 'Добавить ребёнка',
    remove: 'Убрать',
    needChild: 'Введите имя ребёнка.',
    pay: 'Оплатить 1 500 ₽',
    demo: 'Макет Stripe: одна кнопка записывает на выбранную дату.',
    failed: 'Не удалось сохранить запись.',
    chooseClass: 'Сначала выберите занятие',
    chooseLead: 'Оплата открывается со страницы занятия.',
  },
  en: {
    done: 'Done',
    enrolled: 'You’re enrolled!',
    sent: 'Payment went through. The class and date are saved in your account.',
    open: 'Open account',
    payment: 'Payment',
    secure: 'Demo payment',
    confirmA: 'Pay for',
    confirmB: 'this class.',
    date: 'Class date',
    child: 'Child’s name',
    childPlaceholder: 'For example, Masha',
    add: 'Add a child',
    remove: 'Remove',
    needChild: 'Enter the child’s name.',
    pay: 'Pay 1,500 ₽',
    demo: 'A Stripe mock: one button enrolls you for the chosen date.',
    failed: 'Could not save the enrollment.',
    chooseClass: 'Choose a class first',
    chooseLead: 'Payment opens from the class page.',
  },
}

const openClasses = ['live-letters', 'grow', 'consonance', 'animal-kingdom'] as const

function formatDay(value: string, lang: 'ru' | 'en') {
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(`${value}T12:00:00`))
}

function PaymentForm() {
  const { lang } = useLang()
  const t = text[lang]
  const router = useRouter()
  const requested = useSearchParams().get('activity') || ''
  const activity: ClassSlug | null = isClassSlug(requested) ? requested : null
  const { data: session, isPending } = authClient.useSession()
  const dates = activity ? upcomingClassDates(activity) : []
  const [classDate, setClassDate] = useState(dates[0] || '')
  const [names, setNames] = useState([''])
  const [paid, setPaid] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const program = activity ? classes[activity][lang] : ''

  useEffect(() => {
    if (!activity || isPending || session) return
    router.replace(`/sign-in?next=${encodeURIComponent(paymentPath(activity))}`)
  }, [activity, isPending, session, router])

  if (!activity) {
    return (
      <main className="form-page">
        <div className="form-wrap">
          <p className="eyebrow">{t.payment}</p>
          <h1>{t.chooseClass}</h1>
          <p className="form-lead">{t.chooseLead}</p>
          {openClasses.map((slug) => <Link key={slug} href={`/activities/${slug}`} className="primary-button form-button">{classes[slug][lang]}</Link>)}
        </div>
      </main>
    )
  }

  return (
    <main className="form-page">
      <div className="payment-card">
        {paid ? <>
          <div className="success-icon"><Check size={28} /></div>
          <p className="eyebrow">{t.done}</p>
          <h1>{t.enrolled}</h1>
          <p className="form-lead">{program} · {classDate ? formatDay(classDate, lang) : ''}. {t.sent}</p>
          <Link href="/auth/continue" className="primary-button form-button">{t.open}</Link>
        </> : <>
          <div className="stripe-head"><span><CreditCard size={20} /> {t.payment}</span><small>DEMO</small></div>
          <p className="eyebrow">{t.secure}</p>
          <h1>{t.confirmA}<br /><em>{program}</em></h1>
          {names.map((name, index) => <div className="child-row" key={index}><label>{t.child} {names.length > 1 ? index + 1 : ''}<input value={name} onChange={(event) => setNames(names.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} placeholder={t.childPlaceholder} /></label>{names.length > 1 && <button type="button" className="link-button" onClick={() => setNames(names.filter((_, itemIndex) => itemIndex !== index))}>{t.remove}</button>}</div>)}
          {names.length < 3 && <button type="button" className="link-button" onClick={() => setNames([...names, ''])}>{t.add}</button>}
          <label>{t.date}<select value={classDate} onChange={(event) => setClassDate(event.target.value)}>{dates.map((value) => <option key={value} value={value}>{formatDay(value, lang)}</option>)}</select></label>
          <div className="order-line"><span>{program}{classDate ? ` · ${formatDay(classDate, lang)}` : ''}</span></div>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button form-button" disabled={busy || !classDate || !session} onClick={async () => {
            const chosen = childNames(names)
            if (!chosen.length) {
              setError(t.needChild)
              return
            }
            setBusy(true)
            setError('')
            let failed = false
            for (const name of chosen) {
              const response = await fetch('/api/children', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, age: '—', activity, startsAt: classDate, paid: true }),
              })
              if (!response.ok) failed = true
            }
            setBusy(false)
            if (failed) setError(t.failed)
            else setPaid(true)
          }}>{t.pay}</button>
          <p className="form-foot">{t.demo}</p>
        </>}
      </div>
    </main>
  )
}

export default function PaymentPage() {
  return <Suspense><PaymentForm /></Suspense>
}
