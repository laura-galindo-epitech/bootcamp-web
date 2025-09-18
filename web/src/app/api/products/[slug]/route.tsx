'use client'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '@/lib/api'
import { useParams } from 'next/navigation'
import { useCart } from '@/store/cart'
import { useState } from 'react'
import { formatPrice } from '@/lib/utils'
 
export default function ProductDetail() {
    const { slug } = useParams<{ slug: string }>()
    const { data } = useQuery({ queryKey: ['product', slug], queryFn: async () => {
        const res = await fetchProducts()
        return res.items.find(p => p.slug === slug)
    }})
    const [variantId, setVariantId] = useState<string | null>(null)
    const add = useCart(s => s.add)
 
    if (!data) return <div className="mx-auto max-w-6xl px-4 py-10">Produit introuvable</div>
    const selected = data.variants.find(v => v.id === variantId) || data.variants[0]
 
    return (
        <section className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-2 gap-8">
            <img src={data.images[0]} alt={data.name} className="aspect-square object-cover rounded-xl border" />
            <div>
                <h1 className="text-2xl font-semibold">{data.name}</h1>
                <div className="text-gray-600">{data.brand}</div>
                <div className="mt-2 text-lg">{formatPrice(selected.price)}</div>
 
                <div className="mt-4">
                    <label className="block text-sm mb-1">Pointure</label>
                    <div className="flex flex-wrap gap-2">
                        {data.variants.map(v => (
                            <button key={v.id} onClick={()=>setVariantId(v.id)} className={`px-3 py-1 border rounded ${selected.id===v.id ? 'bg-black text-white' : ''}`}>{v.size}</button>
                        ))}
                    </div>
                </div>
 
                <button
                    className="mt-6 inline-flex items-center rounded-full bg-black px-5 py-2.5 text-white hover:opacity-900"
                    onClick={() => add({
                        productId: data.id,
                        variantId: selected.id,
                        name: data.name,
                        image: data.images[0],
                        size: selected.size,
                        quantity: 1,
                        unitPrice: selected.price,
                    })}
                >
                    Ajouter au panier
                </button>
 
                <p className="mt-6 text-sm text-gray-700">{data.description}</p>
            </div>
        </section>
    )
}