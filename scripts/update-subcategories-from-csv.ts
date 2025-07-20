/**
 * Script pentru actualizarea subcategoriilor produselor existente pe baza unui CSV
 * Acesta nu va modifica categoriile sau brandurile existente, doar va adăuga subcategoria
 * Identificarea produselor se face pe baza URL-urilor pentru a evita duplicatele
 */

import { db } from "../server/db";
import { products } from "../shared/schema";
import { eq, or, and, inArray } from "drizzle-orm";
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

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

async function updateSubcategoriesFromCSV() {
  console.log("Începerea procesului de actualizare a subcategoriilor din CSV...");

  try {
    // Citește fișierul CSV
    const csvContent = fs.readFileSync('./attached_assets/tjreps_clothes_with_subcategories_updated.csv', 'utf-8');
    const records: ProductFromCSV[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });

    console.log(`Am găsit ${records.length} produse în CSV.`);

    // Filtrăm înregistrările care au subcategorii definite
    const recordsWithSubcategories = records.filter(record => record.subcategory && record.subcategory.trim() !== '');
    console.log(`Din care ${recordsWithSubcategories.length} au subcategorii definite.`);

    // Contoare pentru statistici
    let foundProducts = 0;
    let updatedProducts = 0;
    let notFoundProducts = 0;
    let alreadyHaveSubcategory = 0;
    let notClothingCategory = 0;
    let changedToClothing = 0;

    // Grupăm înregistrările pe bucăți pentru procesare mai eficientă
    const batchSize = 100;
    const recordBatches = [];
    for (let i = 0; i < recordsWithSubcategories.length; i += batchSize) {
      recordBatches.push(recordsWithSubcategories.slice(i, i + batchSize));
    }

    for (const [batchIndex, batch] of recordBatches.entries()) {
      console.log(`Procesare lot ${batchIndex + 1}/${recordBatches.length}...`);
      
      // Extrage URL-urile pentru acest lot
      const batchBuyUrls = batch.map(r => r.buyUrl);
      
      // Găsește toate produsele care au URL-urile din acest lot
      const matchingProducts = await db.select()
        .from(products)
        .where(inArray(products.buyUrl, batchBuyUrls));
      
      // Crează un map pentru căutare rapidă
      const productMap = new Map(matchingProducts.map(p => [p.buyUrl, p]));
      
      // Actualizează fiecare produs din lot
      for (const record of batch) {
        const product = productMap.get(record.buyUrl);
        
        if (product) {
          foundProducts++;
          
          // Verifică dacă produsul este în categoria Clothing sau trebuie mutat
          const needsUpdate = 
            // Produsul nu are deja aceeași subcategorie
            (product.subCategory !== record.subcategory) ||
            // Produsul este în Shoes dar conform CSV ar trebui să fie în Clothing
            (product.category === "Shoes" && record.category === "Clothing");
          
          if (needsUpdate) {
            const updates: any = {
              subCategory: record.subcategory
            };
            
            // Dacă produsul este în Shoes dar ar trebui să fie în Clothing conform CSV-ului
            if (product.category === "Shoes" && record.category === "Clothing") {
              updates.category = "Clothing";
              changedToClothing++;
            }
            
            // Actualizează produsul
            await db.update(products)
              .set(updates)
              .where(eq(products.id, product.id));
            
            updatedProducts++;
            console.log(`Produs actualizat: "${product.title}" (ID: ${product.id}) - subcategoria setată la "${record.subcategory}"`);
          } else if (product.subCategory === record.subcategory) {
            alreadyHaveSubcategory++;
          } else if (product.category !== "Clothing") {
            notClothingCategory++;
          }
        } else {
          notFoundProducts++;
        }
      }
    }

    // Afișează statistici
    console.log("\n=== Statistici ===");
    console.log(`Total produse în CSV: ${records.length}`);
    console.log(`Produse cu subcategorii definite: ${recordsWithSubcategories.length}`);
    console.log(`Produse găsite în baza de date: ${foundProducts}`);
    console.log(`Produse actualizate cu subcategorii: ${updatedProducts}`);
    console.log(`Produse mutate din Shoes în Clothing: ${changedToClothing}`);
    console.log(`Produse care aveau deja subcategoria corectă: ${alreadyHaveSubcategory}`);
    console.log(`Produse care nu sunt în categoria Clothing: ${notClothingCategory}`);
    console.log(`Produse negăsite în baza de date: ${notFoundProducts}`);

  } catch (error) {
    console.error("A apărut o eroare în timpul procesului:", error);
  }
}

// Rulează scriptul
updateSubcategoriesFromCSV()
  .then(() => {
    console.log("Script finalizat.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Eroare la rularea scriptului:", error);
    process.exit(1);
  });