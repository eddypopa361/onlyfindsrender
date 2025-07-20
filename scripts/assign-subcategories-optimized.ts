import { db } from '../server/db';
import { products } from '../shared/schema';
import { sql } from 'drizzle-orm';

/**
 * Versiune optimizată a scriptului pentru atribuirea subcategoriilor
 * Folosește o singură interogare pentru fiecare subcategorie
 */

async function assignSubcategoriesOptimized() {
  console.log('Început proces optimizat de atribuire a subcategoriilor...');

  // Pentru fiecare subcategorie, definim un array de cuvinte cheie
  const subcategories = [
    { 
      name: 'T-Shirts', 
      keywords: ['t-shirt', 'tshirt', 't shirt', 'tee', 'tees', 'shirt tee'] 
    },
    { 
      name: 'Shirts', 
      keywords: ['shirt', 'long sleeve', 'button', 'button up', 'button down', 'flannel', 'polo'] 
    },
    { 
      name: 'Hoodies', 
      keywords: ['hoodie', 'hooded', 'pullover', 'sweatshirt'] 
    },
    { 
      name: 'Jackets', 
      keywords: ['jacket', 'coat', 'parka', 'outerwear', 'bomber', 'puffer', 'windbreaker', 'varsity'] 
    },
    { 
      name: 'Sweaters', 
      keywords: ['sweater', 'knit', 'jumper', 'crewneck', 'crew neck', 'cardigan', 'knitwear'] 
    },
    { 
      name: 'Pants & Jeans', 
      keywords: ['pants', 'pant', 'trousers', 'jeans', 'cargos', 'cargo', 'slacks', 'joggers'] 
    },
    { 
      name: 'Shorts', 
      keywords: ['shorts', 'short'] 
    },
    { 
      name: 'Tracksuits', 
      keywords: ['tracksuit', 'track suit', 'sweatsuit', 'sweat suit', 'two piece', 'set', 'trackpants'] 
    },
    { 
      name: 'Vests', 
      keywords: ['vest', 'gilet', 'sleeveless'] 
    },
    { 
      name: 'Denim', 
      keywords: ['denim', 'jean jacket', 'jean vest'] 
    },
    { 
      name: 'Vintage', 
      keywords: ['vintage', 'retro', 'old school'] 
    },
    { 
      name: 'Boxers', 
      keywords: ['boxers', 'briefs', 'underwear', 'underpants', 'boxer shorts'] 
    }
  ];

  let totalAssigned = 0;
  
  // Facem clasificarea pentru fiecare subcategorie folosind OR combinat pentru toate cuvintele cheie
  for (const { name, keywords } of subcategories) {
    try {
      // Construim condiția OR cu toate cuvintele cheie
      const conditionsSQL = keywords.map(keyword => 
        `LOWER(title) LIKE '%${keyword.toLowerCase()}%'`
      ).join(' OR ');
      
      // Executăm query-ul
      const result = await db.execute(
        sql`UPDATE products 
            SET sub_category = ${name} 
            WHERE category = 'Clothing' 
            AND sub_category IS NULL 
            AND (${sql.raw(conditionsSQL)})`
      );
      
      console.log(`S-au clasificat ${result.rowCount || 0} produse în subcategoria "${name}"`);
      totalAssigned += Number(result.rowCount || 0);
    } catch (error) {
      console.error(`Eroare la clasificarea subcategoriei "${name}":`, error);
    }
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
  
  console.log(`\nRezultat final:`);
  console.log(`Produse clasificate în această rulare: ${totalAssigned}`);
  console.log(`Total produse clasificate: ${classifiedCount} din ${totalCount} (${Math.round(classifiedCount/totalCount*100)}%).`);
  console.log(`${totalCount - classifiedCount} produse nu au putut fi clasificate automat.`);
}

// Execută funcția și gestionează închiderea conexiunii
assignSubcategoriesOptimized()
  .then(() => {
    console.log('\nScript executat cu succes!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Eroare la executarea scriptului:', error);
    process.exit(1);
  });