import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Download, Calendar, FileText } from "lucide-react";
import type { Epaper } from "@shared/schema";

export default function EpaperSection() {
  const { data: epapers = [], isLoading } = useQuery<Epaper[]>({
    queryKey: ["/api/epapers?limit=6"],
  });

  if (isLoading) {
    return (
      <section id="e-news-paper" className="py-16 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-8 text-center">
            E News Paper
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-[3/4] bg-gray-200 animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (epapers.length === 0) {
    return (
      <section id="e-news-paper" className="py-16 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-8 text-center">
            E News Paper
          </h2>
          <div className="text-center py-12">
            <Newspaper className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
            <p className="text-gray-600">No E-Papers available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="e-news-paper" className="py-16 bg-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-4">
            E News Paper
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access our digital newspaper editions with complete news coverage, analysis, and special reports
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {epapers.map((epaper) => (
            <Card key={epaper.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-indigo-100 to-indigo-200">
                {epaper.thumbnailUrl ? (
                  <img
                    src={epaper.thumbnailUrl}
                    alt={epaper.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Newspaper className="h-20 w-20 text-indigo-400" />
                  </div>
                )}
                {epaper.edition && (
                  <Badge className="absolute top-4 left-4 bg-indigo-600 text-white">
                    {epaper.edition}
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-6">
                <h3 className="font-playfair font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {epaper.title}
                </h3>
                
                {epaper.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {epaper.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(epaper.publishDate!).toLocaleDateString()}</span>
                  </div>
                  {epaper.pages && (
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4" />
                      <span>{epaper.pages} pages</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    {epaper.fileSize && <span>{epaper.fileSize}</span>}
                    {epaper.language && (
                      <span className="ml-2 capitalize">{epaper.language}</span>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => window.open(epaper.pdfUrl, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Read PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {epapers.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              View All E-Papers
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}