import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/lib/types";
import { Link } from 'wouter';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="rounded-2xl overflow-hidden glow-card transition-all duration-300 card-zoom h-full border border-gray-900 shadow-[0_0_0_1px_#000]">
      <div className="relative pb-[100%] overflow-hidden cursor-pointer">
        <Link href={`/product/${product.id}`}>
          <div className="absolute top-2 right-2 z-10">
            <span className="bg-primary/90 text-white text-xs font-medium px-2 py-1 rounded-full">
              {product.price.startsWith('$') ? product.price : `$${product.price}`}
            </span>
          </div>
          <picture>
            <source srcSet={`${product.image}.webp`} type="image/webp" />
            <img 
              src={product.image} 
              alt={product.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover product-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/uploads/placeholder-shoe.jpg';
              }}
            />
          </picture>
        </Link>
      </div>
      <CardContent className="p-4 text-white">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-heading font-semibold text-sm md:text-base mb-3 line-clamp-2 h-10 text-primary-100 cursor-pointer hover:text-primary-300 transition-colors">
            {product.title}
          </h3>
        </Link>
        <div className="flex flex-col gap-2">
          <a 
            href={product.buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center px-3 py-2 bg-primary text-white font-heading font-medium rounded-md hover:bg-primary/90 transition-all glow-button"
          >
            Buy Now
          </a>
          <div className="grid grid-cols-2 gap-2">
            <a 
              href={product.viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center px-3 py-2 border border-primary text-primary-300 font-heading font-medium rounded-md hover:bg-primary/10 transition-all text-xs"
            >
              View Details
            </a>
            <Link 
              href={`/product/${product.id}`}
              className="text-center px-3 py-2 bg-gray-800 text-white font-heading font-medium rounded-md hover:bg-gray-700 transition-all text-xs"
            >
              More Info
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
