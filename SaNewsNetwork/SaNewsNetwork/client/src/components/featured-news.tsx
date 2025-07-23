import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { Article } from "@shared/schema";

export default function FeaturedNews() {
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles?limit=4"],
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Less than an hour ago";
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "breaking news": "bg-red-600 text-white",
      politics: "bg-secondary text-white",
      business: "bg-blue-100 text-blue-800",
      sports: "bg-green-100 text-green-800",
      technology: "bg-purple-100 text-purple-800",
      health: "bg-red-100 text-red-800",
      environment: "bg-green-100 text-green-800",
    };
    return colors[category.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const featuredArticle = articles[0];
  const sidebarArticles = articles.slice(1, 4);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Featured Article */}
          <div className="lg:col-span-2">
            {featuredArticle ? (
              <Card className="overflow-hidden border shadow-lg">
                {featuredArticle.imageUrl && (
                  <img 
                    src={featuredArticle.imageUrl} 
                    alt={featuredArticle.headline}
                    className="w-full h-64 object-cover"
                  />
                )}
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <Badge className={getCategoryColor(featuredArticle.category)}>
                      {featuredArticle.category.toUpperCase()}
                    </Badge>
                    <span className="text-gray-500 text-sm ml-3">
                      {formatTimeAgo(featuredArticle.publishedAt!)}
                    </span>
                  </div>
                  <h2 className="text-2xl font-playfair font-bold mb-3 text-gray-900">
                    {featuredArticle.headline}
                  </h2>
                  {featuredArticle.excerpt && (
                    <p className="text-gray-600 mb-4 font-opensans">
                      {featuredArticle.excerpt}
                    </p>
                  )}
                  <Link href={`/article/${featuredArticle.id}`}>
                    <span className="text-secondary font-semibold hover:text-red-700 transition-colors cursor-pointer">
                      Read Full Article <ArrowRight className="inline h-4 w-4 ml-1" />
                    </span>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No featured articles available at the moment.</p>
              </Card>
            )}
          </div>
          
          {/* Sidebar Featured Articles */}
          <div className="space-y-6">
            <h3 className="text-xl font-playfair font-bold text-gray-900 border-b-2 border-primary pb-2">
              Trending News
            </h3>
            
            {sidebarArticles.length > 0 ? (
              sidebarArticles.map((article) => (
                <Card key={article.id} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    {article.imageUrl && (
                      <img 
                        src={article.imageUrl}
                        alt={article.headline}
                        className="w-full h-24 object-cover rounded mb-3"
                      />
                    )}
                    <div className="flex items-center mb-2">
                      <Badge variant="outline" className={getCategoryColor(article.category)}>
                        {article.category.toUpperCase()}
                      </Badge>
                      <span className="text-gray-500 text-xs ml-2">
                        {formatTimeAgo(article.publishedAt!)}
                      </span>
                    </div>
                    <Link href={`/article/${article.id}`}>
                      <h4 className="font-playfair font-semibold text-gray-900 mb-2 hover:text-secondary transition-colors cursor-pointer">
                        {article.headline}
                      </h4>
                    </Link>
                    {article.excerpt && (
                      <p className="text-gray-600 text-sm font-opensans line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No trending articles available.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
