import StripePaymentForm from '@/components/checkout/StripePaymentForm'

export default function PaymentsPage() {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-medium tracking-tight">Mode de paiement</h2>
      <p className="mt-2 text-zinc-600">Ajoutez une carte de paiement (test). Aucun débit ne sera effectué.</p>

      <div className="mt-6 grid gap-4">
        <div className="rounded-lg border p-4 bg-white">
          <StripePaymentForm />
        </div>
      </div>
    </div>
  )
}
