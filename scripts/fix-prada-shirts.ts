/**
 * Script pentru corectarea produselor Prada și LV shirt care sunt încă în categoria Shoes
 */

import { db } from "../server/db";
import { products } from "../shared/schema";
import { eq, and, like, or } from "drizzle-orm";

async function fixShirts() {
  console.log("Începerea procesului de corectare a produselor cu cămăși...");

  try {
    // Găsește toate produsele de tip shirt în categoria Shoes
    const result = await db.update(products)
      .set({
        category: "Clothing",
        subCategory: "Shirts"
      })
      .where(
        and(
          eq(products.category, "Shoes"),
          or(
            like(products.title, '%shirt%'),
            like(products.title, '%camasa%')
          )
        )
      );

    console.log(`Actualizare completă. Produsele de tip shirt au fost mutate în categoria Clothing.`);

  } catch (error) {
    console.error("A apărut o eroare în timpul procesului:", error);
  }
}

// Rulează scriptul
fixShirts()
  .then(() => {
    console.log("Script finalizat.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Eroare la rularea scriptului:", error);
    process.exit(1);
  });