import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertArticleSchema, insertVideoSchema, insertEpaperSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Article routes
  app.get("/api/articles", async (req, res) => {
    try {
      const { limit, category } = req.query;
      const articles = await storage.getArticles(
        limit ? parseInt(limit as string) : undefined,
        category as string
      );
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getArticle(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: error.errors });
      }
      console.error("Error creating article:", error);
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  app.put("/api/articles/:id", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const validatedData = insertArticleSchema.partial().parse(req.body);
      const article = await storage.updateArticle(id, validatedData);
      res.json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: error.errors });
      }
      console.error("Error updating article:", error);
      res.status(500).json({ message: "Failed to update article" });
    }
  });

  app.delete("/api/articles/:id", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      await storage.deleteArticle(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  app.get("/api/articles/search/:query", async (req, res) => {
    try {
      const { query } = req.params;
      const articles = await storage.searchArticles(query);
      res.json(articles);
    } catch (error) {
      console.error("Error searching articles:", error);
      res.status(500).json({ message: "Failed to search articles" });
    }
  });

  // Video routes
  app.get("/api/videos", async (req, res) => {
    try {
      const { limit } = req.query;
      const videos = await storage.getVideos(
        limit ? parseInt(limit as string) : undefined
      );
      res.json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  app.get("/api/videos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const video = await storage.getVideo(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      console.error("Error fetching video:", error);
      res.status(500).json({ message: "Failed to fetch video" });
    }
  });

  app.post("/api/videos", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(validatedData);
      res.status(201).json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid video data", errors: error.errors });
      }
      console.error("Error creating video:", error);
      res.status(500).json({ message: "Failed to create video" });
    }
  });

  app.put("/api/videos/:id", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const validatedData = insertVideoSchema.partial().parse(req.body);
      const video = await storage.updateVideo(id, validatedData);
      res.json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid video data", errors: error.errors });
      }
      console.error("Error updating video:", error);
      res.status(500).json({ message: "Failed to update video" });
    }
  });

  app.delete("/api/videos/:id", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      await storage.deleteVideo(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting video:", error);
      res.status(500).json({ message: "Failed to delete video" });
    }
  });

  // Admin user management routes
  app.get("/api/admin/users", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      // Only super admin can view and manage users
      if (!user?.isSuperAdmin) {
        return res.status(403).json({ message: "Super admin access required" });
      }
      
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.patch("/api/admin/users/:id", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      // Only super admin can modify admin permissions
      if (!user?.isSuperAdmin) {
        return res.status(403).json({ message: "Super admin access required" });
      }

      const targetUserId = req.params.id;
      const { isAdmin } = req.body;

      // Prevent removing super admin status from yourself
      if (targetUserId === req.user.claims.sub && !isAdmin) {
        return res.status(400).json({ message: "You cannot remove your own admin access" });
      }

      const updatedUser = await storage.updateUserAdmin(targetUserId, isAdmin);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user admin status:", error);
      res.status(500).json({ message: "Failed to update user admin status" });
    }
  });

  // E-Paper routes
  app.get("/api/epapers", async (req, res) => {
    try {
      const { limit } = req.query;
      const epapers = await storage.getEpapers(
        limit ? parseInt(limit as string) : undefined
      );
      res.json(epapers);
    } catch (error) {
      console.error("Error fetching e-papers:", error);
      res.status(500).json({ message: "Failed to fetch e-papers" });
    }
  });

  app.get("/api/epapers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const epaper = await storage.getEpaper(id);
      if (!epaper) {
        return res.status(404).json({ message: "E-Paper not found" });
      }
      res.json(epaper);
    } catch (error) {
      console.error("Error fetching e-paper:", error);
      res.status(500).json({ message: "Failed to fetch e-paper" });
    }
  });

  app.post("/api/epapers", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertEpaperSchema.parse(req.body);
      const epaper = await storage.createEpaper(validatedData);
      res.status(201).json(epaper);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid e-paper data", errors: error.errors });
      }
      console.error("Error creating e-paper:", error);
      res.status(500).json({ message: "Failed to create e-paper" });
    }
  });

  app.put("/api/epapers/:id", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const validatedData = insertEpaperSchema.partial().parse(req.body);
      const epaper = await storage.updateEpaper(id, validatedData);
      res.json(epaper);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid e-paper data", errors: error.errors });
      }
      console.error("Error updating e-paper:", error);
      res.status(500).json({ message: "Failed to update e-paper" });
    }
  });

  app.delete("/api/epapers/:id", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      await storage.deleteEpaper(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting e-paper:", error);
      res.status(500).json({ message: "Failed to delete e-paper" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
