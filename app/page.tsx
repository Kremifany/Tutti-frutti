'use client'

import Link from 'next/link'
import { ArrowRight, Check, Globe2, Sparkles, Users } from 'lucide-react'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLang } from '@/components/language'
import { classes, isClassSlug } from '@/lib/classes'

const activities = [
  { slug: 'live-letters', accent: 'coral', image: '/images/live-letters-card.png', symbol: 'А', symbolEn: 'A', title: 'Живые буквы', titleEn: 'Live Letters', age: '4–5 лет', ageEn: '4–5 years', time: 'Понедельник · 18:00', timeEn: 'Monday · 18:00', description: 'Учим буквы играя и создаём свою азбуку — буква за буквой.', descriptionEn: 'We learn letters through play and make our own alphabet — letter by letter.' },
  { slug: 'grow', accent: 'sage', image: '/images/grow-1.png', symbol: '↗', symbolEn: '↗', title: 'Расти', titleEn: 'Grow', age: '5–8 лет', ageEn: '5–8 years', time: 'Среда · 17:45', timeEn: 'Wednesday · 17:45', description: 'Думаем, двигаемся и открываем новое через игру и маленькие открытия.', descriptionEn: 'We think, move, and discover something new through play and small discoveries.' },
  { slug: 'consonance', accent: 'lavender', image: '/images/consonance-1.png', symbol: '◌', symbolEn: '◌', title: 'Четыре стихии', titleEn: 'Four Elements', age: 'от 2,5 лет', ageEn: 'from 2.5 years', time: 'Пятница · 17:00', timeEn: 'Friday · 17:00', description: 'Ритмы, движение, сенсорика и дыхание в мягком пространстве психолога.', descriptionEn: 'Rhythm, movement, sensory play, and breathing in a gentle psychologist’s space.' },
  { slug: 'storytelling', accent: 'coral', image: '/images/storytelling8.jpeg', symbol: '✧', symbolEn: '✧', title: 'Storytelling', titleEn: 'Storytelling', age: '2,5–8 лет', ageEn: '2.5–8 years', time: 'по афише', timeEn: 'see the poster', description: 'Читаем книгу, играем и проживаем историю вместе.', descriptionEn: 'We read a book, play, and live the story together.' },
]

const text = {
  ru: {
    eyebrow: 'Пространство для роста',
    titleA: 'Думаем.',
    titleB: 'Двигаемся.',
    titleC: 'Открываем',
    titleD: 'новое.',
    hero: 'Творческие, развивающие и образовательные занятия на русском языке, где книги, музыка, движение и игра помогают детям открывать мир, узнавать себя и находить друзей.',
    choose: 'Выбрать занятие',
    art: 'Иллюстрация детей, играющих и читающих',
    book: 'азбука',
    play: 'игра',
    noteA: 'маленькие',
    noteB: 'открытия',
    advantageGroups: 'Небольшие группы',
    advantageLanguage: 'Занятия на русском языке',
    advantagePlay: 'Игра, движение и творчество на каждой встрече',
    projects: 'Мои проекты',
    pickA: 'Выберите своё',
    pickB: 'приключение',
    pickText: 'Каждое занятие — это пространство, где ребёнок может быть собой, пробовать новое и расти в своём темпе.',
    more: 'Подробнее',
    about: 'Про пространство',
    aboutA: 'Растём',
    aboutB: 'играя.',
    aboutParagraphs: [
      'В жизни современных детей много занятий, экранов и готовых ответов. А времени на игру — ту, где можно фантазировать, придумывать свои правила, пробовать и договариваться, — порой остаётся совсем немного. Но именно в игре ребёнок учится проявлять инициативу, справляться с трудностями, выражать свои чувства и понимать других.',
      'В Tutti-Frutti мы создаём пространство для таких открытий. Читаем книги и становимся участниками историй, слушаем музыку и создаём собственные ритмы, знакомимся с буквами, исследуем, двигаемся и творим. Здесь есть место любопытству, неожиданным вопросам и детским идеям.',
      'Особое внимание мы уделяем общению и эмпатии — способности замечать и понимать чувства другого человека. Эти навыки нужны каждому: чтобы дружить, договариваться, просить о помощи и поддерживать. Обсуждая поступки книжных героев и играя вместе, дети пробуют смотреть на ситуацию с разных сторон, слушать друг друга и находить общий язык.',
      'Каждая встреча объединяет обучение с живым опытом. Дети развивают речь, внимание, память, мышление и координацию, учатся создавать и действовать вместе. В небольшой группе мы можем уделить внимание каждому, поддержать его интерес и дать время освоиться.',
      'Нам важно, чтобы ребёнок уходил с радостью от собственных открытий и желанием попробовать ещё.',
    ],
    account: 'Личный кабинет родителей',
    tagline: 'Маленькие открытия каждый день.',
    online: 'Онлайн',
    language: 'Русский / English',
  },
  en: {
    eyebrow: 'A place to grow',
    titleA: 'Think.',
    titleB: 'Move.',
    titleC: 'Discover',
    titleD: 'something new.',
    hero: 'Creative, developmental, and educational classes in Russian, where books, music, movement, and play help children discover the world, learn about themselves, and find friends.',
    choose: 'Choose a class',
    art: 'Illustration of children playing and reading',
    book: 'alphabet',
    play: 'play',
    noteA: 'little',
    noteB: 'discoveries',
    advantageGroups: 'Small groups',
    advantageLanguage: 'Classes in Russian',
    advantagePlay: 'Play, movement, and making things at every meeting',
    projects: 'My projects',
    pickA: 'Choose your',
    pickB: 'adventure',
    pickText: 'Each class is a space where a child can be themselves, try something new, and grow at their own pace.',
    more: 'Details',
    about: 'About the space',
    aboutA: 'We grow',
    aboutB: 'through play.',
    aboutParagraphs: [
      'Modern childhood is full of activities, screens, and ready-made answers. There is often little time left for play where a child can imagine, invent their own rules, try things, and come to an agreement. Yet it is in play that a child learns to take initiative, handle difficulties, express feelings, and understand other people.',
      'At Tutti-Frutti we make room for those discoveries. We read books and step into the stories, listen to music and make our own rhythms, meet letters, explore, move, and create. There is space here for curiosity, unexpected questions, and children’s ideas.',
      'We pay special attention to communication and empathy — the ability to notice and understand another person’s feelings. Everyone needs these skills: to make friends, reach an agreement, ask for help, and offer support. Talking about what book characters do, and playing together, children try looking at a situation from different sides, listen to one another, and find a common language.',
      'Each meeting joins learning with lived experience. Children develop speech, attention, memory, thinking, and coordination, and they learn to create and act together. In a small group we can give attention to each child, support their interest, and give them time to settle in.',
      'We want each child to leave glad about their own discoveries and wanting to try again.',
    ],
    account: 'Parent account',
    tagline: 'Little discoveries every day.',
    online: 'Online',
    language: 'Russian / English',
  },
}

