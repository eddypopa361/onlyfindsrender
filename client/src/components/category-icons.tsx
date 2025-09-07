import { resolveImage } from "@shared/image";

// Category and subcategory image mappings
export const imageByCategory: Record<string, string> = {
  "Trending Now": resolveImage("https://wlfrsqctchxutyfrsoez.supabase.co/storage/v1/object/public/product-images/Trending Now.webp"),
  "Latest Finds": resolveImage("https://wlfrsqctchxutyfrsoez.supabase.co/storage/v1/object/public/product-images/Latest Finds.webp"),
  "Shoes": resolveImage("https://wlfrsqctchxutyfrsoez.supabase.co/storage/v1/object/public/product-images/Shoes.webp"),
  "T-shirt and Shorts": resolveImage("https://wlfrsqctchxutyfrsoez.supabase.co/storage/v1/object/public/product-images/T-shirt and Shorts.webp"),
  "Hoodies and Pants": resolveImage("https://wlfrsqctchxutyfrsoez.supabase.co/storage/v1/object/public/product-images/Hoodies and Pants.webp"),
  "Coats and Jackets": resolveImage("https://wlfrsqctchxutyfrsoez.supabase.co/storage/v1/object/public/product-images/Coats and Jackets.webp"),
  "Accessories": resolveImage("https://wlfrsqctchxutyfrsoez.supabase.co/storage/v1/object/public/product-images/Bags.webp"), // Use Bags as generic accessories image
  "Electronic products": resolveImage("https://wlfrsqctchxutyfrsoez.supabase.co/storage/v1/object/public/product-images/Electronic Products.webp"),
  "Perfumes": resolveImage("https://wlfrsqctchxutyfrsoez.supabase.co/storage/v1/object/public/product-images/Perfumes.webp"),
  "Women": resolveImage("https://wlfrsqctchxutyfrsoez.supabase.co/storage/v1/object/public/product-images/Women.webp")
};

export const imageBySubcategory: Record<string, string> = {
  "Peaked Cap": resolveImage("https://wlfrsqctchxutyfrsoez.supabase.co/storage/v1/object/public/product-images/Peaked Hat.webp"),
  "Knitted Hat": resolveImage("https://wlfrsqctchxutyfrsoez.supabase.co/storage/v1/object/public/product-images/Knitted Hat.webp"),
  "Belts": resolveImage("https://wlfrsqctchxutyfrsoez.supabase.co/storage/v1/object/public/product-images/Belt.webp"),
  "Scarf": resolveImage("https://wlfrsqctchxutyfrsoez.supabase.co/storage/v1/object/public/product-images/Scarf.webp"),
  "Bags": resolveImage("https://wlfrsqctchxutyfrsoez.supabase.co/storage/v1/object/public/product-images/Bags.webp"),
  "Wallet": resolveImage("https://wlfrsqctchxutyfrsoez.supabase.co/storage/v1/object/public/product-images/Wallet.webp"),
  "Jewelry": resolveImage("https://wlfrsqctchxutyfrsoez.supabase.co/storage/v1/object/public/product-images/Jewerly.webp"), // Note: filename has typo but matches upload
  "Sunglasses": resolveImage("https://wlfrsqctchxutyfrsoez.supabase.co/storage/v1/object/public/product-images/Sunglasses.webp"),
  "Underwear and Socks": resolveImage("https://wlfrsqctchxutyfrsoez.supabase.co/storage/v1/object/public/product-images/Underwear and Socks.webp"),
  "Other": resolveImage("https://wlfrsqctchxutyfrsoez.supabase.co/storage/v1/object/public/product-images/Other.webp")
};