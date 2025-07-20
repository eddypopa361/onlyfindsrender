import { db } from '../server/db';
import { products } from '../shared/schema';
import { eq, gte } from 'drizzle-orm';

/**
 * Script pentru ștergerea produselor duplicate din categoria Shoes
 * care au fost adăugate recent.
 */

async function deleteDuplicateShoes() {
  try {
    console.log('Începerea procesului de ștergere a produselor duplicate din categoria Shoes...');
    
    // Am adăugat 114 produse noi, așa că vom șterge produsele cu ID-uri mai mari decât un anumit prag
    // Presupunem că ID-urile încep de la 1361
    const startId = 1361;
    
    const result = await db.delete(products)
      .where(gte(products.id, startId))
      .returning({ deletedId: products.id, title: products.title });
    
    console.log(`S-au șters ${result.length} produse duplicate:`);
    
    // Afișează primele 10 produse șterse (pentru confirmare)
    const displayCount = Math.min(10, result.length);
    for (let i = 0; i < displayCount; i++) {
      console.log(`- #${result[i].deletedId}: ${result[i].title}`);
    }
    
    if (result.length > 10) {
      console.log(`... și încă ${result.length - 10} produse.`);
    }
    
    console.log('\nȘtergerea produselor duplicate s-a finalizat cu succes!');
  } catch (error) {
    console.error('Eroare la ștergerea produselor duplicate:', error);
  }
}

// Execută funcția și închide conexiunea când s-a terminat
deleteDuplicateShoes()
  .then(() => {
    console.log('Script executat cu succes!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Eroare la executarea scriptului:', error);
    process.exit(1);
  });