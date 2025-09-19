import Link from 'next/link';
import Image from 'next/image';
import Link from 'next/link';

interface Brand {
  id: number;
  name: string;
  logo_url: string | null;
}

interface ProductVariant {
  color_family: string;
  price: number;
}

interface ProductImage {
  image_url: string;
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

interface ProductGridProps {
  items: Product[];
}

export default function ProductGrid({ items }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Link key={item.id} href={`/products/${item.slug}`} className="block border rounded-2xl overflow-hidden bg-white">
          {/* Image du produit */}
          <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
            {item.product_images.length > 0 ? (
              <img
                src={item.product_images[0].image_url}
                alt={item.name}
                className="object-cover w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/placeholder-image.jpg'; // Image de remplacement
                }}
              />
            ) : (
              <img
                src="/placeholder-image.jpg"
                alt={item.name}
                className="object-cover w-full h-full"
              />
            )}
          </div>

          {/* Contenu de la carte */}
          <div className="p-3">
            {/* Marque et logo */}
            <div className="flex items-center gap-2 mb-1">
              {item.brand.logo_url && (
                <div className="relative w-6 h-6">
                  <Image
                    src={item.brand.logo_url}
                    alt={`${item.brand.name} logo`}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/placeholder-logo.jpg'; // Logo de remplacement
                    }}
                  />
                </div>
              )}
              <span className="text-xs text-gray-500 truncate">{item.brand.name}</span>
            </div>

            {/* Nom du produit */}
            <h3 className="font-medium truncate">{item.name}</h3>

            {/* Prix */}
            <p className="text-sm text-zinc-500">
              {item.product_variants.length > 0
                ? Math.min(...item.product_variants.map(v => v.price)).toFixed(2) + ' €'
                : item.base_price.toFixed(2) + ' €'}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
