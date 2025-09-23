'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';

interface Brand {
  id: number;
  name: string;
  logo_url: string | null;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  brand_id: number;
  brand: Brand;
  is_active: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id, name, slug, description, base_price, brand_id, is_active,
            brand:brands(id, name, logo_url)
          `);
        if (error) {
          throw error;
        }
        setProducts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
        console.error('Erreur détaillée :', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleToggleActive = async (productId: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', productId);
      if (error) {
        throw error;
      }
      setProducts(products.map(product =>
        product.id === productId ? { ...product, is_active: !currentStatus } : product
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
      console.error('Erreur détaillée :', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des produits</h1>
        <Link href="/admin" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Retour au tableau de bord
        </Link>
      </div>
      <div className="mb-4">
        <Link href="/admin/products/create" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600">
          Ajouter un produit
        </Link>
      </div>
      {isLoading ? (
        <p className="text-center py-8">Chargement des produits...</p>
      ) : error ? (
        <p className="text-center py-8 text-red-700">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Nom</th>
                <th className="py-2 px-4 border">Marque</th>
                <th className="py-2 px-4 border">Prix</th>
                <th className="py-2 px-4 border">Actif</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="py-2 px-4 border">{product.id}</td>
                  <td className="py-2 px-4 border">{product.name}</td>
                  <td className="py-2 px-4 border">{product.brand?.name}</td>
                  <td className="py-2 px-4 border">{product.base_price.toFixed(2)} €</td>
                  <td className="py-2 px-4 border">
                    <span className={`px-2 py-1 rounded-full text-xs ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border">
                    <div className="flex gap-2">
                      <Link href={`/admin/products/edit/${product.id}`} className="text-blue-700 hover:underline">
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleToggleActive(product.id, product.is_active)}
                        className={`hover:underline ${product.is_active ? 'text-red-500' : 'text-green-500'}`}
                      >
                        {product.is_active ? 'Désactiver' : 'Activer'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
