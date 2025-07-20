/**
 * Script pentru atribuirea automată a subcategoriilor pe baza titlurilor produselor
 * Versiune îmbunătățită care acceptă subcategorii noi și reguli de prioritate
 */

import { db } from "../server/db";
import { products } from "../shared/schema";
import { eq, sql } from "drizzle-orm";

type SubCategoryMapItem = {
  keywords: string[];
  subCategory: string;
  priority?: number; // Prioritate mai mare înseamnă că are precedență în caz de potriviri multiple
}

async function assignSubcategoriesEnhanced() {
  console.log("Început procesul de atribuire a subcategoriilor îmbunătățit...");

  // Lista de subcategorii cu cuvinte cheie și priorități
  const subCategoryMap: SubCategoryMapItem[] = [
    {
      subCategory: "T-Shirts",
      keywords: ["t-shirt", "tee", "short sleeve", "ss tee", "graphic tee", "printed tee"],
      priority: 1
    },
    {
      subCategory: "Shirts",
      keywords: ["shirt", "button up", "button-down", "oxford", "polo"],
      priority: 1
    },
    {
      subCategory: "Hoodies",
      keywords: ["hoodie", "zip up", "crewneck", "jumper", "pullover", "sweatshirt", "tech fleece"],
      priority: 2 // Prioritate mai mare pentru "tech fleece" care ar putea fi și Tracksuit
    },
    {
      subCategory: "Jackets",
      keywords: ["jacket", "puffer", "fleece", "coat", "parka", "windbreaker", "down"],
      priority: 2
    },
    {
      subCategory: "Sweaters",
      keywords: ["sweater", "knit", "cardigan", "wool"],
      priority: 1
    },
    {
      subCategory: "Pants & Jeans",
      keywords: ["jeans", "pants", "trousers", "slacks", "cargo", "denim pants"],
      priority: 1
    },
    {
      subCategory: "Shorts",
      keywords: ["shorts", "mesh shorts", "sweat shorts"],
      priority: 2
    },
    {
      subCategory: "Tracksuits",
      keywords: ["tracksuit", "track suit", "track pants", "tech fleece", "full set"],
      priority: 3 // Prioritate mai mare pentru "tech fleece"
    },
    {
      subCategory: "Vests",
      keywords: ["vest", "gilet", "sleeveless"],
      priority: 1
    },
    {
      subCategory: "Denim",
      keywords: ["denim", "denim jacket", "denim jeans", "raw denim"],
      priority: 1
    },
    {
      subCategory: "Vintage",
      keywords: ["vintage", "retro", "old school", "archive"],
      priority: 1
    },
    {
      subCategory: "Boxers",
      keywords: ["boxers", "underwear", "briefs", "trunks"],
      priority: 2
    },
    {
      subCategory: "Jerseys",
      keywords: ["jersey", "nba", "football jersey", "soccer jersey", "kit", "team jersey"],
      priority: 2
    },
    {
      subCategory: "Beanies",
      keywords: ["beanie", "knit hat", "winter hat"],
      priority: 1
    },
    {
      subCategory: "Socks",
      keywords: ["socks", "crew socks", "ankle socks"],
      priority: 1
    }
  ];

  // Obține toate produsele din categoria Clothing care nu au o subcategorie asignată
  const clothingProducts = await db.select().from(products).where(eq(products.category, "Clothing"));
  
  console.log(`Found ${clothingProducts.length} products in the Clothing category.`);
  
  // Reguli speciale
  const specialRules = [
    { keyword: "polo", isNotIn: ["shirt", "ralph lauren polo"], setTo: "Shirts" },
    { keyword: "zip up", isNotIn: [], setTo: "Hoodies" },
    { keyword: "crewneck", isNotIn: [], setTo: "Hoodies" },
    { keyword: "jumper", isNotIn: [], setTo: "Hoodies" },
    { keyword: "tech fleece", isNotIn: [], setTo: "Tracksuits" },
    { keyword: "fleece", isNotIn: ["tech fleece"], setTo: "Jackets" }
  ];

  let updateCount = 0;
  let processedCount = 0;

  for (const product of clothingProducts) {
    processedCount++;
    
    if (processedCount % 100 === 0) {
      console.log(`Processed ${processedCount}/${clothingProducts.length} products...`);
    }
    
    const title = product.title.toLowerCase();
    
    // Verifică dacă se aplică vreo regulă specială
    let specialSubCategory = null;
    
    for (const rule of specialRules) {
      if (title.includes(rule.keyword.toLowerCase())) {
        // Verifică dacă NU conține vreunul din cuvintele cheie restrictive
        const hasRestriction = rule.isNotIn.some(forbidden => title.includes(forbidden.toLowerCase()));
        
        if (!hasRestriction) {
          specialSubCategory = rule.setTo;
          break;
        }
      }
    }
    
    if (specialSubCategory) {
      // Actualizează produsul cu subcategoria din regula specială
      await db.update(products)
        .set({ subCategory: specialSubCategory })
        .where(eq(products.id, product.id));
      
      updateCount++;
      continue; // Trecem la următorul produs
    }
    
    // Dacă nu există reguli speciale, verificăm potrivirile normale
    let bestMatch: { subCategory: string, priority: number } | null = null;
    
    for (const subCatItem of subCategoryMap) {
      // Verifică dacă vreun cuvânt cheie din lista subcategoriei se regăsește în titlu
      const match = subCatItem.keywords.some(keyword => 
        title.includes(keyword.toLowerCase())
      );
      
      if (match) {
        // Păstrează subcategoria cu cea mai mare prioritate
        if (!bestMatch || (subCatItem.priority || 0) > (bestMatch.priority || 0)) {
          bestMatch = { 
            subCategory: subCatItem.subCategory, 
            priority: subCatItem.priority || 0 
          };
        }
      }
    }
    
    if (bestMatch) {
      // Actualizează produsul cu subcategoria potrivită
      await db.update(products)
        .set({ subCategory: bestMatch.subCategory })
        .where(eq(products.id, product.id));
      
      updateCount++;
    }
  }
  
  console.log(`Proces finalizat. ${updateCount} produse au fost actualizate cu subcategorii.`);
}

// Execută funcția și tratează erorile
assignSubcategoriesEnhanced()
  .then(() => {
    console.log("Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error running script:", error);
    process.exit(1);
  });