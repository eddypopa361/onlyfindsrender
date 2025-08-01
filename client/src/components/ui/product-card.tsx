import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Calculate price label from priceUSD or fallback to legacy price
  const getPriceLabel = () => {
    if (product.priceUSD) {
      const priceNum = parseFloat(product.priceUSD);
      return Number.isFinite(priceNum) ? `$${priceNum.toFixed(2)}` : "";
    }
    return product.price.startsWith('$') ? product.price : `$${product.price}`;
  };

  const priceLabel = getPriceLabel();

  return (
    <a
      href={product.buyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-gray-900 bg-black hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
      aria-label={`Buy ${product.title}`}
    >
      <Card className="rounded-2xl overflow-hidden bg-transparent border-0 h-full">
        <div className="relative pb-[100%] overflow-hidden">
          <picture>
            <source srcSet={`${product.image}.webp`} type="image/webp" />
            <img 
              src={product.image} 
              alt={product.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/uploads/placeholder-shoe.jpg';
              }}
            />
          </picture>
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
