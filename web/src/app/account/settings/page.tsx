export default function SettingsPage() {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-medium tracking-tight">Paramètres</h2>
      <p className="mt-2 text-zinc-600">Mettez à jour vos informations personnelles et vos préférences.</p>

      <div className="mt-6 grid gap-6">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-zinc-700">Nom complet</label>
          <input className="w-full rounded-md border px-3 py-2" placeholder="Ex: Jane Doe" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-zinc-700">Email</label>
          <input type="email" className="w-full rounded-md border px-3 py-2" placeholder="nom@exemple.com" />
        </div>
        <div>
          <button className="inline-flex items-center rounded-md bg-black px-4 py-2 text-white hover:opacity-90">Enregistrer</button>
        </div>
      </div>
    </div>
  )
}
