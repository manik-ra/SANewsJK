import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import BreakingNews from "@/components/breaking-news";
import FeaturedNews from "@/components/featured-news";
import VideoSection from "@/components/video-section";
import LatestArticles from "@/components/latest-articles";
import Newsletter from "@/components/newsletter";
import Footer from "@/components/footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <BreakingNews />
      <FeaturedNews />
      <VideoSection />
      <LatestArticles />
      <Newsletter />
      <Footer />
    </div>
  );
}
