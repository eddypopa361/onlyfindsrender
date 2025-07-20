import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { db } from '../server/db';
import { products } from '../shared/schema';
import { sql, eq, like } from 'drizzle-orm';

/**
 * Script pentru importul produselor din categoria Shoes
 * Acest script importă produsele din CSV și le adaugă la baza de date
 */

async function importShoes() {
  try {
    console.log('Începerea importului produselor din categoria Shoes...');
    
    // Citirea fișierului CSV
    const csvData = fs.readFileSync('./attached_assets/brands shoes.csv', 'utf8');
    
    // Parsarea datelor CSV
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    });
    
    console.log(`S-au găsit ${records.length} produse în fișierul CSV.`);
    
    let importCount = 0;
    
    for (const record of records) {
      const title = record.title.trim();
      const price = record.price || "$0";
      const brand = record.brand?.trim() || "Other";
      
      // Simplificăm verificarea - vom adăuga toate produsele fără verificare de duplicare
      // (conform descrierii, acestea sunt produse noi care trebuie adăugate)
      
      // Construirea produsului nou
      const newProduct = {
        title: title,
        price: price,
        category: 'Shoes', // Categorie fixată la Shoes
        brand: brand,
        image: '/uploads/placeholder-shoe.jpg', // Imagine placeholder
        buyUrl: '#',
        viewUrl: '#',
        featured: false
      };
      
      // Inserarea produsului
      await db.insert(products).values(newProduct);
      importCount++;
      
      console.log(`Adăugat: ${title} (${brand}) - ${price}`);
    }
    
    console.log('\nRezumatul importului:');
    console.log(`- Total produse procesate: ${records.length}`);
    console.log(`- Produse adăugate: ${importCount}`);
    
    console.log('\nImportul a fost finalizat cu succes!');
  } catch (error) {
    console.error('Eroare la importul produselor:', error);
  }
}

// Execută funcția și închide conexiunea când s-a terminat
importShoes()
  .then(() => {
    console.log('Script executat cu succes!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Eroare la executarea scriptului:', error);
    process.exit(1);
  });