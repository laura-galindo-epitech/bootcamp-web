import { NextResponse } from 'next/server'
import { Product } from '@/lib/types'

const data: Product[] = [
    {
        id: 'p1', slug: 'air-zoom-pegasus-41', name: 'Air Zoom Pegasus 41',
        brand: 'Nike', gender: 'men', category: 'running',
        description: 'Amorti réactif, usage quotidien',
        images: ['/images/pegasus41-1.jpg','/images/pegasus41-2.jpg'],
        variants: [
            { id:'v1', size:'42', stock: 12, price: 12999 },
            { id:'v2', size:'43', stock: 8, price: 12999 },
        ],
    },
// ... ajoute 10–20 items pour la démo
]

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('search')?.toLowerCase() || ''
    const gender = searchParams.get('gender')
    const category = searchParams.get('category')

    let items = data
    if (q) items = items.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
    if (gender) items = items.filter(p => p.gender === gender)
    if (category) items = items.filter(p => p.category === category)

    return NextResponse.json({ items, total: items.length })
}