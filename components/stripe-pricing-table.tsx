'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/components/language'
import { childNames } from '@/lib/child-names'
import { classes, type ClassSlug } from '@/lib/classes'

const text = {
  ru: {
    eyebrow: 'Запись',
    whoA: 'Кого записываем',
    whoLead: 'Оплачивает родитель. Выберите ребёнка из кабинета или напишите новое имя. Можно до трёх детей.',
    yours: 'Ваши дети',
    child: 'Имя ребёнка',
    placeholder: 'Например, Маша',
    add: 'Добавить ребёнка',
    remove: 'Убрать',
    continue: 'Дальше к оплате',
    edit: 'Изменить имена',
    missingName: 'Введите имя ребёнка.',
    already: (name: string) => `Ребёнок ${name} уже записан на это занятие.`,
    failed: 'Не удалось сохранить имена.',
    missing: (name: string) => `Таблица цен Stripe для занятия «${name}» ещё не подключена.`,
    opening: 'Открываем оплату…',
  },
  en: {
    eyebrow: 'Registration',
    whoA: 'Who is joining',
    whoLead: 'The parent pays. Choose a child already in your account, or add a new name. Up to three children.',
    yours: 'Your children',
    child: 'Child’s name',
    placeholder: 'For example, Masha',
    add: 'Add a child',
    remove: 'Remove',
    continue: 'Continue to payment',
    edit: 'Edit names',
    missingName: 'Enter the child’s name.',
    already: (name: string) => `The child ${name} already registered for that activity.`,
    failed: 'Could not save the names.',
    missing: (name: string) => `The Stripe pricing table for ${name} is not connected yet.`,
    opening: 'Opening payment…',
  },
}

export function StripePricingTable({ activity, publishableKey, pricingTableId, priceId = '' }: { activity: ClassSlug; publishableKey: string; pricingTableId: string; priceId?: string }) {
  const { lang } = useLang()
  const t = text[lang]
  const className = classes[activity][lang]
  const ready = Boolean(publishableKey && pricingTableId)
  const [known, setKnown] = useState<string[]>([])
  const [picked, setPicked] = useState<string[]>([])
  const [names, setNames] = useState([''])
  const [saved, setSaved] = useState<{ id: string; name: string }[] | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [chosenPrice, setChosenPrice] = useState(priceId)
  const [offers, setOffers] = useState<{ priceId: string; name: string; amount: number; currency: string }[] | null>(null)
  const payFor = chosenPrice || priceId
  const openSlots = 3 - picked.length - names.length

  useEffect(() => {
    fetch('/api/children?list=names').then(async (response) => {
      if (!response.ok) return
      const list = childNames(await response.json())
      setKnown(list)
      if (list.length === 1) setPicked(list)
      if (list.length) setNames((current) => current.length === 1 && !current[0].trim() ? [] : current)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!saved || payFor) return
    let active = true
    fetch(`/api/stripe/dates?activity=${activity}`).then(async (response) => {
      if (!active) return
      setOffers(response.ok ? await response.json() : [])
    }).catch(() => { if (active) setOffers([]) })
    return () => { active = false }
  }, [saved, payFor, activity])

  useEffect(() => {
    if (!saved || !payFor) return
    let active = true
    fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activity, priceId: payFor, childIds: saved.map((item) => item.id) }),
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
  }, [saved, payFor, activity, t.failed, t.already])

  const toggleChild = (name: string) => {
    setPicked((current) => {
      if (current.includes(name)) return current.filter((item) => item !== name)
      if (current.length + names.length >= 3) return current
      return [...current, name]
    })
  }

  return (
    <main className="form-page">
      <div className="checkout-wrap">
        {!saved ? (
          <form className="child-step" onSubmit={async (event) => {
            event.preventDefault()
            const chosen = childNames([...picked, ...names])
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
            {names.map((name, index) => (
              <div className="child-row" key={index}>
                <label>{t.child} {names.length > 1 ? index + 1 : ''}<input value={name} onChange={(event) => setNames(names.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} placeholder={t.placeholder} /></label>
                {(names.length > 1 || known.length > 0) && <button type="button" className="link-button" onClick={() => setNames(names.filter((_, itemIndex) => itemIndex !== index))}>{t.remove}</button>}
              </div>
            ))}
            <div className="child-actions">
              {openSlots > 0 && <button type="button" className="link-button" onClick={() => setNames([...names, ''])}>{t.add}</button>}
            </div>
            {error && <p className="form-error">{error}</p>}
            <button className="primary-button form-button" disabled={busy}>{t.continue}</button>
          </form>
        ) : <>
          <div className="child-chips">{saved.map((item) => <span key={item.id}>{item.name}</span>)}<button type="button" className="link-button" onClick={() => setSaved(null)}>{t.edit}</button></div>
          {payFor ? <p className="form-lead">{error || t.opening}</p> : !ready ? <p className="form-error">{t.missing(className)}</p> : offers === null ? <p className="form-lead">{t.opening}</p> : offers.length === 0 ? <p className="form-error">{t.missing(className)}</p> : (
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
