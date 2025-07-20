import { useState, lazy, Suspense, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useCarouselProducts } from "@/hooks/use-product-data";

// Încărcare lazy pentru react-slick (economisim încărcarea inițială)
const Slider = lazy(() => import("react-slick"));

export default function ProductCarousel() {
  const [isClient, setIsClient] = useState(false);

  // Încărcăm slider-ul doar după ce componentele principale s-au încărcat
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Use hook pentru a aduce produsele carousel (funcționează atât cu API cât și cu JSON static)
  const { data, isLoading, isError } = useCarouselProducts();

  // Get carousel products from the API
  const carouselProducts = data || [];

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000, // Viteză mai mare pentru tranziții
    slidesToShow: 4, // Reducem numărul pentru a îmbunătăți performanța
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Mai mult timp între slide-uri
    pauseOnHover: true,
    lazyLoad: "ondemand" as const, // Tipizare corectă pentru lazyLoad
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div className="py-8 px-4 relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-black pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black via-black/90 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/90 to-transparent"></div>
      
      {/* Glow effects - reduse la minim */}
      <div className="absolute -left-20 top-1/2 w-40 h-40 rounded-full bg-primary/30 filter blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        <h2 className="text-3xl font-heading font-bold mb-8 text-center text-white glow-text">
          Featured Products
        </h2>
        
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-red-900 rounded-3xl blur-xl opacity-50"></div>
          <div className="relative bg-black rounded-2xl p-6 md:p-8 border border-primary/20">
            
            {/* Center VIEW ALL button */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <Link href="/products">
                <Button className="bg-black text-white border-2 border-primary hover:bg-primary/50 hover:border-primary rounded-full px-16 py-3 font-bold tracking-wider transition-all duration-300 glow-button text-xl backdrop-blur-sm">
                  VIEW ALL
                </Button>
              </Link>
            </div>
            
            {/* Blurred carousel container */}
            <div className="filter blur-sm">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : isError ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-red-400">Error loading products</p>
                </div>
              ) : carouselProducts.length > 0 && isClient ? (
                <Suspense fallback={
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>
                }>
                  <Slider {...settings}>
                    {carouselProducts.map((product: Product) => (
                      <div key={product.id} className="px-2">
                        <FeaturedProductCard product={product} />
                      </div>
                    ))}
                  </Slider>
                </Suspense>
              ) : (
                <div className="flex justify-center items-center h-40">
                  <p className="text-gray-400">Loading carousel products...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedProductCard({ product }: { product: Product }) {
  return (
    <div className="rounded-xl overflow-hidden transition-all duration-300 bg-black border border-primary/20 hover:border-primary/50 h-full flex flex-col">
      <div className="relative pb-[100%] overflow-hidden bg-gradient-to-b from-primary/30 to-black">
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
            ${product.price}
          </span>
        </div>
        <picture>
          <source srcSet={`${product.image}.webp`} type="image/webp" />
          <img 
            src={product.image} 
            alt={product.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-all duration-300"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
      </div>
      
      <div className="p-4 text-center text-white flex-grow flex flex-col">
        <h3 className="font-heading font-semibold text-sm mb-2 text-white line-clamp-1">
          {product.title}
        </h3>
        
        <div className="mt-auto flex flex-col gap-2">
          <a 
            href={product.buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center px-3 py-1.5 bg-primary text-white font-heading text-xs font-medium rounded hover:bg-primary/80 transition-all glow-button"
          >
            Buy Now
          </a>
          <a 
            href={product.viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center px-3 py-1.5 border border-primary text-white font-heading text-xs font-medium rounded hover:bg-primary/30 transition-all"
          >
            ONLYFINDS
          </a>
        </div>
      </div>
    </div>
  );
}