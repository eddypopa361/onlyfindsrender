import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './product-card';
import { useProductRecommendations } from '@/hooks/use-product-data';

interface ProductRecommendationsProps {
  productId: number;
  limit?: number;
}

/**
 * Componenta pentru afișarea recomandărilor personalizate de produse
 * Primește ID-ul produsului curent și oferă recomandări similare
 */
const ProductRecommendations = ({ productId, limit = 4 }: ProductRecommendationsProps) => {
  // Creeăm un obiect de tip Product cu id-ul pentru a-l trimite la hook
  const dummyProduct = {
    id: productId,
    title: "",
    price: "",
    image: "",
    buyUrl: "",
    viewUrl: "",
    category: "",
    subCategory: null,
    brand: null,
    featured: false,
    carousel: false
  } as any;
  
  // Obține recomandările folosind hook-ul care suportă date statice
  const { data: recommendations, isLoading, isError: error } = useProductRecommendations(dummyProduct, limit);
  
  // Logăm pentru depanare
  console.log('ProductRecommendations:', { 
    productId, 
    recommendations: recommendations?.length || 0,
    isLoading,
    error
  });

  // Dacă se încarcă sau avem o eroare, afișăm starea corespunzătoare
  if (isLoading) {
    return (
      <div className="recommendations-container my-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary-300">
          <span className="inline-block animate-pulse">Loading personalized recommendations...</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(limit)].map((_, index) => (
            <div key={index} className="bg-gray-800 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !recommendations || recommendations.length === 0) {
    return null; // Nu afișăm nimic dacă avem eroare sau lipsesc recomandările
  }

  return (
    <div className="recommendations-container my-8">
      <h2 className="text-2xl font-bold mb-4 text-center text-primary-300">
        You might also like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;