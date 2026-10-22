'use client'

import Link from 'next/link'
import { ArrowRight, CalendarDays, Globe2, Heart, Sparkles, Users } from 'lucide-react'
import { useLang } from '@/components/language'

const activities = [
  { slug: 'live-letters', accent: 'coral', image: '/images/live-letters-1.png', symbol: 'А', symbolEn: 'A', title: 'Живые буквы', titleEn: 'Live Letters', age: '4–5 лет', ageEn: '4–5 years', time: 'Понедельник · 18:00', timeEn: 'Monday · 18:00', description: 'Учим буквы играя и создаём свою азбуку — буква за буквой.', descriptionEn: 'We learn letters through play and make our own alphabet — letter by letter.' },
  { slug: 'grow', accent: 'sage', image: '/images/grow-1.png', symbol: '↗', symbolEn: '↗', title: 'Расти', titleEn: 'Grow', age: '5–8 лет', ageEn: '5–8 years', time: 'Среда · 17:45', timeEn: 'Wednesday · 17:45', description: 'Думаем, двигаемся и открываем новое через игру и маленькие открытия.', descriptionEn: 'We think, move, and discover something new through play and small discoveries.' },
  { slug: 'consonance', accent: 'lavender', image: '/images/consonance-1.png', symbol: '◌', symbolEn: '◌', title: 'Созвучие', titleEn: 'Consonance', age: 'от 2,5 лет', ageEn: 'from 2.5 years', time: 'Пятница · 17:00', timeEn: 'Friday · 17:00', description: 'Ритмы, движение, сенсорика и дыхание в мягком пространстве психолога.', descriptionEn: 'Rhythm, movement, sensory play, and breathing in a gentle psychologist’s space.' },
  { slug: 'animal-kingdom', accent: 'sun', image: '/images/animal-kingdom.png', symbol: '✦', symbolEn: '✦', title: 'Царство животных', titleEn: 'Animal Kingdom', age: '3–7 лет', ageEn: '3–7 years', time: 'Выходные · утром', timeEn: 'Weekends · morning', description: 'Читаем, играем и проживаем историю всем телом — вместе с родителями.', descriptionEn: 'We read, play, and live the story with our whole bodies — together with parents.' },
  { slug: 'storytelling', accent: 'coral', image: '/images/storytelling8.jpeg', symbol: '✧', symbolEn: '✧', title: 'Storytelling', titleEn: 'Storytelling', age: '2,5–8 лет', ageEn: '2.5–8 years', time: 'по афише', timeEn: 'see the poster', description: 'Читаем книгу, играем и проживаем историю вместе.', descriptionEn: 'We read a book, play, and live the story together.' },
]

const text = {
  ru: {
    eyebrow: 'Пространство для роста',
    titleA: 'Думаем.',
    titleB: 'Двигаемся.',
    titleC: 'Открываем',
    titleD: 'новое.',
    hero: 'Развивающие занятия для детей, где движение встречается с мышлением, а обучение превращается в увлекательную игру.',
    choose: 'Выбрать занятие',
    art: 'Иллюстрация детей, играющих и читающих',
    book: 'азбука',
    play: 'игра',
    noteA: 'маленькие',
    noteB: 'открытия',
    groups: 'Мини-группы',
    groupsB: 'до 8 детей',
    gentle: 'Бережный подход',
    gentleB: 'к каждому ребёнку',
    classes: 'Занятия',
    classesB: 'на русском языке',
    projects: 'Мои проекты',
    pickA: 'Выберите своё',
    pickB: 'приключение',
    pickText: 'Каждое занятие — это пространство, где ребёнок может быть собой, пробовать новое и расти в своём темпе.',
    more: 'Подробнее',
    about: 'Про пространство',
    aboutA: 'Здесь можно',
    aboutB: 'расти играя.',
    aboutText: 'Мы создаём занятия, которые помогают детям развивать речь, внимание, воображение, координацию и самостоятельность — легко, с интересом и удовольствием.',
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
    hero: 'Classes for children, where movement meets thinking and learning turns into play.',
    choose: 'Choose a class',
    art: 'Illustration of children playing and reading',
    book: 'alphabet',
    play: 'play',
    noteA: 'little',
    noteB: 'discoveries',
    groups: 'Small groups',
    groupsB: 'up to 8 children',
    gentle: 'A gentle approach',
    gentleB: 'for every child',
    classes: 'Classes',
    classesB: 'in Russian',
    projects: 'My projects',
    pickA: 'Choose your',
    pickB: 'adventure',
    pickText: 'Each class is a space where a child can be themselves, try something new, and grow at their own pace.',
    more: 'Details',
    about: 'About the space',
    aboutA: 'Here you can',
    aboutB: 'grow through play.',
    aboutText: 'We create classes that help children develop speech, attention, imagination, coordination, and independence — lightly, with interest and joy.',
    account: 'Parent account',
    tagline: 'Little discoveries every day.',
    online: 'Online',
    language: 'Russian / English',
  },
}

