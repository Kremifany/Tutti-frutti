import Link from 'next/link'
import { ArrowRight, Calendar, Check, Clock, MapPin, Users } from 'lucide-react'
import type { ReactNode } from 'react'
import { ScrollToTop } from '@/components/scroll-to-top'
import { SiteFooter } from '@/components/site-footer'

const copy = {
  ru: {
    crumb: 'Главная',
    badge: 'Развивающие занятия • 5–8 лет',
    title: 'Расти',
    kicker: 'Развитие начинается с корней',
    lead: 'Развиваем внимание, память, мышление и речь через игру, движение и исследование. Учимся задавать вопросы, искать решения и действовать самостоятельно.',
    heroAlt: 'Ребёнок и росток с корнями',
    baseTitle: 'Крепкая основа для новых открытий',
    base: 'Чтобы осваивать новое, ребёнку важно уметь замечать, запоминать, рассуждать, пробовать и взаимодействовать. На занятиях эти умения развиваются вместе — в играх и разнообразных заданиях.',
    baseAlt: 'Два мальчика на занятии',
    doTitle: 'Что мы делаем на занятиях',
    cards: [
      { title: 'Думаем и ищем', text: 'Сравниваем, находим закономерности и решаем игровые задачи.' },
      { title: 'Замечаем и запоминаем', text: 'Следим за правилами, удерживаем последовательность и ищем детали.' },
      { title: 'Двигаемся и координируем', text: 'Соединяем движение с заданиями на внимание и взаимодействие.' },
      { title: 'Говорим и договариваемся', text: 'Объясняем свои идеи, слушаем друг друга и действуем вместе.' },
    ],
    handsAlt: 'Задание с пальцами и счётными палочками',
    writeAlt: 'Ребёнок выполняет задание',
    tryTitle: 'Пробовать. Ошибаться. Находить.',
    try: 'У ребёнка есть время подумать, проверить свою идею и попробовать другой способ. Поддерживаем самостоятельность и интерес к поиску решений.',
    tryAlt: 'Дети пробуют новое движение',
    helpsTitle: 'Что помогает расти',
    helps: ['Внимание и память', 'Мышление и речь', 'Координация и моторика', 'Эмоции и саморегуляция', 'Самостоятельность', 'Общение'],
    quoteA: 'С интересом к новому.',
    quoteB: 'С уверенностью в своих силах.',
    button: 'Записаться на занятие',
    whenTitle: 'Когда и где',
    facts: [
      { label: 'Возраст: 5–8 лет' },
      { label: 'Продолжительность: 45–55 минут' },
      { label: 'По средам, в 17:45' },
      { label: '200 Geiger Rd, Philadelphia, PA' },
    ],
    success: 'Запись на занятие «Расти» прошла успешно.',
  },
  en: {
    crumb: 'Home',
    badge: 'Developmental classes • ages 5–8',
    title: 'Grow',
    kicker: 'Growth starts at the roots',
    lead: 'We grow attention, memory, thinking, and speech through play, movement, and exploration. Children learn to ask questions, look for solutions, and act on their own.',
    heroAlt: 'A child and a sprout with roots',
    baseTitle: 'A strong base for new discoveries',
    base: 'To take on something new, a child needs to notice, remember, reason, try, and work with others. In class these skills grow together, through games and varied tasks.',
    baseAlt: 'Two boys in class',
    doTitle: 'What we do in class',
    cards: [
      { title: 'We think and search', text: 'We compare, find patterns, and solve playful problems.' },
      { title: 'We notice and remember', text: 'We follow the rules, keep the sequence, and look for details.' },
      { title: 'We move and coordinate', text: 'We join movement with tasks for attention and working together.' },
      { title: 'We talk and agree', text: 'We explain our ideas, listen to each other, and act together.' },
    ],
    handsAlt: 'A finger and counting-stick task',
    writeAlt: 'A child working on a task',
    tryTitle: 'Try. Miss. Find.',
    try: 'A child has time to think, test an idea, and try another way. We support independence and an interest in finding solutions.',
    tryAlt: 'Children trying a new movement',
    helpsTitle: 'What helps children grow',
    helps: ['Attention and memory', 'Thinking and speech', 'Coordination and motor skills', 'Emotions and self-regulation', 'Independence', 'Connection'],
    quoteA: 'With interest in something new.',
    quoteB: 'With confidence in their own strengths.',
    button: 'Sign up for a class',
    whenTitle: 'When and where',
    facts: [
      { label: 'Age: 5–8 years' },
      { label: 'Length: 45–55 minutes' },
      { label: 'Wednesdays at 5:45 pm' },
      { label: '200 Geiger Rd, Philadelphia, PA' },
    ],
    success: 'Registration for Grow was successful.',
  },
} as const

