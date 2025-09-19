import { supabase } from '@/utils/supabase/client';

interface Brand {
  name: string;
}

export const fetchDistinctBrands = async (): Promise<Brand[]> => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('name');

    if (error) {
      console.error('Erreur lors de la récupération des marques :', error);
      return [];
    }

    // Filtrer les doublons
    const uniqueBrandsMap = new Map<string, Brand>();
    data.forEach((brand) => {
      if (!uniqueBrandsMap.has(brand.name)) {
        uniqueBrandsMap.set(brand.name, brand);
      }
    });

    return Array.from(uniqueBrandsMap.values());
  } catch (err) {
    console.error('Erreur inattendue lors de la récupération des marques :', err);
    return [];
  }
};
