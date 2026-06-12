import dotenv from "dotenv";
import { connectDatabase } from "./config/db.js";
import Product from "./models/Product.js";
import StoreConfig from "./models/StoreConfig.js";
import User from "./models/User.js";

dotenv.config();

const products = [
  {
    name: "Nova Wireless Headphones",
    description: "Immersive over-ear sound with active noise cancellation and 40-hour battery life.",
    price: 6499,
    originalPrice: 8499,
    discount: 24,
    category: "Electronics",
    gender: "Unisex",
    stockCount: 24,
    rating: 4.8,
    featured: true,
    imageURL: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Aero Smart Watch",
    description: "Fitness, sleep, heart-rate tracking, and smart notifications in a slim aluminum case.",
    price: 8999,
    originalPrice: 11999,
    discount: 25,
    category: "Electronics",
    gender: "Unisex",
    stockCount: 18,
    rating: 4.7,
    featured: true,
    imageURL: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Everyday Leather Backpack",
    description: "A refined, spacious backpack with padded laptop storage and durable brass fittings.",
    price: 4599,
    originalPrice: 5999,
    discount: 23,
    category: "Fashion",
    gender: "Unisex",
    sizes: ["One size"],
    stockCount: 31,
    rating: 4.6,
    featured: true,
    imageURL: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Minimal Desk Lamp",
    description: "Warm, adjustable LED lighting with touch dimming for productive workspaces.",
    price: 2299,
    originalPrice: 2999,
    discount: 23,
    category: "Home",
    stockCount: 42,
    rating: 4.5,
    featured: false,
    imageURL: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Classic White Sneakers",
    description: "Clean everyday sneakers made with a cushioned sole and breathable lining.",
    price: 3499,
    originalPrice: 4999,
    discount: 30,
    category: "Fashion",
    gender: "Unisex",
    sizes: ["6", "7", "8", "9", "10"],
    stockCount: 27,
    rating: 4.4,
    featured: false,
    imageURL: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Ceramic Coffee Set",
    description: "Hand-finished stoneware pot and two cups designed for slow, quiet mornings.",
    price: 1899,
    originalPrice: 2499,
    discount: 24,
    category: "Home",
    stockCount: 16,
    rating: 4.9,
    featured: true,
    imageURL: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Apex 5G Smartphone",
    description: "Fast 5G performance, vivid OLED display, and an all-day battery in a refined design.",
    price: 22999,
    originalPrice: 29999,
    discount: 23,
    category: "Mobiles",
    stockCount: 20,
    rating: 4.6,
    featured: true,
    imageURL: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Pro English Willow Cricket Bat",
    description: "Balanced full-size cricket bat with a comfortable grip for club and recreational play.",
    price: 3299,
    originalPrice: 4499,
    discount: 27,
    category: "Sports Equipment",
    sizes: ["M", "L"],
    stockCount: 13,
    rating: 4.4,
    featured: false,
    imageURL: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Premium Arabica Coffee",
    description: "Medium-roast whole beans with chocolate and caramel notes, packed fresh in a 500 g bag.",
    price: 699,
    originalPrice: 899,
    discount: 22,
    category: "Groceries",
    stockCount: 45,
    rating: 4.7,
    featured: false,
    imageURL: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80"
  }
];

async function seed() {
  await connectDatabase();
  await Promise.all([Product.deleteMany(), User.deleteMany(), StoreConfig.deleteMany()]);
  await User.create({
    name: "ShopEZ Admin",
    email: "admin@shopez.com",
    password: "Admin123!",
    isAdmin: true
  });
  await Product.insertMany(products);
  await StoreConfig.create({
    key: "primary",
    categories: ["Mobiles", "Electronics", "Sports Equipment", "Fashion", "Groceries", "Home"]
  });
  console.log("Seeded products and admin account");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
