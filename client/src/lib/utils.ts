import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ProductBrand } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Funcția pentru a detecta brand-ul din titlul produsului
export function detectBrand(title: string): ProductBrand {
  const uppercaseTitle = title.toUpperCase();
  
  // Lista de brand-uri și cuvinte cheie asociate
  const brandMap = {
    "NIKE": ["NIKE", "AIR FORCE", "AIR MAX", "DUNK", "JORDAN", "BLAZER", "SACAI", "CORTEZ"],
    "ADIDAS": ["ADIDAS", "YEEZY", "GAZELLE", "SAMBA", "SUPERSTAR", "STAN SMITH", "NMD", "ULTRABOOST"],
    "JORDAN": ["JORDAN", "AIR JORDAN", "JUMPMAN", "J1", "J3", "J4", "J5", "J11", "RETRO"],
    "YEEZY": ["YEEZY", "BOOST 350", "BOOST 700", "FOAM RUNNER", "SLIDE", "YZY", "BOOST 500"],
    "PUMA": ["PUMA", "SUEDE", "RS-X", "FUTURE RIDER"],
    "REEBOK": ["REEBOK", "CLUB C", "CLASSIC LEATHER", "QUESTION"],
    "NEW BALANCE": ["NEW BALANCE", "NB 990", "NB 991", "NB 992", "NB 993", "NB 550", "NB 997", "NB 327"],
    "CONVERSE": ["CONVERSE", "CHUCK TAYLOR", "ALL STAR", "ONE STAR", "CDG PLAY"],
    "VANS": ["VANS", "OLD SKOOL", "AUTHENTIC", "SLIP-ON", "SK8-HI"],
    "BALENCIAGA": ["BALENCIAGA", "TRIPLE S", "SPEED", "TRACK", "DEFENDER"],
    "GUCCI": ["GUCCI", "ACE", "RHYTON", "BASKET"],
    "LOUIS VUITTON": ["LOUIS VUITTON", "LV", "LOUIS V"],
    "DIOR": ["DIOR", "B27", "B23", "CD"],
    "OFF-WHITE": ["OFF-WHITE", "OFF WHITE", "VIRGIL", "THE TEN"],
    "SUPREME": ["SUPREME", "SUP"],
    "PRADA": ["PRADA", "LINEA ROSSA"],
    "VERSACE": ["VERSACE", "MEDUSA"],
    "VALENTINO": ["VALENTINO", "VLTN", "ROCKSTUD"],
    "NORTH FACE": ["NORTH FACE", "TNF"],
    "UNDER ARMOUR": ["UNDER ARMOUR", "UA CURRY", "UA PROJECT ROCK"]
  };
  
  // Verificăm fiecare brand pentru a vedea dacă titlul conține vreunul din cuvintele cheie
  for (const [brand, keywords] of Object.entries(brandMap)) {
    for (const keyword of keywords) {
      if (uppercaseTitle.includes(keyword)) {
        return brand as ProductBrand;
      }
    }
  }
  
  // Dacă nu am găsit niciun brand, returnăm "Other"
  return "Other";
}

// Funcție pentru a formata corect prețul
export function formatPrice(price: string): string {
  // Verificăm dacă prețul are deja simbolul $
  if (price.startsWith('$')) {
    return price;
  }
  return `$${price}`;
}