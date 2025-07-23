import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import type { Article } from "@shared/schema";

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: [`/api/articles/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
              <p className="text-gray-600 mb-6">
                The article you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Button>
          </Link>
        </div>

        <header className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Badge variant="secondary" className="bg-primary text-white">
              {article.category.toUpperCase()}
            </Badge>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(article.publishedAt!)}
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {article.author}
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-4 leading-tight">
            {article.headline}
          </h1>

          {article.excerpt && (
            <p className="text-xl text-gray-600 font-opensans leading-relaxed mb-6">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between border-t border-b border-gray-200 py-4">
            <div className="text-sm text-gray-500">
              Published on {formatDate(article.publishedAt!)}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const url = window.location.href;
                const text = `Check out this article: ${article.headline}`;
                
                if (navigator.share) {
                  navigator.share({
                    title: article.headline,
                    text: text,
                    url: url,
                  }).catch(console.error);
                } else {
                  navigator.clipboard.writeText(url).then(() => {
                    alert('Article link copied to clipboard!');
                  }).catch(() => {
                    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                    window.open(shareUrl, '_blank');
                  });
                }
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </header>

        {article.imageUrl && (
          <div className="mb-8">
            <img
              src={article.imageUrl}
              alt={article.headline}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          <div 
            className="font-opensans text-gray-800 leading-relaxed"
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {article.content}
          </div>
        </div>

        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Last updated: {formatDate(article.updatedAt!)}
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Article
              </Button>
            </div>
          </div>
        </footer>
      </article>

      <Footer />
    </div>
  );
}
