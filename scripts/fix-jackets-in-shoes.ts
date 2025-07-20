/**
 * Script pentru mutarea jachetelor din categoria Shoes în categoria Clothing
 */

import { db } from "../server/db";
import { products } from "../shared/schema";
import { eq, and, like, or } from "drizzle-orm";

async function fixJacketsInShoes() {
  console.log("Începerea procesului de corectare a jachetelor în categoria Shoes...");

  try {
    // Găsește jachetele și alte produse de îmbrăcăminte în categoria Shoes
    const result = await db.update(products)
      .set({
        category: "Clothing",
        subCategory: "Jackets"
      })
      .where(
        and(
          eq(products.category, "Shoes"),
          or(
            like(products.title, '%jacket%'),
            like(products.title, '%denim%')
          )
        )
      );

    console.log(`Jachetele au fost mutate din categoria Shoes în categoria Clothing.`);

    // Găsește alte produse de îmbrăcăminte în categoria Shoes
    const result2 = await db.update(products)
      .set({
        category: "Clothing",
        subCategory: null  // Va fi procesat de scriptul de subcategorii
      })
      .where(
        and(
          eq(products.category, "Shoes"),
          or(
            like(products.title, '%hoodie%'),
            like(products.title, '%sweater%'),
            like(products.title, '%t-shirt%'),
            like(products.title, '%pants%'),
            like(products.title, '%jeans%'),
            like(products.title, '%shorts%'),
            like(products.title, '%sweatshirt%'),
            like(products.title, '%tracksuit%')
          )
        )
      );

    console.log(`Alte produse de îmbrăcăminte au fost mutate din categoria Shoes în categoria Clothing.`);

  } catch (error) {
    console.error("A apărut o eroare în timpul procesului:", error);
  }
}

// Rulează scriptul
fixJacketsInShoes()
  .then(() => {
    console.log("Script finalizat.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Eroare la rularea scriptului:", error);
    process.exit(1);
  });