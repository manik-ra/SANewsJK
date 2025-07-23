import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { User, ArrowRight } from "lucide-react";
import type { Article } from "@shared/schema";

export default function LatestArticles() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: [selectedCategory === "all" ? "/api/articles?limit=50" : `/api/articles?limit=50&category=${selectedCategory}`],
  });

  const categories = [
    { id: "all", label: "All" },
    { id: "breaking news", label: "Breaking News" },
    { id: "e news paper", label: "E News Paper" },
    { id: "politics", label: "Politics" },
    { id: "business", label: "Business" },
    { id: "sports", label: "Sports" },
    { id: "technology", label: "Technology" },
    { id: "health", label: "Health" },
    { id: "environment", label: "Environment" },
  ];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Less than an hour ago";
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "breaking news": "bg-red-600 text-white",
      "e news paper": "bg-indigo-600 text-white",
      politics: "bg-blue-100 text-blue-800",
      business: "bg-green-100 text-green-800",
      sports: "bg-orange-100 text-orange-800",
      technology: "bg-purple-100 text-purple-800",
      health: "bg-red-100 text-red-800",
      environment: "bg-green-100 text-green-800",
    };
    return colors[category.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  // Pagination logic
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <section id="latest-articles" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-playfair font-bold text-gray-900">Latest Articles</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="latest-articles" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-4 sm:mb-0">Latest Articles</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category.id)}
                className={selectedCategory === category.id ? "bg-primary hover:bg-blue-800" : ""}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
        
        {currentArticles.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentArticles.map((article) => (
                <Card key={article.id} className="bg-white border shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {article.imageUrl && (
                    <img 
                      src={article.imageUrl}
                      alt={article.headline}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category.toUpperCase()}
                      </Badge>
                      <span className="text-gray-500 text-sm ml-3">
                        {formatTimeAgo(article.publishedAt!)}
                      </span>
                    </div>
                    <Link href={`/article/${article.id}`}>
                      <h3 className="text-lg font-playfair font-semibold text-gray-900 mb-3 hover:text-secondary transition-colors cursor-pointer line-clamp-2">
                        {article.headline}
                      </h3>
                    </Link>
                    {article.excerpt && (
                      <p className="text-gray-600 text-sm font-opensans mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-2" />
                        <span>{article.author}</span>
                      </div>
                      <Link href={`/article/${article.id}`}>
                        <span className="text-secondary hover:text-red-700 font-medium text-sm cursor-pointer">
                          Read More <ArrowRight className="inline h-4 w-4 ml-1" />
                        </span>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-primary hover:bg-blue-800" : ""}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <p className="text-lg">No articles found for the selected category.</p>
              <p className="text-sm">Try selecting a different category or check back later.</p>
            </div>
            <Button
              variant="outline"
              onClick={() => handleCategoryChange("all")}
            >
              View All Articles
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
