import { db } from '../server/db';
import { products } from '../shared/schema';
import { sql } from 'drizzle-orm';

/**
 * Versiune optimizată a scriptului pentru atribuirea subcategoriilor
 * Folosește UPDATE-uri în lot pentru eficiență maximă
 */

async function assignSubcategoriesFast() {
  console.log('Început proces optimizat de atribuire a subcategoriilor...');

  // Definim subcategoriile și pattern-urile lor
  const subcategories = [
    { name: 'T-Shirts', pattern: '%(t-shirt|tshirt|t shirt|tee|tees)%' },
    { name: 'Shirts', pattern: '%(shirt|long sleeve|button|button up|button down|flannel|polo)%' },
    { name: 'Hoodies', pattern: '%(hoodie|hooded|pullover|sweatshirt)%' },
    { name: 'Jackets', pattern: '%(jacket|coat|parka|outerwear|bomber|puffer|windbreaker|varsity)%' },
    { name: 'Sweaters', pattern: '%(sweater|knit|jumper|crewneck|crew neck|cardigan|knitwear)%' },
    { name: 'Pants & Jeans', pattern: '%(pants|pant|trousers|jeans|cargos|cargo|slacks|joggers)%' },
    { name: 'Shorts', pattern: '%(shorts|short)%' },
    { name: 'Tracksuits', pattern: '%(tracksuit|track suit|sweatsuit|sweat suit|two piece|set|trackpants)%' },
    { name: 'Vests', pattern: '%(vest|gilet|sleeveless)%' },
    { name: 'Denim', pattern: '%(denim|jean|jeans)%' },
    { name: 'Vintage', pattern: '%(vintage|retro|old school)%' },
    { name: 'Boxers', pattern: '%(boxers|briefs|underwear|underpants|boxer shorts)%' }
  ];

  // Actualizează în lot pentru fiecare subcategorie
  for (const { name, pattern } of subcategories) {
    const result = await db.execute(
      sql`UPDATE products SET sub_category = ${name} 
          WHERE category = 'Clothing' 
          AND sub_category IS NULL 
          AND LOWER(title) LIKE ${pattern}`
    );
    
    console.log(`S-au clasificat ${result.rowCount || 0} produse în subcategoria "${name}"`);
  }

  // Verificare număr produse clasificate vs. neclasificate
  const [classifiedResult] = await db.select({ count: sql<number>`count(*)` })
    .from(products)
    .where(sql`category = 'Clothing' AND sub_category IS NOT NULL`);
  
  const [totalResult] = await db.select({ count: sql<number>`count(*)` })
    .from(products)
    .where(sql`category = 'Clothing'`);
  
  const classifiedCount = Number(classifiedResult?.count || 0);
  const totalCount = Number(totalResult?.count || 0);
  
  console.log(`Proces finalizat!`);
  console.log(`S-au clasificat ${classifiedCount} din ${totalCount} produse (${Math.round(classifiedCount/totalCount*100)}%).`);
  console.log(`${totalCount - classifiedCount} produse nu au putut fi clasificate automat.`);
}

// Execută funcția și gestionează închiderea conexiunii
assignSubcategoriesFast()
  .then(() => {
    console.log('Script executat cu succes!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Eroare la executarea scriptului:', error);
    process.exit(1);
  });