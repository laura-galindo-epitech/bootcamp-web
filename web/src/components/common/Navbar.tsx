'use client'
import Link from 'next/link'
import { useCart } from '@/store/cart'
import { ShoppingBag, User, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase/client'
import ThemeToggle from './ThemeToggle'

export default function Navbar({ isAdmin = false, isLoggedIn = false }: { isAdmin?: boolean; isLoggedIn?: boolean }) {
    const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0))
    const [open, setOpen] = useState(false)
    const [loggedIn, setLoggedIn] = useState<boolean>(!!isLoggedIn)

    useEffect(() => {
        let mounted = true
        // Hydrate from Supabase client (local storage based)
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!mounted) return
            setLoggedIn(!!user)
        })
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            setLoggedIn(!!session?.user)
        })
        return () => {
            mounted = false
            sub.subscription.unsubscribe()
        }
    }, [])

    return (
        <header className="sticky top-0 z-40 bg-white/70 dark:bg-zinc-900/70 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between relative">
                {/* Burger (mobile only) */}
                <button
                    type="button"
                    aria-label="Ouvrir le menu"
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    onClick={() => setOpen(v => !v)}
                    className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Logo + Produits + A propos (desktop) */}
                <div className='flex items-center gap-6'>
                    <Link href="/" className="font-semibold tracking-tight text-2xl">OneShoe</Link>
                    {/* Desktop: dropdown hover for Nos produits */}
                    <div className="relative hidden md:block group">
                        <Link href="/products" aria-haspopup="menu" className="inline-block font-bold text-blue-700 hover:opacity-80 transition text-sm">Nos produits</Link>
                        <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50 rounded-md bg-white/95 dark:bg-zinc-900/95 backdrop-blur shadow-lg min-w-[200px] py-2">
                            <Link href="/products?gender=men" className="block px-4 py-3 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800">Homme</Link>
                            <Link href="/products?gender=women" className="block px-4 py-3 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800">Femme</Link>
                            <Link href="/products?gender=kids" className="block px-4 py-3 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800">Enfant</Link>
                        </div>
                    </div>
                    <Link href="/about" className="hidden md:inline-block hover:opacity-80 transition text-sm">À propos</Link>
                </div>

                {/* Right: account/cart */}
                <div className="flex items-center gap-2 md:gap-4">
                    <nav className="flex items-center gap-6 text-sm">
                        {isAdmin && (
                            <Link href="/admin" className="inline-flex items-center gap-2 hover:opacity-80 transition">
                                <span className="hidden md:inline">Admin</span>
                            </Link>
                        )}
                        {loggedIn ? (
                            <Link href="/account" className="inline-flex items-center gap-2 hover:opacity-80 transition">
                                <User size={18} />
                                <span className="hidden md:inline">Mon compte</span>
                            </Link>
                        ) : (
                            <Link href="/login" className="inline-flex items-center gap-2 hover:opacity-80 transition">
                                <User size={18} />
                                <span className="hidden md:inline">Se connecter</span>
                            </Link>
                        )}
                        <Link href="/cart" className="hover:opacity-80 relative inline-flex items-center gap-2">
                            <ShoppingBag size={18} />
                            <span className="hidden md:inline">Panier</span>
                            {count > 0 && (
                                <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-black px-1 text-xs text-white">{count}</span>
                            )}
                        </Link>
                    </nav>
                    <ThemeToggle />

                    {/* Mobile overlay + left drawer */}
                    {/* Backdrop */}
                    <div
                        className={`md:hidden fixed inset-0 z-40 bg-white dark:bg-zinc-900 transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                        onClick={() => setOpen(false)}
                        aria-hidden={!open}
                    />
                    {/* Drawer */}
                    <div
                        id="mobile-menu"
                        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-zinc-900 shadow-lg transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
                        aria-hidden={!open}
                    >
                        {/* Drawer header */}
                        <div className="h-14 flex items-center justify-between px-4 bg-white/70 dark:bg-zinc-900/70 backdrop-blur">
                            <span className="font-semibold tracking-tight">OneShoe</span>
                            <button
                                type="button"
                                aria-label="Fermer le menu"
                                onClick={() => setOpen(false)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <nav className="py-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur shadow-lg">
                            <Link href="/products" className="block px-4 py-3 font-bold text-blue-700 hover:bg-neutral-100 dark:hover:bg-zinc-800" onClick={() => setOpen(false)}>
                                Nos produits
                            </Link>
                            {/* Mobile: sub-links always visible under Nos produits */}
                            <div className="mt-1">
                                <Link href="/products?gender=men" className="block pl-8 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800" onClick={() => setOpen(false)}>
                                    Homme
                                </Link>
                                <Link href="/products?gender=women" className="block pl-8 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800" onClick={() => setOpen(false)}>
                                    Femme
                                </Link>
                                <Link href="/products?gender=kids" className="block pl-8 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800" onClick={() => setOpen(false)}>
                                    Enfant
                                </Link>
                            </div>
                            {loggedIn ? (
                                <Link href="/account" className="block px-4 py-3 hover:bg-neutral-100 dark:hover:bg-zinc-800" onClick={() => setOpen(false)}>
                                    Mon compte
                                </Link>
                            ) : (
                                <Link href="/login" className="block px-4 py-3 hover:bg-neutral-100 dark:hover:bg-zinc-800" onClick={() => setOpen(false)}>
                                    Se connecter
                                </Link>
                            )}
                            <Link href="/about" className="block px-4 py-3 hover:bg-neutral-100" onClick={() => setOpen(false)}>
                                À propos
                            </Link>
                            {isAdmin && (
                                <Link href="/admin" className="block px-4 py-3 hover:bg-neutral-100 dark:hover:bg-zinc-800" onClick={() => setOpen(false)}>
                                    Admin
                                </Link>
                            )}
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    )
}
