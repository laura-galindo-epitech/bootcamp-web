import ProductCard from './ProductCard';

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
  model_slug: string;
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
        <ProductCard key={item.id} product={item} />
      ))}
    </div>
  );
}
