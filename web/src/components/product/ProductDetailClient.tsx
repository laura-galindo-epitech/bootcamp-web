"use client"
import { useState } from 'react'
import { useCart } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

type Variant = {
  id: string
  size: string
  stock: number
  price: number // cents
}

// Updated ProductView to match the new data structure from the server
type ProductView = {
  id: string
  model_slug: string
  sku_model: string
  name: string
  brand: string
  description: string
  images: string[]
  variants: Variant[]
}

export default function ProductDetailClient({ product }: { product: ProductView }) {
  const [variantId, setVariantId] = useState<string | null>(product.variants[0]?.id ?? null)
  const add = useCart((s) => s.add)

  const selected = product.variants.find((v) => v.id === variantId) || product.variants[0]

  return (
    <div>
      <h1 className="text-2xl font-semibold">{product.name}</h1>
      <div className="text-gray-600">{product.brand}</div>
      {selected && <div className="mt-2 text-lg">{formatPrice(selected.price)}</div>}

      <div className="mt-4">
        <label className="block text-sm mb-1">Pointure</label>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setVariantId(v.id)}
              className={`px-3 py-1 border rounded ${selected?.id === v.id ? 'bg-black text-white' : ''}`}
            >
              {v.size}
            </button>
          ))}
        </div>
      </div>

      <button
        className="mt-6 inline-flex items-center rounded-full bg-black px-5 py-2.5 text-white hover:opacity-90"
        onClick={() => {
          if (!selected) return
          add({
            productId: product.id,
            variantId: selected.id,
            name: product.name,
            image: product.images[0],
            size: selected.size as any,
            quantity: 1,
            unitPrice: selected.price,
          })
        }}
      >
        Ajouter au panier
      </button>

      <p className="mt-6 text-sm text-gray-700">{product.description}</p>
    </div>
  )
}
