import { NextResponse } from 'next/server'
import { Product } from '@/lib/types'

const data: Product[] = [
  {
    id:'p1', slug:'air-zoom-pegasus-41', name:'Air Zoom Pegasus 41', brand:'Nike', gender:'men', category:'running',
    description:'Amorti réactif, usage quotidien', images:['/images/pegasus41-1.jpg','/images/pegasus41-2.jpg'],
    variants:[ {id:'v1',size:'42',stock:12,price:12999},{id:'v2',size:'43',stock:8,price:12999} ]
  },
  {
    id:'p2', slug:'ultraboost-light', name:'Ultraboost Light', brand:'adidas', gender:'women', category:'running',
    description:'Retour d’énergie léger', images:['/images/ub-light-1.jpg'],
    variants:[ {id:'v3',size:'38',stock:5,price:17999},{id:'v4',size:'39',stock:3,price:17999} ]
  },
]

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('search')||'').toLowerCase()
  const gender = searchParams.get('gender')
  const category = searchParams.get('category')

  let items = data
  if (q) items = items.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
  if (gender) items = items.filter(p => p.gender === gender)
  if (category) items = items.filter(p => p.category === category)

  return NextResponse.json({ items, total: items.length })
}