const heroes = {
  '1': {
    ru: {
      label: 'Вариант 1 · Тёплый',
      title: [{ text: 'Tutti-Frutti —', breakAfter: true }, { text: 'растём играя', em: true }],
      hero: 'Творческие и развивающие занятия на русском языке без экранов и скучных правил. Через книги, музыку, движение и живую игру помогаем детям открывать мир, понимать свои чувства и находить друзей.',
      cta: 'Записаться на пробное занятие',
      micro: 'Небольшие группы • Внимание каждому ребёнку',
    },
    en: {
      label: 'Option 1 · Warm',
      title: [{ text: 'Tutti-Frutti —', breakAfter: true }, { text: 'we grow through play', em: true }],
      hero: 'Creative and developmental classes in Russian, without screens or dull rules. Through books, music, movement, and live play, we help children discover the world, understand their feelings, and find friends.',
      cta: 'Sign up for a trial class',
      micro: 'Small groups • Attention for every child',
    },
  },
  '2': {
    ru: {
      label: 'Вариант 2 · Чёткий',
      title: [{ text: 'Развивающие занятия на русском языке, где обучение — ' }, { text: 'это игра', em: true }],
      hero: 'В Tutti-Frutti мы развиваем речь, мышление, координацию и эмпатию через живой опыт: читаем истории, создаём ритмы, знакомимся с буквами и учимся дружить в небольших группах.',
      cta: 'Выбрать группу и расписание',
      micro: 'Пространство для любопытства, творчества и радостных открытий',
      long: true,
    },
    en: {
      label: 'Option 2 · Clear',
      title: [{ text: 'Developmental classes in Russian, where learning ' }, { text: 'is play', em: true }],
      hero: 'At Tutti-Frutti we develop speech, thinking, coordination, and empathy through lived experience: we read stories, make rhythms, meet the letters, and learn to be friends in small groups.',
      cta: 'Choose a group and a schedule',
      micro: 'A place for curiosity, making things, and joyful discoveries',
      long: true,
    },
  },
  '3': {
    ru: {
      label: 'Вариант 3 · Короткий',
      title: [{ text: 'Растём, играем и открываем мир ' }, { text: 'на русском языке', em: true }],
      hero: 'Книги, музыка, движение и творчество в небольших группах — пространство, где каждый ребёнок учится фантазировать, договариваться и радоваться своим открытиям.',
      cta: 'Попробовать занятие',
      long: true,
    },
    en: {
      label: 'Option 3 · Short',
      title: [{ text: 'We grow, play, and discover the world ' }, { text: 'in Russian', em: true }],
      hero: 'Books, music, movement, and making things in small groups — a place where every child learns to imagine, to get along, and to enjoy their own discoveries.',
      cta: 'Try a class',
      long: true,
    },
  },
} as const

