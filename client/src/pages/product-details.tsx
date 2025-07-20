import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Product } from '@/lib/types';
import ProductRecommendations from '@/components/ui/product-recommendations';
import { useProductById } from '@/hooks/use-product-data';

/**
 * Pagina de detalii produs
 * Afișează informații detaliate despre un produs și oferă recomandări personalizate
 */
const ProductDetails = () => {
  const params = useParams();
  const [_, setLocation] = useLocation();
  
  // Efectul de scroll to top când se încarcă pagina
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Extragem ID-ul produsului din parametrii URL
  const productId = params.id ? parseInt(params.id) : 0;
  
  // Obținem detaliile produsului folosind hook-ul care suportă date statice
  const { data: product, isLoading, isError: error } = useProductById(productId);
  
  // Gestionăm starea de încărcare
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse bg-gray-800 h-96 rounded-lg mb-8"></div>
        <div className="animate-pulse bg-gray-800 h-8 w-1/3 rounded mb-4"></div>
        <div className="animate-pulse bg-gray-800 h-4 w-1/4 rounded mb-8"></div>
        <div className="animate-pulse bg-gray-800 h-10 w-1/5 rounded"></div>
      </div>
    );
  }
  
  // Gestionăm eroarea sau lipsa de date
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl text-red-400 mb-4">Produsul nu a putut fi găsit</h1>
          <p className="text-gray-300 mb-6">Produsul pe care îl cauți nu există sau a fost eliminat.</p>
          <button 
            className="px-6 py-2 bg-primary hover:bg-primary/80 rounded-lg text-white"
            onClick={() => setLocation('/')}
          >
            Înapoi la pagina principală
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Imaginea produsului */}
        <div className="md:w-2/5">
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-2xl border border-primary/30 max-w-md mx-auto">
            <picture>
              <source srcSet={`${product.image}.webp`} type="image/webp" />
              <img 
                src={product.image} 
                alt={product.title} 
                loading="eager" 
                className="w-full h-auto object-contain max-h-[450px]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/uploads/placeholder-shoe.jpg'; // Imagine implicită în caz de eroare
                }}
              />
            </picture>
          </div>
        </div>
        
        {/* Detaliile produsului */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-white mb-4">{product.title}</h1>
          <div className="mb-4">
            <span className="inline-block bg-primary/50 text-white px-3 py-1 rounded-md text-sm mr-2">
              {product.category}
            </span>
            {product.brand && (
              <span className="inline-block bg-gray-700 text-white px-3 py-1 rounded-md text-sm">
                {product.brand}
              </span>
            )}
          </div>
          <div className="text-2xl font-bold text-white mb-6">{product.price}</div>
          
          {/* Butoane pentru acțiuni */}
          <div className="flex flex-col space-y-4 mb-8">
            <a 
              href={product.buyUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="py-3 px-6 bg-primary hover:bg-primary/80 text-white rounded-lg text-center font-semibold shadow-lg transition-all duration-300 hover:shadow-primary/30"
            >
              Buy Now
            </a>
            <a 
              href={product.viewUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-center font-semibold transition-all duration-300"
            >
              View Details
            </a>
          </div>
          
          {/* Promoție JoyaGoo mutată sub butoane */}
          <div className="rounded-xl overflow-hidden shadow-2xl border border-primary/30 bg-black/50 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-red-900 rounded-xl blur-xl opacity-50"></div>
            <div className="relative overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 backdrop-blur-sm bg-primary/30/50 z-10"></div>
                <img 
                  src="https://i.imgur.com/Z9GcQly.jpg" 
                  alt="JoyaGoo shipping discount" 
                  loading="lazy"
                  className="w-full h-full object-cover opacity-70"
                  style={{ filter: 'blur(2px)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40 z-20"></div>
              </div>
              
              <div className="relative z-30 p-4 md:p-6">
                <div className="flex flex-col items-center text-center">
                  <h2 className="text-xl md:text-2xl font-heading font-bold mb-2 text-white glow-text">
                    Get 50% Off Shipping
                  </h2>
                  <p className="text-gray-200 mb-4 text-sm md:text-base">
                    Use our special sign up link when joining JoyaGoo!
                  </p>
                  <a 
                    href="http://joyagoo.com/register/?ref=300004734" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative inline-block group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary rounded-lg blur-lg opacity-70 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
                    <button className="relative px-6 py-2 bg-primary hover:bg-primary/80 text-white font-heading font-medium rounded-lg transition-all shadow-lg hover:shadow-primary/30 text-sm md:text-base">
                      Sign Up for JoyaGoo
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recomandări personalizate */}
      <ProductRecommendations productId={product.id} />
    </div>
  );
};

export default ProductDetails;