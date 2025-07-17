import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (product.inStock && product.stock > 0) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <Card className={cn("group hover-lift agricultural-card h-full flex flex-col", className)}>
      <CardContent className="p-4 flex-1">
        <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          
          {/* Wishlist button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 hover:bg-background/90"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={cn("h-4 w-4", isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
          </Button>

          {/* Stock badge */}
          {!product.inStock && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Out of Stock
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
          
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <p className="text-xs text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviews})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-muted-foreground">
              Stock: {product.stock}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock || product.stock === 0}
          className="w-full"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;