import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';

// Create mock products data
const generateMockProducts = (count) => {
  const products = [];
  const categories = ["Shoes", "Clothing", "Accessories"];
  const baseProducts = [
    {
      title: "Off White Glasses",
      price: "9.67",
      image: "https://ik.imagekit.io/demo/img/glasses.webp",
      buyUrl: "https://cnfans.com/product/?id=1001",
      viewUrl: "https://cnfans.com/view/?id=1001",
      category: "Accessories",
      featured: true
    },
    {
      title: "Kaws Keychain",
      price: "2.84",
      image: "https://ik.imagekit.io/demo/img/keychain.webp", 
      buyUrl: "https://cnfans.com/product/?id=1002",
      viewUrl: "https://cnfans.com/view/?id=1002",
      category: "Accessories",
      featured: true
    },
    {
      title: "Amiri Jacket",
      price: "114.78",
      image: "https://ik.imagekit.io/demo/img/jacket.webp",
      buyUrl: "https://cnfans.com/product/?id=1003",
      viewUrl: "https://cnfans.com/view/?id=1003",
      category: "Clothing",
      featured: true
    },
    {
      title: "Nike Dunk Low",
      price: "32.50",
      image: "https://ik.imagekit.io/demo/img/dunk.webp",
      buyUrl: "https://cnfans.com/product/?id=1004",
      viewUrl: "https://cnfans.com/view/?id=1004",
      category: "Shoes",
      featured: false
    }
  ];

  for (let i = 0; i < count; i++) {
    const baseProduct = baseProducts[i % baseProducts.length];
    const colorways = Math.floor(Math.random() * 12) + 2;
    products.push({
      title: `${baseProduct.title} (${colorways} Colorways) - Variant ${i+1}`,
      price: (parseFloat(baseProduct.price) * (0.8 + Math.random() * 0.4)).toFixed(2),
      image: baseProduct.image,
      buyUrl: `${baseProduct.buyUrl}&variant=${i+1}`,
      viewUrl: `${baseProduct.viewUrl}&variant=${i+1}`,
      category: categories[i % categories.length],
      featured: i < 8 // First 8 are featured
    });
  }

  return products;
};

// Generate 100 mock products
const mockProducts = generateMockProducts(100);

// Define the CSV Writer
const csvWriter = createObjectCsvWriter({
  path: './mock-products.csv',
  header: [
    { id: 'title', title: 'title' },
    { id: 'price', title: 'price' },
    { id: 'image', title: 'image' },
    { id: 'buyUrl', title: 'buyUrl' },
    { id: 'viewUrl', title: 'viewUrl' },
    { id: 'category', title: 'category' },
    { id: 'featured', title: 'featured' }
  ]
});

// Format the products data
const records = mockProducts.map(product => ({
  ...product,
  featured: product.featured ? 'true' : 'false'
}));

// Write to CSV
csvWriter.writeRecords(records)
  .then(() => {
    console.log('Created mock-products.csv with 100 sample products');
    console.log('You can import this file using the admin import tool at /admin/import');
  });