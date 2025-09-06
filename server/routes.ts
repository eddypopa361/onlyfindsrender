import express, { type Express } from "express";
import type { Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { fixedSupabaseStorage } from "./storage-supabase-fixed";
import { supabaseStorage } from "./supabase-storage";
import { insertProductSchema, products } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import * as csv from 'csv-parse';
import * as fs from 'fs';
import { Readable } from 'stream';
import path from 'path';
import AdmZip from 'adm-zip';


// Setup multer for memory storage (will upload directly to Supabase)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Helper functions for static export
function generateProductPageHtml(product: any) {
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
          alt="${product.title.replace(/"/g, '&quot;')}"
          style="width: 100%; border-radius: 0.5rem; box-shadow: 0 0 20px rgba(138, 43, 226, 0.2);"
          onerror="this.src='/uploads/placeholder-shoe.jpg'"
        />
      </div>
      <div style="flex: 1; min-width: 300px;">
        <h1 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: white;">${product.title}</h1>
        <p style="font-size: 1.25rem; color: rgb(138, 43, 226); margin-bottom: 1rem;">${product.price.startsWith('$') ? product.price : `$${product.price}`}</p>
        
        <div style="margin-bottom: 1rem;">
          <p><strong>Category:</strong> ${product.category}</p>
          ${product.brand ? `<p><strong>Brand:</strong> ${product.brand}</p>` : ''}
          ${product.subCategory ? `<p><strong>Subcategory:</strong> ${product.subCategory}</p>` : ''}
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
      <p>© ${new Date().getFullYear()} ONLYFINDS - Static Export</p>
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

