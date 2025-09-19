'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';

type Filters = {
  gender?: string;
  brands?: string[];
  priceRange?: string;
  colorFamilies?: string[];
};

interface Brand {
  id: number;
  name: string;
}

const genders = [
  { key: 'men', label: 'Homme' },
  { key: 'women', label: 'Femme' },
  { key: 'kids', label: 'Enfant' },
];

const priceRanges = [
  { label: '0-10€', value: '0-10' },
  { label: '10-20€', value: '10-20' },
  { label: '20-30€', value: '20-30' },
  { label: '30-40€', value: '30-40' },
  { label: '40-50€', value: '40-50' },
  { label: '50-60€', value: '50-60' },
];

export default function ProductFilters({ value, onChange }: { value: Filters; onChange: (f: Filters) => void }) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [colorFamilies, setColorFamilies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Récupérer les marques distinctes
        const { data: brandsData, error: brandsError } = await supabase
          .from('brands')
          .select('id, name');

        if (brandsError) {
          console.error('Erreur lors de la récupération des marques :', brandsError);
        } else {
          setBrands(brandsData || []);
        }

        // Récupérer les familles de couleurs distinctes
        const { data: colorsData, error: colorsError } = await supabase
          .from('product_variants')
          .select('color_family');

        if (colorsError) {
          console.error('Erreur lors de la récupération des couleurs :', colorsError);
        } else {
          const uniqueColors = [...new Set(colorsData.map((item: { color_family: string }) => item.color_family))];
          setColorFamilies(uniqueColors);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des filtres :', err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleGenderChange = (gender: string) => {
    onChange({ ...value, gender: value.gender === gender ? undefined : gender });
  };

  const handleBrandChange = (brandId: number) => {
    const brandName = brands.find(brand => brand.id === brandId)?.name;
    if (!brandName) return;

    const updatedBrands = value.brands?.includes(brandName)
      ? value.brands?.filter((b) => b !== brandName)
      : [...(value.brands || []), brandName];
    onChange({ ...value, brands: updatedBrands });
  };

  const handlePriceRangeChange = (range: string) => {
    onChange({ ...value, priceRange: value.priceRange === range ? undefined : range });
  };

  const handleColorFamilyChange = (color: string) => {
    const updatedColors = value.colorFamilies?.includes(color)
      ? value.colorFamilies?.filter((c) => c !== color)
      : [...(value.colorFamilies || []), color];
    onChange({ ...value, colorFamilies: updatedColors });
  };

  if (isLoading) {
    return <div>Chargement des filtres...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filtre par genre (Homme/Femme/Enfant) */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          {genders.map((g) => (
            <button
              key={g.key}
              onClick={() => handleGenderChange(g.key)}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                value.gender === g.key ? 'bg-black text-white' : 'hover:bg-zinc-50'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtre par marque */}
      <div className="filter-group">
        <label className="font-medium">Marque</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => handleBrandChange(brand.id)}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                value.brands?.includes(brand.name) ? 'bg-black text-white' : 'hover:bg-zinc-50'
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filtre par prix */}
      <div className="filter-group">
        <label className="font-medium">Prix</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {priceRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => handlePriceRangeChange(range.value)}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                value.priceRange === range.value ? 'bg-black text-white' : 'hover:bg-zinc-50'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtre par nuance de couleur */}
      <div className="filter-group">
        <label className="font-medium">Couleur</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {colorFamilies.map((color) => (
            <button
              key={color}
              onClick={() => handleColorFamilyChange(color)}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                value.colorFamilies?.includes(color) ? 'bg-black text-white' : 'hover:bg-zinc-50'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
