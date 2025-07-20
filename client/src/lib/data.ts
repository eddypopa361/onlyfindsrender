import { Product } from "./types";

export const products: Product[] = [
  {
    id: 1,
    title: "Off White Glasses (7 Colorways)",
    price: "9.67",
    image: "https://ik.imagekit.io/demo/img/glasses.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=weidian&id=7266238919&ref=67166",
    viewUrl: "https://2024.cnfans.com/product/?shop_type=weidian&id=7266238919&ref=67166",
    category: "Accessories",
    featured: true
  },
  {
    id: 2,
    title: "Kaws Keychain (16 Colorways)",
    price: "2.84",
    image: "https://ik.imagekit.io/demo/img/keychain.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=weidian&id=7262438672&ref=67166",
    viewUrl: "https://2024.cnfans.com/product/?shop_type=weidian&id=7262438672&ref=67166",
    category: "Accessories",
    featured: true
  },
  {
    id: 3,
    title: "Amiri MA1",
    price: "114.78",
    image: "https://ik.imagekit.io/demo/img/jacket.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=weidian&id=7266072843&ref=67166",
    viewUrl: "https://2024.cnfans.com/product/?shop_type=weidian&id=7266072843&ref=67166",
    category: "Clothing",
    featured: true
  },
  {
    id: 4,
    title: "Calvin Klein Boxers (5 Colorways)",
    price: "9.40",
    image: "https://ik.imagekit.io/demo/img/underwear.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=weidian&id=7262359362&ref=67166",
    viewUrl: "https://2024.cnfans.com/product/?shop_type=weidian&id=7262359362&ref=67166",
    category: "Clothing",
    featured: true
  },
  {
    id: 5,
    title: "Yeezy Slides (12 Colorways)",
    price: "24.18",
    image: "https://ik.imagekit.io/demo/img/slides.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=weidian&id=7267005432&ref=67166",
    viewUrl: "https://2024.cnfans.com/product/?shop_type=weidian&id=7267005432&ref=67166",
    category: "Shoes",
    featured: true
  },
  {
    id: 6,
    title: "Air Force 1 (20 Styles)",
    price: "20.00",
    image: "https://ik.imagekit.io/demo/img/airforce.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=weidian&id=7231813766&ref=67166",
    viewUrl: "https://2024.cnfans.com/product/?shop_type=weidian&id=7231813766&ref=67166",
    category: "Shoes",
    featured: true
  },
  {
    id: 7,
    title: "Nike Dunk Low (12 Colorways)",
    price: "32.50",
    image: "https://ik.imagekit.io/demo/img/dunk.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=weidian&id=7231813766&ref=67166",
    viewUrl: "https://2024.cnfans.com/product/?shop_type=weidian&id=7231813766&ref=67166",
    category: "Shoes",
    featured: false
  },
  {
    id: 8,
    title: "Supreme T-Shirt (4 Colorways)",
    price: "18.25",
    image: "https://ik.imagekit.io/demo/img/tshirt.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=weidian&id=7231813766&ref=67166",
    viewUrl: "https://2024.cnfans.com/product/?shop_type=weidian&id=7231813766&ref=67166",
    category: "Clothing",
    featured: false
  },
  {
    id: 9,
    title: "Jordan 4 Retro (8 Colorways)",
    price: "45.99",
    image: "https://ik.imagekit.io/demo/img/jordan.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=weidian&id=7231813766&ref=67166",
    viewUrl: "https://2024.cnfans.com/product/?shop_type=weidian&id=7231813766&ref=67166",
    category: "Shoes",
    featured: false
  },
  {
    id: 10,
    title: "Nike Tech Fleece Set",
    price: "65.30",
    image: "https://ik.imagekit.io/demo/img/fleece.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=weidian&id=7231813766&ref=67166",
    viewUrl: "https://2024.cnfans.com/product/?shop_type=weidian&id=7231813766&ref=67166",
    category: "Clothing",
    featured: false
  },
  {
    id: 11,
    title: "Balenciaga Triple S (6 Colorways)",
    price: "72.45",
    image: "https://ik.imagekit.io/demo/img/balenciaga.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=weidian&id=7231813766&ref=67166",
    viewUrl: "https://2024.cnfans.com/product/?shop_type=weidian&id=7231813766&ref=67166",
    category: "Shoes",
    featured: false
  },
  {
    id: 12,
    title: "Gucci Belt (3 Colorways)",
    price: "28.99",
    image: "https://ik.imagekit.io/demo/img/belt.webp",
    buyUrl: "https://cnfans.com/product/?shop_type=weidian&id=7231813766&ref=67166",
    viewUrl: "https://2024.cnfans.com/product/?shop_type=weidian&id=7231813766&ref=67166",
    category: "Accessories",
    featured: false
  }
];

// Generate more products for the showcase
export const generateMoreProducts = (): Product[] => {
  const additionalProducts = [];
  const categories = ["Shoes", "Clothing", "Accessories"];
  const baseProducts = [...products];

  for (let i = 0; i < 40; i++) {
    const baseProduct = baseProducts[i % baseProducts.length];
    additionalProducts.push({
      id: baseProducts.length + i + 1,
      title: baseProduct.title + " - Variant " + (i + 1),
      price: (parseFloat(baseProduct.price) * (0.8 + Math.random() * 0.4)).toFixed(2),
      image: baseProduct.image,
      buyUrl: baseProduct.buyUrl,
      viewUrl: baseProduct.viewUrl,
      category: categories[i % categories.length],
      featured: false
    });
  }

  return [...products, ...additionalProducts];
};

export const allProducts = generateMoreProducts();
