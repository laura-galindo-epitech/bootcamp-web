import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

// Composant SVG pour l'image de remplacement
const ImagePlaceholder = () => (
  <svg className="w-full h-full bg-gray-100 text-gray-400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="currentColor" opacity="0.3" />
    <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fill="currentColor" className="text-xs">
      Image non disponible
    </text>
  </svg>
);

// Composant SVG pour le logo de remplacement
const LogoPlaceholder = () => (
  <svg className="w-full h-full bg-gray-100 text-gray-400 rounded-full" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="25" r="25" fill="currentColor" opacity="0.3" />
    <text x="25" y="25" textAnchor="middle" dominantBaseline="middle" fill="currentColor" className="text-[8px]">
      Logo
    </text>
  </svg>
);

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
  id: number;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
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

  const primaryImage = product.product_images.find(img => img.is_primary) || product.product_images[0];

  return (
    <Link href={`/products/${product.slug}`} className="group block border rounded-2xl overflow-hidden bg-white">
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        {primaryImage ? (
          <>
            <img
              src={primaryImage.image_url}
              alt={primaryImage.alt_text || product.name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.style.display = 'none';
              }}
            />
            <div className="hidden absolute inset-0">
              <ImagePlaceholder />
            </div>
          </>
        ) : (
          <ImagePlaceholder />
        )}
      </div>
      <div className="p-3">
        {/* Section Marque et Logo */}
        <div className="flex items-center gap-2 mb-1">
          {product.brand.logo_url ? (
            <div className="relative w-6 h-6">
              <img
                src={product.brand.logo_url}
                alt={`${product.brand.name} logo`}
                className="object-contain w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.style.display = 'none';
                }}
              />
              <div style={{ display: 'none' }}><LogoPlaceholder /></div>
            </div>
          ) : (
            <div className="relative w-6 h-6">
              <LogoPlaceholder />
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
