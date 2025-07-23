import {
  users,
  articles,
  videos,
  epapers,
  type User,
  type UpsertUser,
  type Article,
  type InsertArticle,
  type Video,
  type InsertVideo,
  type Epaper,
  type InsertEpaper,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, or } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserAdmin(id: string, isAdmin: boolean): Promise<User>;
  
  // Article operations
  getArticles(limit?: number, category?: string): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article>;
  deleteArticle(id: number): Promise<void>;
  searchArticles(query: string): Promise<Article[]>;
  
  // Video operations
  getVideos(limit?: number): Promise<Video[]>;
  getVideo(id: number): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video>;
  deleteVideo(id: number): Promise<void>;
  
  // E-Paper operations
  getEpapers(limit?: number): Promise<Epaper[]>;
  getEpaper(id: number): Promise<Epaper | undefined>;
  createEpaper(epaper: InsertEpaper): Promise<Epaper>;
  updateEpaper(id: number, epaper: Partial<InsertEpaper>): Promise<Epaper>;
  deleteEpaper(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.createdAt);
  }

  async updateUserAdmin(id: string, isAdmin: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ isAdmin, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Article operations
  async getArticles(limit = 50, category?: string): Promise<Article[]> {
    if (category && category !== 'all') {
      return await db.select().from(articles)
        .where(eq(articles.category, category))
        .orderBy(desc(articles.publishedAt))
        .limit(limit);
    }
    
    return await db.select().from(articles)
      .where(eq(articles.isPublished, true))
      .orderBy(desc(articles.publishedAt))
      .limit(limit);
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article;
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const [newArticle] = await db.insert(articles).values(article).returning();
    return newArticle;
  }

  async updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article> {
    const [updatedArticle] = await db
      .update(articles)
      .set({ ...article, updatedAt: new Date() })
      .where(eq(articles.id, id))
      .returning();
    return updatedArticle;
  }

  async deleteArticle(id: number): Promise<void> {
    await db.delete(articles).where(eq(articles.id, id));
  }

  async searchArticles(query: string): Promise<Article[]> {
    return await db
      .select()
      .from(articles)
      .where(
        or(
          like(articles.headline, `%${query}%`),
          like(articles.content, `%${query}%`),
          like(articles.excerpt, `%${query}%`)
        )
      )
      .orderBy(desc(articles.publishedAt));
  }

  // Video operations
  async getVideos(limit = 20): Promise<Video[]> {
    return await db.select().from(videos)
      .orderBy(desc(videos.publishedAt))
      .limit(limit);
  }

  async getVideo(id: number): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video;
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db.insert(videos).values(video).returning();
    return newVideo;
  }

  async updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video> {
    const [updatedVideo] = await db
      .update(videos)
      .set({ ...video, updatedAt: new Date() })
      .where(eq(videos.id, id))
      .returning();
    return updatedVideo;
  }

  async deleteVideo(id: number): Promise<void> {
    await db.delete(videos).where(eq(videos.id, id));
  }

  // E-Paper operations
  async getEpapers(limit = 20): Promise<Epaper[]> {
    return await db.select().from(epapers)
      .orderBy(desc(epapers.publishDate))
      .limit(limit);
  }

  async getEpaper(id: number): Promise<Epaper | undefined> {
    const [epaper] = await db.select().from(epapers).where(eq(epapers.id, id));
    return epaper;
  }

  async createEpaper(epaper: InsertEpaper): Promise<Epaper> {
    const [newEpaper] = await db.insert(epapers).values(epaper).returning();
    return newEpaper;
  }

  async updateEpaper(id: number, epaper: Partial<InsertEpaper>): Promise<Epaper> {
    const [updatedEpaper] = await db
      .update(epapers)
      .set({ ...epaper, updatedAt: new Date() })
      .where(eq(epapers.id, id))
      .returning();
    return updatedEpaper;
  }

  async deleteEpaper(id: number): Promise<void> {
    await db.delete(epapers).where(eq(epapers.id, id));
  }
}

export const storage = new DatabaseStorage();
