import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { db } from '../server/db';
import { products } from '../shared/schema';
import { eq, like } from 'drizzle-orm';

async function updateProductBrands() {
  console.log('🔄 Începe actualizarea brand-urilor pentru produsele existente...');
  
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
  
  let updatedCount = 0;
  let notFoundCount = 0;
  
  // Treci prin fiecare înregistrare din CSV și actualizează brand-urile
  for (const record of records) {
    const title = record.title?.trim();
    const brand = record.brand?.trim();
    
    if (!title || !brand) {
      console.warn('⚠️ Înregistrare incompletă, se ignoră:', record);
      continue;
    }
    
    // Curăță titlul și îl pregătește pentru comparație
    const cleanTitle = title
      .replace(/\n/g, " ")     // Replace newlines with spaces
      .replace(/\(.*?\)/g, "") // Remove content in parentheses
      .trim();
    
    // Caută produse cu același titlu exact sau parțial
    // Pentru titluri lungi, comparăm doar primele cuvinte
    const titleWords = cleanTitle.split(' ');
    const searchTitle = titleWords.length > 2 ? titleWords.slice(0, 2).join(' ') : cleanTitle;
    
    // Filtrează produsele care conțin searchTitle în titlul lor
    const matchingProducts = allProducts.filter(p => 
      p.title && 
      p.title.toLowerCase().includes(searchTitle.toLowerCase())
    );
    
    if (matchingProducts.length > 0) {
      for (const product of matchingProducts) {
        // Actualizează brand-ul produsului găsit
        await db.update(products)
          .set({ brand: brand })
          .where(eq(products.id, product.id));
        
        console.log(`✅ Am actualizat brand-ul pentru: "${product.title}" (ID: ${product.id}) -> "${brand}"`);
        updatedCount++;
      }
    } else {
      console.log(`⚠️ Nu am găsit produse pentru titlul: "${cleanTitle}" (căutare: "${searchTitle}")`);
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

// Rulează funcția principală
updateProductBrands()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Eroare:', error);
    process.exit(1);
  });