import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import ProductDetailClient from '@/components/product/ProductDetailClient'

type Variant = {
  id: string
  size: string
  stock: number
  price: number // cents
}

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

// In Next.js 15, params can be a Promise in Server Components
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const idNum = Number(id)
  if (!Number.isFinite(idNum)) return notFound()
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      id, model_slug, sku_model, name, description, is_active,
      brand: brand_id ( id, name, logo_url ),
      product_variants (
        id, eu_size, stock_quantity, price, gender, color, image_url,
        product_images ( image_url, alt_text, is_primary )
      )
    `)
    // Filter by numeric id (already validated above)
    .eq('id', idNum)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    console.error(error)
  }

  if (!product) return notFound()

  const toCents = (v: number | null | undefined) => Math.round((v ?? 0) * 100)

  const images: string[] = Array.from(
    new Set(
      (product.product_variants || []).flatMap((v: any) => {
        const imgs = (v.product_images || []).map((img: any) => img.image_url)
        return v.image_url ? [v.image_url, ...imgs] : imgs
      })
    )
  ).filter(Boolean) as string[]

  const variants: Variant[] = (product.product_variants || []).map((v: any) => ({
    id: String(v.id),
    size: String(v.eu_size),
    stock: v.stock_quantity ?? 0,
    price: toCents(v.price ?? 0),
  }))

  const brandObj = Array.isArray((product as any).brand) ? (product as any).brand[0] : (product as any).brand
  const normalized: ProductView = {
    id: String(product.id),
    model_slug: product.model_slug,
    sku_model: product.sku_model,
    name: product.name,
    brand: brandObj?.name ?? '',
    description: product.description ?? '',
    images: images.length ? images : ['/images/hero-shoe.jpg'],
    variants: variants.length ? variants : [{ id: 'default', size: '42', stock: 0, price: toCents(0) }],
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-2 gap-8">
      <img
        src={normalized.images[0]}
        alt={normalized.name}
        className="aspect-square object-cover rounded-xl border"
      />
      <ProductDetailClient product={normalized} />
    </section>
  )
}
