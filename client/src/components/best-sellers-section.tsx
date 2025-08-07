import { lazy, Suspense, useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useFeaturedProducts } from "@/hooks/use-product-data";

// Lazy loading pentru ProductCard
const ProductCard = lazy(() => import("@/components/ui/product-card").then(mod => ({ default: mod.ProductCard })));

export default function BestSellersSection() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Folosim IntersectionObserver pentru a încărca produsele doar când secțiunea este vizibilă
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Nu mai avem nevoie să observăm odată ce a devenit vizibil
        }
      },
      { threshold: 0.1 } // Începe să încarce când 10% din secțiune este vizibilă
    );
    
    const section = document.getElementById('bestsellers');
    if (section) {
      observer.observe(section);
    }
    
    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  // Folosim hook-ul nostru personalizat care suportă atât API cât și JSON static
  const { data: products, isLoading, isError } = useFeaturedProducts();

  // Loading state vizibil
  if (isLoading) {
    return (
      <section className="py-12 bg-black relative -mb-8">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-white">
              Best Sellers
            </h2>
          </div>
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-white">Loading best sellers...</span>
          </div>
        </div>
      </section>
    );
  }

  // Error state vizibil
  if (isError || !products || products.length === 0) {
    return (
      <section className="py-12 bg-black relative -mb-8">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-white">
              Best Sellers
            </h2>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-center text-white">
              <p className="text-red-400 mb-4">⚠️ Unable to load best sellers</p>
              <p className="text-gray-400">Please check console for details</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-black relative -mb-8">
      <div className="absolute inset-0 bg-black"></div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/90 to-transparent"></div>
      
      {/* Glow effects - poziționare sus pentru alternare - extinse pentru continuitate */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/30 filter blur-3xl"></div>
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/25 filter blur-3xl"></div>
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-80 h-80 rounded-full bg-primary/20 filter blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary/15 filter blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/20 filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2 inline-block relative text-white">
            <span className="relative z-10">Best Sellers</span>
            <div className="absolute bottom-0 left-0 w-full h-3 bg-primary/20 -z-10"></div>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our most popular products loved by customers worldwide
          </p>
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
              <p className="text-gray-400">Loading best sellers...</p>
            </div>
          </div>
        )}
        
        {/* Error state */}
        {isError && (
          <div className="text-center py-10">
            <p className="text-blue-400">Failed to load best sellers</p>
          </div>
        )}
        
        {/* Products grid - optimizat cu lazy loading și suspense */}
        {!isLoading && !isError && products && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {products.map((product: Product, index: number) => (
              <div 
                key={`bestseller-${product.id}`} 
                className="transition-opacity duration-500 ease-in-out"
              >
                <Suspense fallback={
                  <div className="rounded-xl bg-black border border-primary/20 p-4 h-96 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                  </div>
                }>
                  <ProductCard product={product} />
                </Suspense>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}