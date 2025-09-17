'use client'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '@/lib/api'
import ProductGrid from '@/components/product/ProductGrid'
import { useState } from 'react'
import { Search } from 'lucide-react'
import ProductFilters from '@/components/product/ProductFilters'

export default function ProductsPage() {
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState<{gender?: string; category?: string}>({})
    const { data, isLoading, error } = useQuery({
        queryKey: ['products', { search, ...filters }],
        queryFn: () => fetchProducts({ search, ...filters })
    })

    return (
    <section className="mx-auto max-w-6xl px-4 py-6 space-y-5">
        <div className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 shadow-sm">
            <Search size={16} className="text-zinc-500" />
            <input 
                value={search}
                onChange={e=>setSearch(e.target.value)}
                placeholder="Rechercher des modèles..."
                className="w-full bg-transparent outline-none placeholder:text-zinc-400" />
        </div>
        <ProductFilters value={filters} onChange={setFilters} />
        {isLoading && <div className="text-sm text-zinc-500">Chargement...</div>}
        {error && <div className="text-sm text-red-600">Erreur de chargement</div>}
        {data && <ProductGrid items={data.items} />}
    </section>
    )
}
