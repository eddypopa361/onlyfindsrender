/**
 * Script pentru resetarea subcategoriilor pentru produsele din categoria Shoes
 */

import { db } from "../server/db";
import { products } from "../shared/schema";
import { eq, ne, isNull } from "drizzle-orm";

async function resetShoeSubcategories() {
  console.log("Începerea procesului de resetare a subcategoriilor pentru produse Shoes...");

  try {
    // Mută toate produsele din categoria Shoes în categoria Clothing
    const updateResult = await db.update(products)
      .set({ 
        category: "Clothing",
        subCategory: null  // Resetăm subcategoria pentru a fi procesată ulterior
      })
      .where(eq(products.category, "Shoes"));
    
    console.log(`Toate produsele din categoria Shoes au fost mutate în categoria Clothing.`);

    // Găsește produse cu branduri specifice de încălțăminte și le mută înapoi în Shoes
    const shoeBrands = [
      'NIKE', 'AIR JORDAN', 'NEW BALANCE', 'BAPESTA', 
      'CONVERSE', 'ASICS', 'TIMBERLANDS', 'BASKETBALL SHOES', 'ADIDAS',
      'UGG', 'BIRKINSTOCKS', 'MAISON MIHARA YASUHIRO', 'AMIRI', 
      'RICK OWENS', 'DIOR', 'ALEXANDER MCQUEEN'
    ];
    
    // Mută fiecare brand de încălțăminte pe rând
    for (const brand of shoeBrands) {
      await db.update(products)
        .set({ 
          category: "Shoes",
          subCategory: null
        })
        .where(eq(products.brand, brand));
      
      console.log(`Produsele cu brandul ${brand} au fost mutate în categoria Shoes.`);
    }

    // Verifică câte produse sunt acum în categoria Shoes
    const shoeCount = await db.select()
      .from(products)
      .where(eq(products.category, "Shoes"));
    
    console.log(`După actualizare, există ${shoeCount.length} produse în categoria Shoes.`);

  } catch (error) {
    console.error("A apărut o eroare în timpul procesului:", error);
  }
}

// Rulează scriptul
resetShoeSubcategories()
  .then(() => {
    console.log("Script finalizat.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Eroare la rularea scriptului:", error);
    process.exit(1);
  });