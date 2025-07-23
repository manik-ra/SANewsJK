import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false),
  isSuperAdmin: boolean("is_super_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Articles table
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  headline: text("headline").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  category: varchar("category").notNull(),
  author: varchar("author").notNull(),
  imageUrl: varchar("image_url"),
  publishedAt: timestamp("published_at").defaultNow(),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Videos table
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  platform: varchar("platform").notNull(), // youtube, instagram, facebook, twitter
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: varchar("thumbnail_url"),
  duration: varchar("duration"),
  views: integer("views").default(0),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// E-Papers table
export const epapers = pgTable("epapers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  pdfUrl: text("pdf_url").notNull(),
  thumbnailUrl: varchar("thumbnail_url"),
  edition: varchar("edition"), // morning, evening, weekend
  language: varchar("language").default("english"),
  publishDate: timestamp("publish_date").defaultNow(),
  fileSize: varchar("file_size"),
  pages: integer("pages"),
  downloadCount: integer("download_count").default(0),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const articlesRelations = relations(articles, ({ one }) => ({
  author: one(users, {
    fields: [articles.author],
    references: [users.id],
  }),
}));

export const videosRelations = relations(videos, ({ one }) => ({
  author: one(users, {
    fields: [videos.platform],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEpaperSchema = createInsertSchema(epapers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertEpaper = z.infer<typeof insertEpaperSchema>;
export type Epaper = typeof epapers.$inferSelect;
