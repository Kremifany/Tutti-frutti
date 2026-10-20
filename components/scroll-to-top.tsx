'use client'

import { usePathname } from 'next/navigation'
import { useLayoutEffect } from 'react'

export function ScrollToTop() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    const root = document.documentElement
    const previous = root.style.scrollBehavior
    root.style.scrollBehavior = 'auto'
    const id = window.location.hash.replace('#', '')
    const target = id ? document.getElementById(id) : null
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
    root.style.scrollBehavior = previous
  }, [pathname])

  return null
}
