/**
 * Fixed Supabase storage implementation with proper column mapping
 * Maps between camelCase API and snake_case database columns
 */

import { supabase, supabaseConfig } from "./supabase"

// Product type for API (camelCase)
interface Product {
  id: string
  title: string
  priceUSD: string
  image: string | null
  buyUrl: string
  category: string
  subCategory?: string | null
  featured: boolean
  carousel: boolean
}

// Supabase row type (snake_case)
interface SupabaseProduct {
  id: string
  title: string
  price_usd: string
  image: string | null
  buy_url: string
  category: string
  sub_category?: string | null
  featured: boolean
  carousel: boolean
}

// Convert Supabase row to API format
function mapFromSupabase(row: SupabaseProduct): Product {
  return {
    id: row.id,
    title: row.title,
    priceUSD: row.price_usd,
    image: row.image,
    buyUrl: row.buy_url,
    category: row.category,
    subCategory: row.sub_category,
    featured: row.featured,
    carousel: row.carousel
  }
}

// Convert API format to Supabase row
function mapToSupabase(product: Partial<Product>, skipId: boolean = false): Partial<SupabaseProduct> {
  const result: Partial<SupabaseProduct> = {
    title: product.title,
    price_usd: product.priceUSD,
    image: product.image,
    buy_url: product.buyUrl,
    category: product.category,
    sub_category: product.subCategory,
    featured: product.featured,
    carousel: product.carousel
  }
  
  // Only include ID if it exists and we're not skipping it (for creates)
  if (!skipId && product.id) {
    result.id = product.id
  }
  
  return result
}

export interface SupabaseStorage {
  getProducts(page: number, limit: number, category?: string, subCategory?: string, sort?: string): Promise<{ products: Product[]; total: number }>
  getProductById(id: string): Promise<Product | null>
  getFeaturedProducts(): Promise<Product[]>
  getCarouselProducts(): Promise<Product[]>
  searchProducts(query: string, page: number, limit: number, sort?: string): Promise<{ products: Product[]; total: number }>
  createProduct(product: Omit<Product, 'id'>): Promise<Product>
  updateProduct(id: string, updates: Partial<Product>): Promise<Product>
  deleteProduct(id: string): Promise<void>
  bulkCreateProducts(products: Omit<Product, 'id'>[]): Promise<Product[]>
  getCategories(): Promise<string[]>
  getBrands(): Promise<string[]>
}

export class SupabaseStorageImpl implements SupabaseStorage {
  constructor() {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }
  }

  async getProducts(page: number = 1, limit: number = 12, category?: string, subCategory?: string, sort?: string) {
    if (!supabase) throw new Error('Supabase not configured')

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })

    // Apply filters using correct snake_case column names
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    if (subCategory && subCategory !== 'all') {
      query = query.eq('sub_category', subCategory)
    }

    // Apply sorting with correct column names
    switch (sort) {
      case 'price-asc':
        query = query.order('price_usd', { ascending: true, nullsLast: true })
        break
      case 'price-desc':
        query = query.order('price_usd', { ascending: false, nullsLast: true })
        break
      case 'newest':
        query = query.order('id', { ascending: false })
        break
      case 'alphabetical':
        query = query.order('title', { ascending: true })
        break
      case 'featured':
      default:
        query = query.order('featured', { ascending: false }).order('id', { ascending: false })
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
      .order('id', { ascending: false })
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
      .order('id', { ascending: false })
      .limit(8)

    if (error) {
      console.error('Error fetching carousel products:', error)
      throw error
    }

    return (data || []).map(mapFromSupabase)
  }

  async searchProducts(query: string, page: number = 1, limit: number = 12, sort?: string) {
    if (!supabase) throw new Error('Supabase not configured')

    let supabaseQuery = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .or(`title.ilike.%${query}%,category.ilike.%${query}%`)


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

  async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    if (!supabase) throw new Error('Supabase not configured')

    // Skip ID field when creating new products to let database auto-generate it
    const supabaseData = mapToSupabase(productData, true)
    
    const { data, error } = await supabase
      .from('products')
      .insert(supabaseData)  // Remove array wrapper
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

  async bulkCreateProducts(products: Omit<Product, 'id'>[]): Promise<Product[]> {
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
    // Since brand column doesn't exist, return empty array
    return []
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