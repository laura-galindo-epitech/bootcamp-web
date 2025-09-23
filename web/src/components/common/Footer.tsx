"use client"

import Link from 'next/link'

const COOKIE_NAME = 'consent_analytics'

function reopenConsentBanner() {
    if (typeof document === 'undefined') return
    const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax${secure}`
    window.dispatchEvent(new Event('cookie:consent-reset'))
}

export default function Footer() {
    return (
        <footer className="mt-10 bg-blue-700 dark:bg-zinc-900 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-white/80 dark:text-zinc-400 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p>© {new Date().getFullYear()} OneShoe</p>
                <nav className="flex flex-wrap items-center gap-4">
                    <Link href="/terms" className="hover:underline">CGV</Link>
                    <Link href="/privacy" className="hover:underline">Confidentialité</Link>
                    <Link href="/mentions-legales" className="hover:underline">Mentions légales</Link>
                    <Link href="/contact" className="hover:underline">Contact</Link>
                </nav>
                <button
                    type="button"
                    onClick={reopenConsentBanner}
                    className="text-left text-xs underline underline-offset-4 hover:text-white md:text-sm"
                    aria-label="Gérer mes préférences cookies"
                >
                    Gérer mes cookies
                </button>
            </div>
        </footer>
    )
}
