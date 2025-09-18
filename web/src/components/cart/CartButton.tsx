'use client'
import { useState } from 'react'
import { useCart } from '@/store/cart'
import CartDrawer from './CartDrawer'

export default function CartButton() {
    const [open, setOpen] = useState(false)
    const count = useCart(s => s.items.reduce((n,i)=> n + i.quantity, 0))
    return (
        <>
            <button onClick={()=>setOpen(true)} className="relative">
                Panier ({count})
            </button>
            <CartDrawer open={open} onClose={()=>setOpen(false)} />
        </>
    )
}