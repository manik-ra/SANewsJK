import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
              Stay Informed with <span className="text-secondary">SA News JK</span>
            </h1>
            <p className="text-xl mb-6 text-blue-100 font-opensans">
              Your trusted source for breaking news, in-depth analysis, and comprehensive coverage of local and global events.
            </p>
            <Button 
              className="bg-secondary text-white hover:bg-red-700"
              size="lg"
              onClick={() => {
                const element = document.getElementById('latest-articles');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Latest News
            </Button>
          </div>
          <div className="text-center">
            <img 
              src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Professional newsroom environment" 
              className="rounded-xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
