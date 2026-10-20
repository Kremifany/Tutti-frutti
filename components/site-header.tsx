'use client'

import Link from 'next/link'
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useState, type MouseEvent } from 'react'
import { useLang } from '@/components/language'
import { authClient } from '@/lib/auth-client'
import { destinationForRole } from '@/lib/roles'

const text = {
  ru: {
    home: 'tutti-frutti — главная',
    nav: 'Основная навигация',
    projects: 'Проекты',
    about: 'О нас',
    contact: 'Контакты',
    signIn: 'Войти',
    account: 'Кабинет',
    signOut: 'Выйти',
    themeLight: 'Включить светлую тему',
    themeDark: 'Включить тёмную тему',
    language: 'Выбрать язык',
    open: 'Открыть меню',
    close: 'Закрыть меню',
  },
  en: {
    home: 'tutti-frutti — home',
    nav: 'Main navigation',
    projects: 'Projects',
    about: 'About',
    contact: 'Contact',
    signIn: 'Sign in',
    account: 'Account',
    signOut: 'Sign out',
    themeLight: 'Switch to light theme',
    themeDark: 'Switch to dark theme',
    language: 'Choose language',
    open: 'Open menu',
    close: 'Close menu',
  },
}

export function SiteHeader() {
  const { lang, setLang } = useLang()
  const t = text[lang]
  const { data: session } = authClient.useSession()
  const [darkMode, setDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setDarkMode(document.documentElement.dataset.theme === 'dark')
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'
  }, [darkMode])

  const goToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    setMenuOpen(false)
    if (window.location.pathname !== '/') return
    event.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.pushState(null, '', `/#${id}`)
  }

  const goHome = (event: MouseEvent<HTMLAnchorElement>) => {
    setMenuOpen(false)
    if (window.location.pathname !== '/') return
    event.preventDefault()
    history.pushState(null, '', '/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand" aria-label={t.home} onClick={goHome}>
          <span className="brand-mark"><img src="/images/logo.png" alt="" /></span>
          <span>tutti-frutti</span>
        </Link>
        <nav className={menuOpen ? 'site-nav is-open' : 'site-nav'} aria-label={t.nav}>
          <Link href="/#activities" onClick={(event) => goToSection(event, 'activities')}>{t.projects}</Link>
          <Link href="/#about" onClick={(event) => goToSection(event, 'about')}>{t.about}</Link>
          <Link href="/#contact" onClick={(event) => goToSection(event, 'contact')}>{t.contact}</Link>
          {session ? <><Link href={destinationForRole(session.user.role)} className="nav-login" onClick={() => setMenuOpen(false)}>{t.account} <ArrowRight size={15} /></Link><button className="nav-text" type="button" onClick={() => authClient.signOut().then(() => { window.location.href = '/' })}>{t.signOut}</button></> : <Link href="/sign-in" className="nav-login" onClick={() => setMenuOpen(false)}>{t.signIn} <ArrowRight size={15} /></Link>}
          <button className="theme-switch" type="button" onClick={() => setDarkMode((value) => !value)} aria-label={darkMode ? t.themeLight : t.themeDark}>{darkMode ? <Sun size={15} /> : <Moon size={15} />}</button>
          <div className="lang-switch" role="group" aria-label={t.language}>
            <button type="button" className={lang === 'ru' ? 'is-active' : ''} onClick={() => setLang('ru')}>RU</button>
            <span>/</span>
            <button type="button" className={lang === 'en' ? 'is-active' : ''} onClick={() => setLang('en')}>EN</button>
          </div>
        </nav>
        <button className="menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? t.close : t.open}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </header>
  )
}
