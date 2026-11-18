'use client'

import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLang } from '@/components/language'
import { SiteFooter } from '@/components/site-footer'
import { authClient } from '@/lib/auth-client'
import { classes, isClassSlug } from '@/lib/classes'

const activities = [
  { slug: 'live-letters', accent: 'sage', image: '/images/home/icon-letters.jpg', symbol: 'А', symbolEn: 'A', title: 'Живые буквы', titleEn: 'Live Letters', age: '4–5 лет', ageEn: '4–5 years', time: 'Понедельник · 18:00', timeEn: 'Monday · 18:00', description: 'Играем, читаем, сочиняем и знакомимся с буквами в увлекательной форме.', descriptionEn: 'We play, read, make up stories, and meet the letters in a playful way.' },
  { slug: 'grow', accent: 'sun', image: '/images/home/icon-grow.jpg', symbol: '↗', symbolEn: '↗', title: 'Расти', titleEn: 'Grow', age: '5–8 лет', ageEn: '5–8 years', time: 'Среда · 17:45', timeEn: 'Wednesday · 17:45', description: 'Развиваем мышление, эмоциональный интеллект и социальные навыки через игру и творчество.', descriptionEn: 'We grow thinking, emotional intelligence, and social skills through play and making things.' },
  { slug: 'consonance', accent: 'lavender', image: '/images/home/icon-sound.jpg', symbol: '◌', symbolEn: '◌', title: 'Созвучие', titleEn: 'Consonance', age: 'от 2,5 лет', ageEn: 'from 2.5 years', time: 'Пятница · 17:00', timeEn: 'Friday · 17:00', description: 'Слушаем музыку, создаём собственные ритмы, двигаемся и выражаем себя.', descriptionEn: 'We listen to music, make our own rhythms, move, and express ourselves.' },
  { slug: 'storytelling', accent: 'coral', image: '/images/home/icon-book.jpg', symbol: '✧', symbolEn: '✧', title: 'Интерактивные чтения', titleEn: 'Interactive reading', age: '2,5–8 лет', ageEn: '2.5–8 years', time: 'по афише', timeEn: 'see the poster', description: 'Читаем, обсуждаем, задаём вопросы и становимся участниками историй.', descriptionEn: 'We read, talk, ask questions, and step into the stories.' },
]

const text = {
  ru: {
    title: 'Думаем. Двигаемся. Открываем новое.',
    kicker: 'Творческие, развивающие и образовательные занятия на русском языке',
    hero: 'Книги, музыка, движение и игра помогают детям открывать мир, узнавать себя и находить друзей.',
    choose: 'Выбрать занятие',
    heroAlt: 'Педагог читает детям, рядом занятие с поделками',
    playTitle: 'Детству нужно время для игры',
    play: [
      'В жизни современных детей много занятий, экранов и готовых ответов. А времени на игру, где можно фантазировать, придумывать свои правила, пробовать и договариваться, порой остаётся совсем немного.',
      'В игре ребёнок учится проявлять инициативу, справляться с трудностями, выражать свои чувства и понимать других.',
    ],
    playAlt: 'Дети играют с балансиром и тоннелем',
    feelTitle: 'Учимся чувствовать и понимать',
    feel: 'Эмпатия нужна каждому: чтобы дружить, договариваться, просить о помощи и поддерживать. Обсуждая поступки книжных героев и играя вместе, дети учатся слушать друг друга и смотреть на ситуацию с разных сторон.',
    feelAlt: 'Дети и педагог мастерят вместе',
    worldTitle: 'Открываем мир вместе',
    world: 'Читаем книги и становимся участниками историй, слушаем музыку и создаём собственные ритмы, знакомимся с буквами, исследуем, двигаемся и творим. Здесь есть место любопытству, неожиданным вопросам и детским идеям.',
    worldAlt: 'Открытая книга, синяя птица и замок',
    valuesLabel: 'Как проходят занятия',
    values: [
      { title: 'Небольшие группы', text: 'Уютная атмосфера и больше возможностей для общения и участия каждого ребёнка.' },
      { title: 'Внимание каждому', text: 'Учитываем возраст, интересы и особенности детей, поддерживаем их инициативу.' },
      { title: 'Живой опыт', text: 'Настоящие книги, музыка, движение, творчество и свободная игра — вместо готовых ответов.' },
    ],
    quote: 'Радость открытий. Смелость пробовать. Желание узнавать.',
    pick: 'Выберите своё приключение',
    tagline: 'Маленькие открытия каждый день.',
    language: 'Русский / English',
  },
  en: {
    title: 'Think. Move. Discover something new.',
    kicker: 'Creative, developmental, and educational classes in Russian',
    hero: 'Books, music, movement, and play help children discover the world, learn about themselves, and find friends.',
    choose: 'Choose a class',
    heroAlt: 'A teacher reading to children, with a craft circle beside them',
    playTitle: 'Childhood needs time for play',
    play: [
      'Modern childhood is full of activities, screens, and ready-made answers. There is often little time left for play where a child can imagine, invent their own rules, try things, and come to an agreement.',
      'It is in play that a child learns to take initiative, handle difficulties, express feelings, and understand other people.',
    ],
    playAlt: 'Children playing with a balance beam and a tunnel',
    feelTitle: 'Learning to feel and understand',
    feel: 'Everyone needs empathy: to make friends, reach an agreement, ask for help, and offer support. Talking about what book characters do, and playing together, children learn to listen to one another and see a situation from different sides.',
    feelAlt: 'Children and a teacher making something together',
    worldTitle: 'Discovering the world together',
    world: 'We read books and step into the stories, listen to music and make our own rhythms, meet the letters, explore, move, and create. There is room here for curiosity, unexpected questions, and children’s ideas.',
    worldAlt: 'An open book, a blue bird, and a castle',
    valuesLabel: 'How the classes feel',
    values: [
      { title: 'Small groups', text: 'A cozy atmosphere, and more room for each child to talk and take part.' },
      { title: 'Attention for each child', text: 'We take age, interests, and each child’s way of being into account, and we support their initiative.' },
      { title: 'Lived experience', text: 'Real books, music, movement, making things, and free play — instead of ready-made answers.' },
    ],
    quote: 'The joy of discovery. The courage to try. The wish to learn.',
    pick: 'Choose your adventure',
    tagline: 'Little discoveries every day.',
    language: 'Russian / English',
  },
}

