'use client'
import Link from 'next/link'
import { useCart } from '@/store/cart'
import { ShoppingBag, User, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
    const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0))
    const [open, setOpen] = useState(false)

    return (
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between relative">
                {/* Burger (mobile only) */}
                <button
                    type="button"
                    aria-label="Ouvrir le menu"
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    onClick={() => setOpen(v => !v)}
                    className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded hover:bg-zinc-100"
                >
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Logo + Produits + A propos (desktop) */}
                <div className='flex items-center gap-6'>
                    <Link href="/" className="font-semibold tracking-tight text-lg">OneShoe</Link>
                    <Link href="/products" className="hidden md:inline-block hover:opacity-80 transition text-sm">Nos produits</Link>
                    <Link href="/about" className="hidden md:inline-block hover:opacity-80 transition text-sm">À propos</Link>
                </div>

                {/* Right: account/cart + burger */}
                <div className="flex items-center gap-4">
                    <nav className="flex items-center gap-6 text-sm">
                        <Link href="/account" className="inline-flex items-center gap-2 hover:opacity-80 transition">
                            <User size={18} />
                            <span className="hidden md:inline">Mon compte</span>
                        </Link>
                        <Link href="/cart" className="hover:opacity-80 relative inline-flex items-center gap-2">
                            <ShoppingBag size={18} />
                            <span className="hidden md:inline">Panier</span>
                            {count > 0 && (
                                <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-black px-1 text-xs text-white">{count}</span>
                            )}
                        </Link>
                    </nav>

                    {/* Mobile panel: only Produits */}
                    {open && (
                        <div id="mobile-menu" className="md:hidden absolute top-14 inset-x-0 bg-white border-b shadow-sm">
                            <nav className="py-2">
                                <Link href="/products" className="block px-4 py-3 hover:bg-zinc-50" onClick={() => setOpen(false)}>
                                    Nos produits
                                </Link>
                                <Link href="/about" className="block px-4 py-3 hover:bg-zinc-50" onClick={() => setOpen(false)}>
                                    À propos
                                </Link>

                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
