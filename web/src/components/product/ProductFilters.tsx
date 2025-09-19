'use client';

import React, { useState, useEffect } from 'react';
import { fetchDistinctBrands } from '@/utils/supabase/brands';
import { fetchDistinctColorFamilies } from '@/utils/supabase/colors';

type Filters = {
  gender?: string;
  brands?: string[];
  priceRange?: string;
  colorFamilies?: string[];
};

const genders = [
  { key: 'men', label: 'Homme' },
  { key: 'women', label: 'Femme' },
  { key: 'kids', label: 'Enfant' },
];

const priceRanges = [
  { label: '5-15€', value: '5-15' },
  { label: '15-20€', value: '15-20' },
  { label: '20-25€', value: '20-25' },
  { label: '25-30€', value: '25-30' },
  { label: '30-35€', value: '30-35' },
  { label: '35-45€', value: '35-45' },
];

export default function ProductFilters({ value, onChange }: { value: Filters; onChange: (f: Filters) => void }) {
  const [brands, setBrands] = useState<string[]>([]);
  const [colorFamilies, setColorFamilies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [distinctBrands, distinctColors] = await Promise.all([
          fetchDistinctBrands(),
          fetchDistinctColorFamilies(),
        ]);
        setBrands(distinctBrands);
        setColorFamilies(distinctColors);
      } catch (err) {
        console.error('Erreur lors du chargement des filtres :', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleGenderChange = (gender: string) => {
    onChange({ ...value, gender: value.gender === gender ? undefined : gender });
  };

  const handleBrandChange = (brand: string) => {
    const updatedBrands = value.brands?.includes(brand)
      ? value.brands?.filter((b) => b !== brand)
      : [...(value.brands || []), brand];
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
              key={brand}
              onClick={() => handleBrandChange(brand)}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                value.brands?.includes(brand) ? 'bg-black text-white' : 'hover:bg-zinc-50'
              }`}
            >
              {brand}
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
