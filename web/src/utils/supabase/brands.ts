import { supabase } from '@/utils/supabase/client';

interface Brand {
  name: string;
}

export const fetchDistinctBrands = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase.rpc('get_distinct_brand_names');

    if (error) {
      console.error('Erreur lors de la récupération des marques :', error);
      return [];
    }

    // Vérifier que `data` est bien un tableau et extraire les noms uniques
    if (!Array.isArray(data)) {
      console.error('Les données retournées ne sont pas un tableau.');
      return [];
    }

    // Extraire les noms uniques
    const uniqueBrands = [...new Set(data.map((item: Brand) => item.name))];
    return uniqueBrands;
  } catch (err) {
    console.error('Erreur inattendue lors de la récupération des marques :', err);
    return [];
  }
};