const factIcons = [Users, Clock, Calendar, MapPin] as const

const cardTones = ['sun', 'peach', 'sage', 'coral'] as const
const helpTones = ['sun', 'peach', 'sage', 'coral', 'sage', 'sage'] as const

function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3 11.2V16h6v-1.8A6 6 0 0 0 12 3z',
    eye: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    run: 'M14 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM4 22l4-6 3 2 2-3 4 2M8 10l3 2 2-3 5 1',
    chat: 'M5 16.5A7 7 0 1 1 8 18L4 20zM9 11h.01M12 11h.01M15 11h.01',
    brain: 'M9 6a3 3 0 0 0-3 3 3 3 0 0 0 0 6 3 3 0 0 0 3 3 3 3 0 0 0 3-3V9a3 3 0 0 0-3-3zM15 6a3 3 0 0 1 3 3 3 3 0 0 1 0 6 3 3 0 0 1-3 3 3 3 0 0 1-3-3V9a3 3 0 0 1 3-3z',
    gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 3v2M12 19v2M4.2 6.2l1.4 1.4M18.4 16.4l1.4 1.4M3 12h2M19 12h2M4.2 17.8l1.4-1.4M18.4 7.6l1.4-1.4',
    heart: 'M12 19s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z',
    sprout: 'M12 21V11M12 13c-4 0-6-3-6-6 4 0 6 2 6 6zM12 11c4-1 6-4 6-7-4 0-6 3-6 7z',
    people: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM16 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM3 19c.4-2.4 2.4-4 5-4s4.6 1.6 5 4M13 15c2.2 0 4 1.3 4.5 3.5',
  }
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  )
}

const cardIcons = ['bulb', 'eye', 'run', 'chat']
const helpIcons = ['brain', 'chat', 'gear', 'heart', 'sprout', 'people']

export function GrowDetail({ lang, justRegistered, signup }: { lang: 'ru' | 'en'; justRegistered: boolean; signup: ReactNode }) {
  const t = copy[lang]
  return (
    <main className="grow-page">
      <ScrollToTop />
      {justRegistered && <p className="register-success detail-success" role="status"><Check size={18} />{t.success}</p>}
      <p className="grow-crumb"><Link href="/">{t.crumb}</Link> / {t.title}</p>
      <section className="grow-hero">
        <div>
          <p className="grow-badge"><Icon name="sprout" /> {t.badge}</p>
          <h1>{t.title}</h1>
          <h2>{t.kicker}</h2>
          <hr />
          <p className="grow-lead">{t.lead}</p>
          <a className="primary-button" href="#grow-dates">{t.button} <ArrowRight size={17} /></a>
        </div>
        <img src="/images/grow-sprout.jpg" alt={t.heroAlt} />
      </section>

      <section className="grow-base">
        <div>
          <h2>{t.baseTitle}</h2>
          <p>{t.base}</p>
        </div>
        <img src="/images/grow2.jpeg" alt={t.baseAlt} />
      </section>

      <section className="grow-do">
        <h2>{t.doTitle}</h2>
        <div className="grow-cards">
          {t.cards.map((card, index) => (
            <article className={`grow-card ${cardTones[index]}`} key={card.title}>
              <i><Icon name={cardIcons[index]} /></i>
              <div>
                <strong>{card.title}</strong>
                <p>{card.text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="grow-photos">
          <img src="/images/grow1.jpeg" alt={t.handsAlt} />
          <img src="/images/grow3.jpeg" alt={t.writeAlt} />
        </div>
      </section>

      <section className="grow-try">
        <div>
          <h2>{t.tryTitle}</h2>
          <p>{t.try}</p>
        </div>
        <img src="/images/grow4.jpeg" alt={t.tryAlt} />
      </section>

      <section className="grow-helps">
        <h2>{t.helpsTitle}</h2>
        <div>
          {t.helps.map((item, index) => (
            <article className={`grow-help ${helpTones[index]}`} key={item}>
              <i><Icon name={helpIcons[index]} /></i>
              <span>{item}</span>
            </article>
          ))}
        </div>
      </section>

      <p className="grow-quote">{t.quoteA}<br />{t.quoteB}</p>

      <section className="grow-when" id="grow-dates">
        <h2>{t.whenTitle}</h2>
        <ul className="grow-facts">
          {t.facts.map((fact, index) => {
            const Icon = factIcons[index]
            return <li key={fact.label}><i><Icon size={18} strokeWidth={1.8} /></i><span>{fact.label}</span></li>
          })}
        </ul>
        <div className="grow-signup">{signup}</div>
      </section>

      <SiteFooter />
    </main>
  )
}
