'use client'
import { useEffect, useState } from 'react'
import { formatPrice } from '@/lib/utils'
export default function OrderPage({ params }:{ params:{ number:string } }){
  const [order, setOrder] = useState<any>(null)
  useEffect(()=>{ const raw = sessionStorage.getItem('lastOrder'); if(raw){ const o = JSON.parse(raw); if(o.orderNumber===params.number) setOrder(o) } },[params.number])
  if(!order) return <section className="mx-auto max-w-6xl px-4 py-10">Commande {params.number} confirmée.</section>
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Merci pour votre achat !</h1>
      <p className="text-zinc-600 mt-1">Numéro de commande : <strong>{order.orderNumber}</strong></p>
      <div className="mt-6 grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          {order.items.map((i:any)=> (
            <div key={i.variantId} className="flex items-center gap-3">
              <img src={i.image} className="w-14 h-14 object-cover rounded" alt="" />
              <div className="flex-1 text-sm">
                <div className="font-medium">{i.name} — {i.size}</div>
                <div className="text-zinc-500">{i.quantity} × {formatPrice(i.unitPrice)}</div>
              </div>
              <div className="text-sm">{formatPrice(i.quantity*i.unitPrice)}</div>
            </div>
          ))}
        </div>
        <aside className="border rounded-2xl p-4 h-max bg-white">
          <h2 className="font-medium mb-2">Récapitulatif</h2>
          <div className="flex items-center justify-between"><span>Total</span><span>{formatPrice(order.total)}</span></div>
          <h3 className="font-medium mt-4 mb-2">Client</h3>
          <p className="text-sm text-zinc-600">
            {order.customer.firstName} {order.customer.lastName}<br/>
            {order.customer.address}<br/>
            {order.customer.zip} {order.customer.city}, {order.customer.country}<br/>
            {order.customer.email}
          </p>
        </aside>
      </div>
      <a href="/products" className="inline-flex mt-8 rounded-full border px-5 py-2.5 hover:bg-zinc-50">Revenir à la boutique</a>
    </section>
  )
}