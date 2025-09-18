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

                {/* Right: account/cart */}
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

                    {/* Mobile overlay + left drawer */}
                    {/* Backdrop */}
                    <div
                        className={`md:hidden fixed inset-0 z-40 bg-white transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                        onClick={() => setOpen(false)}
                        aria-hidden={!open}
                    />
                    {/* Drawer */}
                    <div
                        id="mobile-menu"
                        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
                        aria-hidden={!open}
                    >
                        {/* Drawer header */}
                        <div className="h-14 flex items-center justify-between px-4 bg-white/70 backdrop-blur">
                            <span className="font-semibold tracking-tight">OneShoe</span>
                            <button
                                type="button"
                                aria-label="Fermer le menu"
                                onClick={() => setOpen(false)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded hover:bg-zinc-100"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <nav className="py-2 bg-white/95 backdrop-blur shadow-lg">
                            <Link href="/products" className="block px-4 py-3 hover:bg-neutral-100" onClick={() => setOpen(false)}>
                                Nos produits
                            </Link>
                            <Link href="/account/settings" className="block px-4 py-3 hover:bg-neutral-100" onClick={() => setOpen(false)}>
                                Paramètres
                            </Link>
                            <Link href="/about" className="block px-4 py-3 hover:bg-neutral-100" onClick={() => setOpen(false)}>
                                À propos
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    )
}
