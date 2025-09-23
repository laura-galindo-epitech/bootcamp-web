// src/app/products/page.tsx
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
  id: number;
  color_family: string;
  price: number;
  gender?: string;
}

interface ProductImage {
  id: number;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
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
      // Récupérer les produits
      let productsQuery = supabase
        .from('products')
        .select('id, name, slug, base_price, brand_id, brand:brands(id, name, logo_url)');

      if (searchTerm) {
        productsQuery = productsQuery.ilike('name', `%${searchTerm}%`);
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
          productsQuery = productsQuery.in('brand_id', brandIds);
        } else {
          setProducts([]);
          return;
        }
      }

      if (filters.priceRange) {
        const [minPrice, maxPrice] = filters.priceRange.split('-').map(Number);
        productsQuery = productsQuery.gte('base_price', minPrice).lte('base_price', maxPrice || 1000);
      }

      const { data: productsData, error: productsError } = await productsQuery;

      if (productsError) {
        throw new Error(`Erreur lors de la récupération des produits: ${productsError.message}`);
      }

      if (!productsData) {
        throw new Error('Aucune donnée retournée par la requête.');
      }

      // Récupérer les images et les variants pour chaque produit
      const productsWithDetails = await Promise.all(
        productsData.map(async (product) => {
          // Récupérer les images du produit
          const { data: imagesData, error: imagesError } = await supabase
            .from('product_images')
            .select('id, image_url, alt_text, is_primary')
            .eq('product_variant_id', product.id);

          if (imagesError) {
            console.error(`Erreur lors de la récupération des images pour le produit ${product.id}: ${imagesError.message}`);
          }

          // Récupérer les variants du produit
          const { data: variantsData, error: variantsError } = await supabase
            .from('product_variants')
            .select('id, color_family, price, gender')
            .eq('product_id', product.id);

          if (variantsError) {
            console.error(`Erreur lors de la récupération des variants pour le produit ${product.id}: ${variantsError.message}`);
          }

          // Filtrer les variants par gender si nécessaire
          let filteredVariants = variantsData || [];
          if (filters.gender) {
            filteredVariants = filteredVariants.filter(variant => variant.gender === filters.gender);
          }

          // Filtrer les variants par color_family si nécessaire
          if (filters.colorFamilies && filters.colorFamilies.length > 0) {
            filteredVariants = filteredVariants.filter(variant =>
              filters.colorFamilies!.includes(variant.color_family)
            );
          }

          return {
            ...product,
            brand: product.brand || { id: 0, name: '', logo_url: null },
            product_images: imagesData || [],
            product_variants: filteredVariants,
          };
        })
      );

      // Filtrer les produits qui n'ont pas de variants correspondants aux filtres
      const filteredProducts = productsWithDetails.filter(product => {
        if (filters.gender && product.product_variants.length === 0) {
          return false;
        }
        if (filters.colorFamilies && filters.colorFamilies.length > 0 && product.product_variants.length === 0) {
          return false;
        }
        return true;
      });

      setProducts(filteredProducts);
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
