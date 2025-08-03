import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import staticDataService, { useStaticData } from "@/lib/staticDataService";

/**
 * Hook pentru a obține produse cu filtrare și paginare
 */
export function useProducts({
  page = 1,
  limit = 12,
  category,
  subCategory,
  brand,
  sort = "featured"
}: {
  page?: number;
  limit?: number;
  category?: string;
  subCategory?: string;
  brand?: string;
  sort?: string;
}) {
  const isStatic = useStaticData();

  return useQuery({
    queryKey: ["/api/products", page, limit, category, subCategory, brand, sort],
    queryFn: async () => {
      if (isStatic) {
        // Folosim serviciul static
        return staticDataService.getProducts(page, limit, category, subCategory, brand, sort);
      } else {
        // Folosim API-ul
        let url = `/api/products?page=${page}&limit=${limit}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        if (subCategory) url += `&subCategory=${encodeURIComponent(subCategory)}`;
        if (brand) url += `&brand=${encodeURIComponent(brand)}`;
        if (sort) url += `&sort=${encodeURIComponent(sort)}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.statusText}`);
        }
        return await response.json();
      }
    }
  });
}

/**
 * Hook pentru a obține un produs după ID
 */
export function useProductById(id?: number) {
  const isStatic = useStaticData();

  return useQuery({
    queryKey: [`/api/products/${id}`, id],
    queryFn: async () => {
      if (!id) return undefined;
      
      if (isStatic) {
        // Folosim serviciul static
        return staticDataService.getProductById(id);
      } else {
        // Folosim API-ul
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            return undefined;
          }
          throw new Error(`Error fetching product: ${response.statusText}`);
        }
        return await response.json();
      }
    },
    enabled: !!id
  });
}

/**
 * Hook pentru a obține produsele featured
 */
export function useFeaturedProducts() {
  const isStatic = useStaticData();

  return useQuery({
    queryKey: ["/api/products/featured"],
    staleTime: 10 * 60 * 1000, // 10 minute cache pentru featured products
    queryFn: async () => {
      if (isStatic) {
        // Folosim serviciul static
        return staticDataService.getFeaturedProducts();
      } else {
        // Folosim API-ul
        const response = await fetch("/api/products/featured");
        if (!response.ok) {
          throw new Error(`Error fetching featured products: ${response.statusText}`);
        }
        return await response.json();
      }
    }
  });
}

/**
 * Hook pentru a obține produsele carousel
 */
export function useCarouselProducts() {
  const isStatic = useStaticData();

  return useQuery({
    queryKey: ["/api/products/carousel"],
    staleTime: 10 * 60 * 1000, // 10 minute cache pentru carousel products
    queryFn: async () => {
      if (isStatic) {
        // Folosim serviciul static
        return staticDataService.getCarouselProducts();
      } else {
        // Folosim API-ul
        const response = await fetch("/api/products/carousel");
        if (!response.ok) {
          throw new Error(`Error fetching carousel products: ${response.statusText}`);
        }
        return await response.json();
      }
    }
  });
}

/**
 * Hook pentru căutarea produselor
 */
export function useSearchProducts({
  query,
  page = 1,
  limit = 12,
  brand,
  sort = "featured"
}: {
  query: string;
  page?: number;
  limit?: number;
  brand?: string;
  sort?: string;
}) {
  const isStatic = useStaticData();

  return useQuery({
    queryKey: ["/api/products/search", query, page, limit, brand, sort],
    queryFn: async () => {
      if (isStatic) {
        // Folosim serviciul static
        return staticDataService.searchProducts(query, page, limit, brand, sort);
      } else {
        // Folosim API-ul
        let url = `/api/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
        if (brand) url += `&brand=${encodeURIComponent(brand)}`;
        if (sort) url += `&sort=${encodeURIComponent(sort)}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error searching products: ${response.statusText}`);
        }
        return await response.json();
      }
    },
    enabled: query.length > 0
  });
}

/**
 * Hook pentru recomandări de produse
 */
export function useProductRecommendations(product?: Product, limit: number = 4) {
  const isStatic = useStaticData();

  return useQuery({
    queryKey: [`/api/products/${product?.id}/recommendations`, product?.id],
    queryFn: async () => {
      if (!product) return [];
      
      if (isStatic) {
        // Folosim serviciul static
        return staticDataService.getProductRecommendations(product, limit);
      } else {
        // Folosim API-ul
        const response = await fetch(`/api/products/${product.id}/recommendations?limit=${limit}`);
        if (!response.ok) {
          throw new Error(`Error fetching recommendations: ${response.statusText}`);
        }
        return await response.json();
      }
    },
    enabled: !!product
  });
}