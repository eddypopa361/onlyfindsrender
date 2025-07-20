#!/usr/bin/env node

/**
 * Script pentru extragerea datelor de produse din Excel, inclusiv numele imaginilor
 * 
 * Acest script:
 * 1. Citește un fișier Excel (.xlsx)
 * 2. Extrage numele produselor, preturile și numele imaginilor
 * 3. Creează un CSV gata pentru importare
 * 
 * Mod de utilizare:
 * node scripts/extract-excel-images.js path/to/your-excel-file.xlsx
 */

import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';

// Verifică argumentele liniei de comandă
const excelFilePath = process.argv[2];
if (!excelFilePath) {
  console.error('Te rog să specifici calea către fișierul Excel.');
  console.error('Exemplu: node scripts/extract-excel-images.js ./data/produse.xlsx');
  process.exit(1);
}

// Verifică dacă fișierul există
if (!fs.existsSync(excelFilePath)) {
  console.error(`Fișierul ${excelFilePath} nu a fost găsit.`);
  process.exit(1);
}

// Funcție pentru detectarea categoriei
function detectCategory(productName) {
  if (!productName) return "Default";
  
  const nameLower = productName.toLowerCase();
  
  // Lista de cuvinte cheie pentru a detecta categoria
  const keywords = {
    "Shoes": ["shoes", "sneakers", "dunk", "jordan", "yeezy", "air force", "boot", "adidas", "nike"],
    "Clothing": ["shirt", "tee", "hoodie", "jacket", "coat", "pants", "jeans", "sweater", "dress"],
    "Accessories": ["wallet", "bag", "purse", "backpack", "glasses", "watch", "hat", "cap", "keychain"]
  };
  
  for (const [category, categoryKeywords] of Object.entries(keywords)) {
    for (const keyword of categoryKeywords) {
      if (nameLower.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  
  return "Clothing"; // Categoria implicită
}

// Citește fișierul Excel
console.log(`Citire fișier Excel: ${excelFilePath}`);
const workbook = XLSX.readFile(excelFilePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Extrage informațiile din worksheet
console.log('Extragere date produse și imagini...');

// Conversia la JSON pentru a putea procesa ușor
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

// Pregătim datele pentru CSV
const products = [];
const imageNames = new Set(); // Pentru a ține evidența numelor imaginilor

// Procesare rânduri (sărim header-ul)
for (let i = 1; i < jsonData.length; i++) {
  const row = jsonData[i];
  
  // Verifică dacă rândul are suficiente date
  if (!row || row.length < 2) continue;
  
  // Citim datele din celule
  const productName = row[1]; // Coloana B: Nume produs
  if (!productName) continue; // Sărim rândurile fără nume produs
  
  // Preț în USD (coloana E) sau CNY (coloana D) dacă USD lipsește
  const price = row[4] ? row[4] : row[3];
  if (!price) continue; // Sărim rândurile fără preț
  
  // Extragem URL-ul pentru cumpărare din coloana C
  // Notă: Nu putem extrage hyperlink-urile aici, ar trebui să folosești Google Apps Script
  const buyUrl = row[2] || "";
  const viewUrl = buyUrl; // Folosim același URL pentru vizualizare
  
  // Detectăm categoria pe baza numelui produsului
  const category = detectCategory(productName);
  
  // Extragem numele imaginii din proprietățile celulei (dacă există)
  // În Excel dezarhivat, celula A ar trebui să conțină referințe la imagini
  let imageName = "";
  
  // Verificăm dacă coloana A conține ceva (posibil o referință la imagine)
  if (row[0]) {
    // Încercăm să extragem doar numele fișierului
    // În Excel, imaginile pot apărea ca "image4.png" sau alte formate
    const cellValue = row[0].toString();
    
    // Verificăm dacă conține extensii de imagine
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    for (const ext of imageExtensions) {
      if (cellValue.toLowerCase().includes(ext)) {
        // Extrage numele imaginii folosind regex
        const match = cellValue.match(/[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+/);
        if (match) {
          imageName = match[0];
          imageNames.add(imageName); // Adăugăm la set pentru raportare
          break;
        }
      }
    }
    
    // Dacă nu am găsit extensie, dar celula conține "image" sau "img"
    if (!imageName && (cellValue.toLowerCase().includes('image') || cellValue.toLowerCase().includes('img'))) {
      const match = cellValue.match(/image[0-9]+|img[0-9]+/i);
      if (match) {
        imageName = `${match[0]}.png`; // Presupunem extensia .png
        imageNames.add(imageName);
      }
    }
  }
  
  // Markăm unele produse ca featured (cele mai scumpe)
  const priceValue = parseFloat(price);
  const featured = priceValue > 50; // Produsele de peste 50$ vor fi featured
  
  // Adăugăm produsul la lista noastră
  products.push({
    title: productName,
    price: price.toString(),
    image: imageName, // Numele imaginii pentru importul automat
    buyUrl: buyUrl,
    viewUrl: viewUrl,
    category: category,
    featured: featured
  });
}

// Creăm directorul pentru output dacă nu există
const outputDir = path.dirname(excelFilePath);
const csvPath = path.join(outputDir, 'products-for-import.csv');

// Scriem datele în CSV
const csvWriter = createObjectCsvWriter({
  path: csvPath,
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

csvWriter.writeRecords(products)
  .then(() => {
    console.log(`\n✅ Fișierul CSV a fost creat cu succes: ${csvPath}`);
    console.log(`\nS-au procesat ${products.length} produse.`);
    console.log(`S-au identificat ${imageNames.size} nume de imagini.`);
    
    console.log('\nPași următori:');
    console.log('1. Verifică fișierul CSV generat pentru a te asigura că datele sunt corecte');
    console.log('2. Extrage toate imaginile din fișierul Excel dezarhivat într-un folder');
    console.log('3. Încarcă atât fișierul CSV, cât și folderul cu imagini pe site-ul tău');
  })
  .catch(error => {
    console.error('Eroare la scrierea fișierului CSV:', error);
  });