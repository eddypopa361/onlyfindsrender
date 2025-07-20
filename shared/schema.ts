import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  price: text("price").notNull(),
  image: text("image").notNull(),
  buyUrl: text("buy_url").notNull(),
  viewUrl: text("view_url").notNull(),
  category: text("category").notNull(),
  subCategory: text("sub_category"),  // Subcategoria pentru filtrare suplimentară
  brand: text("brand"),  // Brand-ul produsului pentru filtrare și căutare
  featured: boolean("featured").default(false),
  carousel: boolean("carousel").default(false), // Indicator pentru produsele din carusel
});

export const insertProductSchema = createInsertSchema(products).pick({
  title: true,
  price: true,
  image: true,
  buyUrl: true, 
  viewUrl: true,
  category: true,
  subCategory: true,
  brand: true,
  featured: true,
  carousel: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
