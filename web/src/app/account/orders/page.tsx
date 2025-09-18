export default function OrdersPage() {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-medium tracking-tight">Mes commandes</h2>
      <p className="mt-2 text-zinc-600">Vous n'avez pas encore de commande.</p>
      <div className="mt-6 grid gap-3 text-sm text-zinc-500">
        <p>Quand vous passerez une commande, elle apparaîtra ici avec son numéro, sa date et son statut.</p>
      </div>
    </div>
  )
}
