import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

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

export default function ProductCard({ product }: { product: Product }) {
  const minPrice = product.product_variants.length > 0
    ? Math.min(...product.product_variants.map(v => v.price))
    : product.base_price;

  return (
    <Link href={`/products/${product.slug}`} className="group block border rounded-2xl overflow-hidden bg-white">
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        {product.product_images.length > 0 ? (
          <img
            src={product.product_images[0].image_url}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/placeholder-image.jpg'; // Image de remplacement
            }}
          />
        ) : (
          <img
            src="/placeholder-image.jpg"
            alt={product.name}
            className="object-cover w-full h-full"
          />
        )}
      </div>
      <div className="p-3">
        {/* Section Marque et Logo */}
        <div className="flex items-center gap-2 mb-1">
          {product.brand.logo_url && (
            <div className="relative w-6 h-6">
              <Image
                src={product.brand.logo_url}
                alt={`${product.brand.name} logo`}
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
          <span className="text-xs text-gray-500 truncate">{product.brand.name}</span>
        </div>

        {/* Nom du produit */}
        <div className="font-medium truncate">{product.name}</div>

        {/* Prix */}
        <div className="text-sm mt-1">{formatPrice(minPrice)}</div>
      </div>
    </Link>
  );
}
