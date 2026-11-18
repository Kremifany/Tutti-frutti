import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope, Playfair_Display } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'
import { LanguageProvider, type Lang } from '@/components/language'
import { ScrollToTop } from '@/components/scroll-to-top'
import { SiteHeader } from '@/components/site-header'

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'tutti-frutti — растём играя',
  description: 'Творческие, развивающие и образовательные занятия на русском языке, где книги, музыка, движение и игра помогают детям открывать мир, узнавать себя и находить друзей.',
  icons: {
    icon: [{ url: '/tf-color.png', type: 'image/png', sizes: '128x128' }],
    apple: '/images/logo.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const saved = (await cookies()).get('tf-lang')?.value
  const lang: Lang = saved === 'en' || saved === 'ru' ? saved : 'ru'
  return (
    <html lang={lang} data-scroll-behavior="smooth">
      <body className={`${manrope.variable} ${playfair.variable} antialiased`}>
        <LanguageProvider initialLang={lang}>
          <ScrollToTop />
          <SiteHeader />
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </LanguageProvider>
      </body>
    </html>
  )
}
