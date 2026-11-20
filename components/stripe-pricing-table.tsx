'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/components/language'
import { childNames } from '@/lib/child-names'
import { classes, type ClassSlug } from '@/lib/classes'

const text = {
  ru: {
    eyebrow: 'Запись',
    whoA: 'Кого записываем',
    whoLead: 'Оплачивает родитель. Выберите ребёнка из кабинета или введите новое имя и нажмите «Добавить ребёнка». Можно до трёх детей.',
    yours: 'Ваши дети',
    child: 'Имя ребёнка',
    placeholder: 'Например, Маша',
    add: 'Добавить ребёнка',
    continue: 'Дальше к оплате',
    edit: 'Изменить имена',
    missingName: 'Добавьте ребёнка или выберите имя из кабинета.',
    already: (name: string) => `Ребёнок ${name} уже записан на эту дату.`,
    failed: 'Не удалось сохранить имена.',
    addFailed: 'Не удалось добавить ребёнка.',
    missing: (name: string) => `Таблица цен Stripe для занятия «${name}» ещё не подключена.`,
    empty: (name: string) => `Для занятия «${name}» в Stripe пока нет цен.`,
    opening: 'Открываем оплату…',
  },
  en: {
    eyebrow: 'Registration',
    whoA: 'Who is joining',
    whoLead: 'The parent pays. Choose a child already in your account, or type a new name and click “Add a child”. Up to three children.',
    yours: 'Your children',
    child: 'Child’s name',
    placeholder: 'For example, Masha',
    add: 'Add a child',
    continue: 'Continue to payment',
    edit: 'Edit names',
    missingName: 'Add a child or choose one from your account.',
    already: (name: string) => `The child ${name} is already registered for that date.`,
    failed: 'Could not save the names.',
    addFailed: 'Could not add the child.',
    missing: (name: string) => `The Stripe pricing table for ${name} is not connected yet.`,
    empty: (name: string) => `${name} has no prices in Stripe yet.`,
    opening: 'Opening payment…',
  },
}

export function StripePricingTable({ activity, publishableKey, pricingTableId, priceId = '', storyId = '' }: { activity: ClassSlug; publishableKey: string; pricingTableId: string; priceId?: string; storyId?: string }) {
  const { lang } = useLang()
  const t = text[lang]
  const className = classes[activity][lang]
  const ready = Boolean(publishableKey && pricingTableId)
  const [known, setKnown] = useState<string[]>([])
  const [picked, setPicked] = useState<string[]>([])
  const [draft, setDraft] = useState('')
  const [saved, setSaved] = useState<{ id: string; name: string }[] | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [chosenPrice, setChosenPrice] = useState(priceId)
  const [offers, setOffers] = useState<{ priceId: string; name: string; amount: number; currency: string }[] | null>(null)
  const payFor = chosenPrice || priceId
  const canAdd = picked.length < 3
  const canSubmitName = Boolean(childNames(draft)[0])

  useEffect(() => {
    fetch('/api/children?list=names').then(async (response) => {
      if (!response.ok) return
      const list = childNames(await response.json())
      setKnown(list)
      if (list.length === 1) setPicked(list)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!saved || payFor) return
    let active = true
    const storyQuery = storyId ? `&story=${storyId}` : ''
    fetch(`/api/stripe/dates?activity=${activity}${storyQuery}`).then(async (response) => {
      if (!active) return
      setOffers(response.ok ? await response.json() : [])
    }).catch(() => { if (active) setOffers([]) })
    return () => { active = false }
  }, [saved, payFor, activity, storyId])

  useEffect(() => {
    if (!saved || !payFor) return
    let active = true
    fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activity, priceId: payFor, childIds: saved.map((item) => item.id), storyId: storyId || undefined }),
    }).then(async (response) => {
      const payload = await response.json().catch(() => null) as { url?: string; names?: string[] } | null
      if (!active) return
      if (response.status === 409 && payload?.names?.length) {
        setSaved(null)
        setError(payload.names.map((name) => t.already(name)).join(' '))
        setBusy(false)
        return
      }
      if (!response.ok || !payload?.url) {
        setError(t.failed)
        setBusy(false)
        return
      }
      window.location.href = payload.url
    }).catch(() => {
      if (!active) return
      setError(t.failed)
      setBusy(false)
    })
    return () => { active = false }
  }, [saved, payFor, activity, storyId, t.failed, t.already])

  const toggleChild = (name: string) => {
    setPicked((current) => {
      if (current.includes(name)) return current.filter((item) => item !== name)
      if (current.length >= 3) return current
      return [...current, name]
    })
  }

  const addChild = async () => {
    const name = childNames(draft)[0]
    if (!name) {
      setError(t.missingName)
      return
    }
    if (picked.length >= 3) return
    setBusy(true)
    setError('')
    const response = await fetch('/api/children', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    setBusy(false)
    if (!response.ok) {
      setError(t.addFailed)
      return
    }
    setKnown((current) => current.some((item) => item.toLowerCase() === name.toLowerCase()) ? current : [...current, name])
    setPicked((current) => current.some((item) => item.toLowerCase() === name.toLowerCase()) || current.length >= 3 ? current : [...current, name])
    setDraft('')
  }

  return (
    <main className="form-page">
      <div className="checkout-wrap">
        {!saved ? (
          <form className="child-step" onSubmit={async (event) => {
            event.preventDefault()
            const chosen = childNames(picked)
            if (!chosen.length) {
              setError(t.missingName)
              return
            }
            setBusy(true)
            setError('')
            const response = await fetch('/api/children', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ names: chosen, activity }),
            })
            setBusy(false)
            if (response.status === 409) {
              const payload = await response.json().catch(() => null) as { names?: string[] } | null
              const registered = payload?.names?.length ? payload.names : chosen
              setError(registered.map((name) => t.already(name)).join(' '))
              return
            }
            if (!response.ok) {
              setError(t.failed)
              return
            }
            setSaved(await response.json())
          }}>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.whoA}<br /><em>{lang === 'en' ? `${className}.` : `на «${className}».`}</em></h1>
            <p className="form-lead">{t.whoLead}</p>
            {known.length > 0 && <>
              <p className="child-label">{t.yours}</p>
              <div className="known-children">{known.map((name) => <button type="button" key={name} className={picked.includes(name) ? 'is-on' : ''} aria-pressed={picked.includes(name)} onClick={() => toggleChild(name)}>{name}</button>)}</div>
            </>}
            {canAdd && (
              <label>{t.child}<input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={t.placeholder} /></label>
            )}
            <div className="child-actions">
              {canAdd && <button type="button" className="link-button" disabled={busy || !canSubmitName} onClick={addChild}>{t.add}</button>}
            </div>
            {error && <p className="form-error">{error}</p>}
            <button className="primary-button form-button" disabled={busy}>{t.continue}</button>
          </form>
        ) : <>
          <div className="child-chips">{saved.map((item) => <span key={item.id}>{item.name}</span>)}<button type="button" className="link-button" onClick={() => setSaved(null)}>{t.edit}</button></div>
          {payFor ? <p className="form-lead">{error || t.opening}</p> : !ready ? <p className="form-error">{t.missing(className)}</p> : offers === null ? <p className="form-lead">{t.opening}</p> : offers.length === 0 ? <p className="form-error">{t.empty(className)}</p> : (
            <div className="date-offers">
              {offers.map((offer) => (
                <button type="button" className="primary-button" key={offer.priceId} onClick={() => setChosenPrice(offer.priceId)}>{offer.name}</button>
              ))}
              {error && <p className="form-error">{error}</p>}
            </div>
          )}
        </>}
      </div>
    </main>
  )
}
