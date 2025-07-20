/**
 * Script pentru mutarea crewneck-urilor din categoria Shoes în categoria Clothing
 */

import { db } from "../server/db";
import { products } from "../shared/schema";
import { eq, and, like } from "drizzle-orm";

async function fixCrewnecksInShoes() {
  console.log("Începerea procesului de corectare a crewneck-urilor în categoria Shoes...");

  try {
    // Găsește crewneck-urile în categoria Shoes
    const result = await db.update(products)
      .set({
        category: "Clothing",
        subCategory: "Hoodies"  // Crewneck-urile sunt de obicei în subcategoria Hoodies
      })
      .where(
        and(
          eq(products.category, "Shoes"),
          like(products.title, '%crewneck%')
        )
      );

    console.log(`Crewneck-urile au fost mutate din categoria Shoes în categoria Clothing cu subcategoria Hoodies.`);
  } catch (error) {
    console.error("A apărut o eroare în timpul procesului:", error);
  }
}

// Rulează scriptul
fixCrewnecksInShoes()
  .then(() => {
    console.log("Script finalizat.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Eroare la rularea scriptului:", error);
    process.exit(1);
  });