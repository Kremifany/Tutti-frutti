export const CLASS_PRICE = 1500

export const classes = {
  'live-letters': { ru: 'Живые буквы', en: 'Live Letters', weekday: 1, time: '18:00' },
  grow: { ru: 'Расти', en: 'Grow', weekday: 3, time: '17:45' },
  consonance: { ru: 'Созвучие', en: 'Consonance', weekday: 5, time: '17:00' },
  'animal-kingdom': { ru: 'Царство животных', en: 'Animal Kingdom', weekday: 6, time: '10:00' },
  storytelling: { ru: 'Интерактивный сторителлинг', en: 'Interactive Storytelling', weekday: 6, time: '10:00' },
} as const

export type ClassSlug = keyof typeof classes

export function isClassSlug(value: string): value is ClassSlug {
  return value in classes
}

export function paymentPath(slug: ClassSlug) {
  return `/payment?activity=${slug}`
}

export function checkoutPath(slug: ClassSlug) {
  return `/checkout?activity=${slug}`
}

export function safeNextPath(value: string | null) {
  if (!value) return null
  let url: URL
  try {
    url = new URL(value, 'http://tutti.local')
  } catch {
    return null
  }
  if (url.origin !== 'http://tutti.local') return null
  if (url.pathname === '/payment' || url.pathname === '/checkout') {
    const activity = url.searchParams.get('activity') || ''
    if (!isClassSlug(activity)) return null
    return url.pathname === '/checkout' ? checkoutPath(activity) : paymentPath(activity)
  }
  const match = url.pathname.match(/^\/activities\/([a-z0-9-]+)$/)
  if (!match || !isClassSlug(match[1])) return null
  const product = url.searchParams.get('product') || ''
  if (product && !/^[A-Za-z0-9-]+$/.test(product)) return null
  return product ? `/activities/${match[1]}?product=${product}` : `/activities/${match[1]}`
}

export function nextClassDate(slug: ClassSlug, from = new Date()) {
  const item = classes[slug]
  const [hours, minutes] = item.time.split(':').map(Number)
  const date = new Date(from)
  date.setSeconds(0, 0)
  const delta = (item.weekday - date.getDay() + 7) % 7
  date.setDate(date.getDate() + delta)
  date.setHours(hours, minutes, 0, 0)
  if (date.getTime() <= from.getTime()) date.setDate(date.getDate() + 7)
  return date
}

export function upcomingClassDates(slug: ClassSlug, count = 8, from = new Date()) {
  const dates: string[] = []
  let cursor = new Date(from.getTime() - 1000)
  for (let index = 0; index < count; index++) {
    const next = nextClassDate(slug, cursor)
    const month = String(next.getMonth() + 1).padStart(2, '0')
    const day = String(next.getDate()).padStart(2, '0')
    dates.push(`${next.getFullYear()}-${month}-${day}`)
    cursor = next
  }
  return dates
}

export function classDateFromChoice(slug: ClassSlug, value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  const [hours, minutes] = classes[slug].time.split(':').map(Number)
  const date = new Date(year, month - 1, day, hours, minutes, 0, 0)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null
  if (date.getDay() !== classes[slug].weekday) return null
  if (date.getTime() <= Date.now()) return null
  return date
}
