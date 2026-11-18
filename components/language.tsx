'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Lang = 'ru' | 'en'

const LanguageContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void }>({
  lang: 'ru',
  setLang: () => {},
})

function asLang(value?: string | null): Lang | null {
  return value === 'en' || value === 'ru' ? value : null
}

function persist(lang: Lang) {
  localStorage.setItem('tf-lang', lang)
  document.cookie = `tf-lang=${lang};path=/;max-age=31536000;samesite=lax`
  document.documentElement.lang = lang
}

export function LanguageProvider({ children, initialLang = 'ru' }: { children: React.ReactNode; initialLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    const saved = asLang(localStorage.getItem('tf-lang')) || asLang(initialLang) || 'ru'
    setLangState(saved)
    persist(saved)
  }, [initialLang])

  const setLang = (next: Lang) => {
    setLangState(next)
    persist(next)
  }

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>
}

export function useLang() {
  return useContext(LanguageContext)
}
