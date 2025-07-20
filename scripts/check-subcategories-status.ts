/**
 * Script pentru verificarea statusului subcategoriilor după actualizare
 */

import { db } from "../server/db";
import { products } from "../shared/schema";
import { eq, or, and, isNull, isNotNull, count } from "drizzle-orm";

async function checkSubcategoriesStatus() {
  console.log("Verificarea statusului subcategoriilor...");

  try {
    // 1. Câte produse sunt în total
    const totalProducts = await db.select({ count: count() }).from(products);
    console.log(`Total produse în baza de date: ${totalProducts[0].count}`);

    // 2. Câte produse sunt în categoria Clothing
    const clothingProducts = await db.select({ count: count() })
      .from(products)
      .where(eq(products.category, "Clothing"));
    console.log(`Produse în categoria Clothing: ${clothingProducts[0].count}`);

    // 3. Câte produse din categoria Clothing au subcategorii
    const clothingWithSubcategory = await db.select({ count: count() })
      .from(products)
      .where(
        and(
          eq(products.category, "Clothing"),
          isNotNull(products.subCategory)
        )
      );
    console.log(`Produse Clothing cu subcategorii: ${clothingWithSubcategory[0].count} (${
      Math.round((clothingWithSubcategory[0].count / clothingProducts[0].count) * 100)
    }%)`);

    // 4. Câte produse din categoria Clothing nu au subcategorii
    const clothingWithoutSubcategory = await db.select({ count: count() })
      .from(products)
      .where(
        and(
          eq(products.category, "Clothing"),
          isNull(products.subCategory)
        )
      );
    console.log(`Produse Clothing fără subcategorii: ${clothingWithoutSubcategory[0].count} (${
      Math.round((clothingWithoutSubcategory[0].count / clothingProducts[0].count) * 100)
    }%)`);

    // 5. Distribuția subcategoriilor pentru produsele Clothing
    const subcategoryDistribution = await db.select({
      subCategory: products.subCategory,
      count: count(),
    })
      .from(products)
      .where(eq(products.category, "Clothing"))
      .groupBy(products.subCategory);

    console.log("\nDistribuția subcategoriilor pentru produsele Clothing:");
    subcategoryDistribution.forEach(item => {
      const percentage = Math.round((item.count / clothingProducts[0].count) * 100);
      console.log(`- ${item.subCategory || 'Fără subcategorie'}: ${item.count} produse (${percentage}%)`);
    });

    // 6. Verifică dacă există produse Shoes cu subcategorie
    const shoesWithSubcategory = await db.select({ count: count() })
      .from(products)
      .where(
        and(
          eq(products.category, "Shoes"),
          isNotNull(products.subCategory)
        )
      );
    console.log(`\nProduse Shoes cu subcategorii: ${shoesWithSubcategory[0].count}`);

    if (shoesWithSubcategory[0].count > 0) {
      // Afișează distribuția subcategoriilor pentru produsele Shoes
      const shoesSubcategoryDistribution = await db.select({
        subCategory: products.subCategory,
        count: count(),
      })
        .from(products)
        .where(
          and(
            eq(products.category, "Shoes"),
            isNotNull(products.subCategory)
          )
        )
        .groupBy(products.subCategory);

      console.log("\nDistribuția subcategoriilor pentru produsele Shoes:");
      shoesSubcategoryDistribution.forEach(item => {
        console.log(`- ${item.subCategory}: ${item.count} produse`);
      });
    }

  } catch (error) {
    console.error("A apărut o eroare în timpul procesului:", error);
  }
}

// Rulează scriptul
checkSubcategoriesStatus()
  .then(() => {
    console.log("\nVerificare finalizată.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Eroare la rularea scriptului:", error);
    process.exit(1);
  });