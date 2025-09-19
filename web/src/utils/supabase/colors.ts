import { supabase } from '@/utils/supabase/client';

interface ColorFamily {
  color_family: string;
}

export const fetchDistinctColorFamilies = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase.rpc('get_distinct_color_families');

    if (error) {
      console.error('Erreur lors de la récupération des couleurs :', error);
      return [];
    }

    // Vérifier que `data` est bien un tableau
    if (!Array.isArray(data)) {
      console.error('Les données retournées ne sont pas un tableau.');
      return [];
    }

    // Extraire les couleurs uniques
    const uniqueColors = [...new Set(data.map((item: ColorFamily) => item.color_family))];
    return uniqueColors;
  } catch (err) {
    console.error('Erreur inattendue lors de la récupération des couleurs :', err);
    return [];
  }
};
