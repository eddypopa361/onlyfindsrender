import { Product } from "@shared/schema";

// Cache pentru produse
let productCache: Product[] = [];
let isLoaded = false;

/**
 * Service pentru încărcarea și gestionarea datelor statice din fișierul JSON
 * Acest serviciu înlocuiește apelurile către API pentru produse când ne aflăm în modul static
 */
export const staticDataService = {
  /**
   * Încarcă datele din fișierul JSON. Se face o singură dată și se stochează în memorie.
   */
  async loadProducts(): Promise<Product[]> {
    // Dacă datele sunt deja încărcate, le returnăm din cache
    if (isLoaded) {
      return productCache;
    }

    // Încercăm path-uri absolute pentru Netlify
    const possiblePaths = [
      '/data/products.json',     // Path absolut principal
      './data/products.json',    // Path relativ
      'data/products.json',      // Path simplu
      `${window.location.origin}/data/products.json`  // Path complet cu domeniu
    ];

    for (const path of possiblePaths) {
      try {
        console.log(`Attempting to load products.json from: ${path}`);
        const response = await fetch(path);
        
        if (response.ok) {
          const loadedProducts = await response.json() as Product[];
          if (Array.isArray(loadedProducts) && loadedProducts.length > 0) {
            productCache = loadedProducts;
            isLoaded = true;
            console.log(`✅ Successfully loaded ${productCache.length} products from ${path}`);
            return productCache;
          }
        }
        
        console.log(`❌ Failed to load from ${path}: ${response.status}`);
      } catch (error) {
        console.log(`❌ Error loading from ${path}:`, error instanceof Error ? error.message : String(error));
      }
    }

    // Dacă ajungem aici, nu am putut încărca din niciun path
    console.error('❌ Failed to load products from any source');
    isLoaded = true;
    productCache = [];
    return [];
  },

  /**
   * Obține toate produsele cu paginare și filtrare
   */
  async getProducts(
    page: number = 1, 
    limit: number = 12, 
    category?: string, 
    subCategory?: string, 
    brand?: string, 
    sort: string = "featured"
  ): Promise<{ products: Product[], pagination: { totalItems: number, totalPages: number, currentPage: number } }> {
    const products = await this.loadProducts();
    
    // Filtrare
    let filteredProducts = [...products];
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (subCategory) {
      // Asigurăm compatibilitatea cu ambele versiuni de structură de date
      filteredProducts = filteredProducts.filter(p => 
        p.subCategory === subCategory
      );
    }
    
    if (brand) {
      filteredProducts = filteredProducts.filter(p => p.brand === brand);
    }
    
    // Sortare
    if (sort === "featured") {
      filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else if (sort === "price-asc") {
      filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "price-desc") {
      filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === "newest") {
      // În absența câmpului de dată, putem folosi ID-ul ca aproximare
      filteredProducts.sort((a, b) => b.id - a.id);
    }
    
    // Calculăm numărul total de pagini
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / limit) || 1; // Asigurăm că avem cel puțin o pagină
    
    // Paginare
    const startIdx = (page - 1) * limit;
    const endIdx = page * limit;
    const paginatedProducts = filteredProducts.slice(startIdx, endIdx);
    
    // Returnăm obiecte în același format ca API-ul
    return {
      products: paginatedProducts,
      pagination: {
        totalItems: filteredProducts.length,
        totalPages: totalPages,
        currentPage: page
      }
    };
  },
  
  /**
   * Obține un produs după ID
   */
  async getProductById(id: number): Promise<Product | undefined> {
    const products = await this.loadProducts();
    return products.find(p => p.id === id);
  },
  
  /**
   * Obține produsele featured
   */
  async getFeaturedProducts(): Promise<Product[]> {
    const products = await this.loadProducts();
    return products.filter(p => p.featured).slice(0, 8);
  },
  
  /**
   * Obține produsele pentru carousel
   */
  async getCarouselProducts(): Promise<Product[]> {
    const products = await this.loadProducts();
    // Folosim produsele featured pentru carousel
    return products.filter(p => p.featured).slice(0, 12);
  },
  
  /**
   * Caută produse după cuvinte cheie
   */
  async searchProducts(
    query: string, 
    page: number = 1, 
    limit: number = 12, 
    brand?: string, 
    sort: string = "featured"
  ): Promise<{ products: Product[], pagination: { totalItems: number, totalPages: number, currentPage: number } }> {
    const products = await this.loadProducts();
    
    // Transformăm query-ul pentru căutare
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    // Filtrare după query și brand
    let filteredProducts = products.filter(product => {
      // Verificăm dacă produsul conține termenii de căutare
      const titleMatches = searchTerms.every(term => 
        product.title.toLowerCase().includes(term)
      );
      
      // Verificăm brand-ul dacă este specificat
      const brandMatches = !brand || product.brand === brand;
      
      return titleMatches && brandMatches;
    });
    
    // Sortare
    if (sort === "featured") {
      filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else if (sort === "price-asc") {
      filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "price-desc") {
      filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === "newest") {
      filteredProducts.sort((a, b) => b.id - a.id);
    }
    
    // Calculăm numărul total de pagini
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / limit) || 1; // Asigurăm că avem cel puțin o pagină
    
    // Paginare
    const startIdx = (page - 1) * limit;
    const endIdx = page * limit;
    const paginatedProducts = filteredProducts.slice(startIdx, endIdx);
    
    return {
      products: paginatedProducts,
      pagination: {
        totalItems: filteredProducts.length,
        totalPages: totalPages,
        currentPage: page
      }
    };
  },
  
  /**
   * Obține recomandări de produse pe baza unui produs
   */
  async getProductRecommendations(product: Product, limit: number = 4): Promise<Product[]> {
    console.log('StaticDataService.getProductRecommendations called with:', { 
      productId: product.id,
      category: product.category,
      brand: product.brand,
      limit
    });
    
    const products = await this.loadProducts();
    console.log('Total products loaded:', products.length);
    
    // Filtrăm produsele care au aceeași categorie sau brand, dar nu sunt același produs
    const sameCategory = products.filter(p => 
      p.id !== product.id && 
      (p.category === product.category || (p.brand && product.brand && p.brand === product.brand))
    );
    
    console.log('Found similar products:', sameCategory.length);
    
    // Dacă nu găsim produse similare, returnăm primele produse disponibile
    if (sameCategory.length === 0) {
      console.log('No similar products found, returning fallback recommendations');
      return products
        .filter(p => p.id !== product.id)
        .slice(0, limit);
    }
    
    // Amestecăm rezultatele pentru a obține recomandări diferite de fiecare dată
    const shuffled = sameCategory.sort(() => 0.5 - Math.random());
    
    // Returnăm primele 'limit' produse
    const recommendations = shuffled.slice(0, limit);
    console.log('Returning recommendations:', recommendations.length);
    
    return recommendations;
  }
};

// Funcție helper pentru a verifica dacă putem folosi serviciul de date statice
export function useStaticData(): boolean {
  // FORȚEZ ÎNTOTDEAUNA modul static - nu mai folosesc API deloc
  console.log('useStaticData: FORCED STATIC MODE - always returning true');
  return true;
}

// Export default pentru a facilita importul
export default staticDataService;