/**
 * Fixed Supabase storage implementation with proper column mapping
 * Maps between camelCase API and snake_case database columns
 */

import { supabase, supabaseConfig } from "./supabase"

// Product type for API (camelCase)
interface Product {
  id: string
  title: string
  priceUSD: number | null
  image: string | null
  buyUrl: string | null
  viewUrl?: string | null
  category: string | null
  subCategory?: string | null
  brand?: string | null
  featured: boolean
  carousel: boolean
  created_at?: string
  updated_at?: string
}

// Supabase row type (snake_case)
interface SupabaseProduct {
  id: string
  title: string
  priceusd: number | null
  image: string | null
  buyurl: string | null
  viewurl?: string | null
  category: string | null
  subcategory?: string | null
  brand?: string | null
  featured: boolean
  carousel: boolean
  created_at?: string
  updated_at?: string
}

// Convert Supabase row to API format
function mapFromSupabase(row: SupabaseProduct): Product {
  return {
    id: row.id,
    title: row.title,
    priceUSD: row.priceusd,
    image: row.image,
    buyUrl: row.buyurl,
    viewUrl: row.viewurl,
    category: row.category,
    subCategory: row.subcategory,
    brand: row.brand,
    featured: row.featured,
    carousel: row.carousel,
    created_at: row.created_at,
    updated_at: row.updated_at
  }
}

// Convert API format to Supabase row
function mapToSupabase(product: Partial<Product>): Partial<SupabaseProduct> {
  return {
    id: product.id,
    title: product.title,
    priceusd: product.priceUSD,
    image: product.image,
    buyurl: product.buyUrl,
    viewurl: product.viewUrl,
    category: product.category,
    subcategory: product.subCategory,
    brand: product.brand,
    featured: product.featured,
    carousel: product.carousel
  }
}

export interface SupabaseStorage {
  getProducts(page: number, limit: number, category?: string, subCategory?: string, brand?: string, sort?: string): Promise<{ products: Product[]; total: number }>
  getProductById(id: string): Promise<Product | null>
  getFeaturedProducts(): Promise<Product[]>
  getCarouselProducts(): Promise<Product[]>
  searchProducts(query: string, page: number, limit: number, brand?: string, sort?: string): Promise<{ products: Product[]; total: number }>
  createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product>
  updateProduct(id: string, updates: Partial<Product>): Promise<Product>
  deleteProduct(id: string): Promise<void>
  bulkCreateProducts(products: Omit<Product, 'id' | 'created_at' | 'updated_at'>[]): Promise<Product[]>
  getCategories(): Promise<string[]>
  getBrands(): Promise<string[]>
}

