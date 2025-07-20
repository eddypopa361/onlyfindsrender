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

  return (
    <section className="py-12 bg-black relative">
      <div className="absolute inset-0 bg-black"></div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/90 to-transparent"></div>
      
      {/* Purple glow effects - reduse pentru performanță */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-primary-600/20 filter blur-3xl"></div>
      
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
              <Loader2 className="h-10 w-10 animate-spin text-primary-500 mb-3" />
              <p className="text-gray-400">Loading best sellers...</p>
            </div>
          </div>
        )}
        
        {/* Error state */}
        {isError && (
          <div className="text-center py-10">
            <p className="text-red-400">Failed to load best sellers</p>
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
                  <div className="rounded-xl bg-black border border-primary-500/20 p-4 h-96 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full border-2 border-primary-500 border-t-transparent animate-spin"></div>
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