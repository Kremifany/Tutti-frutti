'use client'

import Link from 'next/link'
import { ArrowLeft, Bell, BookOpen, CalendarDays, Users } from 'lucide-react'
import type { ReactNode } from 'react'
import { useLang } from '@/components/language'

const text = {
  ru: {
    owner: 'Кабинет владельца',
    schedule: 'Расписание',
    families: 'Дети и родители',
    stories: 'Сторителлинг',
    alerts: 'Уведомления',
    back: 'На сайт',
  },
  en: {
    owner: 'Owner account',
    schedule: 'Schedule',
    families: 'Children and parents',
    stories: 'Storytelling',
    alerts: 'Notifications',
    back: 'Back to the site',
  },
}

export function DashboardShell({ active, children }: { active: 'schedule' | 'families' | 'stories' | 'alerts'; children: ReactNode }) {
  const { lang } = useLang()
  const t = text[lang]
  return (
    <main className="dashboard-page">
      <aside className="dashboard-side">
        <Link href="/" className="brand"><span className="brand-mark"><img src="/images/logo.png" alt="" /></span><span>tutti-frutti</span></Link>
        <p className="side-label">{t.owner}</p>
        <nav>
          <Link href="/dashboard" className={active === 'schedule' ? 'selected' : undefined}><CalendarDays size={18} /> {t.schedule}</Link>
          <Link href="/dashboard/families" className={active === 'families' ? 'selected' : undefined}><Users size={18} /> {t.families}</Link>
          <Link href="/dashboard/stories" className={active === 'stories' ? 'selected' : undefined}><BookOpen size={18} /> {t.stories}</Link>
          <span className={active === 'alerts' ? 'selected' : undefined} aria-disabled="true"><Bell size={18} /> {t.alerts}</span>
        </nav>
        <div className="dashboard-mobile-nav">
          <Link href="/dashboard" className={active === 'schedule' ? 'selected' : undefined}><CalendarDays size={16} /> {t.schedule}</Link>
          <Link href="/dashboard/families" className={active === 'families' ? 'selected' : undefined}><Users size={16} /> {t.families}</Link>
          <Link href="/dashboard/stories" className={active === 'stories' ? 'selected' : undefined}><BookOpen size={16} /> {t.stories}</Link>
        </div>
        <Link href="/" className="back-link"><ArrowLeft size={15} /> {t.back}</Link>
      </aside>
      {children}
    </main>
  )
}
