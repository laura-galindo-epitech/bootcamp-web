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

interface Brand {
  id: number;
  name: string;
}

interface ProductVariant {
  id?: number;
  color_family: string;
  price: number;
  gender: string;
  sku: string;
  eu_size: number;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  isNewColor?: boolean;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  brand_id: number;
  is_active: boolean;
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [brandId, setBrandId] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [colorFamilies, setColorFamilies] = useState<string[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProductAndBrands = async () => {
      try {
        // Récupérer les marques
        const { data: brandsData, error: brandsError } = await supabase
          .from('brands')
          .select('id, name');
        if (brandsError) {
          throw brandsError;
        }
        setBrands(brandsData || []);

        // Récupérer les familles de couleur existantes
        const { data: colorFamiliesData, error: colorFamiliesError } = await supabase
          .from('product_variants')
          .select('color_family')
          .not('color_family', 'is', null);

        if (colorFamiliesError) {
          throw colorFamiliesError;
        }

        // Filtrer les valeurs "new" et les valeurs vides
        const uniqueColorFamilies = [...new Set(colorFamiliesData
          .map(item => item.color_family)
          .filter(color => color && color !== 'new'))];

        setColorFamilies(uniqueColorFamilies);

        // Récupérer le produit
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .maybeSingle();

        if (productError) {
          throw productError;
        }
        if (productData) {
          setName(productData.name);
          setSlug(productData.slug);
          setDescription(productData.description || '');
          setBasePrice(productData.base_price);
          setBrandId(productData.brand_id);
          setIsActive(productData.is_active);
        }

        // Récupérer les variants du produit
        const { data: variantsData, error: variantsError } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', params.id);

        if (variantsError) {
          throw variantsError;
        }
        if (variantsData) {
          // Récupérer les images pour chaque variant
          const variantsWithImages = await Promise.all(variantsData.map(async (variant) => {
            const { data: imagesData, error: imagesError } = await supabase
              .from('product_images')
              .select('*')
              .eq('product_variant_id', variant.id);

            if (imagesError) {
              throw imagesError;
            }
            const image = imagesData && imagesData.length > 0 ? imagesData[0] : { image_url: '', alt_text: '', is_primary: false };
            return {
              ...variant,
              image_url: image.image_url,
              alt_text: image.alt_text,
              is_primary: image.is_primary,
              isNewColor: false,
            };
          }));
          setVariants(variantsWithImages);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
        console.error('Erreur détaillée :', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductAndBrands();
  }, [params.id]);

  // Générer automatiquement le slug à partir du nom
  useEffect(() => {
    if (name && !slug) {
      setSlug(generateSlug(name));
    }
  }, [name, slug]);

  const handleAddVariant = () => {
    setVariants([...variants, { color_family: '', price: 0, gender: '', sku: '', eu_size: 0, image_url: '', alt_text: '', is_primary: false, isNewColor: false }]);
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
    for (const variant of variants) {
      if (variant.price <= 0) {
        setError('Le prix de chaque variant doit être supérieur à 0.');
        return false;
      }
      if (!variant.eu_size || !variant.gender) {
        setError('Les champs "Taille EU" et "Genre" sont obligatoires pour chaque variant.');
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
    try {
      // Si le slug n'est pas rempli, le générer automatiquement
      const finalSlug = slug || generateSlug(name);

      // Mettre à jour le produit
      const { error: productError } = await supabase
        .from('products')
        .update({
          name,
          slug: finalSlug,
          description,
          base_price: basePrice,
          brand_id: brandId,
          is_active: isActive,
        })
        .eq('id', params.id);

      if (productError) {
        throw productError;
      }

      // Mettre à jour les variants et les images
      for (const variant of variants) {
        if (variant.id) {
          // Mettre à jour un variant existant
          const { error: variantError } = await supabase
            .from('product_variants')
            .update({
              color_family: variant.color_family,
              price: variant.price,
              gender: variant.gender,
              sku: variant.sku,
              eu_size: variant.eu_size,
              image_url: variant.image_url,
            })
            .eq('id', variant.id);

          if (variantError) {
            throw variantError;
          }

          // Mettre à jour les images
          const { data: existingImages, error: existingImagesError } = await supabase
            .from('product_images')
            .select('*')
            .eq('product_variant_id', variant.id);

          if (existingImagesError) {
            throw existingImagesError;
          }

          if (existingImages && existingImages.length > 0) {
            const { error: imageError } = await supabase
              .from('product_images')
              .update({
                image_url: variant.image_url,
                alt_text: variant.alt_text,
                is_primary: variant.is_primary,
              })
              .eq('id', existingImages[0].id);

            if (imageError) {
              throw imageError;
            }
          } else if (variant.image_url) {
            const { error: imageError } = await supabase
              .from('product_images')
              .insert([{
                product_variant_id: variant.id,
                image_url: variant.image_url,
                alt_text: variant.alt_text,
                is_primary: variant.is_primary,
              }]);

            if (imageError) {
              throw imageError;
            }
          }
        } else {
          // Créer un nouveau variant
          const { data: variantData, error: variantError } = await supabase
            .from('product_variants')
            .insert([{
              product_id: params.id,
              color_family: variant.color_family,
              price: variant.price,
              gender: variant.gender,
              sku: variant.sku,
              eu_size: variant.eu_size,
              image_url: variant.image_url,
            }])
            .select()
            .single();

          if (variantError) {
            throw variantError;
          }

          // Créer les images
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
              throw imageError;
            }
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
        <h1 className="text-2xl font-bold">Modifier le Produit</h1>
        <div className="flex gap-4">
          <Link href="/admin/products" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Retour aux produits
          </Link>
        </div>
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
          <label className="block mb-1">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Laissé vide pour générer automatiquement à partir du nom"
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
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
                  <label className="block mb-1">Famille de couleur</label>
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
                  <label className="block mb-1">SKU</label>
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
                  <label className="block mb-1">URL de l'image</label>
                  <input
                    type="text"
                    value={variant.image_url}
                    onChange={(e) => handleVariantChange(index, 'image_url', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Texte alternatif de l'image</label>
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
                  <label htmlFor={`isPrimary-${index}`}>Image principale</label>
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
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" disabled={isLoading}>
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <Link href="/admin/stocks" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Gérer les Stocks
          </Link>
        </div>
      </form>
    </div>
  );
}
