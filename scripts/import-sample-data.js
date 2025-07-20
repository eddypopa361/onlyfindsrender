#!/usr/bin/env node

import { insertProductSchema } from '../shared/schema.js';
import { db } from '../server/db.js';
import { products } from '../shared/schema.js';
import fs from 'fs';

// Sample data to quickly populate database for testing
const sampleProducts = [
  {
    title: "Off White Glasses (7 Colorways)",
    price: "9.67",
    image: "https://ik.imagekit.io/demo/img/glasses.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=weidian&id=7266238919&ref=67166",
    viewUrl: "https://2024.cnfans.com/product/?shop_type=weidian&id=7266238919&ref=67166",
    category: "Accessories",
    featured: true
  },
  {
    title: "Kaws Keychain (16 Colorways)",
    price: "2.84",
    image: "https://ik.imagekit.io/demo/img/keychain.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=weidian&id=7262438672&ref=67166",
    viewUrl: "https://2024.cnfans.com/product/?shop_type=weidian&id=7262438672&ref=67166",
    category: "Accessories",
    featured: true
  },
  {
    title: "Amiri MA1",
    price: "114.78",
    image: "https://ik.imagekit.io/demo/img/jacket.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=weidian&id=7266072843&ref=67166",
    viewUrl: "https://2024.cnfans.com/product/?shop_type=weidian&id=7266072843&ref=67166",
    category: "Clothing",
    featured: true
  },
  {
    title: "Nike Dunk Low (12 Colorways)",
    price: "32.50",
    image: "https://ik.imagekit.io/demo/img/dunk.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=weidian&id=7231813766&ref=67166",
    viewUrl: "https://2024.cnfans.com/product/?shop_type=weidian&id=7231813766&ref=67166",
    category: "Shoes",
    featured: true
  }
];

async function importSampleData() {
  console.log('Importing sample data...');
  
  try {
    // Check if products table already has data
    const count = await db.select({ count: db.fn.count() }).from(products);
    if (count[0].count > 0) {
      console.log('Products table already has data. Skipping sample import.');
      return;
    }
    
    // Validate each product and add to database
    for (const product of sampleProducts) {
      try {
        const validProduct = insertProductSchema.parse(product);
        await db.insert(products).values(validProduct);
        console.log(`Imported: ${product.title}`);
      } catch (e) {
        console.error(`Failed to validate product: ${product.title}`, e);
      }
    }
    
    console.log('Sample data import complete!');
    console.log('\nYou can now:');
    console.log('1. Start the server with: npm run dev');
    console.log('2. Visit /admin/import to import your actual data');
    console.log('3. Or test the current catalog at /products');
    
  } catch (error) {
    console.error('Error importing sample data:', error);
  } finally {
    // Close the database connection
    await db.end();
  }
}

importSampleData();