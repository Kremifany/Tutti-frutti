'use client'

import { useEffect, useState } from 'react'
import { DashboardShell } from '@/components/dashboard-shell'
import { useLang } from '@/components/language'

const text = {
  ru: {
    owner: 'Кабинет владельца',
    title: 'Дети и родители',
    lead: 'Сначала родитель, под ним — дети из его кабинета.',
    empty: 'Пока нет родителей.',
    noChildren: 'Пока нет детей.',
    children: 'Дети',
  },
  en: {
    owner: 'Owner account',
    title: 'Children and parents',
    lead: 'Each parent first, then the children in that account.',
    empty: 'No parents yet.',
    noChildren: 'No children yet.',
    children: 'Children',
  },
}

type Family = { id: string; name: string; email: string; children: string[] }

export default function FamiliesPage() {
  const { lang } = useLang()
  const t = text[lang]
  const [families, setFamilies] = useState<Family[] | null>(null)
  const loading = families === null
  const rows = families ?? []

  useEffect(() => {
    let active = true
    fetch('/api/families').then(async (response) => {
      if (!active) return
      setFamilies(response.ok ? await response.json() : [])
    }).catch(() => { if (active) setFamilies([]) })
    return () => { active = false }
  }, [])

  return (
    <DashboardShell active="families">
      <section className="dashboard-main" aria-busy={loading}>
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">{t.owner}</p>
            <h1>{t.title}</h1>
            <p className="form-lead">{t.lead}</p>
          </div>
        </header>
        <div className="dash-panel families-panel">
          {loading ? (
            <div className="row-skeleton" aria-hidden="true"><div><span className="skeleton wide" /><span className="skeleton short" /></div></div>
          ) : rows.length === 0 ? (
            <p className="form-lead">{t.empty}</p>
          ) : rows.map((family) => (
            <article className="family-block" key={family.id}>
              <div className="parent-row family-parent">
                <div className="mini-avatar">{family.name[0]}</div>
                <div>
                  <strong>{family.name}</strong>
                  <small>{family.email}</small>
                </div>
              </div>
              <p className="eyebrow family-kids-label">{t.children}</p>
              {family.children.length === 0 ? (
                <p className="form-lead family-empty">{t.noChildren}</p>
              ) : (
                <ul className="family-kids">
                  {family.children.map((name) => (
                    <li key={name}>
                      <div className="mini-avatar">{name[0]}</div>
                      <strong>{name}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>
    </DashboardShell>
  )
}
