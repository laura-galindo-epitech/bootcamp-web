"use client"
import Container from '@/components/common/Container'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type VariantDraft = { id: string; size: string; price: string; stock: string }
type ImageDraft = { id: string; url: string; alt: string }

export default function AdminNewProductPage() {
  const router = useRouter()
  // Soft guard client-side: if you later inject role into a client context, you can redirect.
  // This is optional and does not replace the server guard at /admin (list page).
  useEffect(() => {
    // no-op placeholder
  }, [])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [brand, setBrand] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [description, setDescription] = useState('')
  const [variants, setVariants] = useState<VariantDraft[]>([])
  const [images, setImages] = useState<ImageDraft[]>([])

  const addVariant = () =>
    setVariants((v) => [
      ...v,
      { id: crypto.randomUUID(), size: '', price: '', stock: '' },
    ])
  const removeVariant = (id: string) =>
    setVariants((v) => v.filter((x) => x.id !== id))

  const addImage = () =>
    setImages((v) => [
      ...v,
      { id: crypto.randomUUID(), url: '', alt: '' },
    ])
  const removeImage = (id: string) =>
    setImages((v) => v.filter((x) => x.id !== id))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name,
      slug,
      brand,
      base_price: basePrice,
      description,
      variants,
      images,
    }
    // Placeholder: rien n'est connecté pour le moment
    console.log('Draft product payload:', payload)
    alert('Formulaire prêt. Aucune connexion DB pour le moment.')
  }

  return (
    <Container className="py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Nouveau produit</h1>
          <p className="text-sm text-zinc-500">Saisie des informations produit (brouillon)</p>
        </div>
        <Link href="/admin" className="text-sm text-zinc-600 hover:underline">Retour au dashboard</Link>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Infos principales */}
        <section className="rounded-2xl border bg-white p-4 space-y-4">
          <h2 className="font-medium">Informations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-600">Nom</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Ex: Air Zoom Pegasus 41" />
            </div>
            <div>
              <label className="block text-sm text-zinc-600">Slug</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="ex: air-zoom-pegasus-41" />
            </div>
            <div>
              <label className="block text-sm text-zinc-600">Marque</label>
              <input value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="ex: Nike" />
            </div>
            <div>
              <label className="block text-sm text-zinc-600">Prix de base (€)</label>
              <input type="number" step="0.01" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="ex: 129.99" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-zinc-600">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 h-24" placeholder="Description courte du produit" />
            </div>
          </div>
        </section>

        {/* Variants */}
        <section className="rounded-2xl border bg-white p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Variantes</h2>
            <button type="button" onClick={addVariant} className="text-sm rounded-full border px-3 py-1 bg-white hover:bg-zinc-50">Ajouter une variante</button>
          </div>
          <div className="space-y-3">
            {variants.length === 0 && (
              <p className="text-sm text-zinc-500">Aucune variante pour l’instant.</p>
            )}
            {variants.map((v) => (
              <div key={v.id} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input value={v.size} onChange={(e) => setVariants((all) => all.map((x) => x.id === v.id ? { ...x, size: e.target.value } : x))} className="rounded-md border px-3 py-2" placeholder="Pointure (ex: 42)" />
                <input type="number" step="0.01" value={v.price} onChange={(e) => setVariants((all) => all.map((x) => x.id === v.id ? { ...x, price: e.target.value } : x))} className="rounded-md border px-3 py-2" placeholder="Prix (€)" />
                <input type="number" value={v.stock} onChange={(e) => setVariants((all) => all.map((x) => x.id === v.id ? { ...x, stock: e.target.value } : x))} className="rounded-md border px-3 py-2" placeholder="Stock" />
                <button type="button" onClick={() => removeVariant(v.id)} className="rounded-md border px-3 py-2 hover:bg-zinc-50">Supprimer</button>
              </div>
            ))}
          </div>
        </section>

        {/* Images */}
        <section className="rounded-2xl border bg-white p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Images</h2>
            <button type="button" onClick={addImage} className="text-sm rounded-full border px-3 py-1 bg-white hover:bg-zinc-50">Ajouter une image</button>
          </div>
          <div className="space-y-3">
            {images.length === 0 && (
              <p className="text-sm text-zinc-500">Aucune image pour l’instant.</p>
            )}
            {images.map((img) => (
              <div key={img.id} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input value={img.url} onChange={(e) => setImages((all) => all.map((x) => x.id === img.id ? { ...x, url: e.target.value } : x))} className="rounded-md border px-3 py-2" placeholder="URL de l’image" />
                <input value={img.alt} onChange={(e) => setImages((all) => all.map((x) => x.id === img.id ? { ...x, alt: e.target.value } : x))} className="rounded-md border px-3 py-2" placeholder="Texte alternatif" />
                <button type="button" onClick={() => removeImage(img.id)} className="rounded-md border px-3 py-2 hover:bg-zinc-50">Supprimer</button>
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-2">
          <button type="submit" className="rounded-full bg-black text-white px-5 py-2.5 hover:opacity-90">Enregistrer le brouillon</button>
          <Link href="/admin" className="rounded-full border px-5 py-2.5 hover:bg-zinc-50">Annuler</Link>
        </div>
      </form>
    </Container>
  )
}
