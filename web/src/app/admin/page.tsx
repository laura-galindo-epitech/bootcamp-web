'use client';

import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord Administrateur</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/products" className="block">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Gestion des Produits</h2>
            <p className="text-gray-600">Ajouter, modifier et gérer les produits.</p>
          </div>
        </Link>

        <Link href="/admin/stocks" className="block">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Gestion des Stocks</h2>
            <p className="text-gray-600">Ajouter et suivre les mouvements de stock.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
