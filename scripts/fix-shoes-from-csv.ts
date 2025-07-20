/**
 * Script optimizat pentru asigurarea că toate produsele din CSV-ul specificat sunt în categoria Shoes
 * Folosim URL-urile ca identificator unic pentru găsirea produselor
 * Versiune optimizată care face update în lot pentru eficiență
 */

import { db } from "../server/db";
import { products } from "../shared/schema";
import { eq, or, and, inArray, notInArray, not, sql } from "drizzle-orm";
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

interface ProductFromCSV {
  title: string;
  price: string;
  image: string;
  buyUrl: string;
  viewUrl: string;
  category: string;
  featured: string;
}

async function fixShoesFromCSV() {
  console.log("Începerea procesului optimizat de corectare a categoriei pentru produsele din CSV...");

  try {
    // Citește fișierul CSV
    const csvContent = fs.readFileSync('./attached_assets/TJ JOYAGOO LINKS FOR WEBSITE - Export_Ready.csv', 'utf-8');
    const records: ProductFromCSV[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });

    console.log(`Am găsit ${records.length} produse în CSV.`);

    // Extrage toate URL-urile din CSV
    const buyUrls = records.map(r => r.buyUrl);
    
    // Găsește toate produsele care au URL-urile din CSV
    const matchingProducts = await db.select()
      .from(products)
      .where(
        inArray(products.buyUrl, buyUrls)
      );
    
    console.log(`Am găsit ${matchingProducts.length} produse în baza de date care corespund cu CSV-ul.`);
    
    // Găsește produse care trebuie actualizate (nu sunt deja în categoria Shoes)
    const productsToUpdate = matchingProducts.filter(p => p.category !== "Shoes");
    
    console.log(`Produse de actualizat: ${productsToUpdate.length}`);
    
    if (productsToUpdate.length > 0) {
      // Obține ID-urile produselor care trebuie actualizate
      const productIdsToUpdate = productsToUpdate.map(p => p.id);
      
      // Actualizează toate produsele la categoria Shoes într-o singură operație
      await db.update(products)
        .set({
          category: "Shoes",
          subCategory: null
        })
        .where(inArray(products.id, productIdsToUpdate));
      
      console.log("Actualizare finalizată!");
      
      // Afișează detalii despre produsele actualizate pentru confirmare
      for (const product of productsToUpdate) {
        console.log(`Produs actualizat: "${product.title}" (ID: ${product.id}) de la categoria "${product.category}" la "Shoes"`);
      }
    }
    
    // Produse care erau deja în categoria corectă
    const alreadyInShoesCategory = matchingProducts.filter(p => p.category === "Shoes").length;
    
    // Produse care nu au fost găsite
    const notFoundUrls = buyUrls.filter(url => !matchingProducts.some(p => p.buyUrl === url));
    
    // Afișează statistici
    console.log("\n=== Statistici ===");
    console.log(`Total produse în CSV: ${records.length}`);
    console.log(`Produse găsite în baza de date: ${matchingProducts.length}`);
    console.log(`Produse actualizate la categoria Shoes: ${productsToUpdate.length}`);
    console.log(`Produse deja în categoria Shoes: ${alreadyInShoesCategory}`);
    console.log(`Produse negăsite în baza de date: ${notFoundUrls.length}`);
    
    if (notFoundUrls.length > 0) {
      console.log("\nPrimele 5 URL-uri negăsite:");
      notFoundUrls.slice(0, 5).forEach(url => {
        const record = records.find(r => r.buyUrl === url);
        if (record) {
          console.log(`- ${record.title}: ${url}`);
        }
      });
    }

  } catch (error) {
    console.error("A apărut o eroare în timpul procesului:", error);
  }
}

// Rulează scriptul
fixShoesFromCSV()
  .then(() => {
    console.log("Script finalizat.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Eroare la rularea scriptului:", error);
    process.exit(1);
  });