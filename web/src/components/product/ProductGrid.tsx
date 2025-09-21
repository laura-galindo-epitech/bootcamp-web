import Link from 'next/link';

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

interface ProductGridProps {
  items: Product[];
}

export default function ProductGrid({ items }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const primaryImage = item.product_images.find(img => img.is_primary) || item.product_images[0];

        return (
          <Link key={item.id} href={`/products/${item.slug}`} className="block border rounded-2xl overflow-hidden bg-white">
            {/* Image du produit */}
            <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
              {primaryImage ? (
                <img
                  src={primaryImage.image_url}
                  alt={primaryImage.alt_text || item.name}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.style.display = 'none';
                  }}
                />
              ) : null}
              {!primaryImage && <ImagePlaceholder />}
              {primaryImage && <ImagePlaceholder style={{ display: 'none' }} />}
            </div>

            {/* Contenu de la carte */}
            <div className="p-3">
              {/* Marque et logo */}
              <div className="flex items-center gap-2 mb-1">
                {item.brand.logo_url ? (
                  <div className="relative w-6 h-6">
                    <img
                      src={item.brand.logo_url}
                      alt={`${item.brand.name} logo`}
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
        );
      })}
    </div>
  );
}
