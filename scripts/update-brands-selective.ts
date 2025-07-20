import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { db } from '../server/db';
import { products } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function updateBrandsSelective() {
  console.log('🔄 Începe actualizarea selectivă a brand-urilor...');
  
  // Citește fișierul CSV
  const csvFilePath = path.join(process.cwd(), 'attached_assets', 'brands shoes.csv');
  
  if (!fs.existsSync(csvFilePath)) {
    console.error(`❌ Fișierul nu există: ${csvFilePath}`);
    return;
  }
  
  const fileContent = fs.readFileSync(csvFilePath, 'utf8');
  
  // Parsează datele CSV
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });
  
  console.log(`📋 Am citit ${records.length} înregistrări din CSV.`);
  
  // Obține toate produsele din baza de date
  const allProducts = await db.select().from(products);
  console.log(`🔍 Am găsit ${allProducts.length} produse în baza de date.`);

  // Set pentru a ține evidența ID-urilor produselor actualizate
  const updatedProductIds = new Set<number>();
  let updatedCount = 0;
  let notFoundCount = 0;
  
  // Treci prin fiecare înregistrare din CSV
  for (const record of records) {
    const title = record.title?.trim();
    const brand = record.brand?.trim();
    
    if (!title || !brand) {
      console.warn('⚠️ Înregistrare incompletă, se ignoră:', record);
      continue;
    }
    
    // Curăță titlul pentru comparație
    const cleanTitle = title
      .replace(/\\n/g, " ")
      .replace(/\\r/g, "")
      .replace(/\\t/g, " ")
      .replace(/\(.*?\)/g, "")
      .trim();
    
    // Caută produsul după titlu
    let exactMatch = null;
    let partialMatch = null;
    
    // Prima încercare: potrivire exactă
    exactMatch = allProducts.find(p => 
      p.title && 
      p.title.toLowerCase() === cleanTitle.toLowerCase() &&
      !updatedProductIds.has(p.id)
    );
    
    // A doua încercare: potrivire parțială
    if (!exactMatch) {
      // Folosim primele 1-2 cuvinte pentru potrivire parțială
      const titleWords = cleanTitle.split(' ');
      const searchTerm = titleWords.length > 1 
        ? titleWords.slice(0, 2).join(' ') 
        : cleanTitle;
      
      partialMatch = allProducts.find(p => 
        p.title && 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !updatedProductIds.has(p.id)
      );
    }
    
    // Actualizează produsul găsit
    const productToUpdate = exactMatch || partialMatch;
    
    if (productToUpdate) {
      await db.update(products)
        .set({ brand })
        .where(eq(products.id, productToUpdate.id));
      
      console.log(`✅ Am actualizat brand-ul pentru "${productToUpdate.title}" (ID: ${productToUpdate.id}) -> "${brand}"`);
      
      // Marchează produsul ca fiind actualizat
      updatedProductIds.add(productToUpdate.id);
      updatedCount++;
    } else {
      console.log(`❌ Nu am găsit potrivire pentru "${cleanTitle}" (Brand: ${brand})`);
      notFoundCount++;
    }
  }
  
  console.log(`
🎉 Actualizare finalizată:
  - Produse actualizate: ${updatedCount}
  - Produse negăsite: ${notFoundCount}
  - Total înregistrări procesate: ${records.length}
  `);
}

// Rulează funcția
updateBrandsSelective()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Eroare:', error);
    process.exit(1);
  });