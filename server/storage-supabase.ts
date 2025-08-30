/**
 * Supabase-based storage implementation
 * Replaces the old database with Supabase as single source of truth
 */

import { supabase, validateSupabaseConfig, supabaseConfig } from "./supabase"
// Define Product type to match Supabase schema
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

export interface SupabaseStorage {
  // Product operations
  getProducts(page: number, limit: number, category?: string, subCategory?: string, brand?: string, sort?: string): Promise<{ products: Product[]; total: number }>
  getProductById(id: string): Promise<Product | null>
  getFeaturedProducts(): Promise<Product[]>
  getCarouselProducts(): Promise<Product[]>
  searchProducts(query: string, page: number, limit: number, brand?: string, sort?: string): Promise<{ products: Product[]; total: number }>
  
  // Admin operations
  createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product>
  updateProduct(id: string, updates: Partial<Product>): Promise<Product>
  deleteProduct(id: string): Promise<void>
  bulkCreateProducts(products: Omit<Product, 'id' | 'created_at' | 'updated_at'>[]): Promise<Product[]>
  
  // Category operations
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

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    if (subCategory && subCategory !== 'all') {
      query = query.eq('subCategory', subCategory)
    }
    if (brand && brand !== 'all') {
      query = query.eq('brand', brand)
    }

    // Apply sorting
    switch (sort) {
      case 'price-asc':
        query = query.order('priceUSD', { ascending: true, nullsLast: true })
        break
      case 'price-desc':
        query = query.order('priceUSD', { ascending: false, nullsLast: true })
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

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching products:', error)
      throw error
    }

    return {
      products: data || [],
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
      if (error.code === 'PGRST116') { // Not found
        return null
      }
      console.error('Error fetching product:', error)
      throw error
    }

    return data
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

    return data || []
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

    return data || []
  }

  async searchProducts(query: string, page: number = 1, limit: number = 12, brand?: string, sort?: string) {
    if (!supabase) throw new Error('Supabase not configured')

    let supabaseQuery = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .or(`title.ilike.%${query}%,brand.ilike.%${query}%,category.ilike.%${query}%`)

    // Apply brand filter
    if (brand && brand !== 'all') {
      supabaseQuery = supabaseQuery.eq('brand', brand)
    }

    // Apply sorting
    switch (sort) {
      case 'price-asc':
        supabaseQuery = supabaseQuery.order('priceUSD', { ascending: true, nullsLast: true })
        break
      case 'price-desc':
        supabaseQuery = supabaseQuery.order('priceUSD', { ascending: false, nullsLast: true })
        break
      case 'newest':
        supabaseQuery = supabaseQuery.order('created_at', { ascending: false })
        break
      case 'alphabetical':
        supabaseQuery = supabaseQuery.order('title', { ascending: true })
        break
      case 'featured':
      default:
        supabaseQuery = supabaseQuery.order('featured', { ascending: false }).order('created_at', { ascending: false })
        break
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    supabaseQuery = supabaseQuery.range(from, to)

    const { data, error, count } = await supabaseQuery

    if (error) {
      console.error('Error searching products:', error)
      throw error
    }

    return {
      products: data || [],
      total: count || 0
    }
  }

  async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    if (!supabase) throw new Error('Supabase not configured')

    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      throw error
    }

    return data
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    if (!supabase) throw new Error('Supabase not configured')

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      throw error
    }

    return data
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

    const { data, error } = await supabase
      .from('products')
      .insert(products)
      .select()

    if (error) {
      console.error('Error bulk creating products:', error)
      throw error
    }

    return data || []
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

    // Extract unique categories
    const categories = [...new Set(data?.map(item => item.category).filter(Boolean))] as string[]
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

    // Extract unique brands
    const brands = [...new Set(data?.map(item => item.brand).filter(Boolean))] as string[]
    return brands.sort()
  }
}

// Create and export the storage instance only if configured
let supabaseStorageInstance: SupabaseStorageImpl | null = null

try {
  supabaseStorageInstance = supabaseConfig.isConfigured 
    ? new SupabaseStorageImpl()
    : null
} catch (error) {
  console.warn('Supabase storage not available:', error)
  supabaseStorageInstance = null
}

export const supabaseStorage = supabaseStorageInstance