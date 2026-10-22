import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope, Playfair_Display } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/components/language'
import { OwnerGoogle } from '@/components/owner-google'
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
  description: 'Развивающие занятия для детей: живые буквы, Расти, Созвучие и интерактивный сторителлинг.',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${manrope.variable} ${playfair.variable} antialiased`}>
        <LanguageProvider>
          <ScrollToTop />
          <OwnerGoogle clientId={process.env.GOOGLE_CLIENT_ID || ''} ownerEmail={process.env.OWNER_EMAIL || ''} />
          <SiteHeader />
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </LanguageProvider>
      </body>
    </html>
  )
}
