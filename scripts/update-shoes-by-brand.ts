/**
 * Script pentru actualizarea produselor în categoria Shoes pe baza brandurilor
 * Acest script citește brandurile din CSV și găsește produsele existente
 * după brand, actualizându-le categoria la "Shoes"
 */

import { db } from "../server/db";
import { products } from "../shared/schema";
import { eq, or } from "drizzle-orm";
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

async function updateShoesByBrand() {
  console.log("Începerea procesului de actualizare a produselor Shoes pe baza brandurilor...");

  try {
    // Citirea CSV-ului
    const csvContent = fs.readFileSync('./attached_assets/brands shoes.csv', 'utf8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });

    // Extrage brandurile unice din CSV
    const shoeBrands = [...new Set(records.map((record: any) => record.brand.trim()))];
    console.log(`S-au găsit ${shoeBrands.length} branduri de încălțăminte în CSV:`, shoeBrands);

    // Construiește condiția pentru actualizare - toate produsele care au brandurile specificate
    const brandConditions = shoeBrands.map(brand => 
      eq(products.brand, brand)
    );

    // Actualizează toate produsele care au branduri de încălțăminte
    const updateResult = await db.update(products)
      .set({ 
        category: "Shoes",
        subCategory: null
      })
      .where(or(...brandConditions));

    console.log("Actualizare completă. Produsele au fost mutate în categoria Shoes.");

    // Afișează numărul de produse în categoria Shoes pentru verificare
    const shoesCount = await db.select({ count: db.fn.count() })
      .from(products)
      .where(eq(products.category, "Shoes"));

    console.log(`În prezent există ${shoesCount[0].count} produse în categoria Shoes.`);

  } catch (error) {
    console.error("A apărut o eroare în timpul procesului:", error);
  }
}

// Rulează scriptul
updateShoesByBrand()
  .then(() => {
    console.log("Script finalizat.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Eroare la rularea scriptului:", error);
    process.exit(1);
  });