'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Lang = 'ru' | 'en'

const LanguageContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void }>({
  lang: 'ru',
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ru')

  useEffect(() => {
    const saved = localStorage.getItem('tf-lang')
    if (saved === 'en' || saved === 'ru') setLangState(saved)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = (next: Lang) => {
    setLangState(next)
    localStorage.setItem('tf-lang', next)
    document.documentElement.lang = next
  }

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>
}

export function useLang() {
  return useContext(LanguageContext)
}
