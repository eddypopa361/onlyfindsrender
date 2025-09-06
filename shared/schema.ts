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
  id: text("id").primaryKey(), // UUID format in Supabase
  title: text("title").notNull(),
  price_usd: text("price_usd").notNull(), // Matches database column exactly
  image: text("image"),
  buy_url: text("buy_url").notNull(),
  category: text("category").notNull(),
  sub_category: text("sub_category"),
  featured: boolean("featured").default(false),
  carousel: boolean("carousel").default(false),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true, // Omit ID since it's auto-generated
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
