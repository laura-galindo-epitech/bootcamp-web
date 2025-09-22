"use client"

import { useEffect, useState } from 'react'

const COOKIE_NAME = 'consent_analytics'
const THIRTEEN_MONTHS = 60 * 60 * 24 * 395 // 13 mois max (RGPD)

function buildCookie(value: 'true' | 'false') {
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : ''
  return `${COOKIE_NAME}=${value}; Path=/; Max-Age=${THIRTEEN_MONTHS}; SameSite=Lax${secure}`
}

function readConsent(): 'true' | 'false' | null {
  if (typeof document === 'undefined') return null
  const row = document.cookie.split('; ').find((entry) => entry.startsWith(`${COOKIE_NAME}=`))
  return row ? (row.split('=')[1] as 'true' | 'false') : null
}

function writeConsent(value: 'true' | 'false') {
  if (typeof document === 'undefined') return
  document.cookie = buildCookie(value)
}

function clearConsentCookie() {
  if (typeof document === 'undefined') return
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax${secure}`
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = readConsent()
    setVisible(!(stored === 'true' || stored === 'false'))
  }, [])

  useEffect(() => {
    const handler = () => {
      clearConsentCookie()
      setVisible(true)
    }
    window.addEventListener('cookie:consent-reset', handler)
    return () => window.removeEventListener('cookie:consent-reset', handler)
  }, [])

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Bannière de consentement"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-50 max-w-2xl rounded-2xl border border-blue-100 bg-white/95 p-6 shadow-lg backdrop-blur dark:border-blue-900/40 dark:bg-zinc-900 md:left-auto md:right-6"
    >
      <div className="space-y-2">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Mais d’abord, les cookies</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-200">
          Nous utilisons des cookies essentiels au fonctionnement du site (session, panier). Les cookies{' '}
          <strong>Analytics</strong> restent désactivés tant que vous ne les acceptez pas. Pour en savoir plus, consultez
          notre <a href="/privacy" className="underline">politique de confidentialité</a>.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-medium">
        <button
          type="button"
          onClick={() => {
            writeConsent('true')
            setVisible(false)
            window.location.reload()
          }}
          className="rounded-lg bg-blue-700 px-4 py-2 text-white shadow-sm transition hover:bg-blue-600"
          aria-label="Accepter tous les cookies"
        >
          Accepter tous les cookies
        </button>
        <button
          type="button"
          onClick={() => {
            writeConsent('false')
            setVisible(false)
            window.location.reload()
          }}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Refuser les cookies non essentiels"
        >
          Refuser les cookies optionnels
        </button>
        <button
          type="button"
          onClick={() => {
            clearConsentCookie()
            setVisible(true)
          }}
          className="ml-auto rounded-lg border border-transparent px-4 py-2 text-blue-700 underline underline-offset-2 hover:text-blue-600"
        >
          Gérer mes cookies
        </button>
      </div>
    </div>
  )
}
