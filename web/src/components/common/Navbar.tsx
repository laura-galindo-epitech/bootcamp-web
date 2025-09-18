'use client'
import Link from 'next/link'
import { useCart } from '@/store/cart'
import { ShoppingBag } from 'lucide-react'

export default function Navbar() {
    const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0))
    return (
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
                <div className='flex items-center gap-6'>
                    <Link href="/" className="font-semibold tracking-tight text-lg">OneShoe</Link>
                    <Link href="/products" className="hover:opacity-80 transition text-sm">Produits</Link>
                </div>
                <nav className="flex items-center gap-6 text-sm">
                    <Link href="/cart" className="relative inline-flex items-center gap-2">
                        <ShoppingBag size={18} />
                        <span>Panier</span>
                        {count > 0 && (
                            <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-black px-1 text-xs text-white">{count}</span>
                        )}
                    </Link>
                </nav>
            </div>
        </header>
    )
}