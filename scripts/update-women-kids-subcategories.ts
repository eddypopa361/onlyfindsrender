/**
 * Script pentru actualizarea subcategoriilor pentru produsele Women și Kids
 * din CSV-ul furnizat de utilizator
 */

import { db } from "../server/db";
import { products } from "../shared/schema";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";

interface ProductFromCSV {
  title: string;
  price: string;
  image: string;
  buyUrl: string;
  viewUrl: string;
  category: string;
  brand: string;
  featured: string;
  subcategory: string;
}

async function updateWomenKidsSubcategories() {
  console.log("📝 Începem actualizarea subcategoriilor pentru produsele Women și Kids...");
  
  try {
    // Citim fișierul CSV
    const csvPath = path.resolve(process.cwd(), "attached_assets", "TJ JOYAGOO LINKS FOR WEBSITE - Export_Ready (2).csv");
    const csvContent = fs.readFileSync(csvPath, "utf-8");
    
    // Parsăm conținutul CSV
    const productsFromCSV: ProductFromCSV[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });
    
    console.log(`📊 S-au găsit ${productsFromCSV.length} produse în CSV.`);
    
    // Contor pentru produsele actualizate
    let updatedCount = 0;
    
    // Procesăm fiecare produs din CSV
    for (const csvProduct of productsFromCSV) {
      // Căutăm produsul în baza de date după URL-ul de cumpărare (cel mai unic identificator)
      const [existingProduct] = await db.select()
        .from(products)
        .where(eq(products.buyUrl, csvProduct.buyUrl));
      
      if (existingProduct) {
        // Actualizăm subcategoria
        await db.update(products)
          .set({ 
            subCategory: csvProduct.subcategory.trim() // Eliminăm spațiile în plus
          })
          .where(eq(products.id, existingProduct.id));
        
        updatedCount++;
        console.log(`✅ Actualizat: "${existingProduct.title}" - subcategoria: ${csvProduct.subcategory}`);
      } else {
        console.log(`⚠️ Produs negăsit în baza de date: "${csvProduct.title}" (${csvProduct.buyUrl})`);
      }
    }
    
    console.log(`\n📋 Rezumat:`);
    console.log(`🔄 Total produse procesate din CSV: ${productsFromCSV.length}`);
    console.log(`✅ Produse actualizate: ${updatedCount}`);
    console.log(`⚠️ Produse negăsite: ${productsFromCSV.length - updatedCount}`);
    
  } catch (error) {
    console.error("❌ Eroare la actualizarea subcategoriilor:", error);
  }
}

// Rulăm scriptul
updateWomenKidsSubcategories().then(() => {
  console.log("\n✨ Procesul de actualizare a subcategoriilor s-a încheiat.");
  process.exit(0);
}).catch(error => {
  console.error("❌ Eroare fatală:", error);
  process.exit(1);
});