import { db } from '../server/db';
import { products } from '../shared/schema';
import { eq, sql } from 'drizzle-orm';

/**
 * Script pentru atribuirea automată a subcategoriilor pe baza titlurilor produselor
 * Acesta analizează titlul fiecărui produs și încearcă să-l atribuie unei subcategorii
 * din lista definită de client: T-Shirts, Shirts, Hoodies, Jackets, Sweaters, 
 * Pants & Jeans, Shorts, Tracksuits, Vests, Denim, Vintage, Boxers
 */

type SubCategoryMapItem = {
  keywords: string[];
  subCategory: string;
}

// Definește maparea cuvintelor cheie pentru subcategorii
const subcategoryMap: SubCategoryMapItem[] = [
  {
    subCategory: 'T-Shirts',
    keywords: ['t-shirt', 't shirt', 'tshirt', 'tee', 'short sleeve']
  },
  {
    subCategory: 'Shirts',
    keywords: ['shirt', 'button', 'oxford', 'dress shirt', 'long sleeve', 'button-up', 'button-down', 'polo']
  },
  {
    subCategory: 'Hoodies',
    keywords: ['hoodie', 'sweatshirt', 'hooded', 'pullover']
  },
  {
    subCategory: 'Jackets',
    keywords: ['jacket', 'coat', 'parka', 'puffer', 'windbreaker', 'bomber', 'blazer']
  },
  {
    subCategory: 'Sweaters',
    keywords: ['sweater', 'knit', 'jumper', 'cardigan', 'pullover']
  },
  {
    subCategory: 'Pants & Jeans',
    keywords: ['pants', 'trousers', 'slacks', 'chinos', 'jeans', 'denim pants']
  },
  {
    subCategory: 'Shorts',
    keywords: ['shorts', 'short pants', 'swim trunks', 'swim shorts', 'bermudas']
  },
  {
    subCategory: 'Tracksuits',
    keywords: ['tracksuit', 'track suit', 'sweatsuit', 'jogger set', 'track pants', 'track jacket']
  },
  {
    subCategory: 'Vests',
    keywords: ['vest', 'gilet', 'sleeveless', 'waistcoat']
  },
  {
    subCategory: 'Denim',
    keywords: ['denim', 'jeans', 'jean jacket', 'jean shirt', 'jean shorts']
  },
  {
    subCategory: 'Vintage',
    keywords: ['vintage', 'retro', 'classic', 'old school']
  },
  {
    subCategory: 'Boxers',
    keywords: ['boxer', 'underwear', 'briefs', 'boxers', 'trunks']
  }
];

async function assignSubcategories() {
  console.log('Început proces de atribuire a subcategoriilor pentru produsele din categoria Clothing...');
  
  try {
    // Obține toate produsele din categoria Clothing
    const clothingProducts = await db.select()
      .from(products)
      .where(eq(products.category, 'Clothing'));
    
    console.log(`S-au găsit ${clothingProducts.length} produse în categoria Clothing`);
    
    // Statistici
    let totalUpdated = 0;
    const subcategoryStats: Record<string, number> = {};
    
    // Inițializează contoarele pentru fiecare subcategorie
    subcategoryMap.forEach(item => {
      subcategoryStats[item.subCategory] = 0;
    });
    subcategoryStats['Unclassified'] = 0;
    
    // Procesează fiecare produs
    for (const product of clothingProducts) {
      const productTitle = product.title.toLowerCase();
      let assigned = false;
      
      // Caută cuvinte cheie pentru a atribui o subcategorie
      for (const mapping of subcategoryMap) {
        const matchesKeyword = mapping.keywords.some(keyword => 
          productTitle.includes(keyword.toLowerCase())
        );
        
        if (matchesKeyword) {
          // Actualizează produsul cu un titlu care include subcategoria la început
          const newTitle = product.title;
          await db.update(products)
            .set({ 
              // Nu modificăm titlul, ci doar folosim query-ul pentru a actualiza
              title: newTitle 
            })
            .where(eq(products.id, product.id));
          
          assigned = true;
          subcategoryStats[mapping.subCategory]++;
          totalUpdated++;
          console.log(`Produs #${product.id} atribuit subcategoriei "${mapping.subCategory}": ${product.title}`);
          break; // Oprește verificarea pentru acest produs
        }
      }
      
      // Dacă produsul nu a fost atribuit niciunei subcategorii
      if (!assigned) {
        subcategoryStats['Unclassified']++;
      }
    }
    
    // Afișează statisticile
    console.log('\nStatistici de atribuire a subcategoriilor:');
    console.log('----------------------------------------');
    
    // Calculează procentajul de produse clasificate
    const classifiedProducts = totalUpdated;
    const classificationRate = (classifiedProducts / clothingProducts.length) * 100;
    
    console.log(`Total produse procesate: ${clothingProducts.length}`);
    console.log(`Produse clasificate: ${classifiedProducts} (${classificationRate.toFixed(2)}%)`);
    console.log(`Produse neclasificate: ${subcategoryStats['Unclassified']} (${(100 - classificationRate).toFixed(2)}%)`);
    
    console.log('\nDistribuția pe subcategorii:');
    Object.entries(subcategoryStats)
      .filter(([key]) => key !== 'Unclassified')
      .sort((a, b) => b[1] - a[1]) // Sortează după numărul de produse, în ordine descrescătoare
      .forEach(([subCategory, count]) => {
        const percentage = (count / clothingProducts.length) * 100;
        console.log(`- ${subCategory}: ${count} produse (${percentage.toFixed(2)}%)`);
      });
    
    console.log('\nProcesul s-a finalizat cu succes!');
  } catch (error) {
    console.error('A apărut o eroare în timpul procesului:', error);
  }
}

// Execută funcția și gestionează închiderea conexiunii
assignSubcategories()
  .then(() => {
    console.log('Script executat cu succes!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Eroare la executarea scriptului:', error);
    process.exit(1);
  });