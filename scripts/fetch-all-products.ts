
import { db } from '../server/db';
import { products } from '../shared/schema';

async function fetchAllProducts() {
  try {
    const allProducts = await db.select().from(products);
    console.log(`Found ${allProducts.length} products`);
    console.log(JSON.stringify(allProducts, null, 2));
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    process.exit();
  }
}

fetchAllProducts();
