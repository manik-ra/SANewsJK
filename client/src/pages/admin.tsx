import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { ArrowLeft, Plus, Edit, Trash2, Save, Eye, Settings } from "lucide-react";
import type { Article, Video, Epaper } from "@shared/schema";

export default function Admin() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
    
    if (!isLoading && isAuthenticated && !user?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "Admin access required to view this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  // Article form state
  const [articleForm, setArticleForm] = useState({
    headline: "",
    content: "",
    excerpt: "",
    category: "",
    author: "",
    imageUrl: "",
    isPublished: true,
  });

  // Video form state
  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    platform: "",
    videoUrl: "",
    thumbnailUrl: "",
    duration: "",
  });

  // E-Paper form state
  const [epaperForm, setEpaperForm] = useState({
    title: "",
    description: "",
    pdfUrl: "",
    thumbnailUrl: "",
    edition: "",
    language: "english",
    fileSize: "",
    pages: 0,
  });

  // Fetch articles and videos
  const { data: articles = [], isLoading: articlesLoading } = useQuery({
    queryKey: ["/api/articles"],
    enabled: !!user?.isAdmin,
  });

  const { data: videos = [], isLoading: videosLoading } = useQuery({
    queryKey: ["/api/videos"],
    enabled: !!user?.isAdmin,
  });

  const { data: epapers = [], isLoading: epapersLoading } = useQuery({
    queryKey: ["/api/epapers"],
    enabled: !!user?.isAdmin,
  });

  // Create article mutation
  const createArticleMutation = useMutation({
    mutationFn: async (articleData: typeof articleForm) => {
      const response = await apiRequest("POST", "/api/articles", articleData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Article created successfully!",
      });
      setArticleForm({
        headline: "",
        content: "",
        excerpt: "",
        category: "",
        author: "",
        imageUrl: "",
        isPublished: true,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create article. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create video mutation
  const createVideoMutation = useMutation({
    mutationFn: async (videoData: typeof videoForm) => {
      const response = await apiRequest("POST", "/api/videos", videoData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Video content added successfully!",
      });
      setVideoForm({
        title: "",
        description: "",
        platform: "",
        videoUrl: "",
        thumbnailUrl: "",
        duration: "",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add video content. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete article mutation
  const deleteArticleMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/articles/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Article deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete article. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.headline || !articleForm.content || !articleForm.category || !articleForm.author) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createArticleMutation.mutate(articleForm);
  };

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.platform || !videoForm.videoUrl) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createVideoMutation.mutate(videoForm);
  };

  // Create E-Paper mutation
  const createEpaperMutation = useMutation({
    mutationFn: async (epaperData: typeof epaperForm) => {
      const response = await apiRequest("POST", "/api/epapers", epaperData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "E-Paper uploaded successfully!",
      });
      setEpaperForm({
        title: "",
        description: "",
        pdfUrl: "",
        thumbnailUrl: "",
        edition: "",
        language: "english",
        fileSize: "",
        pages: 0,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/epapers"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to upload E-Paper. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEpaperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!epaperForm.title || !epaperForm.pdfUrl) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createEpaperMutation.mutate(epaperForm);
  };

  if (isLoading || !user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Site
                </Button>
              </Link>
              <h1 className="text-2xl font-playfair font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="text-sm text-gray-600">
              Welcome, {user.firstName} {user.lastName}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="epapers">E-Papers</TabsTrigger>
            {user?.isSuperAdmin && <TabsTrigger value="users">Manage Users</TabsTrigger>}
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Article
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleArticleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="headline">Article Headline *</Label>
                      <Input
                        id="headline"
                        value={articleForm.headline}
                        onChange={(e) => setArticleForm({ ...articleForm, headline: e.target.value })}
                        placeholder="Enter compelling headline..."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={articleForm.category} onValueChange={(value) => setArticleForm({ ...articleForm, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breaking news">Breaking News</SelectItem>
                          <SelectItem value="e news paper">E News Paper</SelectItem>
                          <SelectItem value="politics">Politics</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="environment">Environment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Article Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={articleForm.excerpt}
                      onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                      placeholder="Brief summary of the article..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Article Content *</Label>
                    <Textarea
                      id="content"
                      value={articleForm.content}
                      onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                      placeholder="Write your article content here..."
                      rows={12}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="author">Author *</Label>
                      <Input
                        id="author"
                        value={articleForm.author}
                        onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                        placeholder="Author name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Featured Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={articleForm.imageUrl}
                        onChange={(e) => setArticleForm({ ...articleForm, imageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button type="submit" disabled={createArticleMutation.isPending}>
                      <Save className="h-4 w-4 mr-2" />
                      {createArticleMutation.isPending ? "Publishing..." : "Publish Article"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Articles</CardTitle>
              </CardHeader>
              <CardContent>
                {articlesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading articles...</p>
                  </div>
                ) : articles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No articles found. Create your first article above.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {articles.slice(0, 10).map((article: Article) => (
                      <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{article.headline}</h4>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <Badge variant="outline">{article.category}</Badge>
                            <span>{new Date(article.publishedAt!).toLocaleDateString()}</span>
                            <span>{article.author}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link href={`/article/${article.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteArticleMutation.mutate(article.id)}
                            disabled={deleteArticleMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Video Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVideoSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="videoTitle">Video Title *</Label>
                    <Input
                      id="videoTitle"
                      value={videoForm.title}
                      onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                      placeholder="Enter video title..."
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="platform">Platform *</Label>
                      <Select value={videoForm.platform} onValueChange={(value) => setVideoForm({ ...videoForm, platform: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="videoUrl">Video URL *</Label>
                      <Input
                        id="videoUrl"
                        value={videoForm.videoUrl}
                        onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                        placeholder="https://youtube.com/watch?v=..."
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                      <Input
                        id="thumbnailUrl"
                        value={videoForm.thumbnailUrl}
                        onChange={(e) => setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })}
                        placeholder="https://example.com/thumbnail.jpg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={videoForm.duration}
                        onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                        placeholder="5:42"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoDescription">Video Description</Label>
                    <Textarea
                      id="videoDescription"
                      value={videoForm.description}
                      onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                      placeholder="Brief description of the video content..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={createVideoMutation.isPending}>
                      <Save className="h-4 w-4 mr-2" />
                      {createVideoMutation.isPending ? "Adding..." : "Add Video Content"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Videos</CardTitle>
              </CardHeader>
              <CardContent>
                {videosLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading videos...</p>
                  </div>
                ) : videos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No videos found. Add your first video above.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {videos.slice(0, 10).map((video: Video) => (
                      <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{video.title}</h4>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <Badge variant="outline">{video.platform}</Badge>
                            <span>{new Date(video.publishedAt!).toLocaleDateString()}</span>
                            {video.duration && <span>{video.duration}</span>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="epapers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Upload E-Paper
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEpaperSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="epaper-title">E-Paper Title *</Label>
                      <Input
                        id="epaper-title"
                        value={epaperForm.title}
                        onChange={(e) => setEpaperForm({ ...epaperForm, title: e.target.value })}
                        placeholder="SA News JK - Morning Edition"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edition">Edition</Label>
                      <Select value={epaperForm.edition} onValueChange={(value) => setEpaperForm({ ...epaperForm, edition: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Edition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning Edition</SelectItem>
                          <SelectItem value="evening">Evening Edition</SelectItem>
                          <SelectItem value="weekend">Weekend Special</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="epaper-description">Description</Label>
                    <Textarea
                      id="epaper-description"
                      value={epaperForm.description}
                      onChange={(e) => setEpaperForm({ ...epaperForm, description: e.target.value })}
                      placeholder="Brief description of this E-Paper edition..."
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="pdf-url">PDF File URL *</Label>
                      <Input
                        id="pdf-url"
                        value={epaperForm.pdfUrl}
                        onChange={(e) => setEpaperForm({ ...epaperForm, pdfUrl: e.target.value })}
                        placeholder="https://example.com/newspaper.pdf"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="thumbnail-url">Thumbnail Image URL</Label>
                      <Input
                        id="thumbnail-url"
                        value={epaperForm.thumbnailUrl}
                        onChange={(e) => setEpaperForm({ ...epaperForm, thumbnailUrl: e.target.value })}
                        placeholder="https://example.com/thumbnail.jpg"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="file-size">File Size</Label>
                      <Input
                        id="file-size"
                        value={epaperForm.fileSize}
                        onChange={(e) => setEpaperForm({ ...epaperForm, fileSize: e.target.value })}
                        placeholder="2.5 MB"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pages">Number of Pages</Label>
                      <Input
                        id="pages"
                        type="number"
                        value={epaperForm.pages}
                        onChange={(e) => setEpaperForm({ ...epaperForm, pages: parseInt(e.target.value) || 0 })}
                        placeholder="16"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={epaperForm.language} onValueChange={(value) => setEpaperForm({ ...epaperForm, language: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="hindi">Hindi</SelectItem>
                          <SelectItem value="urdu">Urdu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button type="submit" disabled={createEpaperMutation.isPending}>
                      <Save className="h-4 w-4 mr-2" />
                      {createEpaperMutation.isPending ? "Uploading..." : "Upload E-Paper"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent E-Papers</CardTitle>
              </CardHeader>
              <CardContent>
                {epapersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading E-Papers...</p>
                  </div>
                ) : epapers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No E-Papers found. Upload your first E-Paper above.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {epapers.slice(0, 10).map((epaper: Epaper) => (
                      <div key={epaper.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{epaper.title}</h4>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            {epaper.edition && <Badge variant="outline" className="bg-indigo-50 text-indigo-700">{epaper.edition}</Badge>}
                            <span>{new Date(epaper.publishDate!).toLocaleDateString()}</span>
                            {epaper.fileSize && <span>{epaper.fileSize}</span>}
                            {epaper.pages && <span>{epaper.pages} pages</span>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {user?.isSuperAdmin && (
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">⚠️ Super Admin Controls</CardTitle>
                  <p className="text-sm text-gray-600">Only you can manage admin permissions. This ensures exclusive control over who can access admin features.</p>
                </CardHeader>
                <CardContent>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> You are the only person who can add or remove admin users. This feature is restricted to your account for security purposes.
                    </p>
                  </div>
                  <div className="text-center py-8">
                    <Link href="/admin-users">
                      <Button>
                        <Settings className="h-4 w-4 mr-2" />
                        Manage Admin Users
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{articles.length}</div>
                    <div className="text-gray-600">Total Articles</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{videos.length}</div>
                    <div className="text-gray-600">Video Content</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{epapers.length}</div>
                    <div className="text-gray-600">E-Papers</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">Active</div>
                    <div className="text-gray-600">Website Status</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
