'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Search } from 'lucide-react';
import ProductFilters from '../../components/product/ProductFilters';
import ProductGrid from '../../components/product/ProductGrid';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<{ gender?: string }>({});
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Récupérer les produits actifs avec leurs images et marques
        let query = supabase
          .from('products')
          .select(`
            *,
            product_images (*),
            brands (*)
          `)
          .eq('is_active', true); // Masquer les produits inactifs

        // Appliquer les filtres
        if (search) {
          query = query.ilike('name', `%${search}%`);
        }

        if (filters.gender) {
          query = query.eq('gender', filters.gender);
        }

        // Exécuter la requête
        const { data, error } = await query;

        if (error) {
          throw error;
        }

        // Traiter les données
        const processedProducts = data.map(product => {
          const brand = product.brands || null;
          const images = product.product_images || [];

          return {
            ...product,
            images: images,
            brand_logo: brand?.logo_url,
            brand_name: brand?.name,
          };
        });

        setProducts(processedProducts || []);
      } catch (err) {
        setError('Erreur de chargement des produits');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [search, filters]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 space-y-5">
      <div className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 shadow-sm">
        <Search size={16} className="text-zinc-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher des modèles..."
          className="w-full bg-transparent outline-none placeholder:text-zinc-400"
        />
      </div>
      <ProductFilters value={filters} onChange={setFilters} />
      {isLoading && <div className="text-sm text-zinc-500">Chargement...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {products.length > 0 && <ProductGrid items={products} />}
    </section>
  );
}
