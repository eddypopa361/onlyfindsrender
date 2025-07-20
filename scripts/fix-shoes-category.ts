/**
 * Script pentru corectarea categoriei Shoes
 * Menține în categoria Shoes doar produsele din CSV-ul furnizat și mută restul în categoria Clothing
 */

import { db } from "../server/db";
import { products } from "../shared/schema";
import { eq, ilike, inArray, not } from "drizzle-orm";
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

// Lista de titluri pentru produsele care ar trebui să fie în categoria Shoes
const shoeTitles = [
  "1:1 AIR FORCE 1", 
  "LJR BEST BATCH", 
  "LOWS BATCH", 
  "BUDGET LOWS",
  "mid batch", 
  "MID BATCH", 
  "BEST BATCH", 
  "gx batch", 
  "G batch", 
  "BEST BUDGET BATCH", 
  "kz batch", 
  "y3 batch",
  "jordan 6", 
  "jordan 11", 
  "jordan 12", 
  "jordan 13", 
  "BUDGET LOWS & HIGHS", 
  "BEST BATCH LOWS",
  "M BATCH", 
  "m batch", 
  "BEST BATCH to PRICE ratio", 
  "OFF WHITE (1-50)", 
  "vt batch", 
  "SLIDES", 
  "FOAMRUNNERS & slides",
  "350", 
  "YEEZY BOOST 500", 
  "YEEZY 500", 
  "YEEZY BOOST 700 V2", 
  "yeezy 700", 
  "IDEK WHAT THESE ARE HAHA",
  "stussy af1", 
  "af1", 
  "af1 skeleton halloween", 
  "color changing af1", 
  "airmax 95", 
  "corteiz airmax 95s",
  "airmax 1", 
  "airmax 97", 
  "tns", 
  "vapormax flyknit", 
  "nike shox tl", 
  "nike air zoom football/soccer",
  "air more uptempo", 
  "nocta glide", 
  "ZOOM VEMEROS", 
  "THE 50 LOT", 
  "blazers", 
  "OUT OF OFFICE",
  "990 V3", 
  "NB1906", 
  "2002R", 
  "NB550", 
  "NB327", 
  "530 sl miu miu", 
  "NB9060", 
  "MID bapestaS",
  "1:1 BAPESTAS", 
  "BAPESTA SHARKFACE", 
  "B30", 
  "b31", 
  "b33", 
  "B23", 
  "B57", 
  "alpha sandals", 
  "RAMONES",
  "JUMBO LACES", 
  "ALEXANDER MCQUEEN", 
  "BALENCIAGA runners", 
  "balenciaga led", 
  "balenciaga slides",
  "balenciaga TRACK 2.0", 
  "balenciaga", 
  "louis vuitton trainers", 
  "LV SNEAKERS", 
  "louis vuitton waterfront mule slides",
  "ADIDAS CAMPUS ORIGINALS", 
  "BAD BUNNY X ADIDAS CAMPUS", 
  "ADDIDAS", 
  "samba wales bonner", 
  "kyrie 5",
  "kobe 5/6/8", 
  "skel top lows", 
  "uggs", 
  "clogs", 
  "Black Peterson LOW", 
  "Converse Comme des Garçons",
  "LAVIN CURB", 
  "GUCCI", 
  "ASICS Gel", 
  "ASICS", 
  "CHANEL", 
  "TIMBS", 
  "LOAFERS", 
  "PRADA"
];

async function fixShoeCategory() {
  console.log("Începerea procesului de corectare a categoriei Shoes...");

  try {
    // Pas 1: Citirea CSV-ului pentru a extrage titlurile exact
    const csvContent = fs.readFileSync('./attached_assets/brands shoes.csv', 'utf8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });

    const exactShoeTitles = records.map((record: any) => record.title.trim());
    console.log(`S-au găsit ${exactShoeTitles.length} titluri exacte de încălțăminte în CSV.`);

    // Pas 2: Obține toate produsele din categoria Shoes în prezent
    const currentShoes = await db.select().from(products).where(eq(products.category, "Shoes"));
    console.log(`În prezent există ${currentShoes.length} produse în categoria Shoes.`);

    // Pas 3: Identifică produsele care trebuie să rămână în categoria Shoes
    const shoesToKeep = currentShoes.filter(product => {
      // Verifică dacă titlul produsului se potrivește exact cu unul din CSV
      const exactMatch = exactShoeTitles.some(title => 
        product.title.toLowerCase().trim() === title.toLowerCase().trim()
      );

      // Dacă nu avem o potrivire exactă, verificăm dacă începe cu unul din titlurile generice
      if (!exactMatch) {
        return shoeTitles.some(shoeTitle => 
          product.title.toLowerCase().startsWith(shoeTitle.toLowerCase())
        );
      }
      
      return exactMatch;
    });

    const shoesToKeepIds = shoesToKeep.map(shoe => shoe.id);
    console.log(`${shoesToKeepIds.length} produse vor rămâne în categoria Shoes.`);

    // Pas 4: Identifică produsele care trebuie mutate din Shoes în Clothing
    const shoesToMove = currentShoes.filter(product => !shoesToKeepIds.includes(product.id));
    console.log(`${shoesToMove.length} produse vor fi mutate din Shoes în Clothing.`);

    // Pas 5: Actualizează categoria produselor care trebuie mutate în Clothing
    if (shoesToMove.length > 0) {
      const shoesToMoveIds = shoesToMove.map(shoe => shoe.id);
      
      // Procesează în loturi pentru a evita limitele de dimensiune a query-urilor
      const batchSize = 100;
      for (let i = 0; i < shoesToMoveIds.length; i += batchSize) {
        const batch = shoesToMoveIds.slice(i, i + batchSize);
        
        await db.update(products)
          .set({ 
            category: "Clothing",
            // Resetăm subcategoria pentru a fi procesată de scriptul de subcategorii
            subCategory: null
          })
          .where(inArray(products.id, batch));
        
        console.log(`Mutate produsele ${i + 1} - ${i + batch.length} din ${shoesToMoveIds.length}.`);
      }
    }

    console.log("Procesul de corectare a categoriei Shoes a fost finalizat cu succes.");
    console.log(`În categoria Shoes au rămas ${shoesToKeepIds.length} produse.`);
    console.log(`${shoesToMove.length} produse au fost mutate în categoria Clothing.`);

  } catch (error) {
    console.error("A apărut o eroare în timpul procesului:", error);
  }
}

// Rulează scriptul
fixShoeCategory()
  .then(() => {
    console.log("Script finalizat.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Eroare la rularea scriptului:", error);
    process.exit(1);
  });