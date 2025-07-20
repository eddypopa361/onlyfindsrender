
import { google } from 'googleapis';
import * as fs from 'fs';

async function main() {
  try {
    // Load credentials from environment variable
    const credentials = JSON.parse(process.env.GOOGLE_OAUTH_SECRETS!);
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1L6u-xU0VOXV0pLaQyXdfoQNleEUdMoTAnqSju22z32Q';
    const range = 'Sheet1!A2:E'; // Adjust range based on your data

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found.');
      return;
    }

    const products = rows.map(row => ({
      title: row[1] || '', // Column B: Product Name
      price: row[4] || '', // Column E: Price in USD
      image: row[0] || '', // Column A: Pictures
      buyUrl: row[2] || '', // Column C: Link
      viewUrl: row[2] || '', // Using same link for view
      category: 'Other', // Default category
      featured: false // Default not featured
    }));

    const csvContent = [
      'title,price,image,buyUrl,viewUrl,category,featured',
      ...products.map(p => 
        `"${p.title}","${p.price}","${p.image}","${p.buyUrl}","${p.viewUrl}","${p.category}","${p.featured}"`
      )
    ].join('\n');

    fs.writeFileSync('mock-products.csv', csvContent);
    console.log('CSV file created successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
