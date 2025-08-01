import { 
  Flame, 
  Clock, 
  Footprints, 
  Shirt, 
  Layers, 
  Shield, 
  Backpack, 
  Cpu, 
  Sparkles, 
  Crown,
  // Subcategory icons
  HardHat,
  Package2,
  Circle,
  Wind,
  ShoppingBag,
  Wallet,
  Gem,
  Glasses,
  Package,
  Tag
} from "lucide-react";

export const iconByCategory: Record<string, any> = {
  "Trending Now": Flame,
  "Latest Finds": Clock,
  "Shoes": Footprints,
  "T-shirt and Shorts": Shirt,
  "Hoodies and Pants": Layers,
  "Coats and Jackets": Shield,
  "Accessories": Backpack,
  "Electronic Products": Cpu,
  "Perfumes": Sparkles,
  "Womans": Crown
};

export const iconBySubcategory: Record<string, any> = {
  "Peaked Cap": HardHat,
  "Knitted Hat": Package2,
  "Belt": Circle,
  "Scarf": Wind,
  "Bags": ShoppingBag,
  "Wallet": Wallet,
  "Jewelry": Gem,
  "Sunglasses": Glasses,
  "Underwear and Socks": Package,
  "Other": Tag
};