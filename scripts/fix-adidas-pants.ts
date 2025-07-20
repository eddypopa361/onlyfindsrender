/**
 * Script pentru mutarea produselor Adidas rămase din Shoes în categoria Clothing
 */

import { db } from "../server/db";
import { products } from "../shared/schema";
import { eq, and, or } from "drizzle-orm";

async function fixAdidasPants() {
  console.log("Începerea procesului de mutare a produselor Adidas din Shoes în Clothing...");

  try {
    // Mută toate produsele Adidas din categoria Shoes în Clothing/Pants & Jeans
    const updateResult = await db.update(products)
      .set({
        category: "Clothing",
        subCategory: "Pants & Jeans"
      })
      .where(
        and(
          eq(products.category, "Shoes"),
          or(
            eq(products.brand, "ADIDAS"),
            eq(products.brand, "ADIDSA")
          )
        )
      );

    console.log(`Produsele Adidas au fost mutate din categoria Shoes în categoria Clothing.`);

    // Verifică numărul de produse rămase în categoria Shoes
    const shoesCount = await db.select()
      .from(products)
      .where(eq(products.category, "Shoes"));

    console.log(`După actualizare, au rămas ${shoesCount.length} produse în categoria Shoes.`);

  } catch (error) {
    console.error("A apărut o eroare în timpul procesului:", error);
  }
}

// Rulează scriptul
fixAdidasPants()
  .then(() => {
    console.log("Script finalizat.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Eroare la rularea scriptului:", error);
    process.exit(1);
  });