const valueIcons = ['/images/home/icon-groups.png', '/images/home/icon-heart.png', '/images/home/icon-sprout.png']

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
  const params = useSearchParams()
  const { data: session, isPending } = authClient.useSession()
  const signedIn = !isPending && !!session

  useEffect(() => {
    if (params.get('choose') !== '1') return
    document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [params])

  const choose = signedIn
    ? <a href="#activities" className="primary-button">{t.choose} <ArrowRight size={17} /></a>
    : <Link href="/register" className="primary-button">{t.choose} <ArrowRight size={17} /></Link>

  return (
    <main className="home">
      <Suspense fallback={null}><RegisterNotice /></Suspense>
      <section className="home-hero">
        <div className="home-hero-copy">
          <h1>{t.title}</h1>
          <p className="home-kicker">{t.kicker}</p>
          <p className="home-lead">{t.hero}</p>
          {choose}
        </div>
        <div className="home-hero-art" role="img" aria-label={t.heroAlt}>
          <img src="/images/home/read.jpg" alt="" />
          <img src="/images/home/craft.jpg" alt="" />
        </div>
      </section>

      <section id="about" className="home-split">
        <div>
          <h2>{t.playTitle}</h2>
          {t.play.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <img className="home-play" src="/images/home/play-photo.jpg" alt={t.playAlt} />
      </section>

      <section className="home-panel">
        <div className="home-split">
          <img className="home-feel" src="/images/home/feel-frame.jpg" alt={t.feelAlt} />
          <div>
            <h2>{t.feelTitle}</h2>
            <p>{t.feel}</p>
          </div>
        </div>
      </section>

      <section className="home-world">
        <div>
          <h2>{t.worldTitle}</h2>
          <p>{t.world}</p>
        </div>
        <img src="/images/home/story-art.png" alt={t.worldAlt} />
      </section>

      <section className="home-values" aria-label={t.valuesLabel}>
        {t.values.map((item, index) => (
            <article key={item.title}>
              <img src={valueIcons[index]} alt="" />
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
        ))}
      </section>

      <p className="home-quote">{t.quote}</p>

      <section id="projects" className="home-pick">
        <h2 id="activities">{t.pick}</h2>
        <div className="home-cards">
          {activities.map((item) => (
            <Link href={`/activities/${item.slug}`} className={`home-card ${item.accent}`} key={item.slug}>
              <img src={item.image} alt="" />
              <span>
                <strong>{en ? item.titleEn : item.title}</strong>
                <em>{en ? item.descriptionEn : item.description}</em>
              </span>
              <i aria-hidden="true"><ArrowRight size={16} /></i>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
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
