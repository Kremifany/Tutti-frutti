'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { classes, type ClassSlug } from '@/lib/classes'
import { useLang } from '@/components/language'

type ChildRow = {
  id: string
  name: string
  age: string
  notes: string | null
  activity: string | null
  startsAt: string | null
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
    classLabel: 'Занятие',
    dateLabel: 'Дата',
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
    classLabel: 'Class',
    dateLabel: 'Date',
    paid: 'Paid',
    unpaid: 'Stripe payment later',
    unknown: 'Not set',
  },
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

export function AccountCabinet({ name }: { name: string }) {
  const { lang } = useLang()
  const t = text[lang]
  const [children, setChildren] = useState<ChildRow[] | null>(null)

  useEffect(() => {
    fetch('/api/children').then(async (response) => {
      setChildren(response.ok ? await response.json() : [])
    }).catch(() => setChildren([]))
  }, [])

  const groups = children ? [...children.reduce((map, item) => {
    const list = map.get(item.name) || []
    list.push(item)
    map.set(item.name, list)
    return map
  }, new Map<string, ChildRow[]>()).entries()] : null

  return (
    <main className="form-page">
      <div className="form-wrap">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{name ? <>{t.hello},<br /><em>{name}</em></> : t.hello}</h1>
        <Link href="/#activities" className="text-link account-classes">{t.register} <ArrowRight size={16} /></Link>
        {groups === null ? null : groups.length === 0 ? <p className="form-lead">{t.empty}</p> : <>
          <p className="form-lead">{t.lead}</p>
          <p className="eyebrow">{t.children}</p>
          {groups.map(([childName, items]) => (
            <section className="child-block" key={childName}>
              <h2>{childName}</h2>
              <ul>{items.map((item) => {
                const activity = item.activity && item.activity in classes ? classes[item.activity as ClassSlug][lang] : t.unknown
                return (
                  <li key={item.id}>
                    <strong>{t.classLabel}: {activity}</strong>
                    <span>{t.dateLabel}: {item.startsAt ? when(item.startsAt, lang) : t.unknown}</span>
                    <span>{item.paid ? t.paid : t.unpaid}</span>
                    {item.notes && <small>{item.notes}</small>}
                  </li>
                )
              })}</ul>
            </section>
          ))}
        </>}
      </div>
    </main>
  )
}
