import Link from 'next/link'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

export default function ProductCard({ product }: { product: Product }) {
    const minPrice = Math.min(...product.variants.map(v => v.price))
    return (
        <Link href={`/products/${product.slug}`} className="group block border rounded-2xl overflow-hidden bg-white">
            <img src={product.images[0]} alt={product.name} className="aspect-square object-cover group-hover:scale-105 transition" />
            <div className="relative">
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
            </div>
            <div className="p-3">
                <div className="text-sm text-gray-500">{product.brand}</div>
                <div className="font-medium">{product.name}</div>
                <div className="text-sm mt-1">{formatPrice(minPrice)}</div>
            </div>
        </Link>
    )
}