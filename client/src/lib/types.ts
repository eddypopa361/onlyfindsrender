// Updated types for new taxonomy and pricing structure

export type MainCategory =
  | "Trending Now"
  | "Latest Finds"
  | "Shoes"
  | "T-shirt and Shorts"
  | "Hoodies and Pants"
  | "Coats and Jackets"
  | "Accessories"
  | "Electronic products"
  | "Perfumes"
  | "Women";

export type AccessoriesSubcategory =
  | "Peaked Cap"
  | "Knitted Hat"
  | "Belts"
  | "Scarf"
  | "Bags"
  | "Wallet"
  | "Jewelry"
  | "Sunglasses"
  | "Underwear and Socks"
  | "Other";

// Legacy types for backward compatibility
export type ProductCategory = MainCategory | "All";
export type ClothingSubCategory = "All";

export interface Product {
  id: number;
  title: string;
  price: string; // legacy field
  priceUSD?: string; // new field from CSV
  image: string;
  buyUrl: string;
  category: MainCategory;
  subCategory?: string;
  featured?: boolean;
  carousel?: boolean;
}

// CSV import helper functions
export function parsePriceUSD(v: string): number {
  const s = (v ?? "").toString().trim().replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

export function normalizeCSVRow(row: Record<string, string>) {
  const priceNum = parsePriceUSD(row.priceUSD || "0");
  return {
    title: row.title?.trim() || "",
    priceUSD: priceNum.toString(),
    price: `$${priceNum.toFixed(2)}`, // legacy format
    image: row.image?.trim() || "",
    buyUrl: row.buyUrl?.trim() || "",
    category: row.category?.trim() as MainCategory,
    subCategory: row.subcategory?.trim() || undefined,
    featured: String(row.featured || "false").toLowerCase() === "true",
    carousel: false, // default value
  };
}