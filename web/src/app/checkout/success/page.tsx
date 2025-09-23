'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createCheckout } from '@/lib/api'
import { useCart } from '@/store/cart'

export default function CheckoutSuccessPage(){
  const params = useSearchParams()
  const router = useRouter()
  const clear = useCart(s=>s.clear)

  useEffect(()=>{
    const status = params.get('status')
    if (status === 'cancel') return
    async function finalize(){
      try{
        const pending = sessionStorage.getItem('pendingOrder')
        if (!pending) return
        const { items, total, customer } = JSON.parse(pending)
        const res = await createCheckout({ items, total, customer })
        sessionStorage.removeItem('pendingOrder')
        sessionStorage.setItem('lastOrder', JSON.stringify({ items, total, customer, orderNumber: res.orderNumber }))
        clear(); router.replace(`/order/${res.orderNumber}`)
      }catch{
        // reste sur la page si erreur
      }
    }
    finalize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Validation de la carte…</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">Merci de patienter pendant la finalisation de votre commande.</p>
    </section>
  )
}

