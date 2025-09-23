'use client'
import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

function InnerForm({ onSaved }: { onSaved?: (info: any) => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!stripe || !elements) return
    setLoading(true)
    setError(null)
    const { setupIntent, error } = await stripe.confirmSetup({ elements, redirect: 'if_required' })
    if (error) {
      setError(error.message || 'Erreur de confirmation')
      setLoading(false)
      return
    }
    const pmId = setupIntent?.payment_method as string | undefined
    if (!pmId) {
      setError('Aucun moyen de paiement retourné')
      setLoading(false)
      return
    }
    // Récupérer les métadonnées côté serveur (sans rien stocker pour l’instant)
    const res = await fetch('/api/stripe/save-payment-method', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethodId: pmId }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Erreur serveur')
    } else {
      onSaved?.(data)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-3">
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={!stripe || loading} onClick={handleSubmit} className="w-full rounded-md bg-black text-white px-4 py-2 hover:opacity-90 disabled:opacity-50">
        {loading ? 'Enregistrement…' : 'Enregistrer la carte'}
      </button>
    </div>
  )
}

export default function StripePaymentForm() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [savedInfo, setSavedInfo] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/stripe/create-setup-intent', { method: 'POST' })
      .then(async (r) => {
        const j = await r.json()
        if (!r.ok) throw new Error(j.error || 'Erreur')
        setClientSecret(j.clientSecret)
      })
      .catch((e) => setError(e.message))
  }, [])

  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (!clientSecret || !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) return <p className="text-sm text-zinc-500">Chargement du formulaire…</p>

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      {savedInfo ? (
        <div className="rounded-md border p-3 bg-white">
          <p className="text-sm">Carte enregistrée: {savedInfo.brand?.toUpperCase()} •••• {savedInfo.last4} (exp. {savedInfo.exp_month}/{savedInfo.exp_year})</p>
        </div>
      ) : (
        <InnerForm onSaved={setSavedInfo} />
      )}
    </Elements>
  )
}

