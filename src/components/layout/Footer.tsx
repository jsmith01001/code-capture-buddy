import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <Leaf className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xl font-bold">Sokovuma</span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Your trusted partner in agriculture. Quality products for farming success.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 hover:text-accent cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 hover:text-accent cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 hover:text-accent cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/products" className="text-sm hover:text-accent transition-colors">
                All Products
              </Link>
              <Link to="/categories" className="text-sm hover:text-accent transition-colors">
                Categories
              </Link>
              <Link to="/about" className="text-sm hover:text-accent transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-sm hover:text-accent transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/categories/seeds" className="text-sm hover:text-accent transition-colors">
                Seeds
              </Link>
              <Link to="/categories/tools" className="text-sm hover:text-accent transition-colors">
                Tools
              </Link>
              <Link to="/categories/fertilizers" className="text-sm hover:text-accent transition-colors">
                Fertilizers
              </Link>
              <Link to="/categories/animal-feed" className="text-sm hover:text-accent transition-colors">
                Animal Feed
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>info@sokovuma.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>123 Farm Road, Agriculture City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-primary-foreground/80">
              © 2024 Sokovuma. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm hover:text-accent transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;