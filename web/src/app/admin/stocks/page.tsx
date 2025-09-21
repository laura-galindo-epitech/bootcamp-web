'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';

interface ProductVariant {
  id: number;
  sku: string;
  product_id: number;
  product_name: string;
  color_family: string;
  eu_size: number;
  gender: string;
}

interface Stock {
  id: number;
  product_variant_id: number;
  quantity_change: number;
  reason: string;
  created_at: string;
}

interface StockWithVariant extends Stock {
  variant: ProductVariant;
}

// Valeurs autorisées pour le motif de stock
const stockReasons = ['initial', 'restock', 'sale', 'return', 'damage', 'adjustment'];

export default function StocksPage() {
  const [stocks, setStocks] = useState<StockWithVariant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [quantityChange, setQuantityChange] = useState<number>(0);
  const [reason, setReason] = useState<string>('');

  useEffect(() => {
    const fetchStocksAndVariants = async () => {
      try {
        // Récupérer les variants de produits
        const { data: variantsData, error: variantsError } = await supabase
          .from('product_variants')
          .select('id, sku, product_id, color_family, eu_size, gender, products(name)');
        if (variantsError) {
          throw variantsError;
        }
        const formattedVariants = variantsData.map(variant => ({
          ...variant,
          product_name: variant.products.name
        }));
        setProductVariants(formattedVariants);

        // Récupérer les mouvements de stock
        const { data: stocksData, error: stocksError } = await supabase
          .from('stocks')
          .select('*, product_variants(*, products(name))');
        if (stocksError) {
          throw stocksError;
        }
        const formattedStocks = stocksData.map(stock => ({
          ...stock,
          variant: {
            ...stock.product_variants,
            product_name: stock.product_variants.products.name
          }
        }));
        setStocks(formattedStocks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
        console.error('Erreur détaillée :', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStocksAndVariants();
  }, []);

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariantId || !reason) {
      setError('Veuillez sélectionner un variant et un motif.');
      return;
    }
    // Vérifier que la quantité n'est pas égale à 0
    if (quantityChange === 0) {
      setError('La quantité ne peut pas être égale à 0.');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('stocks')
        .insert([{
          product_variant_id: selectedVariantId,
          quantity_change: quantityChange,
          reason: reason,
        }])
        .select();
      if (error) {
        throw error;
      }
      // Mettre à jour la liste des stocks
      const { data: variantData } = await supabase
        .from('product_variants')
        .select('*, products(name)')
        .eq('id', selectedVariantId)
        .single();
      const newStock = {
        ...data[0],
        variant: {
          ...variantData,
          product_name: variantData.products.name
        }
      };
      setStocks([...stocks, newStock]);
      // Réinitialiser le formulaire
      setSelectedVariantId(null);
      setQuantityChange(0);
      setReason('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
      console.error('Erreur détaillée :', err);
    }
  };

  const calculateCurrentStock = (variantId: number) => {
    return stocks
      .filter(stock => stock.product_variant_id === variantId)
      .reduce((sum, stock) => sum + stock.quantity_change, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Stocks</h1>
        <Link href="/admin" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Retour au tableau de bord
        </Link>
      </div>
      <div className="mb-8 p-4 border rounded-lg bg-white">
        <h2 className="text-xl font-semibold mb-4">Ajouter un mouvement de stock</h2>
        <form onSubmit={handleAddStock} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">Variant de Produit</label>
              <select
                value={selectedVariantId || ''}
                onChange={(e) => setSelectedVariantId(Number(e.target.value))}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Sélectionnez un variant</option>
                {productVariants.map(variant => (
                  <option key={variant.id} value={variant.id}>
                    {variant.product_name} - {variant.color_family} - Taille {variant.eu_size} ({variant.gender})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">Quantité (positif pour ajouter, négatif pour retirer)</label>
              <input
                type="number"
                value={quantityChange}
                onChange={(e) => setQuantityChange(Number(e.target.value))}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Motif</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Sélectionnez un motif</option>
                {stockReasons.map((reasonOption) => (
                  <option key={reasonOption} value={reasonOption}>
                    {reasonOption}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Ajouter
          </button>
        </form>
      </div>
      {isLoading ? (
        <p className="text-center py-8">Chargement des stocks...</p>
      ) : error ? (
        <p className="text-center py-8 text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Produit</th>
                <th className="py-2 px-4 border">Variant</th>
                <th className="py-2 px-4 border">Quantité</th>
                <th className="py-2 px-4 border">Stock Actuel</th>
                <th className="py-2 px-4 border">Motif</th>
                <th className="py-2 px-4 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map(stock => (
                <tr key={stock.id}>
                  <td className="py-2 px-4 border">{stock.id}</td>
                  <td className="py-2 px-4 border">{stock.variant.product_name}</td>
                  <td className="py-2 px-4 border">
                    {stock.variant.color_family} - Taille {stock.variant.eu_size} ({stock.variant.gender})
                  </td>
                  <td className="py-2 px-4 border" style={{ color: stock.quantity_change < 0 ? 'red' : 'green' }}>
                    {stock.quantity_change > 0 ? `+${stock.quantity_change}` : stock.quantity_change}
                  </td>
                  <td className="py-2 px-4 border">{calculateCurrentStock(stock.product_variant_id)}</td>
                  <td className="py-2 px-4 border">{stock.reason}</td>
                  <td className="py-2 px-4 border">{new Date(stock.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
