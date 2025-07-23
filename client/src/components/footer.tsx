import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-playfair font-bold mb-4">SA News JK</h3>
            <p className="text-gray-300 mb-6 font-opensans">
              Your trusted source for breaking news, in-depth analysis, and comprehensive coverage of local and global events. 
              Committed to delivering accurate, timely, and unbiased journalism.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-youtube text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-playfair font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 font-opensans">
              <li><a href="#politics" className="text-gray-300 hover:text-white transition-colors">Politics</a></li>
              <li><a href="#business" className="text-gray-300 hover:text-white transition-colors">Business</a></li>
              <li><a href="#sports" className="text-gray-300 hover:text-white transition-colors">Sports</a></li>
              <li><a href="#technology" className="text-gray-300 hover:text-white transition-colors">Technology</a></li>
              <li><a href="#health" className="text-gray-300 hover:text-white transition-colors">Health</a></li>
              <li><a href="#environment" className="text-gray-300 hover:text-white transition-colors">Environment</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-playfair font-semibold mb-4">Company</h4>
            <ul className="space-y-2 font-opensans">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Advertise</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <hr className="border-gray-700 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm font-opensans">
            © {currentYear} SA News JK. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0 font-opensans">
            Professional news portal delivering trusted journalism
          </p>
        </div>
      </div>
    </footer>
  );
}
