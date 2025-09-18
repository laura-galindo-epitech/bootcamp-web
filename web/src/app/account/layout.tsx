"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const items = [
    { href: '/account/orders', label: 'Commandes' },
    { href: '/account/addresses', label: 'Adresses' },
    { href: '/account/payments', label: 'Mode de paiement' },
    { href: '/account/settings', label: 'Paramètres' },
  ]

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Mon compte</h1>

      <div className="mt-6 grid md:grid-cols-[220px_1fr] gap-6">
        <aside className="md:sticky md:top-16">
          <nav aria-label="Navigation du compte" className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
            {items.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  className={`shrink-0 rounded-lg px-3 py-2 text-sm border transition ${
                    active
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-zinc-700 hover:bg-zinc-50 border-zinc-200'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <section className="min-h-[40vh] rounded-xl border bg-white p-4 md:p-6">
          {children}
        </section>
      </div>
    </main>
  )
}
