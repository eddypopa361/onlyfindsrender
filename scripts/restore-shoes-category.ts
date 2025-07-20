/**
 * Script pentru restaurarea produselor în categoria Shoes
 * Acest script citește titlurile din CSV și găsește produsele existente
 * după titlu, actualizându-le categoria la "Shoes"
 */

import { db } from "../server/db";
import { products } from "../shared/schema";
import { eq, ilike, or } from "drizzle-orm";
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

async function restoreShoesCategory() {
  console.log("Începerea procesului de restaurare a produselor în categoria Shoes...");

  try {
    // Citirea CSV-ului cu produsele pentru categoria Shoes
    const csvContent = fs.readFileSync('./attached_assets/brands shoes.csv', 'utf8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });

    // Extrage titlurile produselor din CSV
    let shoeTitlesFromCsv = records.map((record: any) => record.title.trim());
    
    // Creează condiții pentru căutarea după titluri
    const searchConditions = [];
    for (const title of shoeTitlesFromCsv) {
      // Elimina caracterele newline si ghilimele pentru a face cautarea mai exacta
      const cleanTitle = title.replace(/\\n/g, ' ').replace(/"/g, '').trim();
      if (cleanTitle) {
        // Folosește ilike pentru a face căutarea case-insensitive
        searchConditions.push(ilike(products.title, `%${cleanTitle}%`));
      }
    }

    // Caută produse care se potrivesc cu titlurile din CSV
    if (searchConditions.length > 0) {
      // Obține produsele care ar trebui să fie în categoria Shoes
      const potentialShoeProducts = await db.select()
        .from(products)
        .where(or(...searchConditions));

      console.log(`S-au găsit ${potentialShoeProducts.length} produse potențiale pentru categoria Shoes.`);

      // Actualizează categoria pentru produsele găsite
      const productIds = potentialShoeProducts.map(product => product.id);
      
      // Procesează actualizarea în loturi pentru a evita limitări de bază de date
      const batchSize = 100;
      let updatedCount = 0;
      
      for (let i = 0; i < productIds.length; i += batchSize) {
        const batchIds = productIds.slice(i, Math.min(i + batchSize, productIds.length));
        
        if (batchIds.length > 0) {
          // Actualizează produsele din acest lot
          const result = await db.update(products)
            .set({ 
              category: "Shoes",
              subCategory: null  // Resetăm subcategoria pentru Shoes
            })
            .where(or(...batchIds.map(id => eq(products.id, id))));
          
          updatedCount += batchIds.length;
          console.log(`Actualizate ${batchIds.length} produse (lot ${i / batchSize + 1})`);
        }
      }

      console.log(`Proces finalizat. S-au actualizat ${updatedCount} produse la categoria Shoes.`);
    } else {
      console.log("Nu s-au găsit titluri valide în CSV.");
    }

  } catch (error) {
    console.error("A apărut o eroare în timpul procesului:", error);
  }
}

// Rulează scriptul
restoreShoesCategory()
  .then(() => {
    console.log("Script finalizat.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Eroare la rularea scriptului:", error);
    process.exit(1);
  });