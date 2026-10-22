import Stripe from 'stripe'
import { classes, isClassSlug, type ClassSlug } from '@/lib/classes'

const pricingTables: Record<ClassSlug, string> = {
  'live-letters': 'STRIPE_PRICING_TABLE_LIVE_LETTERS',
  grow: 'STRIPE_PRICING_TABLE_GROW',
  consonance: 'STRIPE_PRICING_TABLE_CONSONANCE',
  'animal-kingdom': 'STRIPE_PRICING_TABLE_ANIMAL_KINGDOM',
  storytelling: 'STRIPE_PRICING_TABLE_STORYTELLING',
}

export function pricingTableFor(activity: ClassSlug) {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || ''
  const pricingTableId = process.env[pricingTables[activity]] || ''
  return { publishableKey, pricingTableId, configured: Boolean(publishableKey && pricingTableId) }
}

export function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  return new Stripe(key)
}

export type ClassOffer = {
  priceId: string
  name: string
  startsAt: string | null
  amount: number
  currency: string
}

export async function pricingTableOffers(activity: ClassSlug): Promise<ClassOffer[]> {
  const secret = process.env.STRIPE_SECRET_KEY
  const { pricingTableId, configured } = pricingTableFor(activity)
  if (!secret || !configured) return []
  const response = await fetch(`https://api.stripe.com/v1/pricing_tables/${pricingTableId}`, {
    headers: { Authorization: `Bearer ${secret}` },
  })
  if (!response.ok) return []
  const data = await response.json() as { pricing_table_items?: { name?: string; amount?: string | number; currency?: string; price_id?: string }[] }
  const [hours, minutes] = classes[activity].time.split(':').map(Number)
  const rows: ClassOffer[] = []
  for (const item of data.pricing_table_items || []) {
    if (!item.price_id || !item.name) continue
    const found = dateInText(item.name)
    let startsAt = found?.date ? new Date(found.date) : null
    if (startsAt && !found?.hasTime) startsAt.setHours(hours, minutes, 0, 0)
    if (startsAt && startsAt.getTime() <= Date.now()) continue
    rows.push({
      priceId: item.price_id,
      name: item.name,
      startsAt: startsAt ? startsAt.toISOString() : null,
      amount: Number(item.amount || 0),
      currency: item.currency || 'usd',
    })
  }
  rows.sort((a, b) => (a.startsAt || '9999').localeCompare(b.startsAt || '9999'))
  return rows
}

const months: Record<string, number> = {
  января: 0, февраля: 1, марта: 2, апреля: 3, мая: 4, июня: 5, июля: 6, августа: 7, сентября: 8, октября: 9, ноября: 10, декабря: 11,
  январь: 0, февраль: 1, март: 2, апрель: 3, май: 4, июнь: 5, июль: 6, август: 7, сентябрь: 8, октябрь: 9, ноябрь: 10, декабрь: 11,
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  jan: 0, feb: 1, mar: 2, apr: 3, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
}

function clock(hours: string | undefined, minutes: string | undefined) {
  if (!hours) return null
  const h = Number(hours)
  const m = Number(minutes || 0)
  if (h > 23 || m > 59) return null
  return { h, m }
}

function at(year: number, month: number, day: number, time: { h: number; m: number } | null) {
  const date = new Date(year, month, day, time?.h ?? 12, time?.m ?? 0, 0, 0)
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null
  return { date, hasTime: Boolean(time) }
}

export function dateInText(text: string) {
  const iso = text.match(/(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{1,2}):(\d{2}))?/)
  if (iso) return at(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]), clock(iso[4], iso[5]))
  const slash = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/)
  if (slash) return at(Number(slash[3]), Number(slash[1]) - 1, Number(slash[2]), clock(slash[4], slash[5]))
  const dotted = text.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/)
  if (dotted) return at(Number(dotted[3]), Number(dotted[2]) - 1, Number(dotted[1]), clock(dotted[4], dotted[5]))
  const words = text.toLowerCase()
  const monthPattern = Object.keys(months).sort((a, b) => b.length - a.length).join('|')
  const dayFirst = words.match(new RegExp(`(\\d{1,2})\\s+(${monthPattern})\\s+(\\d{4})(?:\\s+(\\d{1,2}):(\\d{2}))?`))
  if (dayFirst) return at(Number(dayFirst[3]), months[dayFirst[2]], Number(dayFirst[1]), clock(dayFirst[4], dayFirst[5]))
  const monthFirst = words.match(new RegExp(`(${monthPattern})\\s+(\\d{1,2}),?\\s+(\\d{4})(?:\\s+(\\d{1,2}):(\\d{2}))?`))
  if (monthFirst) return at(Number(monthFirst[3]), months[monthFirst[1]], Number(monthFirst[2]), clock(monthFirst[4], monthFirst[5]))
  return null
}

function activityInText(text: string) {
  const haystack = text.toLowerCase()
  const found = (Object.keys(classes) as ClassSlug[]).find((slug) => haystack.includes(classes[slug].ru.toLowerCase()) || haystack.includes(classes[slug].en.toLowerCase()) || haystack.includes(slug))
  return found || null
}

export function purchaseFromProduct(product: { name?: string | null; description?: string | null; metadata?: Stripe.Metadata | null }, activityHint?: string | null) {
  const metadata = product.metadata || {}
  const text = [product.name, product.description, ...Object.values(metadata)].filter(Boolean).join(' ')
  const activity = (metadata.activity && isClassSlug(metadata.activity) ? metadata.activity : null) || activityInText(text) || (activityHint && isClassSlug(activityHint) ? activityHint : null)
  const found = dateInText(text)
  let startsAt = found?.date || null
  if (startsAt && !found?.hasTime && activity) {
    const [hours, minutes] = classes[activity].time.split(':').map(Number)
    startsAt = new Date(startsAt)
    startsAt.setHours(hours, minutes, 0, 0)
  }
  return {
    activity,
    startsAt,
    name: product.name || (activity ? classes[activity].ru : 'Занятие'),
  }
}
