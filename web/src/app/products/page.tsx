'use client'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '@/lib/api'
import ProductGrid from '@/components/product/ProductGrid'
import { useState } from 'react'
import { Search } from 'lucide-react'
import ProductFilters from '@/components/product/ProductFilters'
import Skeleton from '@/components/common/Skeleton'

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
        {isLoading && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4 lg:gap-6">
                {Array.from({length:8}).map((_,i)=> (
                    <div key={i} className="rounded-2xl border bg-white overflow-hidden">
                        <Skeleton className="aspect-square" />
                        <div className="p-3 space-y-2">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        )}
        {error && <div className="text-sm text-red-600">Erreur de chargement</div>}
        {data && <ProductGrid items={data.items} />}
    </section>
    )
}
