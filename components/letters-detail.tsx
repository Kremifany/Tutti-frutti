import Link from 'next/link'
import { ArrowRight, BookOpen, Brain, Calendar, Check, Clock, Hand, Heart, Lightbulb, MapPin, MessageCircle, PersonStanding, Scissors, Users, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { ScrollToTop } from '@/components/scroll-to-top'
import { SiteFooter } from '@/components/site-footer'

const copy = {
  ru: {
    crumb: 'Главная',
    badge: 'Книжный клуб • 4–5 лет',
    title: 'Живые буквы',
    lead: 'Читаем, играем, двигаемся и творим. Знакомимся с буквами через увлекательные истории и собственные открытия. На каждой встрече создаём новую страницу своей рукотворной азбуки.',
    button: 'Записаться на занятие',
    artAlt: 'Живые буквы',
    howTitle: 'Как оживают буквы',
    how: [
      { title: 'Читаем и обсуждаем', text: 'Знакомимся с героями книг и стихов, делимся мыслями и задаём вопросы.' },
      { title: 'Слушаем и говорим', text: 'Играем со звуками и словами, замечаем знакомые буквы.' },
      { title: 'Двигаемся и играем', text: 'Разыгрываем истории и отправляемся в маленькие приключения.' },
      { title: 'Создаём своими руками', text: 'Делаем коллажи и исследуем разные материалы.' },
    ],
    playAlt: 'Дети держат буквы из синельной проволоки',
    reachAlt: 'Дети тянутся к букве на стене',
    craftTitle: 'Азбука, которую ребёнок создаёт сам',
    craft: 'На каждом занятии дети создают коллаж, посвящённый букве. Постепенно отдельные работы складываются в собственную азбуку — с любимыми героями, необычными материалами и воспоминаниями о наших встречах. Рассматривая её дома, вспоминаем истории и рассказываем о своих открытиях близким.',
    craftAlt: 'Руки скручивают букву из оранжевой проволоки',
    bookTitle: 'Книга — начало приключения',
    book: 'Читаем вместе, разыгрываем сюжеты и пробуем понять героев. Учимся слушать друг друга, рассказывать и фантазировать.',
    bookAlt: 'Педагог читает книгу детям на ковре',
    givesTitle: 'Что даёт каждое занятие',
    gives: [
      { title: 'Речь', text: 'Обсуждаем прочитанное и придумываем истории.' },
      { title: 'Внимание', text: 'Слушаем задания и замечаем детали.' },
      { title: 'Воображение', text: 'Перевоплощаемся и ищем необычные решения.' },
      { title: 'Мелкая моторика', text: 'Приклеиваем, лепим и соединяем детали.' },
      { title: 'Знакомство с буквами', text: 'Связываем звук, образ буквы и игровой опыт.' },
      { title: 'Общение', text: 'Слушаем друг друга и действуем вместе.' },
    ],
    whenTitle: 'Когда и где',
    facts: [
      { label: 'Возраст: 4–5 лет' },
      { label: 'Продолжительность: 45–55 минут' },
      { label: 'По понедельникам, в 18:00' },
      { label: '200 Geiger Rd, Philadelphia, PA' },
    ],
    faqTitle: 'Вопросы родителей',
    faq: [
      { q: 'Нужно ли уже знать буквы?', a: 'Нет, предварительная подготовка не нужна. Знакомиться с буквами будем вместе на занятиях.' },
      { q: 'Можно ли прийти на одну встречу?', a: 'Да! Можно посетить одно занятие вместе с родителем, познакомиться со мной и попробовать наш формат.' },
    ],
    success: 'Запись на занятие «Живые буквы» прошла успешно.',
  },
  en: {
    crumb: 'Home',
    badge: 'Book club • ages 4–5',
    title: 'Live Letters',
    lead: 'We read, play, move, and make things. We meet letters through captivating stories and our own discoveries. At every meeting we make a new page of a handmade alphabet.',
    button: 'Sign up for a class',
    artAlt: 'Live Letters',
    howTitle: 'How letters come alive',
    how: [
      { title: 'We read and talk', text: 'We meet the heroes of books and poems, share thoughts, and ask questions.' },
      { title: 'We listen and speak', text: 'We play with sounds and words, and notice letters we know.' },
      { title: 'We move and play', text: 'We act out stories and set off on little adventures.' },
      { title: 'We make things by hand', text: 'We make collages and explore different materials.' },
    ],
    playAlt: 'Children holding pipe-cleaner letters',
    reachAlt: 'Children reaching for a letter on the wall',
    craftTitle: 'An alphabet the child makes',
    craft: 'At every class the children make a collage for one letter. Little by little those pieces become their own alphabet — with favorite heroes, unusual materials, and memories of our meetings. Looking at it at home, we remember the stories and tell the people close to us about our discoveries.',
    craftAlt: 'Hands shaping a letter from orange pipe cleaner',
    bookTitle: 'A book starts the adventure',
    book: 'We read together, act out the story, and try to understand the characters. We learn to listen to one another, tell stories, and imagine.',
    bookAlt: 'A teacher reading a book to children on the rug',
    givesTitle: 'What each class gives',
    gives: [
      { title: 'Speech', text: 'We talk about what we read and make up stories.' },
      { title: 'Attention', text: 'We listen to the task and notice details.' },
      { title: 'Imagination', text: 'We step into a role and look for unusual solutions.' },
      { title: 'Fine motor skills', text: 'We glue, shape, and join the pieces.' },
      { title: 'Meeting letters', text: 'We connect the sound, the shape of the letter, and play.' },
      { title: 'Connection', text: 'We listen to one another and act together.' },
    ],
    whenTitle: 'When and where',
    facts: [
      { label: 'Age: 4–5 years' },
      { label: 'Length: 45–55 minutes' },
      { label: 'Mondays at 6:00 pm' },
      { label: '200 Geiger Rd, Philadelphia, PA' },
    ],
    faqTitle: 'Questions from parents',
    faq: [
      { q: 'Does my child already need to know the letters?', a: 'No. No preparation is needed. We will meet the letters together in class.' },
      { q: 'Can we come for just one class?', a: 'Yes. You can come to one class with a parent, meet me, and try our way of working.' },
    ],
    success: 'Registration for Live Letters was successful.',
  },
} as const

const howIcons: LucideIcon[] = [BookOpen, MessageCircle, PersonStanding, Scissors]
const howTones = ['peach', 'sage', 'sun', 'coral'] as const
const giveIcons: Array<LucideIcon | 'abc'> = [Heart, Brain, Lightbulb, Hand, 'abc', Users]
const giveTones = ['peach', 'coral', 'sun', 'peach', 'sage', 'sage'] as const
const factIcons: LucideIcon[] = [Users, Clock, Calendar, MapPin]

function Sprig({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 58c0-16 2-28 14-40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M34 46c-8-2-14-8-16-16 8 1 14 6 16 16zM36 36c8-1 14-6 16-14-8 0-14 5-16 14zM33 26c-7-1-12-6-13-13 7 0 12 5 13 13z" fill="currentColor" />
    </svg>
  )
}

function Mark({ icon }: { icon: LucideIcon | 'abc' }) {
  if (icon === 'abc') return <span className="letters-abc">Абв</span>
  const Icon = icon
  return <Icon size={20} strokeWidth={1.8} />
}

export function LettersDetail({ lang, justRegistered, signup }: { lang: 'ru' | 'en'; justRegistered: boolean; signup: ReactNode }) {
  const t = copy[lang]
  return (
    <main className="letters-page">
      <ScrollToTop />
      {justRegistered && <p className="register-success letters-success" role="status"><Check size={18} />{t.success}</p>}
      <p className="letters-crumb"><Link href="/">{t.crumb}</Link> / {t.title}</p>

      <section className="letters-hero">
        <div>
          <p className="letters-badge"><BookOpen size={15} /> {t.badge}</p>
          <h1>{t.title}</h1>
          <p className="letters-lead">{t.lead}</p>
          <a className="primary-button" href="#letters-dates">{t.button} <ArrowRight size={17} /></a>
        </div>
        <div className="letters-hero-art">
          <img src={lang === 'en' ? '/images/live-letters%20on%20main%20page%20picture.jfif' : '/images/live-letters%20on%20main%20page%20picture2.jfif'} alt={t.artAlt} />
        </div>
      </section>

      <section className="letters-how">
        <h2>{t.howTitle}</h2>
        <div className="letters-cards">
          {t.how.map((item, index) => (
            <article className={`letters-card ${howTones[index]}`} key={item.title}>
              <i><Mark icon={howIcons[index]} /></i>
              <div>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="letters-gallery">
          <figure><img src="/images/live%20letters2.jpeg" alt={t.playAlt} /></figure>
          <figure className="reach"><img src="/images/live_letters_4.jpeg" alt={t.reachAlt} /></figure>
        </div>
      </section>

      <section className="letters-split craft">
        <div>
          <h2>{t.craftTitle}</h2>
          <p>{t.craft}</p>
        </div>
        <img src="/images/live_letters_3.jpeg" alt={t.craftAlt} />
      </section>

      <section className="letters-split book">
        <Sprig className="letters-sprig letters-sprig-b" />
        <div>
          <h2>{t.bookTitle}</h2>
          <p>{t.book}</p>
        </div>
        <img src="/images/live%20letters1.jpeg" alt={t.bookAlt} />
      </section>

      <section className="letters-gives">
        <h2>{t.givesTitle}</h2>
        <div>
          {t.gives.map((item, index) => (
            <article className={`letters-give ${giveTones[index]}`} key={item.title}>
              <i><Mark icon={giveIcons[index]} /></i>
              <div>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="letters-when" id="letters-dates">
        <h2>{t.whenTitle}</h2>
        <ul className="letters-facts">
          {t.facts.map((fact, index) => {
            const Icon = factIcons[index]
            return <li key={fact.label}><i><Icon size={18} strokeWidth={1.8} /></i><span>{fact.label}</span></li>
          })}
        </ul>
        <div className="letters-signup">{signup}</div>
      </section>

      <section className="letters-faq">
        <h2>{t.faqTitle}</h2>
        <div>
          {t.faq.map((item) => (
            <article key={item.q}>
              <strong>{item.q}</strong>
              <p>{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
