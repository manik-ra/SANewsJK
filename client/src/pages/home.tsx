import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import BreakingNews from "@/components/breaking-news";
import FeaturedNews from "@/components/featured-news";
import VideoSection from "@/components/video-section";
import EpaperSection from "@/components/epaper-section";
import LatestArticles from "@/components/latest-articles";
import Newsletter from "@/components/newsletter";
import Footer from "@/components/footer";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="bg-gradient-to-r from-primary to-blue-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-playfair font-bold">
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          <p className="text-blue-100 mt-2 font-opensans">
            Stay updated with the latest news and breaking stories
          </p>
        </div>
      </div>
      <BreakingNews />
      <FeaturedNews />
      <VideoSection />
      <EpaperSection />
      <LatestArticles />
      <Newsletter />
      <Footer />
    </div>
  );
}
