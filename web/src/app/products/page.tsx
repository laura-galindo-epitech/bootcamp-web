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
  product_id: number;
  color_family: string;
  price: number;
  gender?: string;
  // Assuming a nested relation to get images
  product_images: { id: number; image_url: string; alt_text: string; is_primary: boolean }[];
}

interface Product {
  id: number;
  name: string;
  model_slug: string;
  brand: Brand;
  product_images: ProductImage[];
  product_variants: ProductVariant[];
}

interface ProductImage {
  id: number;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
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
      // Step 1: Fetch all products and brands
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, model_slug, brand:brands(id, name, logo_url)');

      if (productsError) {
        throw new Error(`Erreur lors de la récupération des produits: ${productsError.message}`);
      }

      if (!productsData) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      // Step 2: Fetch all product variants and their images
      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select(`
          id, product_id, color_family, price, gender,
          product_images(id, image_url, alt_text, is_primary)
        `);

      if (variantsError) {
        throw new Error(`Erreur lors de la récupération des variants: ${variantsError.message}`);
      }

      // Step 3: Combine and filter the data in-memory
      const productsMap = new Map<number, Product>();

      // Initialize the map with products
      productsData.forEach(product => {
        productsMap.set(product.id, {
          ...product,
          product_images: [],
          product_variants: [],
        });
      });

      // Populate variants and images for each product
      (variantsData || []).forEach(variant => {
        const product = productsMap.get(variant.product_id);
        if (product) {
          // Apply filters to variants
          let shouldIncludeVariant = true;
          if (filters.gender && variant.gender !== filters.gender) {
            shouldIncludeVariant = false;
          }
          if (shouldIncludeVariant && filters.colorFamilies && filters.colorFamilies.length > 0 && !filters.colorFamilies.includes(variant.color_family)) {
            shouldIncludeVariant = false;
          }
          if (shouldIncludeVariant && filters.priceRange) {
            const [minPrice, maxPrice] = filters.priceRange.split('-').map(Number);
            const variantPriceInCents = Math.round((variant.price ?? 0) * 100);
            if (variantPriceInCents < minPrice * 100 || variantPriceInCents > (maxPrice || Infinity) * 100) {
              shouldIncludeVariant = false;
            }
          }

          if (shouldIncludeVariant) {
            product.product_variants.push(variant as ProductVariant);
            // Add images from this variant to the product's image list
            (variant.product_images || []).forEach(img => {
              if (!product.product_images.some(existingImg => existingImg.id === img.id)) {
                product.product_images.push(img);
              }
            });
          }
        }
      });

      // Step 4: Final filtering of products
      let filteredProducts = Array.from(productsMap.values()).filter(product => {
        const productName = product.name.toLowerCase();
        const searchTermLower = searchTerm.toLowerCase();
        const matchesSearch = searchTermLower ? productName.includes(searchTermLower) : true;

        const brandName = product.brand?.name || '';
        const matchesBrand = (filters.brands && filters.brands.length > 0) ? filters.brands.includes(brandName) : true;

        return matchesSearch && matchesBrand && product.product_variants.length > 0;
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
