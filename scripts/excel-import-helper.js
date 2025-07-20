#!/usr/bin/env node

import XLSX from 'xlsx';
import fs from 'fs';
import promptSync from 'prompt-sync';
import path from 'path';

const prompt = promptSync({ sigint: true });

console.log('TJREPS Excel Import Helper');
console.log('==========================');
console.log('This script will help you extract data from your Excel file and prepare it for import.\n');

// Get Excel file path
let excelPath = prompt('Enter the path to your Excel file: ');
while (!fs.existsSync(excelPath)) {
  console.log('File not found. Please enter a valid path.');
  excelPath = prompt('Enter the path to your Excel file: ');
}

// Read the Excel file
console.log(`\nReading Excel file: ${excelPath}`);
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`Found ${data.length} rows of data in the first sheet.`);

// Ask which columns contain which data
console.log('\nAvailable columns:');
if (data.length > 0) {
  const columnNames = Object.keys(data[0]);
  columnNames.forEach((col, index) => {
    console.log(`${index + 1}. ${col}`);
  });

  const mapColumn = (description, required = true) => {
    while (true) {
      const input = prompt(`Which column contains ${description}? (Enter number or column name): `);
      if (!required && (input === '' || input.toLowerCase() === 'none')) {
        return null;
      }
      if (/^\d+$/.test(input) && parseInt(input) >= 1 && parseInt(input) <= columnNames.length) {
        return columnNames[parseInt(input) - 1];
      }
      if (columnNames.includes(input)) {
        return input;
      }
      console.log('Invalid column. Please try again.');
    }
  };

  const titleCol = mapColumn('product title/name');
  const priceCol = mapColumn('price');
  const categoryCol = mapColumn('category (e.g., Shoes, Clothing, Accessories)');
  const buyUrlCol = mapColumn('buy URL/link', false);
  const viewUrlCol = mapColumn('view URL/link', false);
  
  // Collect default values for missing fields
  let defaultBuyUrl = '';
  let defaultViewUrl = '';
  
  if (!buyUrlCol) {
    defaultBuyUrl = prompt('Enter a default buy URL (used when not provided): ');
  }
  
  if (!viewUrlCol) {
    defaultViewUrl = prompt('Enter a default view URL (used when not provided): ');
  }

  // Process each row
  const processedData = [];
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    
    console.log(`\n--- Processing Product ${i + 1}/${data.length} ---`);
    console.log(`Title: ${row[titleCol]}`);
    console.log(`Price: ${row[priceCol]}`);
    console.log(`Category: ${row[categoryCol]}`);
    
    // Get image URL
    const imageUrl = prompt('Enter image URL for this product: ');
    
    // Get URLs if not already mapped
    let buyUrl = buyUrlCol ? row[buyUrlCol] : defaultBuyUrl;
    let viewUrl = viewUrlCol ? row[viewUrlCol] : defaultViewUrl;
    
    // Allow overriding URLs
    if (buyUrlCol) {
      const buyUrlOverride = prompt(`Buy URL [${buyUrl}] (press Enter to keep, or type new URL): `);
      if (buyUrlOverride !== '') {
        buyUrl = buyUrlOverride;
      }
    }
    
    if (viewUrlCol) {
      const viewUrlOverride = prompt(`View URL [${viewUrl}] (press Enter to keep, or type new URL): `);
      if (viewUrlOverride !== '') {
        viewUrl = viewUrlOverride;
      }
    }
    
    // Ask if featured
    const featuredInput = prompt('Is this a featured product? (y/n): ').toLowerCase();
    const featured = featuredInput === 'y' || featuredInput === 'yes';
    
    // Add to processed data
    processedData.push({
      title: row[titleCol],
      price: row[priceCol].toString(),
      image: imageUrl,
      buyUrl: buyUrl,
      viewUrl: viewUrl,
      category: row[categoryCol],
      featured: featured
    });
    
    // Ask if user wants to continue
    if (i < data.length - 1) {
      const continueInput = prompt('Continue with next product? (y/n): ').toLowerCase();
      if (continueInput !== 'y' && continueInput !== 'yes') {
        console.log(`Stopping after ${i + 1} products.`);
        break;
      }
    }
  }

  // Save as CSV
  const csvPath = path.join(path.dirname(excelPath), 'products-import.csv');
  const headers = ['title', 'price', 'image', 'buyUrl', 'viewUrl', 'category', 'featured'];
  
  const csvData = [
    headers.join(','),
    ...processedData.map(row => {
      return headers.map(header => {
        // Escape commas and quotes in CSV
        let value = row[header];
        if (header === 'featured') {
          value = value ? 'true' : 'false';
        }
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',');
    })
  ].join('\n');
  
  fs.writeFileSync(csvPath, csvData);
  console.log(`\nSaved ${processedData.length} products to ${csvPath}`);
  
  // Save as JSON for backup
  const jsonPath = path.join(path.dirname(excelPath), 'products-import.json');
  fs.writeFileSync(jsonPath, JSON.stringify(processedData, null, 2));
  console.log(`Also saved as JSON to ${jsonPath} for backup`);
  
  console.log('\nNext steps:');
  console.log('1. Open the CSV file to check that everything looks correct');
  console.log('2. Go to your website\'s /admin/import page');
  console.log('3. Upload the CSV file to import your products');
  
} else {
  console.log('No data found in the Excel file. Please check the file and try again.');
}