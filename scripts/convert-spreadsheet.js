#!/usr/bin/env node

/**
 * This script converts a CSV from Google Sheets that has columns:
 * Column A: Pictures
 * Column B: Product names
 * Column C: Links
 * Column D: Price in CNY
 * Column E: Price in USD
 * 
 * It transforms this to our required format for import:
 * title, price, image, buyUrl, viewUrl, category, featured
 * 
 * How to use:
 * 1. Export your Google Sheet as CSV and save it locally
 * 2. Run this script: node scripts/convert-spreadsheet.js path/to/your-file.csv
 * 3. It will create a new file called output.csv ready for import
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { createObjectCsvWriter } from 'csv-writer';

// Get the file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide a path to your CSV file.');
  console.error('Usage: node scripts/convert-spreadsheet.js path/to/your-file.csv');
  process.exit(1);
}

try {
  // Read the CSV file
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Parse CSV content
  const records = parse(fileContent, {
    columns: false,
    skip_empty_lines: true
  });
  
  console.log(`Found ${records.length} rows in the CSV file.`);
  
  // Define default values
  const defaultCategory = 'Clothing'; // Change this to your default category
  const defaultFeatured = false;
  
  // Transform data to the required format
  const transformedData = [];
  
  // Skip header row
  for (let i = 1; i < records.length; i++) {
    const row = records[i];
    
    // Only process rows that have at least a product name and price
    if (row[1] && (row[3] || row[4])) {
      const productName = row[1]; // Column B: Product names
      
      // Use USD price (column E) if available, otherwise use CNY price (column D)
      const price = row[4] ? row[4] : row[3];
      
      // For images, we need to handle this differently
      // In this version, we'll just note that images need separate handling
      const imageUrl = ''; // Need to handle images separately - see instructions
      
      // Column C: Links for buyUrl
      const buyUrl = row[2] || '';
      
      // Use the same link for viewUrl
      const viewUrl = buyUrl;
      
      transformedData.push({
        title: productName,
        price: price.toString(),
        image: imageUrl,
        buyUrl: buyUrl,
        viewUrl: viewUrl,
        category: defaultCategory,
        featured: defaultFeatured
      });
    }
  }
  
  console.log(`Transformed ${transformedData.length} valid products.`);
  
  // Write the transformed data to a new CSV file
  const csvWriter = createObjectCsvWriter({
    path: 'output.csv',
    header: [
      {id: 'title', title: 'title'},
      {id: 'price', title: 'price'},
      {id: 'image', title: 'image'},
      {id: 'buyUrl', title: 'buyUrl'},
      {id: 'viewUrl', title: 'viewUrl'},
      {id: 'category', title: 'category'},
      {id: 'featured', title: 'featured'}
    ]
  });
  
  csvWriter.writeRecords(transformedData)
    .then(() => {
      console.log('CSV file has been created successfully.');
      console.log('\nIMPORTANT: You need to manually add image URLs before importing!');
      console.log('Open output.csv in Excel or Google Sheets and add image URLs in the "image" column.');
      console.log('\nAfter adding image URLs, you can import this file at /admin/import');
    });
  
} catch (error) {
  console.error('Error processing the CSV file:', error.message);
}