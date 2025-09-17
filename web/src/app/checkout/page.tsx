'use client'
import { useCart } from '@/store/cart'
import { createCheckout } from '@/lib/api'
import { useState } from 'react'
import { formatPrice } from '@/lib/utils'

export default function CheckoutPage() {
    const { items, clear } = useCart()
    const [status, setStatus] = useState<'idle'|'loading'|'done'>('idle')
    const total = items.reduce((s,i)=> s + i.quantity * i.unitPrice, 0)

    async function pay() {
        setStatus('loading')
        const payload = { items, total }
        const res = await createCheckout(payload)
        setStatus('done')
        clear()
        alert(`Paiement validé ! N° ${res.orderNumber}`)
    }

    return (
        <section className="mx-auto max-w-6xl px-4 py-8 space-y-4">
            <h1 className="text-2xl font-semibold">Paiement (démo)</h1>
            <div>Total à régler : {formatPrice(total)}</div>
            <button disabled={!items.length || status==='loading'} onClick={pay} className="px-4 py-2 rounded bg-black text-white">
                {status==='loading' ? 'Traitement...' : 'Payer'}
            </button>
        </section>
    )
}