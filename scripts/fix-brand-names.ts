import { db } from '../server/db';
import { products } from '../shared/schema';
import { eq, sql } from 'drizzle-orm';

/**
 * Script pentru corectarea inconsistențelor în numele brandurilor
 * Acest script:
 * 1. Corectează greșelile de scriere
 * 2. Uniformizează capitalizarea
 * 3. Rezolvă probleme de spații și punctuație
 */

async function fixBrandNames() {
  console.log('Început proces de corectare a numelor de branduri...');

  const brandCorrections = {
    // Erori de scriere
    'ADIDSA': 'ADIDAS',
    'GALEERY DEPT': 'Gallery Dept',
    'PALPH LAUREN': 'POLO Ralph Lauren',
    'MASON MARGIELA': 'Maison Margiela',
    '"NIKE , OFF-WHITE"': 'OFF-WHITE',
    'NIKE , OFF-WHITE': 'OFF-WHITE',
    
    // Uniformizare capitalizare
    'Balenciaga': 'BALENCIAGA',
    'Dior': 'DIOR',
    'Louis Vuitton': 'LOUIS VUITTON',
    'Nike': 'NIKE',
    'Yeezy': 'YEEZY',
    'Rick Owens': 'RICK OWENS',
    'Gucci': 'GUCCI',
    'Off White': 'OFF-WHITE',
    'Lanvin': 'LANVIN',
    'Prada': 'PRADA',
  };

  let totalFixed = 0;

  // Procesează fiecare corecție
  for (const [wrongName, correctName] of Object.entries(brandCorrections)) {
    try {
      const result = await db.execute(
        sql`UPDATE ${products} SET brand = ${correctName} WHERE brand = ${wrongName}`
      );
      
      console.log(`Corectat: "${wrongName}" → "${correctName}"`);
      totalFixed += Number(result.rowCount || 0);
    } catch (error) {
      console.error(`Eroare la corectarea '${wrongName}': `, error);
    }
  }

  console.log(`Proces finalizat! S-au corectat ${totalFixed} produse.`);
}

// Execută funcția și gestionează închiderea conexiunii
fixBrandNames()
  .then(() => {
    console.log('Script executat cu succes!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Eroare la executarea scriptului:', error);
    process.exit(1);
  });