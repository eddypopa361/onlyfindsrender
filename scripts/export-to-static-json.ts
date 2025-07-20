/**
 * Script pentru exportul produselor din baza de date în format JSON static
 * pentru implementarea versiunii statice a site-ului
 */
import fs from 'fs';
import path from 'path';
import { db } from '../server/db';
import { products } from '../shared/schema';

async function exportToStaticJson() {
  try {
    console.log('Exportul produselor în format JSON static...');
    
    // Obținem toate produsele din baza de date
    const allProducts = await db.select().from(products);
    
    console.log(`S-au găsit ${allProducts.length} produse pentru export`);
    
    // Creăm directorul dacă nu există
    const outputDir = path.join(__dirname, '../client/public/data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Salvăm produsele în fișierul JSON
    const outputPath = path.join(outputDir, 'products.json');
    fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2));
    
    console.log(`Export finalizat cu succes în ${outputPath}`);
  } catch (error) {
    console.error('Eroare la exportul JSON:', error);
  }
}

// Executăm funcția de export
exportToStaticJson()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Eroare la execuția scriptului:', error);
    process.exit(1);
  });