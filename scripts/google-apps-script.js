/**
 * IMPROVED PRODUCT DATA EXTRACTOR FOR GOOGLE SHEETS
 * 
 * This script:
 * 1. Extracts product names, prices, and hyperlinks from your sheet
 * 2. Automatically categorizes products based on their names
 * 3. Assigns professionally selected image URLs by category
 * 4. Handles thousands of products efficiently
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet containing:
 *    - Column B: Product Names
 *    - Column C: Links (clickable "LINK" text)
 *    - Column D: Price (CNY)
 *    - Column E: Price (USD)
 * 2. Go to Extensions > Apps Script
 * 3. Paste this entire code
 * 4. Save the project and return to your sheet
 * 5. Refresh the page
 * 6. Click on the new "Product Data" menu > "Extract Data with Category Images"
 */

// EDIT THIS SECTION: Default high-quality images for each category
// Replace these URLs with your own images if desired
const CATEGORY_IMAGES = {
  "Shoes": "https://ik.imagekit.io/demo/img/dunk.webp", 
  "Clothing": "https://ik.imagekit.io/demo/img/jacket.webp",
  "Accessories": "https://ik.imagekit.io/demo/img/glasses.webp",
  "Default": "https://ik.imagekit.io/demo/img/keychain.webp" // Fallback image
};

// EDIT THIS SECTION: Keywords to categorize products
// Add product-specific keywords to improve categorization accuracy
const CATEGORY_KEYWORDS = {
  "Shoes": ["shoes", "sneakers", "dunk", "jordan", "yeezy", "air force", "air max", "boot", "sandal", "travis", "nike", "adidas", "nb", "ugg", "puma", "reebok"],
  "Clothing": ["shirt", "tee", "hoodie", "jacket", "coat", "pants", "jeans", "sweater", "cardigan", "dress", "clothing", "shorts", "tshirt", "sweatshirt", "zip", "vest", "pullover", "sweat", "fleece", "bomber", "track", "suit", "polo", "jersey"],
  "Accessories": ["wallet", "bag", "purse", "backpack", "glasses", "sunglasses", "watch", "jewelry", "hat", "cap", "keychain", "holder", "scarf", "belt", "bracelet", "ring", "necklace", "earring", "card", "case", "pouch", "airpods", "headphones", "cover"]
};

/**
 * Detects product category based on keywords in product name
 */
function detectCategory(productName) {
  if (!productName) return "Default";
  
  // Convert to lowercase for case-insensitive matching
  const nameLower = productName.toLowerCase();
  
  // Check each category's keywords
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (nameLower.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  
  // Default category if no match found
  return "Clothing";
}

/**
 * Main function to extract and process product data
 */
function extractDataWithCategoryImages() {
  // Get active sheet and data
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getDataRange();
  var values = range.getValues();
  var richTextValues = range.getRichTextValues();
  
  // Create output sheet
  var outputSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Export_Ready");
  outputSheet.appendRow(["title", "price", "image", "buyUrl", "viewUrl", "category", "featured"]);
  
  // Count statistics
  var totalRows = 0;
  var processedRows = 0;
  var categoryCounts = {
    "Shoes": 0,
    "Clothing": 0,
    "Accessories": 0,
    "Default": 0
  };
  
  // Process each row (skip header)
  for (var i = 1; i < values.length; i++) {
    totalRows++;
    
    var row = values[i];
    var richTextRow = richTextValues[i];
    
    // Skip completely empty rows
    if (!row[1]) continue;
    
    // Extract product name (column B)
    var productName = row[1];
    
    // Extract price - prefer USD (column E), fallback to CNY (column D)
    var price = row[4] ? row[4] : row[3];
    if (!price) continue; // Skip if no price
    
    // Extract buy URL from hyperlink in column C
    var buyUrl = "";
    var richTextCell = richTextRow[2];
    if (richTextCell) {
      var runs = richTextCell.getRuns();
      for (var j = 0; j < runs.length; j++) {
        var linkUrl = runs[j].getLinkUrl();
        if (linkUrl) {
          buyUrl = linkUrl;
          break;
        }
      }
    }
    
    // Use same URL for view
    var viewUrl = buyUrl;
    if (!buyUrl) continue; // Skip if no URL
    
    // Detect category and assign image
    var category = detectCategory(productName);
    var imageUrl = CATEGORY_IMAGES[category] || CATEGORY_IMAGES["Default"];
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    
    // Mark some products as featured (top products)
    // More expensive products more likely to be featured
    var priceFactor = parseFloat(price) > 50 ? 0.2 : 0.05;
    var featured = (Math.random() < priceFactor);
    
    // Add to output sheet
    outputSheet.appendRow([
      productName,
      price,
      imageUrl,
      buyUrl,
      viewUrl,
      category,
      featured
    ]);
    
    processedRows++;
  }
  
  // Format output
  outputSheet.getRange(1, 1, 1, 7).setFontWeight('bold');
  outputSheet.autoResizeColumns(1, 7);
  
  // Show results
  var ui = SpreadsheetApp.getUi();
  ui.alert(
    "✅ Data Export Successful",
    `Processed ${processedRows} out of ${totalRows} rows.\n\n` +
    `Categories detected:\n` +
    `- Shoes: ${categoryCounts.Shoes || 0}\n` +
    `- Clothing: ${categoryCounts.Clothing || 0}\n` +
    `- Accessories: ${categoryCounts.Accessories || 0}\n\n` +
    `Next Steps:\n` +
    `1. Check the "Export_Ready" sheet\n` +
    `2. Download as CSV: File > Download > CSV\n` +
    `3. Upload to your site's /admin/import page`,
    ui.ButtonSet.OK
  );
}

// Add menu when sheet is opened
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Product Data")
    .addItem("Extract Data with Category Images", "extractDataWithCategoryImages")
    .addToUi();
}