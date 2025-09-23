import Container from '@/components/common/Container'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Users, ShoppingCart, Euro, PiggyBank, Calendar, Plus } from 'lucide-react'


export default async function AdminDashboardPage() {
  // En dev, si ADMIN_DEV_OVERRIDE=1, on laisse passer sans session
  if (process.env.ADMIN_DEV_OVERRIDE !== '1') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login?next=/admin')
  }
  // Données factices pour le template (à remplacer plus tard)
  const stats = [
    { label: 'Ventes', value: '1 245', icon: ShoppingCart, trend: '+12% ce mois' },
    { label: 'Chiffre d’affaires', value: '€ 98 420', icon: Euro, trend: '+8% ce mois' },
    { label: 'Profit', value: '€ 21 560', icon: PiggyBank, trend: '+5% ce mois' },
    { label: 'Utilisateurs', value: '7 342', icon: Users, trend: '+3% ce mois' },
  ]

  return (
    <Container className="py-8 space-y-6">
      {/* Product and Stock Management Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-15">
        <Link href="/admin/products" className="block">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Gestion des Produits</h2>
            <p className="text-gray-600">Ajouter, modifier et gérer les produits</p>
          </div>
        </Link>
        <Link href="/admin/stocks" className="block">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Gestion des Stocks</h2>
            <p className="text-gray-600">Ajouter des mouvements de stocks</p>
          </div>
        </Link>
      </div>

      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Tableau de bord</h1>
          <p className="text-sm text-zinc-500">Vue d’ensemble des performances</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm bg-white hover:bg-zinc-50">
            <Calendar size={16} />
            Période: Derniers 30 jours
          </button>
        </div>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">{s.label}</span>
              <s.icon size={18} className="text-zinc-400" />
            </div>
            <div className="mt-3 text-2xl font-semibold">{s.value}</div>
            <div className="mt-1 text-xs text-emerald-600">{s.trend}</div>
          </div>
        ))}
      </div>

      {/* Zones de graphiques (placeholders) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border bg-white p-4 h-72">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium">Évolution du CA</h2>
            <span className="text-xs text-zinc-500">Placeholder</span>
          </div>
          <div className="h-full w-full bg-zinc-50 rounded-md border border-dashed" />
        </div>
        <div className="rounded-2xl border bg-white p-4 h-72">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium">Ventes par jour</h2>
            <span className="text-xs text-zinc-500">Placeholder</span>
          </div>
          <div className="h-full w-full bg-zinc-50 rounded-md border border-dashed" />
        </div>
      </div>

      {/* Table récente (placeholder) */}
      <div className="rounded-2xl border bg-white">
        <div className="p-4 border-b">
          <h2 className="font-medium">Commandes récentes</h2>
          <p className="text-xs text-zinc-500">Données factices pour le template</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-50 text-zinc-600">
              <tr>
                <th className="text-left font-medium p-3">Commande</th>
                <th className="text-left font-medium p-3">Client</th>
                <th className="text-left font-medium p-3">Montant</th>
                <th className="text-left font-medium p-3">Statut</th>
                <th className="text-left font-medium p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'ORD-1001', customer: 'Alice', total: '€ 129,99', status: 'Payée', date: '2025-09-01' },
                { id: 'ORD-1000', customer: 'Bob', total: '€ 89,99', status: 'Payée', date: '2025-08-30' },
                { id: 'ORD-0999', customer: 'Charlie', total: '€ 59,99', status: 'Remboursée', date: '2025-08-29' },
              ].map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-3">{o.id}</td>
                  <td className="p-3">{o.customer}</td>
                  <td className="p-3">{o.total}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  )
}
