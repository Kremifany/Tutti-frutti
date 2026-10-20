'use client'

import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'
import { ScrollToTop } from '@/components/scroll-to-top'
import { StoryCarousel, firstFutureStoryIndex } from '@/components/story-carousel'
import { useLang } from '@/components/language'
import { authClient } from '@/lib/auth-client'
import { checkoutPath, isClassSlug } from '@/lib/classes'

const data = {
  'live-letters': {
    accent: 'coral',
    image: '/images/live-letters-3.png',
    ru: {
      en: 'Live Letters',
      title: 'Живые буквы',
      intro: 'Учим буквы играя — и создаём коллаж по каждой букве. В конце года у каждого ребёнка появляется своя настоящая азбука.',
      alt: 'Что такое живые буквы — программа занятия',
      section: 'На занятиях',
      headingA: 'Растём через',
      headingB: 'любопытство.',
      button: 'Записать ребёнка',
      bullets: ['Знакомимся с буквами через игру', 'Создаём коллаж и развиваем мелкую моторику', 'Собираем личную азбуку весь год'],
    },
    en: {
      en: 'Live Letters',
      title: 'Live Letters',
      intro: 'We learn letters through play and make a collage for each letter. By the end of the year, every child has their own real alphabet.',
      alt: 'What Live Letters is — the class program',
      section: 'In class',
      headingA: 'We grow through',
      headingB: 'curiosity.',
      button: 'Enroll a child',
      bullets: ['Meet letters through play', 'Make collages and build fine motor skills', 'Collect a personal alphabet all year'],
    },
  },
  grow: {
    accent: 'sage',
    image: '/images/grow-3-page.png',
    ru: {
      en: 'Grow',
      title: 'Расти',
      intro: 'Программа комплексного развития, где движение встречается с мышлением, а обучение превращается в увлекательную игру.',
      alt: 'Расти — программа системного развития для детей 5–8 лет',
      section: 'На занятиях',
      headingA: 'Растём через',
      headingB: 'любопытство.',
      button: 'Записать ребёнка',
      bullets: ['Развиваем внимание, память и логику', 'Тренируем координацию и крупную моторику', 'Играем с числами и русской речью', 'Учимся находить нестандартные решения'],
    },
    en: {
      en: 'Grow',
      title: 'Grow',
      intro: 'A whole-child program where movement meets thinking, and learning turns into play.',
      alt: 'Grow — a whole-child program for ages 5–8',
      section: 'In class',
      headingA: 'We grow through',
      headingB: 'curiosity.',
      button: 'Enroll a child',
      bullets: ['Build attention, memory, and logic', 'Practice coordination and gross motor skills', 'Play with numbers and Russian speech', 'Find unexpected solutions'],
    },
  },
  consonance: {
    accent: 'lavender',
    image: '/images/consonance-3.png',
    ru: {
      en: 'Consonance',
      title: 'Созвучие',
      intro: 'Мягкое развивающее пространство в кабинете психолога: движение, ритмы, сенсорика, дыхание и расслабление на аэрогамаках.',
      alt: 'Созвучие — слышу мир: музыка, движение и ощущения',
      section: 'На занятиях',
      headingA: 'Растём через',
      headingB: 'любопытство.',
      button: 'Записать ребёнка',
      bullets: ['Крупная моторика и ритмы', 'Сенсорные игры и дыхательные практики', 'Расслабление и бережное общение'],
    },
    en: {
      en: 'Consonance',
      title: 'Consonance',
      intro: 'A gentle space in a psychologist’s room: movement, rhythm, sensory play, breathing, and rest in aerial hammocks.',
      alt: 'Consonance — I hear the world: music, movement, and sensation',
      section: 'In class',
      headingA: 'We grow through',
      headingB: 'curiosity.',
      button: 'Enroll a child',
      bullets: ['Gross motor skills and rhythm', 'Sensory games and breathing', 'Rest and gentle connection'],
    },
  },
  'animal-kingdom': {
    accent: 'sun',
    image: '/images/animal-kingdom.png',
    ru: {
      en: 'Animal kingdom',
      title: 'Царство животных',
      intro: 'Читаем, играем и проживаем историю всем телом — вместе с родителями.',
      alt: 'Царство животных — читаем, играем и проживаем историю',
      section: 'На занятиях',
      headingA: 'Живём историю',
      headingB: 'всем телом.',
      button: 'Записать ребёнка',
      bullets: ['Каждую встречу читаем новую историю', 'Играем и проживаем её движением и театрализацией', 'После занятия — свободная игра вместе с родителями'],
    },
    en: {
      en: 'Animal Kingdom',
      title: 'Animal Kingdom',
      intro: 'We read, play, and live the story with our whole bodies — together with parents.',
      alt: 'Animal Kingdom — we read, play, and live the story',
      section: 'In class',
      headingA: 'We live the story',
      headingB: 'with our whole bodies.',
      button: 'Enroll a child',
      bullets: ['Each meeting we read a new story', 'We play it out through movement and theater', 'Free play with parents afterward'],
    },
  },
  storytelling: {
    accent: 'sun',
    image: '',
    ru: {
      en: 'Storytelling',
      title: 'Интерактивный сторителлинг',
      intro: 'Через чтение книги играем, развивая внимание, крупную моторику, эмоции и воображение. Добавляем театрализацию, свободную игру и общение для родителей.',
      alt: '',
      section: 'На занятиях',
      headingA: 'Растём через',
      headingB: 'любопытство.',
      button: 'Записать ребёнка',
      bullets: ['Каждую встречу — новая книга', 'Элементы театрализации и игры', 'Свободная игра после занятия'],
    },
    en: {
      en: 'Storytelling',
      title: 'Interactive Storytelling',
      intro: 'Through reading a book we play, building attention, gross motor skills, emotions, and imagination. We add theater, free play, and time for parents.',
      alt: '',
      section: 'In class',
      headingA: 'We grow through',
      headingB: 'curiosity.',
      button: 'Enroll a child',
      bullets: ['A new book each meeting', 'Theater and play', 'Free play after class'],
    },
  },
} as const

export function ActivityDetail({ slug }: { slug: string }) {
  const { lang } = useLang()
  const { data: session } = authClient.useSession()
  const item = data[slug as keyof typeof data] ?? data.grow
  const copy = item[lang]
  const story = slug === 'storytelling'
  const [storyIndex, setStoryIndex] = useState(firstFutureStoryIndex)
  const register = isClassSlug(slug) ? checkoutPath(slug) : '/#activities'
  const href = session || !isClassSlug(slug) ? register : `/sign-in?next=${encodeURIComponent(register)}`
  const label = lang === 'en' ? 'To register' : 'Записаться'

  return (
    <main className="detail-page">
      <ScrollToTop />
      {story ? <StoryCarousel href={href} lang={lang} index={storyIndex} onIndex={setStoryIndex} /> : item.image && <section className="detail-feature-image is-lead"><img src={item.image} alt={copy.alt} /></section>}
      <section className="detail-heading">
        <p className="eyebrow">{copy.en}</p>
        <h1>{copy.title}</h1>
        <p className="detail-intro">{copy.intro}</p>
        {!story && <Link className="primary-button" href={href}>{label} <ArrowRight size={17} /></Link>}
      </section>
      <section className="detail-content">
        <div><p className="eyebrow">{copy.section}</p><h2>{copy.headingA}<br /><em>{copy.headingB}</em></h2></div>
        <ul>{copy.bullets.map((bullet) => <li key={bullet}><Check size={18} /> {bullet}</li>)}</ul>
      </section>
    </main>
  )
}
