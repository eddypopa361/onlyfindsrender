/**
 * Script pentru mutarea unor produse specifice din Shoes în subcategoriile corecte de Clothing
 */

import { db } from "../server/db";
import { products } from "../shared/schema";
import { eq, and, like, or, ilike } from "drizzle-orm";

async function fixSpecificShoes() {
  console.log("Începerea procesului de mutare a produselor specifice din Shoes în categoriile corecte...");

  try {
    // Mută pantalonii Rick Owens și Adidas în subcategoria Pants & Jeans
    const updatePantsResult = await db.update(products)
      .set({
        category: "Clothing",
        subCategory: "Pants & Jeans"
      })
      .where(
        and(
          eq(products.category, "Shoes"),
          or(
            // Primele 7 produse din imagine (Rick Owens pants și Adidas pants)
            and(
              or(
                eq(products.brand, "RICK OWENS"),
                eq(products.brand, "ADIDSA")  // Numele brandului este introdus greșit, trebuie să verificăm ambele variante
              ),
              or(
                like(products.title, '%pants%'),
                like(products.title, '%jean%'),
                // Rick Owens produse fără descriere clară în titlu dar care sunt pantaloni 
                // conform imaginii (multe produse Rick Owens au doar numele brandului ca titlu)
                and(
                  eq(products.brand, "RICK OWENS"),
                  or(
                    eq(products.price, "$45"),
                    eq(products.price, "$48"),
                    eq(products.price, "$52"),
                    eq(products.price, "$36"),
                    eq(products.price, "$52")
                  )
                )
              )
            ),
            // Adidas pants cu preț specific
            and(
              eq(products.brand, "ADIDSA"),
              or(
                eq(products.price, "$11"),
                eq(products.price, "$26")
              )
            )
          )
        )
      );

    console.log(`Pantaloni mutați în categoria Clothing, subcategoria Pants & Jeans.`);

    // Mută hanoracul Rick Owens în subcategoria Hoodies
    const updateHoodiesResult = await db.update(products)
      .set({
        category: "Clothing",
        subCategory: "Hoodies"
      })
      .where(
        and(
          eq(products.category, "Shoes"),
          eq(products.brand, "RICK OWENS"),
          or(
            like(products.title, '%hoodie%'),
            // Rick Owens hoodie cu preț specific
            eq(products.price, "$45")
          )
        )
      );

    console.log(`Hanorac mutat în categoria Clothing, subcategoria Hoodies.`);

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
fixSpecificShoes()
  .then(() => {
    console.log("Script finalizat.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Eroare la rularea scriptului:", error);
    process.exit(1);
  });