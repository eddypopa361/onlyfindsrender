import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/lib/types";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { resolveImage } from "@shared/image";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Calculate price label from priceUSD or fallback to legacy price
  const getPriceLabel = () => {
    if (product.priceUSD && Number.isFinite(product.priceUSD)) {
      return `$${product.priceUSD.toFixed(2)}`;
    }
    if (product.price) {
      return product.price.startsWith('$') ? product.price : `$${product.price}`;
    }
    return "";
  };

  const priceLabel = getPriceLabel();
  
  // Check if image is missing or invalid
  const hasValidImage = product.image && product.image.trim() !== '' && product.image.length > 10;
  const shouldShowFallback = !hasValidImage || imageError;
  
  // Debug log for problematic images
  if (!hasValidImage && product.title) {
    console.log('Image missing for product:', product.title, 'Image value:', product.image);
  }

  return (
    <a
      href={product.buyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border-2 border-primary/40 bg-black hover:border-primary/70 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 outline outline-1 outline-primary/60 outline-offset-2 hover:outline-primary/90 hover:outline-offset-3"
      aria-label={`Buy ${product.title}`}
      style={{
        boxShadow: '0 0 15px rgba(0, 189, 255, 0.3), 0 0 30px rgba(0, 189, 255, 0.1)'
      }}
    >
      <Card className="rounded-2xl overflow-hidden bg-transparent border-0 h-full">
        <div className="relative pb-[100%] overflow-hidden">
          {shouldShowFallback ? (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-900/50 rounded-t-2xl">
              <HelpCircle className="w-12 h-12 text-primary" />
            </div>
          ) : (
            <img 
              src={resolveImage(product.image)} 
              alt={product.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                console.error('Image failed to load:', product.title, product.image);
                setImageError(true);
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', product.title);
              }}
            />
          )}
        </div>
        <CardContent className="p-4 text-white">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading font-semibold text-sm md:text-base line-clamp-2 text-white group-hover:text-primary transition-colors">
              {product.title}
            </h3>
            {priceLabel && (
              <span className="shrink-0 rounded-md bg-primary/20 px-2 py-1 text-xs font-semibold text-white ring-1 ring-inset ring-primary/40">
                {priceLabel}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
