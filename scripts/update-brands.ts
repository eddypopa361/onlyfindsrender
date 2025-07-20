import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { db } from '../server/db';
import { products } from '../shared/schema';
import { eq, or, and, like, desc } from 'drizzle-orm';

async function importNewBrands() {
  console.log('🔄 Începe actualizarea și importarea brand-urilor...');
  
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
  
  // Obține toate produsele din baza de date pentru eficiență
  const allProducts = await db.select().from(products).orderBy(desc(products.id));
  console.log(`🔍 Am găsit ${allProducts.length} produse în baza de date.`);
  
  let updatedCount = 0;
  let createdCount = 0;
  
  // Treci prin fiecare înregistrare din CSV
  for (const record of records) {
    const title = record.title?.trim();
    const price = record.price?.trim();
    const brand = record.brand?.trim();
    
    if (!title || !price || !brand) {
      console.warn('⚠️ Înregistrare incompletă, se ignoră:', record);
      continue;
    }
    
    // Elimină simbolul $ din preț și convertește la număr
    const priceValue = parseFloat(price.replace('$', ''));
    
    if (isNaN(priceValue)) {
      console.warn(`⚠️ Preț invalid pentru produsul "${title}": ${price}`);
      continue;
    }
    
    // Obține produsele cu același titlu (ignoring case)
    const titleProducts = allProducts.filter(p => 
      p.title && p.title.toLowerCase().includes(title.toLowerCase())
    );
    
    // Găsește produse cu același titlu și preț
    const matchingProducts = titleProducts.filter(p => 
      p.price === priceValue.toString() || p.price === price
    );
    
    if (matchingProducts.length > 0) {
      // Actualizează brand-ul pentru produsele existente
      for (const product of matchingProducts) {
        await db.update(products)
          .set({ brand })
          .where(eq(products.id, product.id));
        
        console.log(`✅ Am actualizat brand-ul pentru: "${product.title}" (ID: ${product.id}) la "${brand}"`);
        updatedCount++;
      }
    } else {
      // Caută produse doar după titlu (potrivire parțială)
      const titleMatchProducts = allProducts.filter(p => 
        p.title && p.title.toLowerCase().includes(title.toLowerCase().substring(0, 10))
      );
      
      if (titleMatchProducts.length > 0) {
        // Actualizează brand-ul pentru produsele cu potrivire parțială de titlu
        for (const product of titleMatchProducts) {
          await db.update(products)
            .set({ brand })
            .where(eq(products.id, product.id));
          
          console.log(`🔄 Am actualizat brand-ul pentru potrivire parțială: "${product.title}" (ID: ${product.id}) la "${brand}"`);
          updatedCount++;
        }
      } else {
        // Fă potrivire manuală pentru brand-uri specifice
        let productToUpdate;
        
        if (brand === "NIKE") {
          productToUpdate = allProducts.find(p => p.title?.toLowerCase().includes('nike'));
        } else if (brand === "ADIDAS") {
          productToUpdate = allProducts.find(p => p.title?.toLowerCase().includes('adidas'));
        } else if (brand === "PRADA") {
          productToUpdate = allProducts.find(p => p.title?.toLowerCase().includes('prada'));
        } else if (brand === "LOUIS VUITTON") {
          productToUpdate = allProducts.find(p => p.title?.toLowerCase().includes('louis') || p.title?.toLowerCase().includes('vuitton'));
        } else if (brand === "BALENCIAGA") {
          productToUpdate = allProducts.find(p => p.title?.toLowerCase().includes('balenciaga'));
        } else if (brand === "GUCCI") {
          productToUpdate = allProducts.find(p => p.title?.toLowerCase().includes('gucci'));
        }
        
        if (productToUpdate) {
          await db.update(products)
            .set({ brand })
            .where(eq(products.id, productToUpdate.id));
          
          console.log(`🔄 Am actualizat brand-ul pentru potrivire manuală: "${productToUpdate.title}" (ID: ${productToUpdate.id}) la "${brand}"`);
          updatedCount++;
        } else {
          console.log(`⚠️ Nu am putut găsi un produs potrivit pentru: "${title}" (${brand})`);
        }
      }
    }
  }
  
  console.log(`
🎉 Actualizare finalizată:
  - Produse actualizate: ${updatedCount}
  - Produse create: ${createdCount}
  - Total înregistrări procesate: ${records.length}
  `);
}

// Rulează funcția principală
importNewBrands()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Eroare:', error);
    process.exit(1);
  });