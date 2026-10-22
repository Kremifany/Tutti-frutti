'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { classes, type ClassSlug } from '@/lib/classes'
import { useLang } from '@/components/language'

type ChildRow = {
  id: string
  name: string
  age: string
  notes: string | null
  activity: string | null
  startsAt: string | null
  amount: number | null
  currency: string | null
  paid: boolean
}

const text = {
  ru: {
    eyebrow: 'Кабинет родителя',
    hello: 'Здравствуйте',
    lead: 'Здесь имя каждого ребёнка, а под ним — его занятия и даты.',
    empty: 'Пока нет оплаченных записей.',
    register: 'Выбрать занятие',
    children: 'Дети',
    who: 'Ребёнок',
    classLabel: 'Занятие',
    dateLabel: 'Дата',
    payment: 'Оплата',
    paid: 'Оплачено',
    unpaid: 'Оплата через Stripe позже',
    unknown: 'Не указано',
  },
  en: {
    eyebrow: 'Parent account',
    hello: 'Hello',
    lead: 'Each child’s name is listed here, with their classes and dates underneath.',
    empty: 'No paid enrollments yet.',
    register: 'Choose a class',
    children: 'Children',
    who: 'Child',
    classLabel: 'Class',
    dateLabel: 'Date',
    payment: 'Payment',
    paid: 'Paid',
    unpaid: 'Stripe payment later',
    unknown: 'Not set',
  },
}

function money(amount: number, currency: string | null, lang: 'ru' | 'en') {
  if ((currency || '').toLowerCase() === 'usd') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  return `${new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'ru-RU').format(amount)} ₽`
}

function when(value: string, lang: 'ru' | 'en') {
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export default function AccountPage() {
  const { lang } = useLang()
  const t = text[lang]
  const { data } = authClient.useSession()
  const [children, setChildren] = useState<ChildRow[]>([])

  useEffect(() => {
    fetch('/api/children').then(async (response) => {
      if (response.ok) setChildren(await response.json())
    }).catch(() => {})
  }, [])

  return (
    <main className="form-page">
      <div className="form-wrap">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.hello},<br /><em>{data?.user.name || ''}</em></h1>
        <p className="form-lead">{t.lead}</p>
        <Link href="/#activities" className="text-link account-classes">{t.register} <ArrowRight size={16} /></Link>
        <p className="eyebrow">{t.children}</p>
        {children.length === 0 ? <p className="form-lead">{t.empty}</p> : [...children.reduce((groups, item) => {
          const list = groups.get(item.name) || []
          list.push(item)
          groups.set(item.name, list)
          return groups
        }, new Map<string, ChildRow[]>()).entries()].map(([name, items]) => (
          <section className="child-block" key={name}>
            <p className="eyebrow">{t.who}</p>
            <h2>{name}</h2>
            <ul>{items.map((item) => {
              const activity = item.activity && item.activity in classes ? classes[item.activity as ClassSlug][lang] : t.unknown
              return (
                <li key={item.id}>
                  <strong>{t.classLabel}: {activity}</strong>
                  <span>{t.dateLabel}: {item.startsAt ? when(item.startsAt, lang) : t.unknown}</span>
                  <span>{t.payment}: {item.amount != null ? money(item.amount, item.currency, lang) : t.unknown} · {item.paid ? t.paid : t.unpaid}</span>
                  {item.notes && <small>{item.notes}</small>}
                </li>
              )
            })}</ul>
          </section>
        ))}
      </div>
    </main>
  )
}
