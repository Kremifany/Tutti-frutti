'use client'

import { useEffect, useState } from 'react'
import { DashboardShell } from '@/components/dashboard-shell'
import { useLang } from '@/components/language'

const text = {
  ru: {
    owner: 'Кабинет владельца',
    title: 'Сторителлинг',
    lead: 'Загрузите афишу. На странице занятий родители увидят постеры и даты из Stripe.',
    add: 'Новая афиша',
    titleRu: 'Название (RU)',
    titleEn: 'Название (EN)',
    endsAt: 'Показывать до',
    image: 'Постер',
    save: 'Сохранить',
    saving: 'Сохраняем…',
    empty: 'Пока нет афиш.',
    edit: 'Изменить',
    hide: 'Скрыть',
    show: 'Показать',
    remove: 'Удалить',
    cancel: 'Отмена',
    hidden: 'Скрыто',
    visible: 'На сайте',
    failed: 'Не удалось сохранить афишу.',
    uploadFailed: 'Не удалось загрузить изображение.',
    confirmDelete: 'Удалить эту афишу?',
  },
  en: {
    owner: 'Owner account',
    title: 'Storytelling',
    lead: 'Upload a poster. On the class page parents will see posters and Stripe dates.',
    add: 'New poster',
    titleRu: 'Title (RU)',
    titleEn: 'Title (EN)',
    endsAt: 'Show until',
    image: 'Poster',
    save: 'Save',
    saving: 'Saving…',
    empty: 'No posters yet.',
    edit: 'Edit',
    hide: 'Hide',
    show: 'Show',
    remove: 'Delete',
    cancel: 'Cancel',
    hidden: 'Hidden',
    visible: 'On the site',
    failed: 'Could not save the poster.',
    uploadFailed: 'Could not upload the image.',
    confirmDelete: 'Delete this poster?',
  },
}

type StoryRow = {
  id: string
  titleRu: string
  titleEn: string
  imageUrl: string
  endsAt: string
  active: boolean
}

function dayValue(value: string) {
  return value.slice(0, 10)
}

export default function StoriesPage() {
  const { lang } = useLang()
  const t = text[lang]
  const [rows, setRows] = useState<StoryRow[] | null>(null)
  const [titleRu, setTitleRu] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const loading = rows === null

  const load = () => {
    fetch('/api/owner/stories').then(async (response) => {
      setRows(response.ok ? await response.json() : [])
    }).catch(() => setRows([]))
  }

  useEffect(() => { load() }, [])

  const resetForm = () => {
    setTitleRu('')
    setTitleEn('')
    setEndsAt('')
    setImage(null)
    setEditing(null)
    setError('')
  }

  const startEdit = (row: StoryRow) => {
    setEditing(row.id)
    setTitleRu(row.titleRu)
    setTitleEn(row.titleEn)
    setEndsAt(dayValue(row.endsAt))
    setImage(null)
    setError('')
  }

  const save = async () => {
    if (!titleRu.trim() || !titleEn.trim() || !endsAt) {
      setError(t.failed)
      return
    }
    if (!editing && !image) {
      setError(t.uploadFailed)
      return
    }
    setBusy(true)
    setError('')
    const body = new FormData()
    body.set('titleRu', titleRu.trim())
    body.set('titleEn', titleEn.trim())
    body.set('endsAt', endsAt)
    if (image) body.set('image', image)
    const response = await fetch(editing ? `/api/owner/stories/${editing}` : '/api/owner/stories', {
      method: editing ? 'PATCH' : 'POST',
      body,
    })
    setBusy(false)
    if (!response.ok) {
      setError(response.status === 400 ? t.uploadFailed : t.failed)
      return
    }
    resetForm()
    load()
  }

  const toggle = async (row: StoryRow) => {
    await fetch(`/api/owner/stories/${row.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !row.active }),
    })
    load()
  }

  const remove = async (row: StoryRow) => {
    if (!window.confirm(t.confirmDelete)) return
    await fetch(`/api/owner/stories/${row.id}`, { method: 'DELETE' })
    if (editing === row.id) resetForm()
    load()
  }

  return (
    <DashboardShell active="stories">
      <section className="dashboard-main" aria-busy={loading}>
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">{t.owner}</p>
            <h1>{t.title}</h1>
            <p className="form-lead">{t.lead}</p>
          </div>
        </header>

        <div className="dash-panel story-form-panel">
          <p className="eyebrow">{editing ? t.edit : t.add}</p>
          <label>{t.titleRu}<input value={titleRu} onChange={(event) => setTitleRu(event.target.value)} /></label>
          <label>{t.titleEn}<input value={titleEn} onChange={(event) => setTitleEn(event.target.value)} /></label>
          <label>{t.endsAt}<input type="date" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} /></label>
          <label>{t.image}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => setImage(event.target.files?.[0] || null)} /></label>
          {error && <p className="form-error">{error}</p>}
          <div className="story-form-actions">
            <button type="button" className="primary-button" disabled={busy} onClick={save}>{busy ? t.saving : t.save}</button>
            {editing && <button type="button" className="link-button" onClick={resetForm}>{t.cancel}</button>}
          </div>
        </div>

        <div className="dash-panel stories-panel">
          {loading ? (
            <div className="row-skeleton" aria-hidden="true"><div><span className="skeleton wide" /><span className="skeleton short" /></div></div>
          ) : (rows ?? []).length === 0 ? (
            <p className="form-lead">{t.empty}</p>
          ) : (rows ?? []).map((row) => (
            <article className="story-admin-row" key={row.id}>
              <img src={row.imageUrl} alt={lang === 'en' ? row.titleEn : row.titleRu} />
              <div>
                <strong>{lang === 'en' ? row.titleEn : row.titleRu}</strong>
                <small>{dayValue(row.endsAt)} · {row.active ? t.visible : t.hidden}</small>
              </div>
              <div className="story-admin-actions">
                <button type="button" className="link-button" onClick={() => startEdit(row)}>{t.edit}</button>
                <button type="button" className="link-button" onClick={() => toggle(row)}>{row.active ? t.hide : t.show}</button>
                <button type="button" className="link-button" onClick={() => remove(row)}>{t.remove}</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </DashboardShell>
  )
}
