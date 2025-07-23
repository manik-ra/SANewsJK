import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import type { Video } from "@shared/schema";

export default function VideoSection() {
  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos?limit=6"],
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

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      youtube: "fab fa-youtube text-red-600",
      instagram: "fab fa-instagram text-pink-600", 
      facebook: "fab fa-facebook text-blue-600",
      twitter: "fab fa-twitter text-blue-400",
    };
    return icons[platform.toLowerCase()] || "fas fa-video text-gray-600";
  };

  const openVideo = (url: string) => {
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-4">Video Reports</h2>
            <p className="text-gray-600 font-opensans">Watch our latest video coverage and exclusive interviews</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
    <section className="py-12 bg-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-4">Video Reports</h2>
          <p className="text-gray-600 font-opensans">Watch our latest video coverage and exclusive interviews</p>
        </div>
        
        {videos.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <Card key={video.id} className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  {video.thumbnailUrl ? (
                    <img 
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <Play className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button 
                      className="bg-white bg-opacity-90 rounded-full p-4 hover:bg-opacity-100"
                      onClick={() => openVideo(video.videoUrl)}
                    >
                      <Play className="h-6 w-6 text-primary" />
                    </Button>
                  </div>
                  {video.duration && (
                    <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                      {video.duration}
                    </span>
                  )}
                </div>
                <CardContent className="p-4">
                  <h4 className="font-playfair font-semibold text-gray-900 mb-2 line-clamp-2">
                    {video.title}
                  </h4>
                  {video.description && (
                    <p className="text-gray-600 text-sm font-opensans mb-3 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                  <div className="flex items-center text-xs text-gray-500">
                    <i className={getPlatformIcon(video.platform) + " mr-2"}></i>
                    <span>{video.views?.toLocaleString() || 0} views</span>
                    <span className="mx-2">•</span>
                    <span>{formatTimeAgo(video.publishedAt!)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No video content available at the moment.</p>
              <p className="text-sm">Check back later for the latest video reports.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
