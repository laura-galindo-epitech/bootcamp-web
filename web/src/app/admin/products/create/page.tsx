'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Fonction pour convertir une chaîne en slug
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
};

// Fonction pour générer un SKU unique
const generateSku = (productId: number, color: string, size: number, gender: string): string => {
  const colorCode = color.substring(0, 3).toUpperCase();
  const sizeCode = size.toString().padStart(2, '0');
  const genderCode = gender.substring(0, 1).toUpperCase();
  return `${productId}-${colorCode}-${sizeCode}-${genderCode}`;
};

interface Brand {
  id: number;
  name: string;
}

interface ProductVariant {
  color_family: string;
  price: number;
  gender: string;
  sku: string;
  eu_size: number;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  stock_quantity: number;
  isNewColor?: boolean;
}

export default function CreateProductPage() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [brandId, setBrandId] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [colorFamilies, setColorFamilies] = useState<string[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([
    { color_family: '', price: 0, gender: '', sku: '', eu_size: 0, image_url: '', alt_text: '', is_primary: false, stock_quantity: 0, isNewColor: false }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Vérifie si un slug est unique
  const isSlugUnique = async (slug: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return !data;
  };

  // Vérifie si un SKU est unique
  const isSkuUnique = async (sku: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('product_variants')
      .select('id')
      .eq('sku', sku)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return !data;
  };

  useEffect(() => {
    const fetchBrandsAndColorFamilies = async () => {
      try {
        // Récupérer les marques
        const { data: brandsData, error: brandsError } = await supabase
          .from('brands')
          .select('id, name');
        if (brandsError) {
          throw new Error(`Erreur lors de la récupération des marques: ${brandsError.message}`);
        }
        setBrands(brandsData || []);

        // Récupérer les familles de couleur existantes
        const { data: colorFamiliesData, error: colorFamiliesError } = await supabase
          .from('product_variants')
          .select('color_family')
          .not('color_family', 'is', null); // Exclure les valeurs NULL

        if (colorFamiliesError) {
          throw new Error(`Erreur lors de la récupération des familles de couleur: ${colorFamiliesError.message}`);
        }
        
        // Filtrer les valeurs "new" et les valeurs vides
        const uniqueColorFamilies = [...new Set(colorFamiliesData
          .map(item => item.color_family)
          .filter(color => color && color !== 'new'))];
        
        setColorFamilies(uniqueColorFamilies);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
        console.error('Erreur détaillée :', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBrandsAndColorFamilies();
  }, []);

  // Générer automatiquement le slug à partir du nom
  useEffect(() => {
    if (name && !slug) {
      setSlug(generateSlug(name));
    }
  }, [name, slug]);

  const handleAddVariant = () => {
    setVariants([...variants, { color_family: '', price: 0, gender: '', sku: '', eu_size: 0, image_url: '', alt_text: '', is_primary: false, stock_quantity: 0, isNewColor: false }]);
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: string | number | boolean) => {
    const newVariants = [...variants];

    if (field === 'color_family' && value === 'Nouvelle couleur...') {
      newVariants[index].color_family = '';
      newVariants[index].isNewColor = true;
    } else if (field === 'color_family' && newVariants[index].isNewColor && typeof value === 'string') {
      newVariants[index].color_family = value;
    } else {
      newVariants[index][field] = value as never;
    }

    setVariants(newVariants);
  };

  const validateForm = () => {
    if (basePrice <= 0) {
      setError('Le prix de base doit être supérieur à 0.');
      return false;
    }
    if (!brandId) {
      setError('Veuillez sélectionner une marque.');
      return false;
    }
    if (!name) {
      setError('Veuillez entrer un nom pour le produit.');
      return false;
    }
    for (const variant of variants) {
      if (variant.price <= 0) {
        setError('Le prix de chaque variant doit être supérieur à 0.');
        return false;
      }
      if (!variant.eu_size || !variant.gender) {
        setError('Les champs "Taille EU" et "Genre" sont obligatoires pour chaque variant.');
        return false;
      }
      if (variant.gender && !['man', 'woman', 'child'].includes(variant.gender)) {
        setError('Le genre doit être "Homme", "Femme" ou "Enfant".');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Si le slug n'est pas rempli, le générer automatiquement
      let finalSlug = slug || generateSlug(name);

      // Vérifier l'unicité du slug
      let isSlugUniqueResult = await isSlugUnique(finalSlug);
      while (!isSlugUniqueResult) {
        finalSlug = `${finalSlug}-${Math.floor(Math.random() * 1000)}`;
        isSlugUniqueResult = await isSlugUnique(finalSlug);
      }

      // Créer le produit
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert([{
          name,
          slug: finalSlug,
          description,
          base_price: basePrice,
          brand_id: brandId,
          is_active: isActive,
        }])
        .select()
        .single();

      if (productError) {
        throw new Error(`Erreur lors de la création du produit: ${productError.message}`);
      }
      if (!productData) {
        throw new Error('Aucune donnée retournée après la création du produit.');
      }

      // Créer les variants et les stocks
      for (const variant of variants) {
        // Générer un SKU si vide
        const sku = variant.sku || generateSku(productData.id, variant.color_family, variant.eu_size, variant.gender);

        // Vérifier l'unicité du SKU
        const isUnique = await isSkuUnique(sku);
        if (!isUnique) {
          setError(`Le SKU "${sku}" existe déjà. Veuillez utiliser un SKU unique.`);
          return;
        }

        // Créer le variant
        const { data: variantData, error: variantError } = await supabase
          .from('product_variants')
          .insert([{
            product_id: productData.id,
            color_family: variant.color_family,
            price: variant.price,
            gender: variant.gender,
            sku: sku,
            eu_size: variant.eu_size,
            image_url: variant.image_url,
          }])
          .select()
          .single();

        if (variantError) {
          throw new Error(`Erreur lors de la création du variant: ${variantError.message}`);
        }
        if (!variantData) {
          throw new Error('Aucune donnée retournée après la création du variant.');
        }

        // Ajouter le stock initial
        const { error: stockError } = await supabase
          .from('stocks')
          .insert([{
            product_variant_id: variantData.id,
            quantity_change: variant.stock_quantity,
            reason: 'initial',
          }]);

        if (stockError) {
          throw new Error(`Erreur lors de l'ajout du stock: ${stockError.message}`);
        }

        // Ajouter les images
        if (variant.image_url) {
          const { error: imageError } = await supabase
            .from('product_images')
            .insert([{
              product_variant_id: variantData.id,
              image_url: variant.image_url,
              alt_text: variant.alt_text,
              is_primary: variant.is_primary,
            }]);
          if (imageError) {
            throw new Error(`Erreur lors de l'ajout de l'image: ${imageError.message}`);
          }
        }
      }
      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
      console.error('Erreur détaillée :', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ajouter un produit</h1>
        <Link href="/admin/products" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Retour aux produits
        </Link>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nom</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Slug (optionnel)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Description (optionnelle)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Prix de base</label>
          <input
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
            min="0.01"
            step="0.01"
          />
          {basePrice <= 0 && <p className="text-red-500 text-sm mt-1">Le prix de base doit être supérieur à 0.</p>}
        </div>
        <div>
          <label className="block mb-1">Marque</label>
          <select
            value={brandId || ''}
            onChange={(e) => setBrandId(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Sélectionnez une marque</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isActive">Actif</label>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Variants</h2>
          {variants.map((variant, index) => (
            <div key={index} className="border p-4 mb-4 rounded">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1">Famille de couleur (optionnelle)</label>
                  <select
                    value={variant.isNewColor ? 'Nouvelle couleur...' : variant.color_family}
                    onChange={(e) => {
                      if (e.target.value === 'Nouvelle couleur...') {
                        handleVariantChange(index, 'color_family', '');
                        handleVariantChange(index, 'isNewColor', true);
                      } else {
                        handleVariantChange(index, 'color_family', e.target.value);
                        handleVariantChange(index, 'isNewColor', false);
                      }
                    }}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Sélectionnez une couleur</option>
                    {colorFamilies.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                    <option value="Nouvelle couleur...">Nouvelle couleur...</option>
                  </select>
                  {variant.isNewColor && (
                    <input
                      type="text"
                      value={variant.color_family}
                      onChange={(e) => handleVariantChange(index, 'color_family', e.target.value)}
                      className="w-full p-2 border rounded mt-2"
                      placeholder="Entrez une nouvelle couleur"
                    />
                  )}
                </div>
                <div>
                  <label className="block mb-1">Prix</label>
                  <input
                    type="number"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, 'price', Number(e.target.value))}
                    className="w-full p-2 border rounded"
                    required
                    min="0.01"
                    step="0.01"
                  />
                  {variant.price <= 0 && <p className="text-red-500 text-sm mt-1">Le prix doit être supérieur à 0.</p>}
                </div>
                <div>
                  <label className="block mb-1">Genre</label>
                  <select
                    value={variant.gender}
                    onChange={(e) => handleVariantChange(index, 'gender', e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Sélectionnez un genre</option>
                    <option value="man">Homme</option>
                    <option value="woman">Femme</option>
                    <option value="child">Enfant</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">SKU (optionnel)</label>
                  <input
                    type="text"
                    value={variant.sku}
                    onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Laissé vide pour générer automatiquement"
                  />
                </div>
                <div>
                  <label className="block mb-1">Taille EU</label>
                  <input
                    type="number"
                    value={variant.eu_size}
                    onChange={(e) => handleVariantChange(index, 'eu_size', Number(e.target.value))}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Quantité en stock</label>
                  <input
                    type="number"
                    value={variant.stock_quantity}
                    onChange={(e) => handleVariantChange(index, 'stock_quantity', Number(e.target.value))}
                    className="w-full p-2 border rounded"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block mb-1">URL de l'image (optionnel)</label>
                  <input
                    type="text"
                    value={variant.image_url}
                    onChange={(e) => handleVariantChange(index, 'image_url', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Texte alternatif de l'image (optionnel)</label>
                  <input
                    type="text"
                    value={variant.alt_text}
                    onChange={(e) => handleVariantChange(index, 'alt_text', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`isPrimary-${index}`}
                    checked={variant.is_primary || false}
                    onChange={(e) => handleVariantChange(index, 'is_primary', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor={`isPrimary-${index}`}>Image principale (optionnel)</label>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveVariant(index)}
                className="mt-2 text-red-500 hover:underline"
              >
                Supprimer ce variant
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddVariant}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Ajouter un variant
          </button>
        </div>
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
}
