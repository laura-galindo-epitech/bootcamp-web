import React, { useState } from 'react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  base_price: number;
  images: Array<{ image_url: string; alt_text: string }>;
  brand_logo?: string | null;
  brand_name?: string | null;
}

interface ProductGridProps {
  items: Product[];
}

export default function ProductGrid({ items }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.id} className="border rounded-lg p-4 space-y-3">
          {/* Carrousel d'images */}
          <ProductCarousel images={item.images} />

          {/* Marque */}
          {item.brand_logo || item.brand_name ? (
            <div className="flex items-center gap-2">
              {item.brand_logo && (
                <Image
                  src={item.brand_logo}
                  alt={item.brand_name || 'Logo de la marque'}
                  width={24}
                  height={24}
                />
              )}
              {item.brand_name && (
                <span className="text-sm font-medium">{item.brand_name}</span>
              )}
            </div>
          ) : (
            <div className="h-6"></div> // Espace réservé si pas de marque
          )}

          {/* Nom et prix */}
          <h3 className="font-medium truncate">{item.name}</h3>
          <p className="text-sm text-zinc-500">{item.base_price} €</p>
        </div>
      ))}
    </div>
  );
}

// Composant pour le carrousel d'images
function ProductCarousel({ images }: { images: Array<{ image_url: string; alt_text: string }> }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (images.length === 0) {
    return <div className="relative w-full h-48 bg-gray-100 rounded"></div>;
  }

  return (
    <div className="relative w-full h-48">
      {/* Image actuelle */}
      <Image
        src={images[currentImageIndex].image_url}
        alt={images[currentImageIndex].alt_text}
        fill
        className="object-cover rounded"
      />

      {/* Contrôles du carrousel (si plusieurs images) */}
      {images.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow"
            onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
          >
            &lt;
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow"
            onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
          >
            &gt;
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-gray-400'}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
