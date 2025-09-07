var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/supabase.ts
import { createClient } from "@supabase/supabase-js";
var supabaseUrl, supabaseServiceRole, USE_SUPABASE_ONLY, supabaseConfig, supabase;
var init_supabase = __esm({
  "server/supabase.ts"() {
    "use strict";
    supabaseUrl = process.env.SUPABASE_URL;
    supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_KEY;
    USE_SUPABASE_ONLY = process.env.USE_SUPABASE_ONLY !== "false";
    supabaseConfig = {
      url: supabaseUrl,
      serviceKey: supabaseServiceRole,
      isConfigured: !!(supabaseUrl && supabaseServiceRole),
      useSupabaseOnly: USE_SUPABASE_ONLY
    };
    supabase = supabaseConfig.isConfigured ? createClient(supabaseUrl, supabaseServiceRole, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }) : null;
    if (supabaseConfig.isConfigured) {
      console.log("\u2705 Server Supabase configured with service role");
    } else {
      console.warn("\u26A0\uFE0F Server Supabase not configured");
      console.warn(
        "Missing:",
        !supabaseUrl ? "SUPABASE_URL" : "",
        !supabaseServiceRole ? "SUPABASE_SERVICE_ROLE" : ""
      );
    }
  }
});

// server/supabase-storage.ts
var supabase_storage_exports = {};
__export(supabase_storage_exports, {
  SupabaseStorageService: () => SupabaseStorageService,
  supabaseStorage: () => supabaseStorage
});
import * as fs from "fs";
import * as path from "path";
var BUCKET_NAME, SupabaseStorageService, supabaseStorage;
var init_supabase_storage = __esm({
  "server/supabase-storage.ts"() {
    "use strict";
    init_supabase();
    BUCKET_NAME = "product-images";
    SupabaseStorageService = class {
      /**
       * Initialize the storage bucket (create if doesn't exist)
       */
      async initializeBucket() {
        if (!supabase) throw new Error("Supabase not configured");
        try {
          const { data: buckets, error: listError } = await supabase.storage.listBuckets();
          if (listError) {
            throw listError;
          }
          const bucketExists = buckets?.some((bucket) => bucket.name === BUCKET_NAME);
          if (!bucketExists) {
            const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
              public: true,
              allowedMimeTypes: ["image/*"],
              fileSizeLimit: 10485760
              // 10MB limit
            });
            if (createError) {
              throw createError;
            }
            console.log(`\u2705 Created Supabase Storage bucket: ${BUCKET_NAME}`);
          } else {
            console.log(`\u2705 Supabase Storage bucket already exists: ${BUCKET_NAME}`);
          }
          return true;
        } catch (error) {
          console.error("Error initializing Supabase Storage bucket:", error);
          throw error;
        }
      }
      /**
       * Upload an image file to Supabase Storage
       */
      async uploadImage(file, filename) {
        if (!supabase) throw new Error("Supabase not configured");
        try {
          const ext = path.extname(filename).toLowerCase();
          const mimeTypes = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".webp": "image/webp",
            ".gif": "image/gif"
          };
          const contentType = mimeTypes[ext] || "image/jpeg";
          const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filename, file, {
            cacheControl: "3600",
            upsert: true,
            contentType
          });
          if (error) {
            throw error;
          }
          const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filename);
          return publicUrlData.publicUrl;
        } catch (error) {
          console.error("Error uploading image to Supabase Storage:", error);
          throw error;
        }
      }
      /**
       * Upload a local file to Supabase Storage
       */
      async uploadLocalFile(localPath, storageFilename) {
        try {
          const fileBuffer = fs.readFileSync(localPath);
          return await this.uploadImage(fileBuffer, storageFilename);
        } catch (error) {
          console.error(`Error uploading local file ${localPath}:`, error);
          throw error;
        }
      }
      /**
       * Generate a unique filename for storage
       */
      generateFilename(originalName) {
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const extension = path.extname(originalName);
        return `${timestamp}_${randomStr}${extension}`;
      }
      /**
       * Delete an image from Supabase Storage
       */
      async deleteImage(filename) {
        if (!supabase) throw new Error("Supabase not configured");
        try {
          const { error } = await supabase.storage.from(BUCKET_NAME).remove([filename]);
          if (error) {
            throw error;
          }
        } catch (error) {
          console.error(`Error deleting image ${filename}:`, error);
          throw error;
        }
      }
      /**
       * Get all existing local images that need to be migrated
       */
      getLocalImages() {
        const uploadsDir = path.join(process.cwd(), "..", "uploads");
        if (!fs.existsSync(uploadsDir)) {
          return [];
        }
        const allFiles = fs.readdirSync(uploadsDir);
        return allFiles.filter((file) => {
          const fileName = file.toLowerCase();
          return fileName.includes(".jpg") || fileName.includes(".jpeg") || fileName.includes(".png") || fileName.includes(".webp") || fileName.includes(".gif") || fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") || fileName.endsWith(".png") || fileName.endsWith(".webp") || fileName.endsWith(".gif");
        }).map((file) => path.join(uploadsDir, file));
      }
      /**
       * Migrate all local images to Supabase Storage
       */
      async migrateLocalImages() {
        const localImages = this.getLocalImages();
        const migrated = [];
        const failed = [];
        console.log(`\u{1F4E6} Starting migration of ${localImages.length} local images to Supabase Storage...`);
        for (const localPath of localImages) {
          try {
            const filename = path.basename(localPath);
            const publicUrl = await this.uploadLocalFile(localPath, filename);
            migrated.push(`${localPath} -> ${publicUrl}`);
            console.log(`\u2705 Migrated: ${filename}`);
          } catch (error) {
            failed.push(`${localPath}: ${error}`);
            console.log(`\u274C Failed: ${path.basename(localPath)} - ${error}`);
          }
        }
        console.log(`\u{1F389} Migration complete! Migrated: ${migrated.length}, Failed: ${failed.length}`);
        return { migrated, failed };
      }
    };
    supabaseStorage = new SupabaseStorageService();
  }
});

// server/index.ts
import express3 from "express";

// server/routes.ts
import express from "express";
import { createServer } from "http";

