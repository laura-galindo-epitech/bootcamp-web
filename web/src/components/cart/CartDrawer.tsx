'use client'
import { useCart } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { items, setQty, remove } = useCart()
    const total = items.reduce((s,i)=> s + i.quantity * i.unitPrice, 0)
    return (
        <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
            <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
            <aside className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform rounded-l-2xl ${open ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Votre panier</h2>
                    <button onClick={onClose} aria-label="Fermer" className="text-sm">Fermer</button>
                </div>
                <div className="p-4 space-y-3 overflow-auto h-[calc(100%-8rem)]">
                    {items.length === 0 && <div className="text-sm text-gray-500">Panier vide.</div>}
                    {items.map(i => (
                        <div key={i.variantId} className="flex items-center gap-3 border rounded p-2">
                            <img src={i.image} alt="" className="w-16 h-16 object-cover rounded" />
                            <div className="flex-1">
                                <div className="text-sm font-medium">{i.name} — {i.size}</div>
                                <div className="text-xs text-gray-600">{formatPrice(i.unitPrice)}</div>
                            </div>
                            <input type="number" min={1} value={i.quantity} onChange={e=>setQty(i.variantId, Number(e.target.value))} className="w-14 border rounded px-2 py-1 text-sm" />
                            <button className="text-red-600 text-sm" onClick={()=>remove(i.variantId)}>Suppr.</button>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t flex items-center justify-between">
                    <div className="font-medium">Total : {formatPrice(total)}</div>
                    <a href="/checkout" onClick={onClose} className="px-4 py-2 rounded bg-black text-white text-sm">Payer</a>
                </div>
            </aside>
        </div>
    )
}