import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DiscordLogoIcon,
  HamburgerMenuIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";

export default function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "PRODUCTS", path: "/products" },
    { name: "BEST SELLERS", path: "/#bestsellers" },
    { name: "DOCS", path: "/docs" },
    { name: "FAQ", path: "/faq" },
    { name: "HOW TO", path: "/howto" }
  ];

  const isActive = (path: string) => {
    if (path.includes('#')) {
      return location === path.split('#')[0];
    }
    return location === path;
  };

  return (
    <header className="sticky top-0 bg-black shadow-lg shadow-primary/20 z-40 border-b border-primary/20">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img 
            src="/images/onlyfinds_logo.png" 
            alt="ONLYFINDS Logo" 
            loading="eager"
            className="h-10 object-contain"
          />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.path}
              className={`font-heading font-medium hover:text-primary transition-colors ${
                isActive(link.path) ? "text-primary" : "text-gray-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <a 
            href="https://discord.com/invite/tTAKrgMcuC" 
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 px-5 py-2 bg-primary text-white font-heading font-medium rounded-full glow-button transition-all hover:bg-primary/80"
          >
            JOIN THE DISCORD
          </a>
        </div>
        
        {/* Mobile Navigation Trigger */}
        <button 
          className="md:hidden text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <Cross1Icon className="h-6 w-6" />
          ) : (
            <HamburgerMenuIcon className="h-6 w-6" />
          )}
        </button>
      </nav>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-primary/20">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.path}
                className={`py-2 font-heading font-medium hover:text-primary transition-colors ${
                  isActive(link.path) ? "text-primary" : "text-gray-300"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <a 
              href="https://discord.com/invite/tTAKrgMcuC" 
              target="_blank"
              rel="noopener noreferrer"
              className="my-2 px-5 py-2 bg-primary text-white font-heading font-medium rounded-full inline-block text-center glow-button transition-all hover:bg-primary/80"
              onClick={() => setIsMenuOpen(false)}
            >
              JOIN THE DISCORD
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