// server/storage-supabase-fixed.ts
init_supabase();
function mapFromSupabase(row) {
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
  };
}
function mapToSupabase(product, skipId = false) {
  const result = {
    title: product.title,
    price_usd: product.priceUSD || product.price_usd,
    // Support both formats
    image: product.image,
    buy_url: product.buyUrl || product.buy_url,
    // Support both formats
    category: product.category,
    sub_category: product.subCategory || product.sub_category,
    // Support both formats
    featured: product.featured,
    carousel: product.carousel
  };
  if (!skipId && product.id) {
    result.id = product.id;
  }
  return result;
}
var SupabaseStorageImpl = class {
  constructor() {
    if (!supabase) {
      throw new Error("Supabase client not initialized");
    }
  }
  async getProducts(page = 1, limit = 12, category, subCategory, sort) {
    if (!supabase) throw new Error("Supabase not configured");
    let query = supabase.from("products").select("*", { count: "exact" });
    if (category && category !== "all") {
      query = query.eq("category", category);
    }
    if (subCategory && subCategory !== "all") {
      query = query.eq("sub_category", subCategory);
    }
    switch (sort) {
      case "price-asc":
        query = query.order("price_usd", { ascending: true, nullsLast: true });
        break;
      case "price-desc":
        query = query.order("price_usd", { ascending: false, nullsLast: true });
        break;
      case "newest":
        query = query.order("id", { ascending: false });
        break;
      case "alphabetical":
        query = query.order("title", { ascending: true });
        break;
      case "featured":
      default:
        query = query.order("featured", { ascending: false }).order("id", { ascending: false });
        break;
    }
    const { data, error, count } = await query.range((page - 1) * limit, page * limit - 1);
    if (error) {
      console.error("Supabase getProducts error:", error);
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
    return {
      products: (data || []).map(mapFromSupabase),
      total: count || 0
    };
  }
  async getProductById(id) {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return mapFromSupabase(data);
  }
  async getFeaturedProducts() {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase.from("products").select("*").eq("featured", true).order("id", { ascending: false }).limit(12);
    if (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
    return (data || []).map(mapFromSupabase);
  }
  async getCarouselProducts() {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase.from("products").select("*").eq("carousel", true).order("id", { ascending: false }).limit(8);
    if (error) {
      console.error("Error fetching carousel products:", error);
      throw error;
    }
    return (data || []).map(mapFromSupabase);
  }
  async searchProducts(query, page = 1, limit = 12, sort) {
    if (!supabase) throw new Error("Supabase not configured");
    let supabaseQuery = supabase.from("products").select("*", { count: "exact" }).or(`title.ilike.%${query}%,category.ilike.%${query}%`);
    switch (sort) {
      case "price-asc":
        supabaseQuery = supabaseQuery.order("price_usd", { ascending: true, nullsLast: true });
        break;
      case "price-desc":
        supabaseQuery = supabaseQuery.order("price_usd", { ascending: false, nullsLast: true });
        break;
      case "newest":
        supabaseQuery = supabaseQuery.order("id", { ascending: false });
        break;
      case "alphabetical":
        supabaseQuery = supabaseQuery.order("title", { ascending: true });
        break;
      default:
        supabaseQuery = supabaseQuery.order("featured", { ascending: false }).order("id", { ascending: false });
        break;
    }
    const { data, error, count } = await supabaseQuery.range((page - 1) * limit, page * limit - 1);
    if (error) {
      console.error("Error searching products:", error);
      throw error;
    }
    return {
      products: (data || []).map(mapFromSupabase),
      total: count || 0
    };
  }
  async createProduct(productData) {
    if (!supabase) throw new Error("Supabase not configured");
    const supabaseData = mapToSupabase(productData, true);
    const { data, error } = await supabase.from("products").insert(supabaseData).select().single();
    if (error) {
      console.error("Error creating product:", error);
      throw error;
    }
    return mapFromSupabase(data);
  }
  async updateProduct(id, updates) {
    if (!supabase) throw new Error("Supabase not configured");
    const supabaseUpdates = mapToSupabase(updates);
    const { data, error } = await supabase.from("products").update(supabaseUpdates).eq("id", id).select().single();
    if (error) {
      console.error("Error updating product:", error);
      throw error;
    }
    return mapFromSupabase(data);
  }
  async deleteProduct(id) {
    if (!supabase) throw new Error("Supabase not configured");
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
  async bulkCreateProducts(products2) {
    if (!supabase) throw new Error("Supabase not configured");
    const supabaseProducts = products2.map(mapToSupabase);
    const { data, error } = await supabase.from("products").insert(supabaseProducts).select();
    if (error) {
      console.error("Error bulk creating products:", error);
      throw error;
    }
    return (data || []).map(mapFromSupabase);
  }
  async getCategories() {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase.from("products").select("category").not("category", "is", null);
    if (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
    const categories = [...new Set(data.map((item) => item.category).filter(Boolean))];
    return categories.sort();
  }
  async getBrands() {
    return [];
  }
  async createManyProducts(products2) {
    await this.bulkCreateProducts(products2);
  }
};
var fixedSupabaseStorageInstance = null;
try {
  fixedSupabaseStorageInstance = supabaseConfig.isConfigured ? new SupabaseStorageImpl() : null;
} catch (error) {
  console.warn("Fixed Supabase storage not available:", error);
  fixedSupabaseStorageInstance = null;
}
var fixedSupabaseStorage = fixedSupabaseStorageInstance;

// shared/schema.ts
import { pgTable, text, serial, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var products = pgTable("products", {
  id: text("id").primaryKey(),
  // UUID format in Supabase
  title: text("title").notNull(),
  price_usd: text("price_usd").notNull(),
  // Matches database column exactly
  image: text("image"),
  buy_url: text("buy_url").notNull(),
  category: text("category").notNull(),
  sub_category: text("sub_category"),
  featured: boolean("featured").default(false),
  carousel: boolean("carousel").default(false)
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true
  // Omit ID since it's auto-generated
});

// server/routes.ts
import { z } from "zod";
import multer from "multer";
import * as csv from "csv-parse";
import * as fs2 from "fs";
import path2 from "path";
import AdmZip from "adm-zip";
var upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }
  // 50MB limit for images
});
function generateProductPageHtml(product) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
  <title>${product.title} - ONLYFINDS</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <header class="header">
    <div class="container header-container">
      <a href="/" class="logo">ONLYFINDS <span>DEMO</span></a>
      <nav>
        <a href="/" style="color: white; margin-right: 20px; text-decoration: none;">Home</a>
        <a href="/products" style="color: white; text-decoration: none;">Products</a>
      </nav>
    </div>
  </header>
  
  <main class="container">
    <div style="display: flex; flex-wrap: wrap; gap: 2rem; margin-bottom: 2rem;">
      <div style="flex: 1; min-width: 300px;">
        <img 
          src="${product.image}" 
          alt="${product.title.replace(/"/g, "&quot;")}"
          style="width: 100%; border-radius: 0.5rem; box-shadow: 0 0 20px rgba(138, 43, 226, 0.2);"
          onerror="this.src='/uploads/placeholder-shoe.jpg'"
        />
      </div>
      <div style="flex: 1; min-width: 300px;">
        <h1 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: white;">${product.title}</h1>
        <p style="font-size: 1.25rem; color: rgb(138, 43, 226); margin-bottom: 1rem;">${product.price.startsWith("$") ? product.price : `$${product.price}`}</p>
        
        <div style="margin-bottom: 1rem;">
          <p><strong>Category:</strong> ${product.category}</p>
          ${product.brand ? `<p><strong>Brand:</strong> ${product.brand}</p>` : ""}
          ${product.subCategory ? `<p><strong>Subcategory:</strong> ${product.subCategory}</p>` : ""}
        </div>
        
        <div class="button-container" style="margin-top: 2rem;">
          <a 
            href="${product.buyUrl}" 
            target="_blank"
            rel="noopener noreferrer"
            class="buy-button"
            style="font-size: 1rem; padding: 0.75rem;"
          >
            Buy Now
          </a>
          <a 
            href="${product.viewUrl}" 
            target="_blank"
            rel="noopener noreferrer"
            class="view-button"
            style="font-size: 1rem; padding: 0.75rem; margin-top: 0.5rem; text-align: center;"
          >
            View Original Listing
          </a>
        </div>
      </div>
    </div>
    
    <div style="margin-top: 3rem;">
      <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem; color: white;">You may also like</h2>
      <div class="grid"></div>
    </div>
  </main>
  
  <footer class="footer">
    <div class="container">
      <p>\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} ONLYFINDS - Static Export</p>
    </div>
  </footer>
  
  <script>
    // Load recommendations
    fetch('/data/recommendations-${product.id}.json')
      .then(response => response.json())
      .then(recommendations => {
        const recommendationsHtml = recommendations.map(product => {
          return \`
          <div class="product-card">
            <div class="product-image-container">
              <div class="product-price">
                \${product.price.startsWith('$') ? product.price : \`$\${product.price}\`}
              </div>
              <img 
                src="\${product.image}" 
                alt="\${product.title.replace(/"/g, '&quot;')}"
                class="product-image"
                onerror="this.src='/uploads/placeholder-shoe.jpg'"
              />
            </div>
            <div class="product-content">
              <h3 class="product-title">\${product.title}</h3>
              <div class="button-container">
                <a 
                  href="\${product.buyUrl}" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="buy-button"
                >
                  Buy Now
                </a>
                <div class="action-buttons">
                  <a 
                    href="\${product.viewUrl}" 
                    target="_blank"
                    rel="noopener noreferrer"
                    class="view-button"
                  >
                    View Details
                  </a>
                  <a href="/product/\${product.id}" class="info-button">More Info</a>
                </div>
              </div>
            </div>
          </div>
          \`;
        }).join('');
        
        document.querySelector('.grid').innerHTML = recommendationsHtml;
      })
      .catch(error => {
        console.error('Error loading recommendations:', error);
      });
  </script>
</body>
</html>`;
}
function generateCategoryPageHtml(category, products2) {
  const productsHtml = products2.map((product) => {
    return `
    <div class="product-card">
      <div class="product-image-container">
        <div class="product-price">
          ${product.price.startsWith("$") ? product.price : `$${product.price}`}
        </div>
        <img 
          src="${product.image}" 
          alt="${product.title.replace(/"/g, "&quot;")}"
          class="product-image"
          onerror="this.src='/uploads/placeholder-shoe.jpg'"
        />
      </div>
      <div class="product-content">
        <h3 class="product-title">${product.title}</h3>
        <div class="button-container">
          <a 
            href="${product.buyUrl}" 
            target="_blank"
            rel="noopener noreferrer"
            class="buy-button"
          >
            Buy Now
          </a>
          <div class="action-buttons">
            <a 
              href="${product.viewUrl}" 
              target="_blank"
              rel="noopener noreferrer"
              class="view-button"
            >
              View Details
            </a>
            <a href="/product/${product.id}" class="info-button">More Info</a>
          </div>
        </div>
      </div>
    </div>
    `;
  }).join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
  <title>${category} Products - ONLYFINDS</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <header class="header">
    <div class="container header-container">
      <a href="/" class="logo">ONLYFINDS <span>DEMO</span></a>
      <nav>
        <a href="/" style="color: white; margin-right: 20px; text-decoration: none;">Home</a>
        <a href="/products" style="color: white; text-decoration: none;">Products</a>
      </nav>
    </div>
  </header>
  
  <main class="container">
    <h1 style="font-size: 2rem; margin-bottom: 2rem; color: white;">${category} Products</h1>
    
    <div class="grid">
      ${productsHtml}
    </div>
  </main>
  
  <footer class="footer">
    <div class="container">
      <p>\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} ONLYFINDS - Static Export</p>
    </div>
  </footer>
</body>
</html>`;
}
function generateBrandPageHtml(brand, products2) {
  const productsHtml = products2.map((product) => {
    return `
    <div class="product-card">
      <div class="product-image-container">
        <div class="product-price">
          ${product.price.startsWith("$") ? product.price : `$${product.price}`}
        </div>
        <img 
          src="${product.image}" 
          alt="${product.title.replace(/"/g, "&quot;")}"
          class="product-image"
          onerror="this.src='/uploads/placeholder-shoe.jpg'"
        />
      </div>
      <div class="product-content">
        <h3 class="product-title">${product.title}</h3>
        <div class="button-container">
          <a 
            href="${product.buyUrl}" 
            target="_blank"
            rel="noopener noreferrer"
            class="buy-button"
          >
            Buy Now
          </a>
          <div class="action-buttons">
            <a 
              href="${product.viewUrl}" 
              target="_blank"
              rel="noopener noreferrer"
              class="view-button"
            >
              View Details
            </a>
            <a href="/product/${product.id}" class="info-button">More Info</a>
          </div>
        </div>
      </div>
    </div>
    `;
  }).join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
  <title>${brand} Products - ONLYFINDS</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <header class="header">
    <div class="container header-container">
      <a href="/" class="logo">TJREPS <span>DEMO</span></a>
      <nav>
        <a href="/" style="color: white; margin-right: 20px; text-decoration: none;">Home</a>
        <a href="/products" style="color: white; text-decoration: none;">Products</a>
      </nav>
    </div>
  </header>
  
  <main class="container">
    <h1 style="font-size: 2rem; margin-bottom: 2rem; color: white;">${brand} Products</h1>
    
    <div class="grid">
      ${productsHtml}
    </div>
  </main>
  
  <footer class="footer">
    <div class="container">
      <p>\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} ONLYFINDS - Static Export</p>
    </div>
  </footer>
</body>
</html>`;
}
async function registerRoutes(app2) {
  const apiRouter = express.Router();
  const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  apiRouter.get("/products", asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const category = req.query.category;
    const subCategory = req.query.subCategory;
    const sort = req.query.sort || "featured";
    let result;
    result = await fixedSupabaseStorage.getProducts(page, limit, category, subCategory, sort);
    res.json({
      products: result.products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(result.total / limit),
        totalItems: result.total,
        itemsPerPage: limit
      }
    });
  }));
  apiRouter.get("/products/featured", asyncHandler(async (req, res) => {
    let featuredProducts;
    featuredProducts = await fixedSupabaseStorage.getFeaturedProducts();
    res.json(featuredProducts);
  }));
  apiRouter.get("/products/carousel", asyncHandler(async (req, res) => {
    let carouselProducts;
    carouselProducts = await fixedSupabaseStorage.getCarouselProducts();
    res.json(carouselProducts);
  }));
  apiRouter.get("/products/search", asyncHandler(async (req, res) => {
    const query = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const sort = req.query.sort || "featured";
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    let results;
    results = await fixedSupabaseStorage.searchProducts(query, page, limit, sort);
    res.json({
      products: results.products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(results.total / limit),
        totalItems: results.total,
        itemsPerPage: limit
      }
    });
  }));
  apiRouter.get("/products/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const product = await fixedSupabaseStorage.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  }));
  apiRouter.get("/products/:id/recommendations", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const limit = parseInt(req.query.limit) || 4;
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const product = await fixedSupabaseStorage.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const recommendations = await fixedSupabaseStorage.getProductRecommendations(product, limit);
    res.json(recommendations);
  }));
  apiRouter.post("/products", asyncHandler(async (req, res) => {
    try {
      const customSchema = z.object({
        title: z.string().min(1),
        price_usd: z.string(),
        image: z.string().optional(),
        buy_url: z.string().min(1),
        category: z.string().min(1),
        sub_category: z.string().optional().nullable(),
        featured: z.boolean().default(false),
        carousel: z.boolean().default(false)
      });
      const validatedData = customSchema.parse(req.body);
      const productForStorage = {
        title: validatedData.title,
        priceUSD: validatedData.price_usd,
        image: validatedData.image || null,
        buyUrl: validatedData.buy_url,
        category: validatedData.category,
        subCategory: validatedData.sub_category || null,
        featured: validatedData.featured,
        carousel: validatedData.carousel
      };
      const newProduct = await fixedSupabaseStorage.createProduct(productForStorage);
      res.status(201).json(newProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid product data",
          errors: error.errors
        });
      }
      throw error;
    }
  }));
  apiRouter.post("/products/upload-image", upload.single("image"), asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }
    try {
      const file = req.file;
      const { supabaseStorage: supabaseStorage2 } = await Promise.resolve().then(() => (init_supabase_storage(), supabase_storage_exports));
      const filename = supabaseStorage2.generateFilename(file.originalname);
      const fileBuffer = file.buffer;
      const publicUrl = await supabaseStorage2.uploadImage(fileBuffer, filename);
      res.json({
        message: "Image uploaded successfully to Supabase Storage",
        filename: publicUrl,
        // Return full Supabase Storage URL
        originalName: file.originalname,
        storageUrl: publicUrl
      });
    } catch (error) {
      console.error("Supabase Storage upload error:", error);
      res.status(500).json({
        message: "Failed to upload image to Supabase Storage",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }));
  apiRouter.post(
    "/products/import/csv",
    upload.single("file"),
    asyncHandler(async (req, res) => {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      try {
        const fileContent = req.file.buffer.toString("utf8");
        const parser = csv.parse(fileContent, {
          columns: true,
          skip_empty_lines: true
        });
        const records = [];
        for await (const record of parser) {
          let imagePath = record.image || "";
          if (imagePath && !imagePath.startsWith("/uploads/") && !imagePath.startsWith("http")) {
            imagePath = `/uploads/${imagePath}`;
          }
          const productTitle = record.title || "";
          const priceUSD = record.price_usd || record.priceUSD || record.priceUsd || null;
          const buyUrlValue = record.buy_url || record.buyUrl || "";
          const subCategoryValue = record.sub_category || record.subcategory || record.Subcategory || record.subCategory || null;
          const product = {
            title: productTitle,
            price_usd: priceUSD || "0",
            // Exact database column name
            image: imagePath,
            buy_url: buyUrlValue,
            // Exact database column name
            category: record.category || "Other",
            sub_category: subCategoryValue,
            // Exact database column name
            featured: record.featured === "true" || record.featured === "1" || false,
            carousel: record.carousel === "true" || record.carousel === "1" || false
          };
          if (productTitle && (record.category || "Other")) {
            records.push(product);
          } else {
            console.error("Skipping invalid record (missing title or category):", record);
          }
        }
        if (records.length > 0) {
          await fixedSupabaseStorage.bulkCreateProducts(records);
          return res.status(200).json({
            message: `Import completed successfully! ${records.length} products have been added.`
          });
        } else {
          return res.status(400).json({
            message: "No valid products found in the CSV file"
          });
        }
      } catch (error) {
        console.error("CSV import error:", error);
        return res.status(500).json({
          message: "Error processing CSV file",
          error: error.message || "Unknown error"
        });
      }
    })
  );
  apiRouter.post(
    "/products/import/images",
    upload.single("imagesZip"),
    asyncHandler(async (req, res) => {
      if (!req.file) {
        return res.status(400).json({ message: "No ZIP file uploaded" });
      }
      try {
        if (!req.file.mimetype?.includes("zip") && !req.file.originalname.endsWith(".zip")) {
          return res.status(400).json({ message: "Uploaded file is not a ZIP format" });
        }
        const zip = new AdmZip(req.file.buffer);
        const zipEntries = zip.getEntries();
        const { supabaseStorage: supabaseStorage2 } = await Promise.resolve().then(() => (init_supabase_storage(), supabase_storage_exports));
        let uploadedImages = 0;
        const supportedImageTypes = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
        for (const entry of zipEntries) {
          if (entry.isDirectory || entry.name.startsWith("._")) continue;
          const entryName = entry.name.toLowerCase();
          const isImage = supportedImageTypes.some((ext) => entryName.endsWith(ext));
          if (isImage) {
            try {
              const imageBuffer = entry.getData();
              const publicUrl = await supabaseStorage2.uploadImage(imageBuffer, entry.name);
              uploadedImages++;
              console.log(`Uploaded to Supabase Storage: ${entry.name} -> ${publicUrl}`);
            } catch (uploadError) {
              console.error(`Failed to upload ${entry.name}:`, uploadError);
            }
          }
        }
        if (uploadedImages > 0) {
          return res.status(200).json({
            message: `${uploadedImages} images have been uploaded successfully to Supabase Storage`
          });
        } else {
          return res.status(400).json({
            message: "No images found in the ZIP file"
          });
        }
      } catch (error) {
        console.error("ZIP extraction error:", error);
        if (req.file && fs2.existsSync(req.file.path)) {
          fs2.unlinkSync(req.file.path);
        }
        return res.status(500).json({
          message: "Error processing ZIP file",
          error: error.message || "Unknown error"
        });
      }
    })
  );
  apiRouter.post(
    "/products/fix-image-paths",
    asyncHandler(async (req, res) => {
      try {
        const updatedCount = await storage.fixProductImagePaths();
        return res.status(200).json({
          message: `Image paths have been updated successfully for ${updatedCount} products.`,
          updatedCount
        });
      } catch (error) {
        console.error("Error fixing image paths:", error);
        return res.status(500).json({
          message: "An error occurred while updating image paths.",
          error: error.message || "Eroare necunoscut\u0103"
        });
      }
    })
  );
  apiRouter.get(
    "/export-static",
    asyncHandler(async (req, res) => {
      try {
        console.log("Starting static export for Netlify...");
        const exportDir = path2.join(process.cwd(), "netlify-export");
        if (fs2.existsSync(exportDir)) {
          fs2.rmSync(exportDir, { recursive: true, force: true });
        }
        fs2.mkdirSync(exportDir, { recursive: true });
        const publicDir = path2.join(exportDir, "public");
        fs2.mkdirSync(publicDir, { recursive: true });
        const cssDir = path2.join(publicDir, "css");
        fs2.mkdirSync(cssDir, { recursive: true });
        const jsDir = path2.join(publicDir, "js");
        fs2.mkdirSync(jsDir, { recursive: true });
        const dataDir = path2.join(publicDir, "data");
        fs2.mkdirSync(dataDir, { recursive: true });
        const uploadsDir = path2.join(publicDir, "uploads");
        fs2.mkdirSync(uploadsDir, { recursive: true });
        console.log("Copying image files...");
        const sourceUploadsDir = path2.join(process.cwd(), "uploads");
        let imagesCopied = 0;
        if (fs2.existsSync(sourceUploadsDir)) {
          const files = fs2.readdirSync(sourceUploadsDir);
          for (const file of files) {
            const sourcePath = path2.join(sourceUploadsDir, file);
            if (fs2.statSync(sourcePath).isFile() && (file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".png") || file.endsWith(".gif"))) {
              fs2.copyFileSync(
                sourcePath,
                path2.join(uploadsDir, file)
              );
              imagesCopied++;
            }
          }
        }
        console.log(`Copied ${imagesCopied} images to static export`);
        console.log("Fetching product data...");
        const allProductsData = await storage.getProducts(1, 5e3);
        const allProducts = allProductsData.products;
        const featuredProducts = await storage.getFeaturedProducts();
        const carouselProducts = await storage.getCarouselProducts();
        console.log("Creating data files...");
        fs2.writeFileSync(
          path2.join(dataDir, "products.json"),
          JSON.stringify(allProductsData, null, 2)
        );
        fs2.writeFileSync(
          path2.join(dataDir, "featured.json"),
          JSON.stringify(featuredProducts, null, 2)
        );
        fs2.writeFileSync(
          path2.join(dataDir, "carousel.json"),
          JSON.stringify(carouselProducts, null, 2)
        );
        console.log("Creating product pages...");
        const productPagesDir = path2.join(publicDir, "product");
        fs2.mkdirSync(productPagesDir, { recursive: true });
        for (const product of allProducts) {
          fs2.writeFileSync(
            path2.join(dataDir, `product-${product.id}.json`),
            JSON.stringify(product, null, 2)
          );
          const recommendations = await storage.getProductRecommendations(product);
          fs2.writeFileSync(
            path2.join(dataDir, `recommendations-${product.id}.json`),
            JSON.stringify(recommendations, null, 2)
          );
          const productDir = path2.join(productPagesDir, product.id.toString());
          fs2.mkdirSync(productDir, { recursive: true });
          fs2.writeFileSync(
            path2.join(productDir, "index.html"),
            generateProductPageHtml(product)
          );
        }
        console.log("Creating category and brand pages...");
        const categories = Array.from(new Set(allProducts.map((p) => p.category))).filter(Boolean);
        const brands = Array.from(new Set(allProducts.map((p) => p.brand))).filter(Boolean);
        for (const category of categories) {
          if (!category) continue;
          const categoryProducts = allProducts.filter((p) => p.category === category);
          const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
          fs2.writeFileSync(
            path2.join(dataDir, `category-${categorySlug}.json`),
            JSON.stringify({ products: categoryProducts, total: categoryProducts.length }, null, 2)
          );
          const categoryDir = path2.join(publicDir, "category", categorySlug);
          fs2.mkdirSync(categoryDir, { recursive: true });
          fs2.writeFileSync(
            path2.join(categoryDir, "index.html"),
            generateCategoryPageHtml(category, categoryProducts)
          );
        }
        for (const brand of brands) {
          if (!brand) continue;
          const brandProducts = allProducts.filter((p) => p.brand === brand);
          const brandSlug = brand.toLowerCase().replace(/[^a-z0-9]/g, "-");
          fs2.writeFileSync(
            path2.join(dataDir, `brand-${brandSlug}.json`),
            JSON.stringify({ products: brandProducts, total: brandProducts.length }, null, 2)
          );
          const brandDir = path2.join(publicDir, "brand", brandSlug);
          fs2.mkdirSync(brandDir, { recursive: true });
          fs2.writeFileSync(
            path2.join(brandDir, "index.html"),
            generateBrandPageHtml(brand, brandProducts)
          );
        }
        console.log("Creating CSS and JavaScript files...");
        const cssContent = `
body {
  background-color: #000000;
  overflow-x: hidden;
  max-width: 100vw;
  font-family: 'Inter', sans-serif;
  color: white;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.product-card {
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  border: 1px solid #1f1f1f;
  box-shadow: 0 0 0 1px #000;
  background-color: #0c0c0c;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(138, 43, 226, 0.3);
}

.product-image-container {
  position: relative;
  padding-bottom: 100%;
  overflow: hidden;
  cursor: pointer;
}

.product-price {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
  background-color: rgba(138, 43, 226, 0.9);
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.product-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-content {
  padding: 1rem;
  color: white;
}

.product-title {
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  height: 2.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: rgb(243, 232, 255);
  cursor: pointer;
  transition: color 0.2s;
}

.product-title:hover {
  color: rgb(216, 180, 254);
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.buy-button {
  text-align: center;
  padding: 0.5rem 0.75rem;
  background-color: rgb(138, 43, 226);
  color: white;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  text-decoration: none;
  display: block;
}

.buy-button:hover {
  background-color: rgba(138, 43, 226, 0.9);
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.view-button {
  text-align: center;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgb(138, 43, 226);
  color: rgb(216, 180, 254);
  font-weight: 500;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  font-size: 0.75rem;
  text-decoration: none;
  display: block;
}

.view-button:hover {
  background-color: rgba(138, 43, 226, 0.1);
}

.info-button {
  text-align: center;
  padding: 0.5rem 0.75rem;
  background-color: #1f1f1f;
  color: white;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  font-size: 0.75rem;
  text-decoration: none;
  display: block;
}

.info-button:hover {
  background-color: #2d2d2d;
}

.header {
  background-color: #0c0c0c;
  padding: 1rem 0;
  border-bottom: 1px solid #1f1f1f;
  margin-bottom: 2rem;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
}

.logo span {
  background-image: linear-gradient(to right, white, rgba(138, 43, 226, 0.8));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.footer {
  background-color: #0c0c0c;
  padding: 2rem 0;
  border-top: 1px solid #1f1f1f;
  margin-top: 2rem;
  text-align: center;
  color: #666;
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
`;
        fs2.writeFileSync(path2.join(cssDir, "styles.css"), cssContent);
        const dataLoaderJs = `
// Static data loader for ONLYFINDS
window.TJREPS = {
  dataUrl: '/data',
  
  async loadJSON(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(\`Failed to load data: \${response.status}\`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  },
  
  async loadProductData(productId) {
    return this.loadJSON(\`\${this.dataUrl}/product-\${productId}.json\`);
  },
  
  async loadRecommendations(productId) {
    return this.loadJSON(\`\${this.dataUrl}/recommendations-\${productId}.json\`);
  },
  
  async loadCategoryProducts(category) {
    const categorySlug = category.toLowerCase().replace(/\\s+/g, '-');
    return this.loadJSON(\`\${this.dataUrl}/category-\${categorySlug}.json\`);
  },
  
  async loadBrandProducts(brand) {
    const brandSlug = brand.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return this.loadJSON(\`\${this.dataUrl}/brand-\${brandSlug}.json\`);
  },
  
  async loadFeaturedProducts() {
    return this.loadJSON(\`\${this.dataUrl}/featured.json\`);
  },
  
  async loadCarouselProducts() {
    return this.loadJSON(\`\${this.dataUrl}/carousel.json\`);
  }
};

// Helper functions
function formatPrice(price) {
  return price.startsWith('$') ? price : \`$\${price}\`;
}

// Initialize page elements when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('TJREPS Static Page Initialized');
});
`;
        fs2.writeFileSync(path2.join(jsDir, "data-loader.js"), dataLoaderJs);
        console.log("Creating Netlify configuration files...");
        const netlifyToml = `
[build]
  publish = "public"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;
        fs2.writeFileSync(path2.join(exportDir, "netlify.toml"), netlifyToml);
        const redirects = `
# Netlify redirects
/*    /index.html   200
`;
        fs2.writeFileSync(path2.join(publicDir, "_redirects"), redirects);
        const mainIndexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
  <title>ONLYFINDS - Designer Products Showcase</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/styles.css">
  <script src="/js/data-loader.js" defer></script>
</head>
<body>
  <header class="header">
    <div class="container header-container">
      <a href="/" class="logo">TJREPS <span>DEMO</span></a>
      <nav>
        <a href="/" style="color: white; margin-right: 20px; text-decoration: none;">Home</a>
        <a href="/products" style="color: white; text-decoration: none;">Products</a>
      </nav>
    </div>
  </header>
  
  <main class="container">
    <section style="margin-bottom: 3rem;">
      <h1 style="font-size: 2.5rem; margin-bottom: 1rem; text-align: center; color: white;">
        Welcome to <span style="color: rgb(138, 43, 226);">ONLYFINDS</span>
      </h1>
      <p style="text-align: center; max-width: 800px; margin: 0 auto; color: #ccc;">
        Discover our curated collection of premium designer products at exceptional prices. 
        Browse our categories or search for your favorite brands.
      </p>
    </section>
    
    <section style="margin-bottom: 3rem;">
      <h2 style="font-size: 1.75rem; margin-bottom: 1.5rem; color: white;">Featured Products</h2>
      <div class="grid" id="featured-products">
        <div style="text-align: center; grid-column: 1/-1; padding: 3rem 0; color: #666;">
          Loading featured products...
        </div>
      </div>
    </section>
  </main>
  
  <footer class="footer">
    <div class="container">
      <p>\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} ONLYFINDS - Static Export</p>
    </div>
  </footer>
  
  <script>
    // Load featured products
    window.TJREPS.loadFeaturedProducts()
      .then(products => {
        const featuredContainer = document.getElementById('featured-products');
        
        if (!products || products.length === 0) {
          featuredContainer.innerHTML = '<div style="text-align: center; grid-column: 1/-1; padding: 3rem 0;">No featured products found</div>';
          return;
        }
        
        const productsHtml = products.map(product => {
          return \`
          <div class="product-card">
            <div class="product-image-container">
              <div class="product-price">
                \${formatPrice(product.price)}
              </div>
              <img 
                src="\${product.image}" 
                alt="\${product.title.replace(/"/g, '&quot;')}"
                class="product-image"
                onerror="this.src='/uploads/placeholder-shoe.jpg'"
              />
            </div>
            <div class="product-content">
              <h3 class="product-title">\${product.title}</h3>
              <div class="button-container">
                <a 
                  href="\${product.buyUrl}" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="buy-button"
                >
                  Buy Now
                </a>
                <div class="action-buttons">
                  <a 
                    href="\${product.viewUrl}" 
                    target="_blank"
                    rel="noopener noreferrer"
                    class="view-button"
                  >
                    View Details
                  </a>
                  <a href="/product/\${product.id}" class="info-button">More Info</a>
                </div>
              </div>
            </div>
          </div>
          \`;
        }).join('');
        
        featuredContainer.innerHTML = productsHtml;
      })
      .catch(error => {
        console.error('Error loading featured products:', error);
        document.getElementById('featured-products').innerHTML = '<div style="text-align: center; grid-column: 1/-1; padding: 3rem 0;">Failed to load featured products</div>';
      });
  </script>
</body>
</html>
`;
        fs2.writeFileSync(path2.join(publicDir, "index.html"), mainIndexHtml);
        const productsDir = path2.join(publicDir, "products");
        fs2.mkdirSync(productsDir, { recursive: true });
        const productsIndexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
  <title>All Products - ONLYFINDS</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/styles.css">
  <script src="/js/data-loader.js" defer></script>
</head>
<body>
  <header class="header">
    <div class="container header-container">
      <a href="/" class="logo">TJREPS <span>DEMO</span></a>
      <nav>
        <a href="/" style="color: white; margin-right: 20px; text-decoration: none;">Home</a>
        <a href="/products" style="color: white; text-decoration: none;">Products</a>
      </nav>
    </div>
  </header>
  
  <main class="container">
    <h1 style="font-size: 2rem; margin-bottom: 2rem; color: white;">All Products</h1>
    
    <div style="margin-bottom: 2rem;">
      <select id="category-filter" style="padding: 0.5rem; border-radius: 0.375rem; background: #1f1f1f; color: white; border: 1px solid #333;">
        <option value="">All Categories</option>
      </select>
      
      <select id="brand-filter" style="padding: 0.5rem; border-radius: 0.375rem; background: #1f1f1f; color: white; border: 1px solid #333; margin-left: 0.5rem;">
        <option value="">All Brands</option>
      </select>
    </div>
    
    <div class="grid" id="products-grid">
      <div style="text-align: center; grid-column: 1/-1; padding: 3rem 0; color: #666;">
        Loading products...
      </div>
    </div>
  </main>
  
  <footer class="footer">
    <div class="container">
      <p>\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} ONLYFINDS - Static Export</p>
    </div>
  </footer>
  
  <script>
    // Load all products
    fetch('/data/products.json')
      .then(response => response.json())
      .then(data => {
        const productsGrid = document.getElementById('products-grid');
        const products = data.products;
        
        if (!products || products.length === 0) {
          productsGrid.innerHTML = '<div style="text-align: center; grid-column: 1/-1; padding: 3rem 0;">No products found</div>';
          return;
        }
        
        // Populate category filter
        const categoryFilter = document.getElementById('category-filter');
        const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
        categories.sort().forEach(category => {
          const option = document.createElement('option');
          option.value = category;
          option.textContent = category;
          categoryFilter.appendChild(option);
        });
        
        // Populate brand filter
        const brandFilter = document.getElementById('brand-filter');
        const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
        brands.sort().forEach(brand => {
          const option = document.createElement('option');
          option.value = brand;
          option.textContent = brand;
          brandFilter.appendChild(option);
        });
        
        // Filter change handlers
        categoryFilter.addEventListener('change', updateProductsDisplay);
        brandFilter.addEventListener('change', updateProductsDisplay);
        
        // Initial display
        updateProductsDisplay();
        
        function updateProductsDisplay() {
          const selectedCategory = categoryFilter.value;
          const selectedBrand = brandFilter.value;
          
          // Filter products
          let filteredProducts = products;
          
          if (selectedCategory) {
            filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
          }
          
          if (selectedBrand) {
            filteredProducts = filteredProducts.filter(p => p.brand === selectedBrand);
          }
          
          // Limit to 50 products for performance
          const displayProducts = filteredProducts.slice(0, 50);
          
          if (displayProducts.length === 0) {
            productsGrid.innerHTML = '<div style="text-align: center; grid-column: 1/-1; padding: 3rem 0;">No products match your filters</div>';
            return;
          }
          
          const productsHtml = displayProducts.map(product => {
            return \`
            <div class="product-card">
              <div class="product-image-container">
                <div class="product-price">
                  \${formatPrice(product.price)}
                </div>
                <img 
                  src="\${product.image}" 
                  alt="\${product.title.replace(/"/g, '&quot;')}"
                  class="product-image"
                  onerror="this.src='/uploads/placeholder-shoe.jpg'"
                />
              </div>
              <div class="product-content">
                <h3 class="product-title">\${product.title}</h3>
                <div class="button-container">
                  <a 
                    href="\${product.buyUrl}" 
                    target="_blank"
                    rel="noopener noreferrer"
                    class="buy-button"
                  >
                    Buy Now
                  </a>
                  <div class="action-buttons">
                    <a 
                      href="\${product.viewUrl}" 
                      target="_blank"
                      rel="noopener noreferrer"
                      class="view-button"
                    >
                      View Details
                    </a>
                    <a href="/product/\${product.id}" class="info-button">More Info</a>
                  </div>
                </div>
              </div>
            </div>
            \`;
          }).join('');
          
          productsGrid.innerHTML = productsHtml;
          
          // Show count of displayed products
          productsGrid.insertAdjacentHTML('afterbegin', \`
            <div style="grid-column: 1/-1; margin-bottom: 1rem; color: #ccc; font-size: 0.875rem;">
              Showing \${displayProducts.length} of \${filteredProducts.length} products
              \${filteredProducts.length > 50 ? ' (limited to first 50 for performance)' : ''}
            </div>
          \`);
        }
      })
      .catch(error => {
        console.error('Error loading products:', error);
        document.getElementById('products-grid').innerHTML = '<div style="text-align: center; grid-column: 1/-1; padding: 3rem 0;">Failed to load products</div>';
      });
  </script>
</body>
</html>
`;
        fs2.writeFileSync(path2.join(productsDir, "index.html"), productsIndexHtml);
        console.log("Creating documentation files...");
        const readmeContent = `
# ONLYFINDS - Static Export for Netlify

This is a complete static export of the ONLYFINDS website, ready to be deployed to Netlify or other static hosting services.

## Features

- Full static version of the website with all product data
- Images included in the \`uploads\` directory
- Product pages with recommendations
- Category and brand filtering
- Netlify configuration included

## Deployment Instructions

1. Upload this entire directory to Netlify via the drag-and-drop interface at app.netlify.com
2. Alternatively, connect your GitHub repository and use the netlify.toml configuration

## Directory Structure

- \`/public\` - The main website files
- \`/public/data\` - JSON data files for all products
- \`/public/uploads\` - Product images
- \`/public/css\` - CSS stylesheets
- \`/public/js\` - JavaScript files
- \`/public/product\` - Individual product pages

## Notes

This export was generated on ${(/* @__PURE__ */ new Date()).toLocaleString()} and includes ${allProducts.length} products.
`;
        fs2.writeFileSync(path2.join(exportDir, "README.md"), readmeContent);
        const exportInfo = {
          name: "ONLYFINDS Static Export",
          version: "1.0.0",
          exportDate: (/* @__PURE__ */ new Date()).toISOString(),
          totalProducts: allProducts.length,
          categories: categories.length,
          brands: brands.length,
          images: imagesCopied
        };
        fs2.writeFileSync(
          path2.join(exportDir, "export-info.json"),
          JSON.stringify(exportInfo, null, 2)
        );
        console.log("Creating ZIP archive...");
        const zipPath = path2.join(process.cwd(), "tjreps-netlify-export.zip");
        if (fs2.existsSync(zipPath)) {
          fs2.unlinkSync(zipPath);
        }
        const staticExportZip = new AdmZip();
        staticExportZip.addLocalFolder(exportDir);
        staticExportZip.writeZip(zipPath);
        console.log("Static export completed successfully!");
        console.log(`- Total products: ${allProducts.length}`);
        console.log(`- Images copied: ${imagesCopied}`);
        console.log(`- Categories: ${categories.length}`);
        console.log(`- Brands: ${brands.length}`);
        res.download(zipPath, "tjreps-netlify-export.zip", (err) => {
          if (err) {
            console.error("Download error:", err);
          }
          setTimeout(() => {
            try {
              if (fs2.existsSync(zipPath)) {
                fs2.unlinkSync(zipPath);
              }
              if (fs2.existsSync(exportDir)) {
                fs2.rmSync(exportDir, { recursive: true, force: true });
              }
            } catch (cleanupError) {
              console.error("Cleanup error:", cleanupError);
            }
          }, 5e3);
        });
      } catch (error) {
        console.error("Static export error:", error);
        const exportDir = path2.join(process.cwd(), "netlify-export");
        const zipPath = path2.join(process.cwd(), "tjreps-netlify-export.zip");
        if (fs2.existsSync(exportDir)) {
          fs2.rmSync(exportDir, { recursive: true, force: true });
        }
        if (fs2.existsSync(zipPath)) {
          fs2.unlinkSync(zipPath);
        }
        return res.status(500).json({
          message: "Error generating static export",
          error: error.message || "Unknown error"
        });
      }
    })
  );
  apiRouter.get("/products-export", asyncHandler(async (req, res) => {
    try {
      const allProducts = await db.select().from(products);
      res.setHeader("Content-Disposition", 'attachment; filename="products.json"');
      res.setHeader("Content-Type", "application/json");
      res.json(allProducts);
    } catch (error) {
      console.error("Error exporting products:", error);
      res.status(500).json({ message: "Eroare la exportul produselor", error: String(error) });
    }
  }));
  apiRouter.post("/export-to-static-json", asyncHandler(async (req, res) => {
    try {
      const fs4 = __require("fs");
      const path6 = __require("path");
      console.log("Exportul produselor \xEEn format JSON static...");
      const allProducts = await db.select().from(products);
      console.log(`S-au g\u0103sit ${allProducts.length} produse pentru export`);
      const outputDir = path6.join(__dirname, "../client/public/data");
      if (!fs4.existsSync(outputDir)) {
        fs4.mkdirSync(outputDir, { recursive: true });
      }
      const outputPath = path6.join(outputDir, "products.json");
      fs4.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2));
      console.log(`Export finalizat cu succes \xEEn ${outputPath}`);
      res.json({
        success: true,
        message: `Export finalizat cu succes. ${allProducts.length} produse au fost salvate \xEEn format JSON.`,
        count: allProducts.length
      });
    } catch (error) {
      console.error("Eroare la exportul JSON:", error);
      res.status(500).json({
        success: false,
        message: `Eroare la exportul JSON: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  }));
  if (fixedSupabaseStorage) {
    apiRouter.get("/admin/products", asyncHandler(async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const search = req.query.search;
      const category = req.query.category;
      let result;
      if (search) {
        result = await fixedSupabaseStorage.searchProducts(search, page, limit);
      } else {
        result = await fixedSupabaseStorage.getProducts(page, limit, category);
      }
      res.json(result);
    }));
    apiRouter.post("/admin/products", asyncHandler(async (req, res) => {
      try {
        const productData = insertProductSchema.parse(req.body);
        const transformedData = {
          title: productData.title || "",
          priceUSD: productData.priceUSD ? parseFloat(productData.priceUSD) : null,
          image: productData.image || null,
          buyUrl: productData.buyUrl || null,
          viewUrl: productData.viewUrl || null,
          category: productData.category || null,
          subCategory: productData.subCategory || null,
          brand: productData.brand || null,
          featured: productData.featured || false,
          carousel: productData.carousel || false
        };
        const newProduct = await fixedSupabaseStorage.createProduct(transformedData);
        res.status(201).json(newProduct);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            message: "Invalid product data",
            errors: error.errors
          });
        }
        throw error;
      }
    }));
    apiRouter.get("/admin/products/:id", asyncHandler(async (req, res) => {
      const product = await fixedSupabaseStorage.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    }));
    apiRouter.put("/admin/products/:id", asyncHandler(async (req, res) => {
      const product = await fixedSupabaseStorage.updateProduct(req.params.id, req.body);
      res.json(product);
    }));
    apiRouter.delete("/admin/products/:id", asyncHandler(async (req, res) => {
      await fixedSupabaseStorage.deleteProduct(req.params.id);
      res.json({ success: true });
    }));
    apiRouter.get("/admin/categories", asyncHandler(async (req, res) => {
      const categories = await fixedSupabaseStorage.getCategories();
      res.json(categories);
    }));
  }
  app2.use("/api", apiRouter);
  app2.use("/uploads", express.static("uploads"));
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs3 from "fs";
import path4 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path3 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path3.resolve(import.meta.dirname, "client", "src"),
      "@shared": path3.resolve(import.meta.dirname, "shared"),
      "@assets": path3.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path3.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path3.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path4.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs3.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path4.resolve(import.meta.dirname, "public");
  if (!fs3.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path4.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import path5 from "path";
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use(express3.static(path5.resolve(import.meta.dirname, "..", "public")));
app.get("/", (req, res) => {
  log(`Health check request from ${req.ip || req.connection.remoteAddress}`);
  res.status(200).json({
    status: "healthy",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    service: "ONLYFINDS API",
    uptime: process.uptime()
  });
});
app.get("/health", (req, res) => {
  log(`Health check request at /health from ${req.ip || req.connection.remoteAddress}`);
  res.status(200).json({
    status: "healthy",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    service: "ONLYFINDS API",
    uptime: process.uptime()
  });
});
app.use((req, res, next) => {
  const start = Date.now();
  const path6 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    let logLine = `${req.method} ${path6} ${res.statusCode} in ${duration}ms`;
    if (capturedJsonResponse && path6.startsWith("/api")) {
      logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
    }
    if (logLine.length > 80) {
      logLine = logLine.slice(0, 79) + "\u2026";
    }
    log(logLine);
  });
  next();
});
(async () => {
  try {
    const server = await registerRoutes(app);
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error("Server error:", err);
      res.status(status).json({ message });
    });
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    const port = 5e3;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true
    }, () => {
      log(`\u2705 Server started successfully and serving on port ${port}`);
      log(`\u{1F30D} Server accessible at http://0.0.0.0:${port}`);
      log(`\u{1F49A} Health check endpoints: / and /health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
