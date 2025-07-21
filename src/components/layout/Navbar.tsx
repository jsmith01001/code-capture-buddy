import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl text-primary">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <span>Sokovuma</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for seeds, tools, equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors">
              Products
            </Link>
            <Link to="/categories" className="text-sm font-medium hover:text-primary transition-colors">
              Categories
            </Link>
            <Link to="/seller-certification" className="text-sm font-medium hover:text-primary transition-colors">
              Become a Seller
            </Link>
            
            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/seller-dashboard">Seller Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </form>

              {/* Mobile Links */}
              <div className="flex flex-col space-y-2">
                <Link
                  to="/products"
                  className="text-sm font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Products
                </Link>
                <Link
                  to="/categories"
                  className="text-sm font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Categories
                </Link>
                <Link
                  to="/seller-certification"
                  className="text-sm font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Become a Seller
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center space-x-2 text-sm font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Cart ({totalItems})</span>
                </Link>

                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="text-sm font-medium hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="text-sm font-medium hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/seller-dashboard"
                      className="text-sm font-medium hover:text-primary transition-colors py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Seller Dashboard
                    </Link>
                    <Button
                      variant="ghost"
                      className="justify-start p-0 h-auto font-medium text-sm"
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="flex space-x-2 pt-2">
                    <Button variant="ghost" size="sm" asChild className="flex-1">
                      <Link to="/auth" onClick={() => setIsOpen(false)}>Sign In</Link>
                    </Button>
                    <Button size="sm" asChild className="flex-1">
                      <Link to="/auth" onClick={() => setIsOpen(false)}>Sign Up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;