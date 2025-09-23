'use client'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
  if (stored) return stored
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <button
      type="button"
      aria-label="Basculer le thème"
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      className="inline-flex h-9 w-9 items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
      title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