export class SupabaseStorageImpl implements SupabaseStorage {
  constructor() {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }
  }

  async getProducts(page: number = 1, limit: number = 12, category?: string, subCategory?: string, brand?: string, sort?: string) {
    if (!supabase) throw new Error('Supabase not configured')

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })

    // Apply filters using correct snake_case column names
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    if (subCategory && subCategory !== 'all') {
      query = query.eq('subcategory', subCategory)
    }
    if (brand && brand !== 'all') {
      query = query.eq('brand', brand)
    }

    // Apply sorting with correct column names
    switch (sort) {
      case 'price-asc':
        query = query.order('priceusd', { ascending: true, nullsLast: true })
        break
      case 'price-desc':
        query = query.order('priceusd', { ascending: false, nullsLast: true })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'alphabetical':
        query = query.order('title', { ascending: true })
        break
      case 'featured':
      default:
        query = query.order('featured', { ascending: false }).order('created_at', { ascending: false })
        break
    }

    const { data, error, count } = await query.range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error('Supabase getProducts error:', error)
      throw new Error(`Failed to fetch products: ${error.message}`)
    }

    return {
      products: (data || []).map(mapFromSupabase),
      total: count || 0
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    if (!supabase) throw new Error('Supabase not configured')

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return mapFromSupabase(data)
  }

  async getFeaturedProducts(): Promise<Product[]> {
    if (!supabase) throw new Error('Supabase not configured')

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(12)

    if (error) {
      console.error('Error fetching featured products:', error)
      throw error
    }

    return (data || []).map(mapFromSupabase)
  }

  async getCarouselProducts(): Promise<Product[]> {
    if (!supabase) throw new Error('Supabase not configured')

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('carousel', true)
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) {
      console.error('Error fetching carousel products:', error)
      throw error
    }

    return (data || []).map(mapFromSupabase)
  }

  async searchProducts(query: string, page: number = 1, limit: number = 12, brand?: string, sort?: string) {
    if (!supabase) throw new Error('Supabase not configured')

    let supabaseQuery = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .or(`title.ilike.%${query}%,brand.ilike.%${query}%,category.ilike.%${query}%`)

    if (brand && brand !== 'all') {
      supabaseQuery = supabaseQuery.eq('brand', brand)
    }

    switch (sort) {
      case 'price-asc':
        supabaseQuery = supabaseQuery.order('priceusd', { ascending: true, nullsLast: true })
        break
      case 'price-desc':
        supabaseQuery = supabaseQuery.order('priceusd', { ascending: false, nullsLast: true })
        break
      case 'newest':
        supabaseQuery = supabaseQuery.order('created_at', { ascending: false })
        break
      case 'alphabetical':
        supabaseQuery = supabaseQuery.order('title', { ascending: true })
        break
      default:
        supabaseQuery = supabaseQuery.order('featured', { ascending: false }).order('created_at', { ascending: false })
        break
    }

    const { data, error, count } = await supabaseQuery.range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error('Error searching products:', error)
      throw error
    }

    return {
      products: (data || []).map(mapFromSupabase),
      total: count || 0
    }
  }

  async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    if (!supabase) throw new Error('Supabase not configured')

    const supabaseData = mapToSupabase(productData)
    
    const { data, error } = await supabase
      .from('products')
      .insert([supabaseData])
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      throw error
    }

    return mapFromSupabase(data)
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    if (!supabase) throw new Error('Supabase not configured')

    const supabaseUpdates = mapToSupabase(updates)
    
    const { data, error } = await supabase
      .from('products')
      .update(supabaseUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      throw error
    }

    return mapFromSupabase(data)
  }

  async deleteProduct(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured')

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  async bulkCreateProducts(products: Omit<Product, 'id' | 'created_at' | 'updated_at'>[]): Promise<Product[]> {
    if (!supabase) throw new Error('Supabase not configured')

    const supabaseProducts = products.map(mapToSupabase)
    
    const { data, error } = await supabase
      .from('products')
      .insert(supabaseProducts)
      .select()

    if (error) {
      console.error('Error bulk creating products:', error)
      throw error
    }

    return (data || []).map(mapFromSupabase)
  }

  async getCategories(): Promise<string[]> {
    if (!supabase) throw new Error('Supabase not configured')

    const { data, error } = await supabase
      .from('products')
      .select('category')
      .not('category', 'is', null)

    if (error) {
      console.error('Error fetching categories:', error)
      throw error
    }

    const categories = [...new Set(data.map(item => item.category).filter(Boolean))]
    return categories.sort()
  }

  async getBrands(): Promise<string[]> {
    if (!supabase) throw new Error('Supabase not configured')

    const { data, error } = await supabase
      .from('products')
      .select('brand')
      .not('brand', 'is', null)

    if (error) {
      console.error('Error fetching brands:', error)
      throw error
    }

    const brands = [...new Set(data.map(item => item.brand).filter(Boolean))]
    return brands.sort()
  }
}

// Create and export the fixed storage instance
let fixedSupabaseStorageInstance: SupabaseStorageImpl | null = null

try {
  fixedSupabaseStorageInstance = supabaseConfig.isConfigured 
    ? new SupabaseStorageImpl()
    : null
} catch (error) {
  console.warn('Fixed Supabase storage not available:', error)
  fixedSupabaseStorageInstance = null
}

export const fixedSupabaseStorage = fixedSupabaseStorageInstance