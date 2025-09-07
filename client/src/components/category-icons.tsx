import { resolveImage } from "@shared/image";

// Category and subcategory image mappings
export const imageByCategory: Record<string, string> = {
  "Trending Now": resolveImage("/uploads/Trending Now.webp"),
  "Latest Finds": resolveImage("/uploads/Latest Finds.webp"),
  "Shoes": resolveImage("/uploads/Shoes.webp"),
  "T-shirt and Shorts": resolveImage("/uploads/T-shirt and Shorts.webp"),
  "Hoodies and Pants": resolveImage("/uploads/Hoodies and Pants.webp"),
  "Coats and Jackets": resolveImage("/uploads/Coats and Jackets.webp"),
  "Accessories": resolveImage("/uploads/Bags.webp"), // Use Bags as generic accessories image
  "Electronic products": resolveImage("/uploads/Electronic Products.webp"),
  "Perfumes": resolveImage("/uploads/Perfumes.webp"),
  "Women": resolveImage("/uploads/Women.webp")
};

export const imageBySubcategory: Record<string, string> = {
  "Peaked Cap": resolveImage("/uploads/Peaked Hat.webp"),
  "Knitted Hat": resolveImage("/uploads/Knitted Hat.webp"),
  "Belts": resolveImage("/uploads/Belt.webp"),
  "Scarf": resolveImage("/uploads/Scarf.webp"),
  "Bags": resolveImage("/uploads/Bags.webp"),
  "Wallet": resolveImage("/uploads/Wallet.webp"),
  "Jewelry": resolveImage("/uploads/Jewerly.webp"), // Note: filename has typo but matches upload
  "Sunglasses": resolveImage("/uploads/Sunglasses.webp"),
  "Underwear and Socks": resolveImage("/uploads/Underwear and Socks.webp"),
  "Other": resolveImage("/uploads/Other.webp")
};