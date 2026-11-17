'use client'

import Link from 'next/link'
import { Globe2 } from 'lucide-react'
import { useLang } from '@/components/language'

const text = {
  ru: { tagline: 'Маленькие открытия каждый день.', language: 'Русский / English' },
  en: { tagline: 'Little discoveries every day.', language: 'Russian / English' },
}

export function SiteFooter() {
  const { lang } = useLang()
  const t = text[lang]
  return (
    <footer id="contact" className="home-foot">
      <div className="home-foot-art">
        <img src="/images/home/footer-leaves.jpg" alt="" />
        <div className="home-foot-row">
          <div>
            <Link href="/" className="brand"><span className="brand-mark"><img src="/images/logo.png" alt="" /></span><span>Tutti-Frutti</span></Link>
            <p>{t.tagline}</p>
          </div>
          <div className="footer-contact">
            <a href="mailto:tuttifruttiphiladelphia@gmail.com">tuttifruttiphiladelphia@gmail.com</a>
            <div className="footer-social">
              <a href="https://www.facebook.com/groups/3311360922511076/" target="_blank" rel="noreferrer" aria-label="Facebook"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M14.5 8.5V6.8c0-.7.5-1.1 1.2-1.1H17V3h-2.1C12.4 3 11 4.5 11 6.7v1.8H9v2.7h2V21h3.1v-9.8h2.2l.4-2.7h-2.6z" /></svg></a>
              <a href="https://www.instagram.com/tutti.frutti_t/" target="_blank" rel="noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.4" /><circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" /></svg></a>
            </div>
          </div>
          <div className="footer-language"><Globe2 size={16} /> {t.language}</div>
        </div>
      </div>
    </footer>
  )
}
