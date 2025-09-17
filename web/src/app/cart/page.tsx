'use client'
import { useCart } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
    const { items, setQty, remove } = useCart()
    const total = items.reduce((s,i)=> s + i.quantity * i.unitPrice, 0)
    return (
        <section className="mx-auto max-w-6xl px-4 py-8">
            <h1 className="text-2xl font-semibold mb-4">Votre panier</h1>
            <div className="space-y-4">
                {items.map(i => (
                    <div key={i.variantId} className="flex items-center gap-4 border p-3 rounded">
                        <img src={i.image} alt="" className="w-20 h-20 object-cover rounded" />
                        <div className="flex-1">
                            <div className="font-medium">{i.name} — {i.size}</div>
                            <div className="text-sm text-gray-600">{formatPrice(i.unitPrice)}</div>
                        </div>
                        <input type="number" min={1} value={i.quantity} onChange={e=>setQty(i.variantId, Number(e.target.value))} className="w-16 border rounded px-2 py-1" />
                        <button className="text-red-600" onClick={()=>remove(i.variantId)}>Supprimer</button>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
                <div className="text-lg font-medium">Total : {formatPrice(total)}</div>
                    <a href="/checkout" className="px-4 py-2 rounded bg-black text-white">Passer au paiement</a>
            </div>
        </section>
    )
}