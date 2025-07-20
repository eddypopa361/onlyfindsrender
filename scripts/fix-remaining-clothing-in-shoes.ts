/**
 * Script pentru mutarea produselor de îmbrăcăminte rămase în categoria Shoes
 */

import { db } from "../server/db";
import { products } from "../shared/schema";
import { eq, and, like, or } from "drizzle-orm";

async function fixRemainingClothingInShoes() {
  console.log("Începerea procesului de corectare a produselor de îmbrăcăminte rămase în categoria Shoes...");

  try {
    // Mută tricouri
    await db.update(products)
      .set({
        category: "Clothing",
        subCategory: "T-Shirts"
      })
      .where(
        and(
          eq(products.category, "Shoes"),
          or(
            like(products.title, '%tee%'),
            like(products.title, '%t-shirt%'),
            like(products.title, '%t shirt%')
          )
        )
      );
    
    // Mută hanorace și pulovere
    await db.update(products)
      .set({
        category: "Clothing",
        subCategory: "Hoodies"
      })
      .where(
        and(
          eq(products.category, "Shoes"),
          or(
            like(products.title, '%hoodie%'),
            like(products.title, '%sweatshirt%'),
            like(products.title, '%pullover%')
          )
        )
      );
    
    // Mută tracksuit-uri
    await db.update(products)
      .set({
        category: "Clothing",
        subCategory: "Tracksuits"
      })
      .where(
        and(
          eq(products.category, "Shoes"),
          like(products.title, '%tracksuit%')
        )
      );
    
    // Mută pantaloni și jeanși
    await db.update(products)
      .set({
        category: "Clothing",
        subCategory: "Pants & Jeans"
      })
      .where(
        and(
          eq(products.category, "Shoes"),
          or(
            like(products.title, '%jean%'),
            like(products.title, '%pants%'),
            like(products.title, '%trousers%')
          )
        )
      );
    
    // Mută căciuli
    await db.update(products)
      .set({
        category: "Clothing",
        subCategory: "Beanies"
      })
      .where(
        and(
          eq(products.category, "Shoes"),
          like(products.title, '%beanie%')
        )
      );

    console.log(`Produsele de îmbrăcăminte rămase au fost mutate din categoria Shoes în categoria Clothing.`);
  } catch (error) {
    console.error("A apărut o eroare în timpul procesului:", error);
  }
}

// Rulează scriptul
fixRemainingClothingInShoes()
  .then(() => {
    console.log("Script finalizat.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Eroare la rularea scriptului:", error);
    process.exit(1);
  });