'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, Bell, CalendarDays, Users } from 'lucide-react'
import { useLang } from '@/components/language'
import { classes, type ClassSlug } from '@/lib/classes'

const text = {
  ru: {
    owner: 'Кабинет владельца',
    schedule: 'Расписание',
    families: 'Дети и родители',
    alerts: 'Уведомления',
    back: 'На сайт',
    hello: 'Добрый день',
    people: 'Оплатили и записались',
    registrations: 'Оплаченных записей',
    dates: 'Дат с записями',
    byDate: 'По датам',
    who: 'Кто оплатил',
    empty: 'Пока нет оплат.',
    paid: 'Оплачено',
    unknown: 'Дата не указана',
  },
  en: {
    owner: 'Owner account',
    schedule: 'Schedule',
    families: 'Children and parents',
    alerts: 'Notifications',
    back: 'Back to the site',
    hello: 'Good afternoon',
    people: 'Paid and registered',
    registrations: 'Paid registrations',
    dates: 'Dates with registrations',
    byDate: 'By date',
    who: 'Who paid',
    empty: 'No payments yet.',
    paid: 'Paid',
    unknown: 'Date not set',
  },
}

type Purchase = { id: string; parent: string; child?: string; activity: string | null; startsAt: string | null }

function peopleWord(count: number, lang: 'ru' | 'en') {
  if (lang === 'en') return count === 1 ? 'person' : 'people'
  const last = count % 10
  const teen = count % 100
  if (teen >= 11 && teen <= 14) return 'человек'
  if (last === 1) return 'человек'
  if (last >= 2 && last <= 4) return 'человека'
  return 'человек'
}

function when(value: string, lang: 'ru' | 'en') {
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value))
}

function SkeletonRows({ avatars = false }: { avatars?: boolean }) {
  return (
    <>
      {[0, 1, 2].map((index) => (
        <div className="row-skeleton" key={index} aria-hidden="true">
          {avatars && <span className="skeleton dot" />}
          <div><span className="skeleton wide" /><span className="skeleton short" /></div>
          <span className="skeleton pill" />
        </div>
      ))}
    </>
  )
}

export default function DashboardPage() {
  const { lang } = useLang()
  const t = text[lang]
  const [purchases, setPurchases] = useState<Purchase[] | null>(null)
  const loading = purchases === null
  const rows = purchases ?? []
  const people = new Set(rows.map((item) => item.child || item.parent)).size
  const byDate = [...rows.reduce((groups, item) => {
    const activity = item.activity && item.activity in classes ? classes[item.activity as ClassSlug][lang] : item.activity || t.unknown
    const date = item.startsAt ? when(item.startsAt, lang) : t.unknown
    const key = `${activity}|${date}`
    const group = groups.get(key) || { activity, date, count: 0 }
    group.count += 1
    groups.set(key, group)
    return groups
  }, new Map<string, { activity: string; date: string; count: number }>()).values()]

  useEffect(() => {
    let active = true
    fetch('/api/enrollments').then(async (response) => {
      if (!active) return
      setPurchases(response.ok ? await response.json() : [])
    }).catch(() => { if (active) setPurchases([]) })
    return () => { active = false }
  }, [])

  return (
    <main className="dashboard-page">
      <aside className="dashboard-side">
        <Link href="/" className="brand"><span className="brand-mark"><img src="/images/logo.png" alt="" /></span><span>tutti-frutti</span></Link>
        <p className="side-label">{t.owner}</p>
        <nav>
          <a className="selected"><CalendarDays size={18} /> {t.schedule}</a>
          <a><Users size={18} /> {t.families}</a>
          <a><Bell size={18} /> {t.alerts}</a>
        </nav>
        <Link href="/" className="back-link"><ArrowLeft size={15} /> {t.back}</Link>
      </aside>
      <section className="dashboard-main" aria-busy={loading}>
        <header className="dashboard-header"><div><p className="eyebrow">{t.owner}</p><h1>{t.hello}</h1></div><div className="owner-avatar">К</div></header>
        <div className="stats-grid">
          <div><span>{t.people}</span>{loading ? <span className="skeleton stat-skeleton" /> : <strong>{people}</strong>}</div>
          <div><span>{t.registrations}</span>{loading ? <span className="skeleton stat-skeleton" /> : <strong>{rows.length}</strong>}</div>
          <div><span>{t.dates}</span>{loading ? <span className="skeleton stat-skeleton" /> : <strong>{byDate.length}</strong>}</div>
        </div>
        <div className="dashboard-grid">
          <div className="dash-panel">
            <div className="panel-head"><div><p className="eyebrow">{t.paid}</p><h2>{t.byDate}</h2></div></div>
            {loading ? <SkeletonRows /> : byDate.length === 0 ? <p className="form-lead">{t.empty}</p> : byDate.map((group) => <div className="schedule-row" key={`${group.activity}-${group.date}`}><div><strong>{group.date}</strong><small>{group.activity}</small></div><span className="status-pill">{group.count} {peopleWord(group.count, lang)}</span></div>)}
          </div>
          <div className="dash-panel">
            <div className="panel-head"><div><p className="eyebrow">{t.paid}</p><h2>{t.who}</h2></div></div>
            {loading ? <SkeletonRows avatars /> : rows.length === 0 ? <p className="form-lead">{t.empty}</p> : rows.map((item) => {
              const activity = item.activity && item.activity in classes ? classes[item.activity as ClassSlug][lang] : item.activity || t.unknown
              const detail = [activity, item.startsAt ? when(item.startsAt, lang) : t.unknown].join(' · ')
              const registered = item.child || item.parent
              const owner = registered !== item.parent ? item.parent : ''
              return <div className="parent-row" key={item.id}><div className="mini-avatar">{registered[0]}</div><div><strong>{registered}</strong><small>{[owner, detail].filter(Boolean).join(' · ')}</small></div><span className="status-pill">{t.paid}</span></div>
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
