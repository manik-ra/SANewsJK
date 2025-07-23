import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubscribing(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Successfully Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
      setIsSubscribing(false);
    }, 1000);
  };

  return (
    <section className="bg-primary text-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-playfair font-bold mb-4">Stay Updated</h2>
        <p className="text-xl text-blue-100 mb-8 font-opensans">
          Get the latest news delivered directly to your inbox. Subscribe to our newsletter for breaking news and exclusive content.
        </p>
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
          <Input 
            type="email" 
            placeholder="Enter your email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary w-full bg-white"
            disabled={isSubscribing}
          />
          <Button 
            type="submit"
            disabled={isSubscribing}
            className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold w-full sm:w-auto"
          >
            {isSubscribing ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
        <p className="text-blue-200 text-sm mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
