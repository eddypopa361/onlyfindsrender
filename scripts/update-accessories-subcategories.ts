/**
 * Script pentru actualizarea subcategoriilor pentru produsele din categoria Accessories
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
  Subcategory: string;  // Notă: în CSV câmpul este scris cu S mare (Subcategory)
}

async function updateAccessoriesSubcategories() {
  console.log("📝 Începem actualizarea subcategoriilor pentru produsele Accessories...");
  
  try {
    // Citim fișierul CSV
    const csvPath = path.resolve(process.cwd(), "attached_assets", "TJ JOYAGOO LINKS FOR WEBSITE - Export_Ready (4).csv");
    const csvContent = fs.readFileSync(csvPath, "utf-8");
    
    // Parsăm conținutul CSV
    const productsFromCSV: ProductFromCSV[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });
    
    console.log(`📊 S-au găsit ${productsFromCSV.length} produse în CSV.`);
    
    // Contor pentru produsele actualizate
    let updatedCount = 0;
    let accessoriesCount = 0;
    
    // Procesăm fiecare produs din CSV
    for (const csvProduct of productsFromCSV) {
      // Verificăm dacă produsul este în categoria Accessories
      if (csvProduct.category === 'Accessories') {
        accessoriesCount++;
        
        // Căutăm produsul în baza de date după URL-ul de cumpărare (cel mai unic identificator)
        const [existingProduct] = await db.select()
          .from(products)
          .where(eq(products.buyUrl, csvProduct.buyUrl));
        
        if (existingProduct) {
          // Verificăm dacă există subcategorie în CSV
          const subcategory = csvProduct.Subcategory ? csvProduct.Subcategory.trim() : 'Uncategorized';
          
          // Actualizăm subcategoria
          await db.update(products)
            .set({ 
              subCategory: subcategory
            })
            .where(eq(products.id, existingProduct.id));
          
          updatedCount++;
          console.log(`✅ Actualizat: "${existingProduct.title}" - subcategoria: ${subcategory}`);
        } else {
          console.log(`⚠️ Produs Accessories negăsit în baza de date: "${csvProduct.title}" (${csvProduct.buyUrl})`);
        }
      }
    }
    
    console.log(`\n📋 Rezumat:`);
    console.log(`🔄 Total produse în CSV: ${productsFromCSV.length}`);
    console.log(`🧩 Produse Accessories în CSV: ${accessoriesCount}`);
    console.log(`✅ Produse actualizate: ${updatedCount}`);
    console.log(`⚠️ Produse Accessories negăsite: ${accessoriesCount - updatedCount}`);
    
  } catch (error) {
    console.error("❌ Eroare la actualizarea subcategoriilor:", error);
  }
}

// Rulăm scriptul
updateAccessoriesSubcategories().then(() => {
  console.log("\n✨ Procesul de actualizare a subcategoriilor pentru Accessories s-a încheiat.");
  process.exit(0);
}).catch(error => {
  console.error("❌ Eroare fatală:", error);
  process.exit(1);
});