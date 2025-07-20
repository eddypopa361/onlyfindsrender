export interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  buyUrl: string;
  viewUrl: string;
  category: string;
  subCategory?: string | null;  // Subcategoria produsului (opțional)
  brand?: string | null;  // Brand-ul produsului (opțional)
  featured: boolean | null;
  carousel?: boolean | null;  // Pentru produsele afișate în carousel
}

export type ProductCategory = "All" | "Shoes" | "Clothing" | "Accessories" | "Bags & Backpacks" | "Reptronics + Watches" | "Jewelry" | "Opium Style" | "Room Decor & Misc Items";

// Subcategories for Clothing
export type ClothingSubCategory = "All" | "T-Shirts" | "Shirts" | "Hoodies" | "Jackets" | "Sweaters" | "Pants & Jeans" | "Shorts" | "Tracksuits" | "Boxers" | "Jerseys" | "Socks" | "Women" | "Kids";

// Subcategories for Accessories
export type AccessoriesSubCategory = "All" | "Eyewear" | "Wallets & Small Accessories" | "Fashion Accessories";

// Brand-uri cunoscute pentru filtrare
export type ProductBrand = "All" | "33Trente" | "4Tune" | "ADIDAS" | "ADWYSD" | "AIME LEON DORE" | "Air Jordan" | "AKIMBO" | 
  "ALEXANDER MCQUEEN" | "AMI" | "AMIRI" | "ANTISOCIAL CLUB" | "Arc'teryx" | "ASICS" | "ASTROWORLD" | 
  "BALENCIAGA" | "BAPE" | "BIRKINSTOCKS" | "BROKEN PLANET" | "Burberry" | "C.P.COMPANY" | 
  "CACTUS JACK" | "Calvin Klein" | "Canada Goose" | "Carhartt" | "Carsicko" | "Casablanca" | 
  "CHANEL" | "CHICAGO BULLS" | "Chrome Hearts" | "Cole Buxton" | "Comme des Garçons" | 
  "CONVERSE" | "Corteiz" | "CPFM" | "Crocodile" | "DENIM TEARS" | "Diesel" | "Dior" | 
  "DREW HOUSE" | "Dsquared" | "EMPORIO ARMANI EA7" | "ENFANTS RICHES DÉPRIMÉS" | 
  "Eric Emanuel" | "EVISU" | "Fear of God Essentials" | "Fendi" | "Gallery Dept" | 
  "GANNI" | "GUCCI" | "HELLSTAR" | "House of Errors" | "IDLT" | "KAPITAL" | "Kanye" | 
  "Kaws" | "Kenzo Paris" | "KOLON SPORT" | "LACOSTE" | "LANVIN" | "LORO PIANA" | 
  "LOUIS VUITTON" | "Maison Margiela" | "MAISON MIHARA YASUHIRO" | "MLB" | "Moncler" | 
  "Moose Knuckles" | "MYSTERY" | "NBA" | "Needles" | "NEW BALANCE" | "Nike" | "Oakley" | 
  "OFF-WHITE" | "Palm Angels" | "Patagonia" | "PLAYBOI CARTI" | "PRADA" | "RAF SIMONS" | 
  "Ralph Lauren" | "RANBO" | "Represent" | "REVENGE" | "Rhude" | "RICK OWENS" | "SAINT LAURENT" | 
  "SP5DER" | "STONE ISLAND" | "STUSSY" | "SUBHUMAN" | "SUPREME" | "SYNA WORLD" | 
  "The North Face" | "Thom Browne" | "TIMBERLANDS" | "Trapstar" | "Travis Scott" | "UGG" | 
  "Under Armour" | "UNDERCOVER" | "VETEMENTS" | "VLONE" | "Vuja De" | "Y2" | "YEEZY" | "Other";
