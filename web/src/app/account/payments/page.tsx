export default function PaymentsPage() {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-medium tracking-tight">Mode de paiement</h2>
      <p className="mt-2 text-zinc-600">Gérez vos cartes et méthodes de paiement enregistrées.</p>

      <div className="mt-6 grid gap-4">
        <div className="rounded-lg border p-4 bg-white">
          <p className="text-sm text-zinc-600">Aucun mode de paiement enregistré pour le moment.</p>
          <div className="mt-4 flex items-center gap-3">
            <button className="inline-flex items-center rounded-md bg-black px-4 py-2 text-white hover:opacity-90">Ajouter une carte</button>
            <button className="inline-flex items-center rounded-md border px-4 py-2 hover:bg-zinc-50">Ajouter PayPal</button>
          </div>
        </div>

        {/* Zone prévue pour la liste des cartes enregistrées */}
        <div className="grid gap-3">
          {/* Exemple (à brancher plus tard):
          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="text-sm">
              <p className="font-medium">Visa se terminant par 4242</p>
              <p className="text-zinc-500">Exp. 08/26 • Par défaut</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-sm underline">Définir par défaut</button>
              <button className="text-sm text-red-600 underline">Supprimer</button>
            </div>
          </div>
          */}
        </div>
      </div>
    </div>
  )
}
