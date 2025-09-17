import ProductCard from './ProductCard'
import { Product } from '@/lib/types'

export default function ProductGrid({ items }: { items: Product[] }) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4 lg:gap-6">
            {items.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
)
}