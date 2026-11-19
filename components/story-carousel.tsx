'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

export type StorySlide = {
  id: string
  src: string
  until: string
  ru: string
  en: string
}

function stillAhead(until: string) {
  return new Date(`${until}T23:59:59`).getTime() > Date.now()
}

export function StoryCarousel({
  slides,
  lang,
  index,
  onIndex,
  empty,
}: {
  slides: StorySlide[]
  lang: 'ru' | 'en'
  index: number
  onIndex: (index: number) => void
  empty: string
}) {
  if (!slides.length) {
    return (
      <section className="story-carousel">
        <p className="form-lead date-offers-empty story-carousel-empty">{empty}</p>
      </section>
    )
  }

  const slide = slides[index] ?? slides[0]
  const future = stillAhead(slide.until.slice(0, 10))
  const text = lang === 'en'
    ? { past: 'This class has already happened', prev: 'Previous poster', next: 'Next poster' }
    : { past: 'Это занятие уже прошло', prev: 'Предыдущая афиша', next: 'Следующая афиша' }
  const go = (delta: number) => onIndex((index + delta + slides.length) % slides.length)

  return (
    <section className="story-carousel" aria-roledescription="carousel">
      <div className="story-carousel-frame">
        <img src={slide.src} alt={slide[lang]} />
        {slides.length > 1 && <>
          <button type="button" className="story-carousel-nav prev" aria-label={text.prev} onClick={() => go(-1)}><ChevronLeft size={20} /></button>
          <button type="button" className="story-carousel-nav next" aria-label={text.next} onClick={() => go(1)}><ChevronRight size={20} /></button>
        </>}
      </div>
      <div className="story-carousel-foot">
        {slides.length > 1 && (
          <div className="story-dots" role="tablist">
            {slides.map((item, dot) => (
              <button key={item.id} type="button" className={dot === index ? 'is-on' : ''} aria-label={item[lang]} aria-current={dot === index} onClick={() => onIndex(dot)} />
            ))}
          </div>
        )}
        {!future && <p className="story-past">{text.past}</p>}
      </div>
    </section>
  )
}

export function firstFutureStoryIndex(slides: StorySlide[]) {
  const index = slides.findIndex((slide) => stillAhead(slide.until.slice(0, 10)))
  return index < 0 ? 0 : index
}
