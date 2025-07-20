/**
 * Script optimizat pentru atribuirea automată a subcategoriilor pe baza titlurilor produselor
 * Utilizează actualizări în masă pentru a îmbunătăți performanța
 */

import { db } from "../server/db";
import { products } from "../shared/schema";
import { eq, sql, inArray } from "drizzle-orm";

type SubCategoryMapItem = {
  keywords: string[];
  subCategory: string;
  priority?: number;
}

async function assignSubcategoriesBatch() {
  console.log("Început procesul de atribuire a subcategoriilor în lot...");

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
      priority: 2
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
      priority: 3
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

  // Reguli speciale de procesare
  const specialRules = [
    { keyword: "polo", isNotIn: ["shirt", "ralph lauren polo"], setTo: "Shirts" },
    { keyword: "zip up", isNotIn: [], setTo: "Hoodies" },
    { keyword: "crewneck", isNotIn: [], setTo: "Hoodies" },
    { keyword: "jumper", isNotIn: [], setTo: "Hoodies" },
    { keyword: "tech fleece", isNotIn: [], setTo: "Tracksuits" },
    { keyword: "fleece", isNotIn: ["tech fleece"], setTo: "Jackets" }
  ];

  // Obține toate produsele din categoria Clothing
  const clothingProducts = await db.select().from(products).where(eq(products.category, "Clothing"));
  
  console.log(`S-au găsit ${clothingProducts.length} produse în categoria Clothing.`);

  // Grupează produsele pe subcategorii
  const productSubCategories = new Map<number, string>();
  let updateCount = 0;

  for (const product of clothingProducts) {
    const title = product.title.toLowerCase();
    
    // Verifică dacă se aplică vreo regulă specială
    let assigned = false;

    // Procesează regulile speciale
    for (const rule of specialRules) {
      if (title.includes(rule.keyword.toLowerCase())) {
        // Verifică dacă NU conține vreunul din cuvintele cheie restrictive
        const hasRestriction = rule.isNotIn.some(forbidden => title.includes(forbidden.toLowerCase()));
        
        if (!hasRestriction) {
          productSubCategories.set(product.id, rule.setTo);
          assigned = true;
          break;
        }
      }
    }

    // Dacă nu a fost atribuit prin reguli speciale, verifică potrivirile normale
    if (!assigned) {
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
        productSubCategories.set(product.id, bestMatch.subCategory);
      }
    }
  }

  // Efectuează actualizările în masă
  for (const subCategory of new Set(productSubCategories.values())) {
    const productIds = [...productSubCategories.entries()]
      .filter(([_, sc]) => sc === subCategory)
      .map(([id, _]) => id);
    
    if (productIds.length > 0) {
      const chunkSize = 100; // Actualizează în loturi de 100 pentru a evita limitările BD
      
      for (let i = 0; i < productIds.length; i += chunkSize) {
        const chunk = productIds.slice(i, i + chunkSize);
        
        await db.update(products)
          .set({ subCategory: subCategory })
          .where(inArray(products.id, chunk));
        
        updateCount += chunk.length;
        console.log(`Actualizate ${chunk.length} produse cu subcategoria ${subCategory}`);
      }
    }
  }
  
  console.log(`Proces finalizat. ${updateCount} produse au fost actualizate cu subcategorii.`);
}

// Execută funcția și tratează erorile
assignSubcategoriesBatch()
  .then(() => {
    console.log("Script completat cu succes");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Eroare la rularea scriptului:", error);
    process.exit(1);
  });