type HeroId = keyof typeof heroes

function isHeroId(value: string | null): value is HeroId {
  return value === '1' || value === '2' || value === '3'
}

function RegisterNotice() {
  const { lang } = useLang()
  const slug = useSearchParams().get('registered') || ''
  if (!isClassSlug(slug)) return null
  const name = classes[slug][lang]
  return (
    <p className="register-success" role="status">
      <Check size={18} />
      {lang === 'en' ? `Registration for ${name} was successful.` : `Запись на занятие «${name}» прошла успешно.`}
    </p>
  )
}

function Landing() {
  const { lang } = useLang()
  const t = text[lang]
  const en = lang === 'en'
  const requested = useSearchParams().get('variant')
  const variant: HeroId = isHeroId(requested) ? requested : '1'
  const hero = heroes[variant][lang]

  return (
    <main className="site-shell">
      <Suspense fallback={null}><RegisterNotice /></Suspense>
      <nav className="variant-bar" aria-label={en ? 'Landing page options' : 'Варианты главной'}>
        {(Object.keys(heroes) as HeroId[]).map((id) => (
          <Link key={id} href={id === '1' ? '/' : `/?variant=${id}`} className={id === variant ? 'is-on' : ''} aria-current={id === variant ? 'page' : undefined}>{heroes[id][lang].label}</Link>
        ))}
      </nav>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={15} /> {t.eyebrow}</p>
          <h1 className={'long' in hero && hero.long ? 'hero-title is-long' : 'hero-title'}>{hero.title.map((part) => <span key={part.text}>{'em' in part && part.em ? <em>{part.text}</em> : part.text}{'breakAfter' in part && part.breakAfter ? <br /> : null}</span>)}</h1>
          <p className="hero-text">{hero.hero}</p>
          <a href="#activities" className="primary-button">{hero.cta} <ArrowRight size={17} /></a>
          {'micro' in hero && hero.micro ? <p className="hero-micro">{hero.micro}</p> : null}
        </div>
        <div className="hero-mark">
          <img src="/images/hero-mark.png" alt={en ? 'Tutti Frutti, a creative space for children' : 'Tutti Frutti, творческое пространство для детей'} />
        </div>
      </section>

      <section className="trust-row" aria-label={en ? 'Our advantages' : 'Наши преимущества'}><div><Users size={20} /><span>{t.advantageGroups}</span></div><div><Globe2 size={20} /><span>{t.advantageLanguage}</span></div><div><Sparkles size={20} /><span>{t.advantagePlay}</span></div></section>

      <section id="activities" className="activities-section">
        <div className="section-heading"><div><p className="eyebrow">{t.projects}</p><h2>{t.pickA}<br /><em>{t.pickB}</em></h2></div><p>{t.pickText}</p></div>
        <div className="activity-grid">{activities.map((item, index) => <Link href={`/activities/${item.slug}`} className={`activity-card ${item.accent}${item.slug === 'live-letters' ? ' is-centered' : ''}`} key={item.slug}><div className="activity-top"><span className="activity-index">0{index + 1}</span><span className="activity-age">{en ? item.ageEn : item.age}</span></div><div className="activity-photo"><img src={item.image} alt="" /></div><div className="activity-symbol">{en ? item.symbolEn : item.symbol}</div><h3>{en ? item.titleEn : item.title}</h3>{!en && item.titleEn !== item.title && <p className="activity-en">{item.titleEn}</p>}<p>{en ? item.descriptionEn : item.description}</p><span className="card-link">{t.more} <ArrowRight size={16} /></span></Link>)}</div>
      </section>

      <section id="about" className="about-section"><div className="about-stamp"><img src="/images/logo.png" alt="tutti-frutti" /></div><div><p className="eyebrow">{t.about}</p><h2>{t.aboutA}<br /><em>{t.aboutB}</em></h2><div className="about-story">{t.aboutParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><Link href="/#activities" className="text-link" onClick={(event) => { event.preventDefault(); document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); history.pushState(null, '', '/#activities') }}>{t.account} <ArrowRight size={16} /></Link></div></section>
      <footer id="contact"><div><Link href="/" className="brand"><span className="brand-mark"><img src="/images/logo.png" alt="" /></span><span>tutti-frutti</span></Link><p>{t.tagline}</p></div><div className="footer-contact"><p>{t.online}</p><a href="mailto:tuttifruttiphiladelphia@gmail.com">tuttifruttiphiladelphia@gmail.com</a></div><div className="footer-language"><Globe2 size={16} /> {t.language}</div></footer>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Landing />
    </Suspense>
  )
}

export { activities }
