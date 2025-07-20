import { db } from '../server/db';
import { products } from '../shared/schema';
import { sql } from 'drizzle-orm';

/**
 * Script pentru unificarea brandurilor duplicate
 * Acest script va combina brandurile care sunt practic același brand
 */

async function unifyDuplicateBrands() {
  console.log('Început proces de unificare a brandurilor duplicate...');

  // Definirea unificărilor care trebuie făcute
  const brandUnifications = [
    { target: 'The North Face', sources: ['The North Face', 'TNF', 'North Face'] },
    { target: 'Air Jordan', sources: ['AIR JORDAN', 'Jordan'] },
    { target: 'BAPE', sources: ['BAPE', 'BAPESTA'] },
    { target: 'Ralph Lauren', sources: ['BALACK WATCH', 'POLO Ralph Lauren', 'Ralph Lauren'] },
    { target: 'Dior', sources: ['Christian Dior', 'DIOR'] },
    { target: 'Fear of God Essentials', sources: ['Essentials', 'FEAR OF GOD'] },
    { target: 'Nike', sources: ['NIKE', 'Nocta'] }
  ];

  let totalUnified = 0;

  // Procesează fiecare unificare
  for (const unification of brandUnifications) {
    try {
      // Construiește condiția OR pentru toate sursele de brand
      const sourceConditions = unification.sources
        .filter(source => source !== unification.target) // Exclude targetul dacă există în surse
        .map(source => `brand = '${source}'`)
        .join(' OR ');
      
      if (!sourceConditions) {
        console.log(`Nu sunt branduri de unificat pentru "${unification.target}"`);
        continue;
      }

      // Execută actualizarea
      const result = await db.execute(
        sql`UPDATE products 
            SET brand = ${unification.target} 
            WHERE ${sql.raw(sourceConditions)}`
      );
      
      console.log(`S-au unificat ${result.rowCount || 0} produse sub brandul "${unification.target}"`);
      totalUnified += Number(result.rowCount || 0);
    } catch (error) {
      console.error(`Eroare la unificarea către "${unification.target}":`, error);
    }
  }

  console.log(`\nProcesul s-a finalizat cu succes!`);
  console.log(`S-au unificat în total ${totalUnified} produse.`);
}

// Execută funcția și gestionează închiderea conexiunii
unifyDuplicateBrands()
  .then(() => {
    console.log('Script executat cu succes!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Eroare la executarea scriptului:', error);
    process.exit(1);
  });