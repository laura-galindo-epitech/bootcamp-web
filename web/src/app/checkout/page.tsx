'use client'
import { useCart } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import CheckoutForm, { CheckoutData } from '@/components/checkout/CheckoutForm'
import { createCheckout } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function CheckoutPage(){
  const { items, clear } = useCart()
  const router = useRouter()
  const total = items.reduce((s,i)=> s + i.quantity*i.unitPrice, 0)

  async function onSubmit(data: CheckoutData){
    // 1) Rediriger vers Stripe Checkout (mode setup) pour saisir/valider la carte
    const r = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email, returnUrl: `${location.origin}/checkout/success` })
    })
    const j = await r.json()
    if (r.ok && j.url) {
      // Mémoriser la commande pour finalisation après retour
      sessionStorage.setItem('pendingOrder', JSON.stringify({ items, total, customer: data }))
      window.location.href = j.url as string
      return
    }
    // Fallback: continuer le flow démo si Stripe indisponible
    const res = await createCheckout({ items, total, customer: data })
    sessionStorage.setItem('lastOrder', JSON.stringify({ items, total, customer:data, orderNumber: res.orderNumber }))
    clear(); router.push(`/order/${res.orderNumber}`)
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Paiement (démo)</h1>
        <CheckoutForm onSubmit={onSubmit} />
      </div>
      <aside className="border rounded-2xl p-4 h-max bg-white">
        <h2 className="font-medium mb-3">Votre commande</h2>
        <div className="space-y-3">
          {items.map(i=> (
            <div key={i.variantId} className="flex items-center gap-3">
              <img src={i.image} className="w-16 h-16 object-cover rounded" alt="" />
              <div className="flex-1">
                <div className="text-sm font-medium">{i.name} — {i.size}</div>
                <div className="text-xs text-zinc-500">{i.quantity} × {formatPrice(i.unitPrice)}</div>
              </div>
              <div className="text-sm">{formatPrice(i.quantity*i.unitPrice)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <div className="font-medium">Total</div>
          <div className="font-medium">{formatPrice(total)}</div>
        </div>
      </aside>
    </section>
  )
}
