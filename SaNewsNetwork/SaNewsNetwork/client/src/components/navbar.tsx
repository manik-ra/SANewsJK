import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Settings, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/#breaking-news", label: "Breaking News" },
    { href: "/#e-news-paper", label: "E News Paper" },
    { href: "/#politics", label: "Politics" },
    { href: "/#business", label: "Business" },
    { href: "/#sports", label: "Sports" },
    { href: "/#technology", label: "Technology" },
    { href: "/#videos", label: "Videos" },
  ];

  return (
    <header className="bg-white shadow-md border-b-2 border-primary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <h1 className="text-2xl font-playfair font-bold text-primary">SA News JK</h1>
              <span className="ml-2 text-xs text-gray-500 font-opensans hidden sm:block">
                Professional News Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-secondary transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="hidden sm:block text-sm text-gray-600">
                  Welcome, {user?.firstName}
                </span>
                {user?.isAdmin && (
                  <>
                    <Link href="/admin">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin
                      </Button>
                    </Link>
                    <Link href="/admin/users">
                      <Button variant="outline" size="sm">
                        Users
                      </Button>
                    </Link>
                  </>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.location.href = "/api/logout";
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    window.location.href = "/api/login";
                  }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    window.location.href = "/api/login";
                  }}
                  className="bg-secondary hover:bg-red-700"
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-gray-700 hover:text-secondary transition-colors font-medium py-2"
                    >
                      {item.label}
                    </a>
                  ))}
                  {!isAuthenticated && (
                    <div className="pt-4 border-t">
                      <Button
                        className="w-full mb-2"
                        variant="outline"
                        onClick={() => {
                          window.location.href = "/api/login";
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        className="w-full bg-secondary hover:bg-red-700"
                        onClick={() => {
                          window.location.href = "/api/login";
                        }}
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
