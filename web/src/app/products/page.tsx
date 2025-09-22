'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/utils/supabase/client';
import ProductFilters from '@/components/product/ProductFilters';
import ProductGrid from '@/components/product/ProductGrid';

type Filters = {
  gender?: string;
  brands?: string[];
  priceRange?: string;
  colorFamilies?: string[];
};

interface Brand {
  id: number;
  name: string;
  logo_url: string | null;
}

interface ProductVariant {
  color_family: string;
  price: number;
  gender?: string;
}

interface ProductImage {
  image_url: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  brand: Brand;
  product_images: ProductImage[];
  product_variants: ProductVariant[];
}

export default function ProductsPage() {
  const [filters, setFilters] = useState<Filters>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          base_price,
          brand_id,
          brand: brand_id (id, name, logo_url),
          product_images: product_images(image_url),
          product_variants: product_variants(color_family, price, gender)
        `);

      // Filtrer par terme de recherche
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      if (filters.gender) {
        query = query.contains('product_variants', { gender: filters.gender });
      }

      if (filters.brands && filters.brands.length > 0) {
        const brandIdsQuery = await supabase
          .from('brands')
          .select('id')
          .in('name', filters.brands);

        if (brandIdsQuery.error) {
          throw new Error(`Erreur lors de la récupération des IDs de marque: ${brandIdsQuery.error.message}`);
        }

        if (brandIdsQuery.data && brandIdsQuery.data.length > 0) {
          const brandIds = brandIdsQuery.data.map(brand => brand.id);
          query = query.in('brand_id', brandIds);
        } else {
          setProducts([]);
          return;
        }
      }

      if (filters.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange.split('-').map(Number);
        query = query.gte('base_price', minPrice).lte('base_price', maxPrice || 1000);
      }

      if (filters.colorFamilies && filters.colorFamilies.length > 0) {
        query = query.contains('product_variants', { color_family: filters.colorFamilies });
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Erreur lors de la récupération des produits: ${error.message}`);
      }

      if (!data) {
        throw new Error('Aucune donnée retournée par la requête.');
      }

      // Transformer les données pour correspondre à l'interface Product
      const formattedProducts = data.map((product) => {
        const brandRaw = (product as any).brand
        const brandObj = Array.isArray(brandRaw) ? brandRaw[0] : brandRaw
        const brand = brandObj ? {
          id: brandObj.id,
          name: brandObj.name,
          logo_url: brandObj.logo_url
        } : { id: 0, name: '', logo_url: null };

        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          base_price: product.base_price,
          brand: brand,
          product_images: product.product_images || [],
          product_variants: product.product_variants || [],
        };
      });

      setProducts(formattedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
      console.error('Erreur détaillée :', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Barre de recherche */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <ProductFilters value={filters} onChange={setFilters} />

      {isLoading ? (
        <p className="text-center py-8">Chargement des produits...</p>
      ) : error ? (
        <p className="text-center py-8 text-red-500">{error}</p>
      ) : (
        <ProductGrid items={products} />
      )}
    </div>
  );
}