function generateCategoryPageHtml(category: string, products: any[]) {
  const productsHtml = products.map(product => {
    return `
    <div class="product-card">
      <div class="product-image-container">
        <div class="product-price">
          ${product.price.startsWith('$') ? product.price : `$${product.price}`}
        </div>
        <img 
          src="${product.image}" 
          alt="${product.title.replace(/"/g, '&quot;')}"
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
  }).join('\n');

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
      <p>© ${new Date().getFullYear()} ONLYFINDS - Static Export</p>
    </div>
  </footer>
</body>
</html>`;
}

function generateBrandPageHtml(brand: string, products: any[]) {
  const productsHtml = products.map(product => {
    return `
    <div class="product-card">
      <div class="product-image-container">
        <div class="product-price">
          ${product.price.startsWith('$') ? product.price : `$${product.price}`}
        </div>
        <img 
          src="${product.image}" 
          alt="${product.title.replace(/"/g, '&quot;')}"
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
  }).join('\n');

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
      <p>© ${new Date().getFullYear()} ONLYFINDS - Static Export</p>
    </div>
  </footer>
</body>
</html>`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = express.Router();
  
  // Error handling middleware
  const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
    (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  
  // Get all products with pagination and filtering
  apiRouter.get("/products", asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const category = req.query.category as string;
    const subCategory = req.query.subCategory as string; 
    const brand = req.query.brand as string;
    const sort = req.query.sort as string || "featured";
    
    let result;
    
    // Use Supabase storage only
    result = await fixedSupabaseStorage.getProducts(page, limit, category, subCategory, brand, sort);
    
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
  
  // Get featured products
  apiRouter.get("/products/featured", asyncHandler(async (req: Request, res: Response) => {
    let featuredProducts;
    
    featuredProducts = await fixedSupabaseStorage.getFeaturedProducts();
    
    res.json(featuredProducts);
  }));
  
  // Get carousel products
  apiRouter.get("/products/carousel", asyncHandler(async (req: Request, res: Response) => {
    let carouselProducts;
    
    carouselProducts = await fixedSupabaseStorage.getCarouselProducts();
    
    res.json(carouselProducts);
  }));
  
  // Search products
  apiRouter.get("/products/search", asyncHandler(async (req: Request, res: Response) => {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const brand = req.query.brand as string;
    const sort = req.query.sort as string || "featured";
    
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    
    let results;
    
    results = await fixedSupabaseStorage.searchProducts(query, page, limit, brand, sort);
    
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
  
  // Get product by ID
  apiRouter.get("/products/:id", asyncHandler(async (req: Request, res: Response) => {
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
  
  // Get product recommendations
  apiRouter.get("/products/:id/recommendations", asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const limit = parseInt(req.query.limit as string) || 4;
    
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
  
  // Create a single product
  apiRouter.post("/products", asyncHandler(async (req: Request, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const newProduct = await fixedSupabaseStorage.createProduct(productData);
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
  
  // Single image upload endpoint for admin - now uses Supabase Storage
  apiRouter.post("/products/upload-image", upload.single('image'), asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    try {
      const file = req.file;
      
      // Import Supabase Storage service
      const { supabaseStorage } = await import('./supabase-storage');
      
      // Generate unique filename for Supabase Storage
      const filename = supabaseStorage.generateFilename(file.originalname);
      
      // Use file buffer directly from memory (no temp file needed)
      const fileBuffer = file.buffer;
      const publicUrl = await supabaseStorage.uploadImage(fileBuffer, filename);

      res.json({ 
        message: "Image uploaded successfully to Supabase Storage",
        filename: publicUrl, // Return full Supabase Storage URL
        originalName: file.originalname,
        storageUrl: publicUrl
      });
    } catch (error) {
      console.error("Supabase Storage upload error:", error);
      res.status(500).json({ 
        message: "Failed to upload image to Supabase Storage",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }));

  // CSV Product Import Endpoint
  apiRouter.post(
    "/products/import/csv",
    upload.single("file"),
    asyncHandler(async (req: Request, res: Response) => {
      if (!req.file) {
        return res.status(400).json({ message: "Niciun fișier încărcat" });
      }

      try {
        // Parse CSV from buffer
        const fileContent = req.file.buffer.toString('utf8');
        const parser = csv.parse(fileContent, {
          columns: true,
          skip_empty_lines: true,
        });
        
        const records: any[] = [];
        for await (const record of parser) {
          // Transform CSV record to match product schema
          let imagePath = record.image || "";
          
          // Add uploads prefix if the image name doesn't already have it
          if (imagePath && !imagePath.startsWith('/uploads/') && !imagePath.startsWith('http')) {
            imagePath = `/uploads/${imagePath}`;
          }
          
          // New CSV format: title, priceUSD, image, buyUrl, category, subcategory, featured
          const productTitle = record.title || "";
          const priceUSD = record.priceUSD || record.priceUsd || record.price_usd || null;
          const subCategoryValue = record.subcategory || record.Subcategory || record.subCategory || null;
          
          const product = {
            title: productTitle,
            price: priceUSD || "0", // Use priceUSD as fallback for legacy price
            priceUSD: priceUSD,
            image: imagePath,
            buyUrl: record.buyUrl || record.buy_url || "",
            viewUrl: null, // Not required in new format
            category: record.category || "Other",
            brand: null, // Not used in new format
            subCategory: subCategoryValue,
            featured: record.featured === "true" || record.featured === "1" || false,
            carousel: false
          };
          
          // Validate each product
          try {
            const validatedProduct = insertProductSchema.parse(product);
            records.push(validatedProduct);
          } catch (validationError) {
            console.error("Validation error for record:", record, validationError);
            // Skip invalid records but continue processing
          }
        }

        // No temporary file cleanup needed with memory storage
        
        // Insert validated products in chunks
        if (records.length > 0) {
          await fixedSupabaseStorage.createManyProducts(records);
          return res.status(200).json({ 
            message: `Importul a fost realizat cu succes! ${records.length} produse au fost adăugate.` 
          });
        } else {
          return res.status(400).json({ 
            message: "Nu s-au găsit produse valide în fișierul CSV" 
          });
        }
      } catch (error: any) {
        console.error("CSV import error:", error);
        // No temporary file cleanup needed with memory storage
        return res.status(500).json({ 
          message: "Eroare la procesarea fișierului CSV", 
          error: error.message || 'Eroare necunoscută' 
        });
      }
    })
  );
  
  // Images ZIP Import Endpoint
  apiRouter.post(
    "/products/import/images",
    upload.single("imagesZip"),
    asyncHandler(async (req: Request, res: Response) => {
      if (!req.file) {
        return res.status(400).json({ message: "Niciun fișier ZIP încărcat" });
      }

      try {
        // Check if it's a ZIP file
        if (!req.file.mimetype?.includes('zip') && !req.file.originalname.endsWith('.zip')) {
          return res.status(400).json({ message: "Fișierul încărcat nu este în format ZIP" });
        }

        // Process the ZIP file from memory buffer
        const zip = new AdmZip(req.file.buffer);
        const zipEntries = zip.getEntries();
        
        // Import Supabase Storage service
        const { supabaseStorage } = await import('./supabase-storage');
        
        let uploadedImages = 0;
        const supportedImageTypes = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
        
        // Upload all image files directly to Supabase Storage
        for (const entry of zipEntries) {
          // Skip directories, non-image files, and macOS metadata files
          if (entry.isDirectory || entry.name.startsWith('._')) continue;
          
          const entryName = entry.name.toLowerCase();
          const isImage = supportedImageTypes.some(ext => entryName.endsWith(ext));
          
          if (isImage) {
            try {
              // Get image buffer from ZIP entry
              const imageBuffer = entry.getData();
              
              // Upload directly to Supabase Storage
              const publicUrl = await supabaseStorage.uploadImage(imageBuffer, entry.name);
              uploadedImages++;
              
              console.log(`Uploaded to Supabase Storage: ${entry.name} -> ${publicUrl}`);
            } catch (uploadError) {
              console.error(`Failed to upload ${entry.name}:`, uploadError);
            }
          }
        }
        
        if (uploadedImages > 0) {
          return res.status(200).json({ 
            message: `${uploadedImages} imagini au fost încărcate cu succes în Supabase Storage` 
          });
        } else {
          return res.status(400).json({ 
            message: "Nu s-au găsit imagini în fișierul ZIP" 
          });
        }
      } catch (error: any) {
        console.error("ZIP extraction error:", error);
        
        // Cleanup in case of error
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        
        return res.status(500).json({ 
          message: "Eroare la procesarea fișierului ZIP", 
          error: error.message || 'Eroare necunoscută' 
        });
      }
    })
  );

  // Endpoint to fix image paths for existing products
  apiRouter.post(
    "/products/fix-image-paths",
    asyncHandler(async (req: Request, res: Response) => {
      try {
        const updatedCount = await storage.fixProductImagePaths();
        
        return res.status(200).json({
          message: `Căile imaginilor au fost actualizate cu succes pentru ${updatedCount} produse.`,
          updatedCount
        });
      } catch (error: any) {
        console.error("Error fixing image paths:", error);
        return res.status(500).json({
          message: "A apărut o eroare la actualizarea căilor imaginilor.",
          error: error.message || 'Eroare necunoscută'
        });
      }
    })
  );

  // Static Export Endpoint for Netlify
  apiRouter.get(
    "/export-static",
    asyncHandler(async (req: Request, res: Response) => {
      try {
        console.log("Starting static export for Netlify...");
        
        // Create export directory if it doesn't exist
        const exportDir = path.join(process.cwd(), 'netlify-export');
        if (fs.existsSync(exportDir)) {
          fs.rmSync(exportDir, { recursive: true, force: true });
        }
        fs.mkdirSync(exportDir, { recursive: true });
        
        // Create subdirectories
        const publicDir = path.join(exportDir, 'public');
        fs.mkdirSync(publicDir, { recursive: true });
        
        const cssDir = path.join(publicDir, 'css');
        fs.mkdirSync(cssDir, { recursive: true });
        
        const jsDir = path.join(publicDir, 'js');
        fs.mkdirSync(jsDir, { recursive: true });
        
        const dataDir = path.join(publicDir, 'data');
        fs.mkdirSync(dataDir, { recursive: true });
        
        const uploadsDir = path.join(publicDir, 'uploads');
        fs.mkdirSync(uploadsDir, { recursive: true });
        
        // Copy image files
        console.log("Copying image files...");
        const sourceUploadsDir = path.join(process.cwd(), 'uploads');
        let imagesCopied = 0;
        
        if (fs.existsSync(sourceUploadsDir)) {
          const files = fs.readdirSync(sourceUploadsDir);
          for (const file of files) {
            const sourcePath = path.join(sourceUploadsDir, file);
            if (fs.statSync(sourcePath).isFile() && 
                (file.endsWith('.jpg') || file.endsWith('.jpeg') || 
                 file.endsWith('.png') || file.endsWith('.gif'))) {
              fs.copyFileSync(
                sourcePath,
                path.join(uploadsDir, file)
              );
              imagesCopied++;
            }
          }
        }
        
        console.log(`Copied ${imagesCopied} images to static export`);
        
        // Get all data needed for static site
        console.log("Fetching product data...");
        
        // Get all products
        const allProductsData = await storage.getProducts(1, 5000);
        const allProducts = allProductsData.products;
        
        // Get featured products
        const featuredProducts = await storage.getFeaturedProducts();
        
        // Get carousel products
        const carouselProducts = await storage.getCarouselProducts();
        
        // Create data files
        console.log("Creating data files...");
        
        // Save all products
        fs.writeFileSync(
          path.join(dataDir, 'products.json'),
          JSON.stringify(allProductsData, null, 2)
        );
        
        // Save featured products
        fs.writeFileSync(
          path.join(dataDir, 'featured.json'),
          JSON.stringify(featuredProducts, null, 2)
        );
        
        // Save carousel products
        fs.writeFileSync(
          path.join(dataDir, 'carousel.json'),
          JSON.stringify(carouselProducts, null, 2)
        );
        
        // Create individual product pages
        console.log("Creating product pages...");
        const productPagesDir = path.join(publicDir, 'product');
        fs.mkdirSync(productPagesDir, { recursive: true });
        
        for (const product of allProducts) {
          // Save product data
          fs.writeFileSync(
            path.join(dataDir, `product-${product.id}.json`),
            JSON.stringify(product, null, 2)
          );
          
          // Get and save recommendations
          const recommendations = await storage.getProductRecommendations(product);
          fs.writeFileSync(
            path.join(dataDir, `recommendations-${product.id}.json`),
            JSON.stringify(recommendations, null, 2)
          );
          
          // Create product directory
          const productDir = path.join(productPagesDir, product.id.toString());
          fs.mkdirSync(productDir, { recursive: true });
          
          // Create HTML file for product
          fs.writeFileSync(
            path.join(productDir, 'index.html'),
            generateProductPageHtml(product)
          );
        }
        
        // Create category and brand pages
        console.log("Creating category and brand pages...");
        
        // Extract unique categories and brands
        const categories = Array.from(new Set(allProducts.map(p => p.category))).filter(Boolean);
        const brands = Array.from(new Set(allProducts.map(p => p.brand))).filter(Boolean);
        
        // Create category pages
        for (const category of categories) {
          if (!category) continue;
          
          const categoryProducts = allProducts.filter(p => p.category === category);
          const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
          
          // Save category data
          fs.writeFileSync(
            path.join(dataDir, `category-${categorySlug}.json`),
            JSON.stringify({ products: categoryProducts, total: categoryProducts.length }, null, 2)
          );
          
          // Create category directory
          const categoryDir = path.join(publicDir, 'category', categorySlug);
          fs.mkdirSync(categoryDir, { recursive: true });
          
          // Create HTML file
          fs.writeFileSync(
            path.join(categoryDir, 'index.html'),
            generateCategoryPageHtml(category, categoryProducts)
          );
        }
        
        // Create brand pages
        for (const brand of brands) {
          if (!brand) continue;
          
          const brandProducts = allProducts.filter(p => p.brand === brand);
          const brandSlug = brand.toLowerCase().replace(/[^a-z0-9]/g, '-');
          
          // Save brand data
          fs.writeFileSync(
            path.join(dataDir, `brand-${brandSlug}.json`),
            JSON.stringify({ products: brandProducts, total: brandProducts.length }, null, 2)
          );
          
          // Create brand directory
          const brandDir = path.join(publicDir, 'brand', brandSlug);
          fs.mkdirSync(brandDir, { recursive: true });
          
          // Create HTML file
          fs.writeFileSync(
            path.join(brandDir, 'index.html'),
            generateBrandPageHtml(brand, brandProducts)
          );
        }
        
        // Create CSS file
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
        
        fs.writeFileSync(path.join(cssDir, 'styles.css'), cssContent);
        
        // Create JavaScript files
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
        
        fs.writeFileSync(path.join(jsDir, 'data-loader.js'), dataLoaderJs);
        
        // Create Netlify configuration files
        console.log("Creating Netlify configuration files...");
        
        // netlify.toml
        const netlifyToml = `
[build]
  publish = "public"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;
        
        fs.writeFileSync(path.join(exportDir, 'netlify.toml'), netlifyToml);
        
        // _redirects
        const redirects = `
# Netlify redirects
/*    /index.html   200
`;
        
        fs.writeFileSync(path.join(publicDir, '_redirects'), redirects);
        
        // Create main index.html
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
      <p>© ${new Date().getFullYear()} ONLYFINDS - Static Export</p>
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
        
        fs.writeFileSync(path.join(publicDir, 'index.html'), mainIndexHtml);
        
        // Create a products index page
        const productsDir = path.join(publicDir, 'products');
        fs.mkdirSync(productsDir, { recursive: true });
        
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
      <p>© ${new Date().getFullYear()} ONLYFINDS - Static Export</p>
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
        
        fs.writeFileSync(path.join(productsDir, 'index.html'), productsIndexHtml);
        
        // Create README file
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

This export was generated on ${new Date().toLocaleString()} and includes ${allProducts.length} products.
`;
        
        fs.writeFileSync(path.join(exportDir, 'README.md'), readmeContent);
        
        // Create export metadata
        const exportInfo = {
          name: "ONLYFINDS Static Export",
          version: "1.0.0",
          exportDate: new Date().toISOString(),
          totalProducts: allProducts.length,
          categories: categories.length,
          brands: brands.length,
          images: imagesCopied
        };
        
        fs.writeFileSync(
          path.join(exportDir, 'export-info.json'),
          JSON.stringify(exportInfo, null, 2)
        );
        
        // Create ZIP archive
        console.log("Creating ZIP archive...");
        
        const zipPath = path.join(process.cwd(), 'tjreps-netlify-export.zip');
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
        
        // Send the ZIP file
        res.download(zipPath, 'tjreps-netlify-export.zip', (err) => {
          if (err) {
            console.error("Download error:", err);
          }
          
          // Clean up
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
          }, 5000);
        });
      } catch (error: any) {
        console.error("Static export error:", error);
        
        // Clean up on error
        const exportDir = path.join(process.cwd(), 'netlify-export');
        const zipPath = path.join(process.cwd(), 'tjreps-netlify-export.zip');
        
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

  // Apply the API router with the /api prefix
  // Endpoint pentru exportul tuturor produselor în format JSON
  apiRouter.get("/products-export", asyncHandler(async (req: Request, res: Response) => {
    try {
      const allProducts = await db.select().from(products);
      
      // Adăugăm header Content-Disposition pentru a declanșa descărcarea ca fișier
      res.setHeader('Content-Disposition', 'attachment; filename="products.json"');
      res.setHeader('Content-Type', 'application/json');
      
      // Trimitem datele produselor ca JSON
      res.json(allProducts);
    } catch (error) {
      console.error("Error exporting products:", error);
      res.status(500).json({ message: "Eroare la exportul produselor", error: String(error) });
    }
  }));
  
  // Endpoint pentru a rula scriptul de export JSON către directorul static
  apiRouter.post("/export-to-static-json", asyncHandler(async (req: Request, res: Response) => {
    try {
      const fs = require('fs');
      const path = require('path');
      
      console.log('Exportul produselor în format JSON static...');
      
      // Obținem toate produsele din baza de date
      const allProducts = await db.select().from(products);
      
      console.log(`S-au găsit ${allProducts.length} produse pentru export`);
      
      // Creăm directorul dacă nu există
      const outputDir = path.join(__dirname, '../client/public/data');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Salvăm produsele în fișierul JSON
      const outputPath = path.join(outputDir, 'products.json');
      fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2));
      
      console.log(`Export finalizat cu succes în ${outputPath}`);
      
      res.json({ 
        success: true, 
        message: `Export finalizat cu succes. ${allProducts.length} produse au fost salvate în format JSON.`,
        count: allProducts.length
      });
    } catch (error) {
      console.error('Eroare la exportul JSON:', error);
      res.status(500).json({ 
        success: false, 
        message: `Eroare la exportul JSON: ${error instanceof Error ? error.message : String(error)}` 
      });
    }
  }));

  // Admin API endpoints - require Supabase configuration
  if (fixedSupabaseStorage) {
    
    // Get all products for admin (with pagination)
    apiRouter.get("/admin/products", asyncHandler(async (req: Request, res: Response) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const search = req.query.search as string;
      const category = req.query.category as string;
      
      let result;
      if (search) {
        result = await fixedSupabaseStorage!.searchProducts(search, page, limit);
      } else {
        result = await fixedSupabaseStorage!.getProducts(page, limit, category);
      }
      
      res.json(result);
    }));

    // Create new product
    apiRouter.post("/admin/products", asyncHandler(async (req: Request, res: Response) => {
      try {
        const productData = insertProductSchema.parse(req.body);
        
        // Transform the data to match the Product interface
        const transformedData = {
          title: productData.title || '',
          priceUSD: productData.priceUSD ? parseFloat(productData.priceUSD) : null,
          image: productData.image || null,
          buyUrl: productData.buyUrl || null,
          viewUrl: productData.viewUrl || null,
          category: productData.category || null,
          subCategory: productData.subCategory || null,
          brand: productData.brand || null,
          featured: productData.featured || false,
          carousel: productData.carousel || false,
        };
        
        const newProduct = await fixedSupabaseStorage!.createProduct(transformedData);
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

    // Get single product by ID for editing
    apiRouter.get("/admin/products/:id", asyncHandler(async (req: Request, res: Response) => {
      const product = await fixedSupabaseStorage!.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    }));

    // Update product
    apiRouter.put("/admin/products/:id", asyncHandler(async (req: Request, res: Response) => {
      const product = await fixedSupabaseStorage!.updateProduct(req.params.id, req.body);
      res.json(product);
    }));

    // Delete product
    apiRouter.delete("/admin/products/:id", asyncHandler(async (req: Request, res: Response) => {
      await fixedSupabaseStorage!.deleteProduct(req.params.id);
      res.json({ success: true });
    }));

    // Get categories for admin panel
    apiRouter.get("/admin/categories", asyncHandler(async (req: Request, res: Response) => {
      const categories = await fixedSupabaseStorage!.getCategories();
      res.json(categories);
    }));
  }

  app.use("/api", apiRouter);

  // Serve files from the uploads directory
  app.use('/uploads', express.static('uploads'));

  const httpServer = createServer(app);
  return httpServer;
}