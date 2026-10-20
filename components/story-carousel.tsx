'use client'

import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  { src: '/images/storytelling1.jpeg', until: '2026-01-18', ru: 'Дерево желаний, 18 января', en: 'The Wishing Tree, January 18' },
  { src: '/images/storytelling2.jpeg', until: '2026-02-01', ru: 'Человеткин, 1 февраля', en: 'Stick Man, February 1' },
  { src: '/images/storytelling3.jpeg', until: '2026-03-07', ru: 'Тося-Бося, 7 марта', en: 'Tosya-Bosya, March 7' },
  { src: '/images/storytelling4.jpeg', until: '2026-05-30', ru: 'Мими балерина, 17 и 30 мая', en: 'Mimi the ballerina, May 17 and 30' },
  { src: '/images/storytelling-2.png', until: '2026-06-21', ru: 'Петсон идёт в поход, 20 и 21 июня', en: 'Findus goes camping, June 20 and 21' },
  { src: '/images/storytelling5.jpeg', until: '2026-06-28', ru: 'Петсон идёт в поход, 20 и 28 июня', en: 'Findus goes camping, June 20 and 28' },
  { src: '/images/storytelling6.jpeg', until: '2026-08-08', ru: 'Школа драконов, июль и август', en: 'Dragon school, July and August' },
  { src: '/images/storytelling7.jpeg', until: '2026-10-11', ru: 'Элмер, 10 и 11 октября', en: 'Elmer, October 10 and 11' },
  { src: '/images/storytelling8.jpeg', until: '2026-10-31', ru: 'Ведьмина метла, 31 октября', en: 'The witch’s broom, October 31' },
]

function stillAhead(until: string) {
  return new Date(`${until}T23:59:59`).getTime() > Date.now()
}

export function StoryCarousel({ href, lang, index, onIndex }: { href: string; lang: 'ru' | 'en'; index: number; onIndex: (index: number) => void }) {
  const slide = slides[index] ?? slides[0]
  const future = stillAhead(slide.until)
  const text = lang === 'en'
    ? { reserve: 'Reserve a place', past: 'This class has already happened', prev: 'Previous poster', next: 'Next poster' }
    : { reserve: 'Забронировать место', past: 'Это занятие уже прошло', prev: 'Предыдущая афиша', next: 'Следующая афиша' }
  const go = (delta: number) => onIndex((index + delta + slides.length) % slides.length)

  return (
    <section className="story-carousel" aria-roledescription="carousel">
      <div className="story-carousel-frame">
        <img src={slide.src} alt={slide[lang]} />
        <button type="button" className="story-carousel-nav prev" aria-label={text.prev} onClick={() => go(-1)}><ChevronLeft size={20} /></button>
        <button type="button" className="story-carousel-nav next" aria-label={text.next} onClick={() => go(1)}><ChevronRight size={20} /></button>
      </div>
      <div className="story-carousel-foot">
        <div className="story-dots" role="tablist">
          {slides.map((item, dot) => <button key={item.src} type="button" className={dot === index ? 'is-on' : ''} aria-label={item[lang]} aria-current={dot === index} onClick={() => onIndex(dot)} />)}
        </div>
        {future ? <Link className="primary-button" href={href}>{text.reserve} <ArrowRight size={17} /></Link> : <p className="story-past">{text.past}</p>}
      </div>
    </section>
  )
}

export function firstFutureStoryIndex() {
  const index = slides.findIndex((slide) => stillAhead(slide.until))
  return index < 0 ? 0 : index
}
