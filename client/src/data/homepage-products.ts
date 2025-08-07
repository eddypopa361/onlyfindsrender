// Produse fixe pentru homepage - nu se vor schimba niciodată
import { Product } from "@shared/schema";

export const HOMEPAGE_FEATURED_PRODUCTS: Product[] = [
  {
    id: 4483,
    title: "Chanel",
    price: "45.95",
    priceUSD: "45.95",
    image: "https://img1.wegobuy.com/images/app/2024/12/17/3509046817344_0_8_4.jpg?spm=api-img.8080851",
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
    image: "https://img1.wegobuy.com/images/app/2024/12/17/3509046517344_0_10_4.jpg?spm=api-img.8080851",
    buyUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509046517344&ref=571435",
    viewUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509046517344&ref=571435",
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
    image: "https://img1.wegobuy.com/images/app/2024/12/17/3509046617344_0_10_4.jpg?spm=api-img.8080851",
    buyUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509046617344&ref=571435",
    viewUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509046617344&ref=571435",
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
    image: "https://img1.wegobuy.com/images/app/2024/12/17/3509046717344_0_8_4.jpg?spm=api-img.8080851",
    buyUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509046717344&ref=571435",
    viewUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509046717344&ref=571435",
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
    image: "https://img1.wegobuy.com/images/app/2024/12/17/3509046817344_1_8_4.jpg?spm=api-img.8080851",
    buyUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509046817344&ref=571435",
    viewUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509046817344&ref=571435",
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
    image: "https://img1.wegobuy.com/images/app/2024/12/17/3509046917344_0_10_4.jpg?spm=api-img.8080851",
    buyUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509046917344&ref=571435",
    viewUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509046917344&ref=571435",
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
    image: "https://img1.wegobuy.com/images/app/2024/12/17/3509047017344_0_8_4.jpg?spm=api-img.8080851",
    buyUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509047017344&ref=571435",
    viewUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509047017344&ref=571435",
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
    image: "https://img1.wegobuy.com/images/app/2024/12/17/3509047117344_0_10_4.jpg?spm=api-img.8080851",
    buyUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509047117344&ref=571435",
    viewUrl: "https://cnfans.com/product/?shop_type=yupoo&id=P202412173509047117344&ref=571435",
    category: "Shoes",
    subCategory: "Sneakers",
    brand: "Adidas",
    featured: true,
    carousel: true
  }
];

export const HOMEPAGE_CAROUSEL_PRODUCTS = HOMEPAGE_FEATURED_PRODUCTS.slice(0, 8);