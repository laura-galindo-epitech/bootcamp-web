export default function AddressesPage() {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-medium tracking-tight">Mes adresses</h2>
      <p className="mt-2 text-zinc-600">Gérez vos adresses de livraison et de facturation.</p>
      <div className="mt-6 grid gap-4">
        <div className="rounded-lg border p-4 text-sm text-zinc-600">
          Aucune adresse enregistrée pour le moment.
        </div>
      </div>
    </div>
  )
}
