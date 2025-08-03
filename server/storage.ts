import { users, type User, type InsertUser, products, type Product, type InsertProduct } from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, sql, like, and, or, ne, not, inArray } from "drizzle-orm";


export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(page: number, limit: number, category?: string, subCategory?: string, brand?: string, sort?: string): Promise<{ products: Product[], total: number }>;
  getProductById(id: number): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  getCarouselProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  createManyProducts(products: InsertProduct[]): Promise<void>;
  searchProducts(query: string, page: number, limit: number, brand?: string, sort?: string): Promise<{ products: Product[], total: number }>;
  fixProductImagePaths(): Promise<number>;
  getProductRecommendations(product: Product, limit?: number): Promise<Product[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProducts(page: number = 1, limit: number = 12, category?: string, subCategory?: string, brand?: string, sort: string = "featured"): Promise<{ products: Product[], total: number }> {
    const offset = (page - 1) * limit;
    
    // Build query based on filters
    let queryBuilder = db.select().from(products);
    let countQueryBuilder = db.select({ count: sql<number>`count(*)` }).from(products);
    
    // Apply filters
    const conditions = [];
    
    if (category && category !== 'All') {
      conditions.push(eq(products.category, category));
      
      // Apply subcategory filter for categories that support subcategories
      if ((category === 'Clothing' || category === 'Accessories') && subCategory && subCategory !== 'All') {
        // Filtrează direct pe câmpul subCategory în baza de date
        // Acum că avem subcategorii definite explicit pentru produse
        conditions.push(eq(products.subCategory, subCategory));
      }
    }
    
    if (brand && brand !== 'All') {
      conditions.push(sql`UPPER(${products.brand}) = UPPER(${brand})`);
    }
    
    // Apply all conditions to queries
    if (conditions.length > 0) {
      for (const condition of conditions) {
        queryBuilder = queryBuilder.where(condition);
        countQueryBuilder = countQueryBuilder.where(condition);
      }
    }
    
    // Apply sorting
    if (sort === "priceAsc") {
      queryBuilder = queryBuilder.orderBy(asc(products.price));
    } else if (sort === "priceDesc") {
      queryBuilder = queryBuilder.orderBy(desc(products.price));
    } else {
      // Default to featured first, then newest
      queryBuilder = queryBuilder.orderBy(
        desc(products.featured), 
        desc(products.id)
      );
    }
    
    // Execute queries
    const productsList = await queryBuilder.limit(limit).offset(offset);
    const result = await countQueryBuilder;
    const total = result.length > 0 ? Number(result[0].count) : 0;
    
    return { 
      products: productsList, 
      total 
    };
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    // Get all products with valid images and buyUrl
    const allProducts = await db.select().from(products);
    
    // Use sampleDistinct function for stable daily selection of 12 products
    const validProducts = allProducts.filter(p => 
      p.image && p.image.trim() !== '' && 
      p.buyUrl && p.buyUrl.trim() !== ''
    );
    
    // Sample 12 distinct products for best sellers
    return this.sampleDistinct(validProducts, 12);
  }
  
  async getCarouselProducts(): Promise<Product[]> {
    // Get all products with valid images and buyUrl
    const allProducts = await db.select().from(products);
    
    // Use sampleDistinct function for stable daily selection of 8 products  
    const validProducts = allProducts.filter(p => 
      p.image && p.image.trim() !== '' && 
      p.buyUrl && p.buyUrl.trim() !== ''
    );
    
    // Sample 8 distinct products for carousel
    return this.sampleDistinct(validProducts, 8);
  }

  /**
   * Sample N distinct items from an array using a date-based seed for stability
   */
  private sampleDistinct<T>(items: T[], count: number): T[] {
    if (items.length <= count) return [...items];
    
    const dateString = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const shuffled = [...items];
    
    // Simple seeded shuffle using date string as seed
    let seedValue = 0;
    for (let i = 0; i < dateString.length; i++) {
      seedValue += dateString.charCodeAt(i);
    }
    
    // Fisher-Yates shuffle with seeded random
    for (let i = shuffled.length - 1; i > 0; i--) {
      seedValue = (seedValue * 9301 + 49297) % 233280; // Simple LCG
      const j = Math.floor((seedValue / 233280) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, count);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async createManyProducts(productsToInsert: InsertProduct[]): Promise<void> {
    // Break into chunks to avoid query size limits
    const chunkSize = 100;
    for (let i = 0; i < productsToInsert.length; i += chunkSize) {
      const chunk = productsToInsert.slice(i, i + chunkSize);
      await db.insert(products).values(chunk);
    }
  }

  async searchProducts(query: string, page: number = 1, limit: number = 12, brand?: string, sort: string = "featured"): Promise<{ products: Product[], total: number }> {
    const offset = (page - 1) * limit;
    const searchPattern = `%${query}%`;
    
    // Build search condition
    let searchCondition = sql`${products.title} ILIKE ${searchPattern} OR ${products.category} ILIKE ${searchPattern}`;
    
    // Add brand filter if provided
    if (brand && brand !== 'All') {
      searchCondition = sql`(${searchCondition}) AND UPPER(${products.brand}) = UPPER(${brand})`;
    }
    
    // Create query builder
    let queryBuilder = db.select()
      .from(products)
      .where(searchCondition);
    
    // Apply sorting
    if (sort === "priceAsc") {
      queryBuilder = queryBuilder.orderBy(asc(products.price));
    } else if (sort === "priceDesc") {
      queryBuilder = queryBuilder.orderBy(desc(products.price));
    } else {
      // Default to featured first, then newest
      queryBuilder = queryBuilder.orderBy(
        desc(products.featured), 
        desc(products.id)
      );
    }
    
    // Execute query with pagination
    const productsList = await queryBuilder.limit(limit).offset(offset);
    
    // Get total count for pagination
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(products)
      .where(searchCondition);
    
    const total = result.length > 0 ? Number(result[0].count) : 0;
    
    return {
      products: productsList,
      total
    };
  }
  
  // Helper method to fix image paths for all products
  async fixProductImagePaths(): Promise<number> {
    let updatedCount = 0;
    
    // Get all products with images that don't start with /uploads/ or http
    const productsToUpdate = await db.select().from(products)
      .where(sql`${products.image} IS NOT NULL AND ${products.image} != '' AND 
             ${products.image} NOT LIKE '/uploads/%' AND 
             ${products.image} NOT LIKE 'http%'`);
    
    // Update each product to add the /uploads/ prefix
    for (const product of productsToUpdate) {
      const oldImagePath = product.image;
      const newImagePath = `/uploads/${oldImagePath}`;
      
      await db.update(products)
        .set({ image: newImagePath })
        .where(eq(products.id, product.id));
      
      updatedCount++;
    }
    
    return updatedCount;
  }



  /**
   * Obține recomandări de produse pe baza unui produs specificat
   * Strategia folosită: Caută produse din aceeași categorie și/sau brand
   */
  async getProductRecommendations(product: Product, limit: number = 4): Promise<Product[]> {
    // Excludem produsul curent din recomandări
    const excludeId = product.id;
    const productCategory = product.category;
    const productBrand = product.brand || 'Other';
    
    let recommendedProducts: Product[] = [];
    
    // Metodă sigură pentru a exclude produse
    const safeExcludeIds = (queryBuilder: any, ids: (number | string)[]) => {
      for (const id of ids) {
        if (id !== undefined && id !== null) {
          // Folosim mereu condiții de excludere individuale
          queryBuilder = queryBuilder.where(ne(products.id, id));
        }
      }
      return queryBuilder;
    };
    
    // Strategia 1: Produse din aceeași categorie ȘI același brand (prioritate maximă)
    if (recommendedProducts.length < limit) {
      const currentLimit = limit - recommendedProducts.length;
      
      // Construim interogarea cu condiții de siguranță
      let query = db.select()
        .from(products)
        .where(eq(products.category, productCategory))
        .where(sql`UPPER(${products.brand}) = UPPER(${productBrand})`)
        .where(ne(products.id, excludeId));
      
      // Excludem produsele deja recomandate
      if (recommendedProducts.length > 0) {
        query = safeExcludeIds(query, recommendedProducts.map(p => p.id));
      }
      
      const similarProducts = await query
        .orderBy(desc(products.featured), desc(products.id))
        .limit(currentLimit);
      
      recommendedProducts = [...recommendedProducts, ...similarProducts];
    }
    
    // Strategia 2: Produse doar din aceeași categorie (prioritate secundară)
    if (recommendedProducts.length < limit) {
      const currentLimit = limit - recommendedProducts.length;
      
      let query = db.select()
        .from(products)
        .where(eq(products.category, productCategory))
        .where(ne(products.id, excludeId));
      
      // Excludem același brand (pentru a nu duplica rezultate de la strategia 1)
      if (productBrand) {
        query = query.where(sql`UPPER(${products.brand}) != UPPER(${productBrand})`);
      }
      
      // Excludem produsele deja recomandate
      if (recommendedProducts.length > 0) {
        query = safeExcludeIds(query, recommendedProducts.map(p => p.id));
      }
      
      const similarProducts = await query
        .orderBy(desc(products.featured), desc(products.id))
        .limit(currentLimit);
      
      recommendedProducts = [...recommendedProducts, ...similarProducts];
    }
    
    // Strategia 3: Produse doar cu același brand (prioritate terțiară)
    if (recommendedProducts.length < limit && productBrand) {
      const currentLimit = limit - recommendedProducts.length;
      
      let query = db.select()
        .from(products)
        .where(sql`UPPER(${products.brand}) = UPPER(${productBrand})`)
        .where(ne(products.id, excludeId))
        .where(ne(products.category, productCategory)); // Excludem aceeași categorie
      
      // Excludem produsele deja recomandate
      if (recommendedProducts.length > 0) {
        query = safeExcludeIds(query, recommendedProducts.map(p => p.id));
      }
      
      const similarProducts = await query
        .orderBy(desc(products.featured), desc(products.id))
        .limit(currentLimit);
      
      recommendedProducts = [...recommendedProducts, ...similarProducts];
    }
    
    // Fallback 1: Produse featured (populare)
    if (recommendedProducts.length < limit) {
      const currentLimit = limit - recommendedProducts.length;
      
      let query = db.select()
        .from(products)
        .where(eq(products.featured, true))
        .where(ne(products.id, excludeId));
      
      // Excludem produsele deja recomandate
      if (recommendedProducts.length > 0) {
        query = safeExcludeIds(query, recommendedProducts.map(p => p.id));
      }
      
      const popularProducts = await query
        .orderBy(desc(products.id))
        .limit(currentLimit);
      
      recommendedProducts = [...recommendedProducts, ...popularProducts];
    }
    
    // Fallback 2: Orice produse pentru a completa lista
    if (recommendedProducts.length < limit) {
      const currentLimit = limit - recommendedProducts.length;
      
      let query = db.select()
        .from(products)
        .where(ne(products.id, excludeId));
      
      // Excludem produsele deja recomandate
      if (recommendedProducts.length > 0) {
        query = safeExcludeIds(query, recommendedProducts.map(p => p.id));
      }
      
      const anyProducts = await query
        .orderBy(desc(products.id))
        .limit(currentLimit);
      
      recommendedProducts = [...recommendedProducts, ...anyProducts];
    }
    
    return recommendedProducts;
  }
}

export const storage = new DatabaseStorage();
