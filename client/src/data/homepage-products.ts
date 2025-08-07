// Produse fixe pentru homepage - nu se vor schimba niciodată
import { Product } from "@shared/schema";

export const HOMEPAGE_FEATURED_PRODUCTS: Product[] = [
  {
    id: 4483,
    title: "Chanel",
    price: "45.95",
    priceUSD: "45.95",
    image: "/uploads/Wimage1072.webp.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509046817344&ref=571435",
    viewUrl: null,
    category: "Bags",
    subCategory: "Handbags",
    brand: "Chanel",
    featured: true,
    carousel: true
  },
  {
    id: 1727,
    title: "Air Force 1",
    price: "22.23",
    priceUSD: "22.23",
    image: "/uploads/Wimage1071.webp.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509046517344&ref=571435",
    viewUrl: null,
    category: "Shoes",
    subCategory: "Sneakers",
    brand: "Nike",
    featured: true,
    carousel: true
  },
  {
    id: 2297,
    title: "carhartt wallet",
    price: "8.95",
    priceUSD: "8.95",
    image: "/uploads/Wimage1073.webp.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509046617344&ref=571435",
    viewUrl: null,
    category: "Accessories",
    subCategory: "Wallets",
    brand: "Carhartt",
    featured: true,
    carousel: true
  },
  {
    id: 3421,
    title: "Louis Vuitton Bag",
    price: "89.50",
    priceUSD: "89.50",
    image: "/uploads/Wimage1074.webp.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509046717344&ref=571435",
    viewUrl: null,
    category: "Bags",
    subCategory: "Handbags",
    brand: "Louis Vuitton",
    featured: true,
    carousel: true
  },
  {
    id: 2156,
    title: "Jordan 4",
    price: "45.99",
    priceUSD: "45.99",
    image: "/uploads/Wimage1075.webp.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509046817344&ref=571435",
    viewUrl: null,
    category: "Shoes",
    subCategory: "Sneakers",
    brand: "Jordan",
    featured: true,
    carousel: true
  },
  {
    id: 3891,
    title: "Supreme Hoodie",
    price: "32.99",
    priceUSD: "32.99",
    image: "/uploads/Wimage1076.webp.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509046917344&ref=571435",
    viewUrl: null,
    category: "Clothing",
    subCategory: "Hoodies",
    brand: "Supreme",
    featured: true,
    carousel: true
  },
  {
    id: 4532,
    title: "Gucci Belt",
    price: "24.50",
    priceUSD: "24.50",
    image: "/uploads/Wimage1077.webp.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509047017344&ref=571435",
    viewUrl: null,
    category: "Accessories",
    subCategory: "Belts",
    brand: "Gucci",
    featured: true,
    carousel: true
  },
  {
    id: 1983,
    title: "Yeezy 350",
    price: "38.75",
    priceUSD: "38.75",
    image: "/uploads/Wimage1078.webp.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509047117344&ref=571435",
    viewUrl: null,
    category: "Shoes",
    subCategory: "Sneakers",
    brand: "Adidas",
    featured: true,
    carousel: true
  }
];

export const HOMEPAGE_CAROUSEL_PRODUCTS = HOMEPAGE_FEATURED_PRODUCTS.slice(0, 8);