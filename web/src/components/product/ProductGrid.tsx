import React from 'react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  base_price: number;
  primary_image: string | null;
  brand_logo: string | null;
  brand_name: string | null;
}

interface ProductGridProps {
  items: Product[];
}

export default function ProductGrid({ items }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.id} className="border rounded-lg p-4 space-y-3">
          {item.primary_image && (
            <div className="relative w-full h-48">
              <Image
                src={item.primary_image}
                alt={item.name}
                fill
                className="object-cover rounded"
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            {item.brand_logo && (
              <Image
                src={item.brand_logo}
                alt={item.brand_name || 'Logo de la marque'}
                width={24}
                height={24}
              />
            )}
            <span className="text-sm font-medium">{item.brand_name}</span>
          </div>
          <h3 className="font-medium truncate">{item.name}</h3>
          <p className="text-sm text-zinc-500">{item.base_price} €</p>
        </div>
      ))}
    </div>
  );
}
