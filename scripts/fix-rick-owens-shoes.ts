/**
 * Script pentru mutarea modelelor Rick Owens JUMBO LACES și RAMONES din categoria Shoes în Clothing
 */

import { db } from "../server/db";
import { products } from "../shared/schema";
import { eq, and, or, like } from "drizzle-orm";

async function fixRickOwensShoes() {
  console.log("Începerea procesului de mutare a produselor Rick Owens rămase din Shoes în Clothing...");

  try {
    // Identifică produsele Rick Owens din categoria Shoes
    const rickOwensItems = await db.select()
      .from(products)
      .where(
        and(
          eq(products.category, "Shoes"),
          eq(products.brand, "RICK OWENS")
        )
      );

    console.log(`Am găsit ${rickOwensItems.length} produse Rick Owens în categoria Shoes.`);

    // Mută încălțările Rick Owens în subcategoria Shoes din categoria Clothing
    const updateResult = await db.update(products)
      .set({
        category: "Clothing",
        subCategory: "Shoes" // Folosim Shoes ca subcategorie în Clothing pentru încălțăminte de designer
      })
      .where(
        and(
          eq(products.category, "Shoes"),
          eq(products.brand, "RICK OWENS")
        )
      );

    console.log(`Produsele Rick Owens au fost mutate din categoria Shoes în categoria Clothing, subcategoria Shoes.`);

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
fixRickOwensShoes()
  .then(() => {
    console.log("Script finalizat.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Eroare la rularea scriptului:", error);
    process.exit(1);
  });