var __defProp = Object.defineProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express3 from "express";

// server/routes.ts
import express from "express";
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  insertProductSchema: () => insertProductSchema,
  insertUserSchema: () => insertUserSchema,
  products: () => products,
  users: () => users
});
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
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  price: text("price").notNull(),
  image: text("image").notNull(),
  buyUrl: text("buy_url").notNull(),
  viewUrl: text("view_url").notNull(),
  category: text("category").notNull(),
  subCategory: text("sub_category"),
  // Subcategoria pentru filtrare suplimentară
  brand: text("brand"),
  // Brand-ul produsului pentru filtrare și căutare
  featured: boolean("featured").default(false),
  carousel: boolean("carousel").default(false)
  // Indicator pentru produsele din carusel
});
var insertProductSchema = createInsertSchema(products).pick({
  title: true,
  price: true,
  image: true,
  buyUrl: true,
  viewUrl: true,
  category: true,
  subCategory: true,
  brand: true,
  featured: true,
  carousel: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, asc, sql, ne } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async getProducts(page = 1, limit = 12, category, subCategory, brand, sort = "featured") {
    const offset = (page - 1) * limit;
    let queryBuilder = db.select().from(products);
    let countQueryBuilder = db.select({ count: sql`count(*)` }).from(products);
    const conditions = [];
    if (category && category !== "All") {
      conditions.push(eq(products.category, category));
      if ((category === "Clothing" || category === "Accessories") && subCategory && subCategory !== "All") {
        conditions.push(eq(products.subCategory, subCategory));
      }
    }
    if (brand && brand !== "All") {
      conditions.push(sql`UPPER(${products.brand}) = UPPER(${brand})`);
    }
    if (conditions.length > 0) {
      for (const condition of conditions) {
        queryBuilder = queryBuilder.where(condition);
        countQueryBuilder = countQueryBuilder.where(condition);
      }
    }
    if (sort === "priceAsc") {
      queryBuilder = queryBuilder.orderBy(asc(products.price));
    } else if (sort === "priceDesc") {
      queryBuilder = queryBuilder.orderBy(desc(products.price));
    } else {
      queryBuilder = queryBuilder.orderBy(
        desc(products.featured),
        desc(products.id)
      );
    }
    const productsList = await queryBuilder.limit(limit).offset(offset);
    const result = await countQueryBuilder;
    const total = result.length > 0 ? Number(result[0].count) : 0;
    return {
      products: productsList,
      total
    };
  }
  async getProductById(id) {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }
  async getFeaturedProducts() {
    return await db.select().from(products).where(eq(products.featured, true)).orderBy(desc(products.id)).limit(8);
  }
  async getCarouselProducts() {
    const carouselIds = [312, 333, 871, 271, 622, 711, 888, 621, 1012, 299];
    const carouselProducts = [];
    for (const id of carouselIds) {
      const [product] = await db.select().from(products).where(eq(products.id, id));
      if (product) {
        carouselProducts.push(product);
      }
    }
    return carouselProducts;
  }
  async createProduct(product) {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }
  async createManyProducts(productsToInsert) {
    const chunkSize = 100;
    for (let i = 0; i < productsToInsert.length; i += chunkSize) {
      const chunk = productsToInsert.slice(i, i + chunkSize);
      await db.insert(products).values(chunk);
    }
  }
  async searchProducts(query, page = 1, limit = 12, brand, sort = "featured") {
    const offset = (page - 1) * limit;
    const searchPattern = `%${query}%`;
    let searchCondition = sql`${products.title} ILIKE ${searchPattern} OR ${products.category} ILIKE ${searchPattern}`;
    if (brand && brand !== "All") {
      searchCondition = sql`(${searchCondition}) AND UPPER(${products.brand}) = UPPER(${brand})`;
    }
    let queryBuilder = db.select().from(products).where(searchCondition);
    if (sort === "priceAsc") {
      queryBuilder = queryBuilder.orderBy(asc(products.price));
    } else if (sort === "priceDesc") {
      queryBuilder = queryBuilder.orderBy(desc(products.price));
    } else {
      queryBuilder = queryBuilder.orderBy(
        desc(products.featured),
        desc(products.id)
      );
    }
    const productsList = await queryBuilder.limit(limit).offset(offset);
    const result = await db.select({ count: sql`count(*)` }).from(products).where(searchCondition);
    const total = result.length > 0 ? Number(result[0].count) : 0;
    return {
      products: productsList,
      total
    };
  }
  // Helper method to fix image paths for all products
  async fixProductImagePaths() {
    let updatedCount = 0;
    const productsToUpdate = await db.select().from(products).where(sql`${products.image} IS NOT NULL AND ${products.image} != '' AND 
             ${products.image} NOT LIKE '/uploads/%' AND 
             ${products.image} NOT LIKE 'http%'`);
    for (const product of productsToUpdate) {
      const oldImagePath = product.image;
      const newImagePath = `/uploads/${oldImagePath}`;
      await db.update(products).set({ image: newImagePath }).where(eq(products.id, product.id));
      updatedCount++;
    }
    return updatedCount;
  }
  /**
   * Obține recomandări de produse pe baza unui produs specificat
   * Strategia folosită: Caută produse din aceeași categorie și/sau brand
   */
  async getProductRecommendations(product, limit = 4) {
    const excludeId = product.id;
    const productCategory = product.category;
    const productBrand = product.brand || "Other";
    let recommendedProducts = [];
    const safeExcludeIds = (queryBuilder, ids) => {
      for (const id of ids) {
        if (id !== void 0 && id !== null) {
          queryBuilder = queryBuilder.where(ne(products.id, id));
        }
      }
      return queryBuilder;
    };
    if (recommendedProducts.length < limit) {
      const currentLimit = limit - recommendedProducts.length;
      let query = db.select().from(products).where(eq(products.category, productCategory)).where(sql`UPPER(${products.brand}) = UPPER(${productBrand})`).where(ne(products.id, excludeId));
      if (recommendedProducts.length > 0) {
        query = safeExcludeIds(query, recommendedProducts.map((p) => p.id));
      }
      const similarProducts = await query.orderBy(desc(products.featured), desc(products.id)).limit(currentLimit);
      recommendedProducts = [...recommendedProducts, ...similarProducts];
    }
    if (recommendedProducts.length < limit) {
      const currentLimit = limit - recommendedProducts.length;
      let query = db.select().from(products).where(eq(products.category, productCategory)).where(ne(products.id, excludeId));
      if (productBrand) {
        query = query.where(sql`UPPER(${products.brand}) != UPPER(${productBrand})`);
      }
      if (recommendedProducts.length > 0) {
        query = safeExcludeIds(query, recommendedProducts.map((p) => p.id));
      }
      const similarProducts = await query.orderBy(desc(products.featured), desc(products.id)).limit(currentLimit);
      recommendedProducts = [...recommendedProducts, ...similarProducts];
    }
    if (recommendedProducts.length < limit && productBrand) {
      const currentLimit = limit - recommendedProducts.length;
      let query = db.select().from(products).where(sql`UPPER(${products.brand}) = UPPER(${productBrand})`).where(ne(products.id, excludeId)).where(ne(products.category, productCategory));
      if (recommendedProducts.length > 0) {
        query = safeExcludeIds(query, recommendedProducts.map((p) => p.id));
      }
      const similarProducts = await query.orderBy(desc(products.featured), desc(products.id)).limit(currentLimit);
      recommendedProducts = [...recommendedProducts, ...similarProducts];
    }
    if (recommendedProducts.length < limit) {
      const currentLimit = limit - recommendedProducts.length;
      let query = db.select().from(products).where(eq(products.featured, true)).where(ne(products.id, excludeId));
      if (recommendedProducts.length > 0) {
        query = safeExcludeIds(query, recommendedProducts.map((p) => p.id));
      }
      const popularProducts = await query.orderBy(desc(products.id)).limit(currentLimit);
      recommendedProducts = [...recommendedProducts, ...popularProducts];
    }
    if (recommendedProducts.length < limit) {
      const currentLimit = limit - recommendedProducts.length;
      let query = db.select().from(products).where(ne(products.id, excludeId));
      if (recommendedProducts.length > 0) {
        query = safeExcludeIds(query, recommendedProducts.map((p) => p.id));
      }
      const anyProducts = await query.orderBy(desc(products.id)).limit(currentLimit);
      recommendedProducts = [...recommendedProducts, ...anyProducts];
    }
    return recommendedProducts;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";
import multer from "multer";
import * as csv from "csv-parse";
import * as fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
}
var upload = multer({ dest: "uploads/" });
function generateProductPageHtml(product) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
  <title>${product.title} - TJREPS DEMO</title>
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
      <p>\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} TJREPS DEMO - Static Export</p>
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
  <title>${category} Products - TJREPS DEMO</title>
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
    <h1 style="font-size: 2rem; margin-bottom: 2rem; color: white;">${category} Products</h1>
    
    <div class="grid">
      ${productsHtml}
    </div>
  </main>
  
  <footer class="footer">
    <div class="container">
      <p>\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} TJREPS DEMO - Static Export</p>
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
  <title>${brand} Products - TJREPS DEMO</title>
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
      <p>\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} TJREPS DEMO - Static Export</p>
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
    const brand = req.query.brand;
    const sort = req.query.sort || "featured";
    const result = await storage.getProducts(page, limit, category, subCategory, brand, sort);
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
    const featuredProducts = await storage.getFeaturedProducts();
    res.json(featuredProducts);
  }));
  apiRouter.get("/products/carousel", asyncHandler(async (req, res) => {
    const carouselProducts = await storage.getCarouselProducts();
    res.json(carouselProducts);
  }));
  apiRouter.get("/products/search", asyncHandler(async (req, res) => {
    const query = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const brand = req.query.brand;
    const sort = req.query.sort || "featured";
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    const results = await storage.searchProducts(query, page, limit, brand, sort);
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
    const product = await storage.getProductById(id);
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
    const product = await storage.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const recommendations = await storage.getProductRecommendations(product, limit);
    res.json(recommendations);
  }));
  apiRouter.post("/products", asyncHandler(async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const newProduct = await storage.createProduct(productData);
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
  apiRouter.post(
    "/products/import/csv",
    upload.single("file"),
    asyncHandler(async (req, res) => {
      if (!req.file) {
        return res.status(400).json({ message: "Niciun fi\u0219ier \xEEnc\u0103rcat" });
      }
      try {
        const fileContent = fs.readFileSync(req.file.path, "utf8");
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
          const detectBrand = (title) => {
            const brands = [
              "Nike",
              "Adidas",
              "Jordan",
              "Yeezy",
              "Puma",
              "Reebok",
              "New Balance",
              "Converse",
              "Vans",
              "Under Armour",
              "Balenciaga",
              "Gucci",
              "Louis Vuitton",
              "Dior",
              "Off-White",
              "Supreme",
              "Prada",
              "Versace",
              "Valentino",
              "North Face"
            ];
            for (const brand of brands) {
              if (title.toUpperCase().includes(brand.toUpperCase())) {
                return brand;
              }
            }
            return "Other";
          };
          const productTitle = record.title || "";
          const productBrand = record.brand || detectBrand(productTitle);
          const subCategoryValue = record.subcategory || record.Subcategory || record.subCategory || null;
          const product = {
            title: productTitle,
            price: record.price || "0",
            image: imagePath,
            buyUrl: record.buyUrl || record.buy_url || "",
            viewUrl: record.viewUrl || record.view_url || "",
            category: record.category || "Other",
            brand: productBrand,
            subCategory: subCategoryValue,
            featured: record.featured === "true" || record.featured === "1"
          };
          try {
            const validatedProduct = insertProductSchema.parse(product);
            records.push(validatedProduct);
          } catch (validationError) {
            console.error("Validation error for record:", record, validationError);
          }
        }
        fs.unlinkSync(req.file.path);
        if (records.length > 0) {
          await storage.createManyProducts(records);
          return res.status(200).json({
            message: `Importul a fost realizat cu succes! ${records.length} produse au fost ad\u0103ugate.`
          });
        } else {
          return res.status(400).json({
            message: "Nu s-au g\u0103sit produse valide \xEEn fi\u0219ierul CSV"
          });
        }
      } catch (error) {
        console.error("CSV import error:", error);
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({
          message: "Eroare la procesarea fi\u0219ierului CSV",
          error: error.message || "Eroare necunoscut\u0103"
        });
      }
    })
  );
  apiRouter.post(
    "/products/import/images",
    upload.single("imagesZip"),
    asyncHandler(async (req, res) => {
      if (!req.file) {
        return res.status(400).json({ message: "Niciun fi\u0219ier ZIP \xEEnc\u0103rcat" });
      }
      try {
        if (!req.file.mimetype?.includes("zip") && !req.file.originalname.endsWith(".zip")) {
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ message: "Fi\u0219ierul \xEEnc\u0103rcat nu este \xEEn format ZIP" });
        }
        const zip = new AdmZip(req.file.path);
        const zipEntries = zip.getEntries();
        let extractedImages = 0;
        const supportedImageTypes = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
        for (const entry of zipEntries) {
          if (entry.isDirectory || entry.name.startsWith("._")) continue;
          const entryName = entry.name.toLowerCase();
          const isImage = supportedImageTypes.some((ext) => entryName.endsWith(ext));
          if (isImage) {
            const outputPath = path.join("uploads", entry.name);
            zip.extractEntryTo(entry, "uploads", false, true);
            extractedImages++;
            console.log(`Extracted: ${entry.name} to ${outputPath}`);
          }
        }
        fs.unlinkSync(req.file.path);
        if (extractedImages > 0) {
          return res.status(200).json({
            message: `${extractedImages} imagini au fost extrase cu succes`
          });
        } else {
          return res.status(400).json({
            message: "Nu s-au g\u0103sit imagini \xEEn fi\u0219ierul ZIP"
          });
        }
      } catch (error) {
        console.error("ZIP extraction error:", error);
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({
          message: "Eroare la procesarea fi\u0219ierului ZIP",
          error: error.message || "Eroare necunoscut\u0103"
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
          message: `C\u0103ile imaginilor au fost actualizate cu succes pentru ${updatedCount} produse.`,
          updatedCount
        });
      } catch (error) {
        console.error("Error fixing image paths:", error);
        return res.status(500).json({
          message: "A ap\u0103rut o eroare la actualizarea c\u0103ilor imaginilor.",
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
        const exportDir = path.join(process.cwd(), "netlify-export");
        if (fs.existsSync(exportDir)) {
          fs.rmSync(exportDir, { recursive: true, force: true });
        }
        fs.mkdirSync(exportDir, { recursive: true });
        const publicDir = path.join(exportDir, "public");
        fs.mkdirSync(publicDir, { recursive: true });
        const cssDir = path.join(publicDir, "css");
        fs.mkdirSync(cssDir, { recursive: true });
        const jsDir = path.join(publicDir, "js");
        fs.mkdirSync(jsDir, { recursive: true });
        const dataDir = path.join(publicDir, "data");
        fs.mkdirSync(dataDir, { recursive: true });
        const uploadsDir = path.join(publicDir, "uploads");
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log("Copying image files...");
        const sourceUploadsDir = path.join(process.cwd(), "uploads");
        let imagesCopied = 0;
        if (fs.existsSync(sourceUploadsDir)) {
          const files = fs.readdirSync(sourceUploadsDir);
          for (const file of files) {
            const sourcePath = path.join(sourceUploadsDir, file);
            if (fs.statSync(sourcePath).isFile() && (file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".png") || file.endsWith(".gif"))) {
              fs.copyFileSync(
                sourcePath,
                path.join(uploadsDir, file)
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
        fs.writeFileSync(
          path.join(dataDir, "products.json"),
          JSON.stringify(allProductsData, null, 2)
        );
        fs.writeFileSync(
          path.join(dataDir, "featured.json"),
          JSON.stringify(featuredProducts, null, 2)
        );
        fs.writeFileSync(
          path.join(dataDir, "carousel.json"),
          JSON.stringify(carouselProducts, null, 2)
        );
        console.log("Creating product pages...");
        const productPagesDir = path.join(publicDir, "product");
        fs.mkdirSync(productPagesDir, { recursive: true });
        for (const product of allProducts) {
          fs.writeFileSync(
            path.join(dataDir, `product-${product.id}.json`),
            JSON.stringify(product, null, 2)
          );
          const recommendations = await storage.getProductRecommendations(product);
          fs.writeFileSync(
            path.join(dataDir, `recommendations-${product.id}.json`),
            JSON.stringify(recommendations, null, 2)
          );
          const productDir = path.join(productPagesDir, product.id.toString());
          fs.mkdirSync(productDir, { recursive: true });
          fs.writeFileSync(
            path.join(productDir, "index.html"),
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
          fs.writeFileSync(
            path.join(dataDir, `category-${categorySlug}.json`),
            JSON.stringify({ products: categoryProducts, total: categoryProducts.length }, null, 2)
          );
          const categoryDir = path.join(publicDir, "category", categorySlug);
          fs.mkdirSync(categoryDir, { recursive: true });
          fs.writeFileSync(
            path.join(categoryDir, "index.html"),
            generateCategoryPageHtml(category, categoryProducts)
          );
        }
        for (const brand of brands) {
          if (!brand) continue;
          const brandProducts = allProducts.filter((p) => p.brand === brand);
          const brandSlug = brand.toLowerCase().replace(/[^a-z0-9]/g, "-");
          fs.writeFileSync(
            path.join(dataDir, `brand-${brandSlug}.json`),
            JSON.stringify({ products: brandProducts, total: brandProducts.length }, null, 2)
          );
          const brandDir = path.join(publicDir, "brand", brandSlug);
          fs.mkdirSync(brandDir, { recursive: true });
          fs.writeFileSync(
            path.join(brandDir, "index.html"),
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
        fs.writeFileSync(path.join(cssDir, "styles.css"), cssContent);
        const dataLoaderJs = `
// Static data loader for TJREPS DEMO
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
        fs.writeFileSync(path.join(jsDir, "data-loader.js"), dataLoaderJs);
        console.log("Creating Netlify configuration files...");
        const netlifyToml = `
[build]
  publish = "public"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;
        fs.writeFileSync(path.join(exportDir, "netlify.toml"), netlifyToml);
        const redirects = `
# Netlify redirects
/*    /index.html   200
`;
        fs.writeFileSync(path.join(publicDir, "_redirects"), redirects);
        const mainIndexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
  <title>TJREPS DEMO - Designer Products Showcase</title>
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
        Welcome to <span style="color: rgb(138, 43, 226);">TJREPS DEMO</span>
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
      <p>\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} TJREPS DEMO - Static Export</p>
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
        fs.writeFileSync(path.join(publicDir, "index.html"), mainIndexHtml);
        const productsDir = path.join(publicDir, "products");
        fs.mkdirSync(productsDir, { recursive: true });
        const productsIndexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
  <title>All Products - TJREPS DEMO</title>
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
      <p>\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} TJREPS DEMO - Static Export</p>
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
        fs.writeFileSync(path.join(productsDir, "index.html"), productsIndexHtml);
        console.log("Creating documentation files...");
        const readmeContent = `
# TJREPS DEMO - Static Export for Netlify

This is a complete static export of the TJREPS DEMO website, ready to be deployed to Netlify or other static hosting services.

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
        fs.writeFileSync(path.join(exportDir, "README.md"), readmeContent);
        const exportInfo = {
          name: "TJREPS DEMO Static Export",
          version: "1.0.0",
          exportDate: (/* @__PURE__ */ new Date()).toISOString(),
          totalProducts: allProducts.length,
          categories: categories.length,
          brands: brands.length,
          images: imagesCopied
        };
        fs.writeFileSync(
          path.join(exportDir, "export-info.json"),
          JSON.stringify(exportInfo, null, 2)
        );
        console.log("Creating ZIP archive...");
        const zipPath = path.join(process.cwd(), "tjreps-netlify-export.zip");
        if (fs.existsSync(zipPath)) {
          fs.unlinkSync(zipPath);
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
              if (fs.existsSync(zipPath)) {
                fs.unlinkSync(zipPath);
              }
              if (fs.existsSync(exportDir)) {
                fs.rmSync(exportDir, { recursive: true, force: true });
              }
            } catch (cleanupError) {
              console.error("Cleanup error:", cleanupError);
            }
          }, 5e3);
        });
      } catch (error) {
        console.error("Static export error:", error);
        const exportDir = path.join(process.cwd(), "netlify-export");
        const zipPath = path.join(process.cwd(), "tjreps-netlify-export.zip");
        if (fs.existsSync(exportDir)) {
          fs.rmSync(exportDir, { recursive: true, force: true });
        }
        if (fs.existsSync(zipPath)) {
          fs.unlinkSync(zipPath);
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
      const fs3 = __require("fs");
      const path4 = __require("path");
      console.log("Exportul produselor \xEEn format JSON static...");
      const allProducts = await db.select().from(products);
      console.log(`S-au g\u0103sit ${allProducts.length} produse pentru export`);
      const outputDir = path4.join(__dirname, "../client/public/data");
      if (!fs3.existsSync(outputDir)) {
        fs3.mkdirSync(outputDir, { recursive: true });
      }
      const outputPath = path4.join(outputDir, "products.json");
      fs3.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2));
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
  app2.use("/api", apiRouter);
  app2.use("/uploads", express.static("uploads"));
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path2 from "path";
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
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist"),
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
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
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
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
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
    log(`serving on port ${port}`);
  });
})();