export default function Page() {
  const { lang } = useLang()
  const t = text[lang]
  const en = lang === 'en'

  return (
    <main className="site-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={15} /> {t.eyebrow}</p>
          <h1>{t.titleA}<br /><em>{t.titleB}</em><br />{t.titleC}<br />{t.titleD}</h1>
          <p className="hero-text">{t.hero}</p>
          <a href="#activities" className="primary-button">{t.choose} <ArrowRight size={17} /></a>
        </div>
        <div className="hero-art" aria-label={t.art}>
          <div className="hero-sun" /><div className="hero-blob blob-one" /><div className="hero-blob blob-two" />
          <div className="hero-card card-book"><span>{en ? 'A' : 'А'}</span><small>{t.book}</small></div>
          <div className="hero-card card-shape"><Heart size={27} fill="currentColor" /><small>{t.play}</small></div>
          <div className="hero-note">{t.noteA}<br /><strong>{t.noteB}</strong></div>
          <div className="hero-ground" />
        </div>
      </section>

      <section className="trust-row"><div><Users size={20} /><span>{t.groups}<br /><b>{t.groupsB}</b></span></div><div><Heart size={20} /><span>{t.gentle}<br /><b>{t.gentleB}</b></span></div><div><CalendarDays size={20} /><span>{t.classes}<br /><b>{t.classesB}</b></span></div></section>

      <section id="activities" className="activities-section">
        <div className="section-heading"><div><p className="eyebrow">{t.projects}</p><h2>{t.pickA}<br /><em>{t.pickB}</em></h2></div><p>{t.pickText}</p></div>
        <div className="activity-grid">{activities.map((item, index) => <Link href={`/activities/${item.slug}`} className={`activity-card ${item.accent}`} key={item.slug}><div className="activity-top"><span className="activity-index">0{index + 1}</span><span className="activity-age">{en ? item.ageEn : item.age}</span></div><div className="activity-photo"><img src={item.image} alt="" /></div><div className="activity-symbol">{en ? item.symbolEn : item.symbol}</div><h3>{en ? item.titleEn : item.title}</h3>{!en && item.titleEn !== item.title && <p className="activity-en">{item.titleEn}</p>}<p>{en ? item.descriptionEn : item.description}</p><span className="card-link">{t.more} <ArrowRight size={16} /></span></Link>)}</div>
      </section>

      <section id="about" className="about-section"><div className="about-stamp"><img src="/images/logo.png" alt="tutti-frutti" /></div><div><p className="eyebrow">{t.about}</p><h2>{t.aboutA}<br /><em>{t.aboutB}</em></h2><p>{t.aboutText}</p><Link href="/#activities" className="text-link" onClick={(event) => { event.preventDefault(); document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); history.pushState(null, '', '/#activities') }}>{t.account} <ArrowRight size={16} /></Link></div></section>
      <footer id="contact"><div><Link href="/" className="brand"><span className="brand-mark"><img src="/images/logo.png" alt="" /></span><span>tutti-frutti</span></Link><p>{t.tagline}</p></div><div className="footer-contact"><p>{t.online}</p><a href="mailto:tuttifruttiphiladelphia@gmail.com">tuttifruttiphiladelphia@gmail.com</a></div><div className="footer-language"><Globe2 size={16} /> {t.language}</div></footer>
    </main>
  )
}

export { activities }
