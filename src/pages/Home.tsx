import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/product/ProductCard';
import { ArrowRight, Leaf, Shield, Truck, Star, Users } from 'lucide-react';
import { products, categories } from '@/data/mockData';

const Home = () => {
  const featuredProducts = products.slice(0, 8);
  const featuredCategories = categories.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="secondary" className="w-fit">
                  🌱 Agricultural Excellence
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Your One-Stop
                  <span className="text-primary block">Farm Shop</span>
                </h1>
              </div>
              
              <p className="text-lg text-muted-foreground max-w-md">
                From seeds to harvest, we provide everything you need for successful farming. 
                Quality products, expert advice, and fast delivery.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/products">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/categories">Browse Categories</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Happy Farmers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square relative">
                <img
                  src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=600&fit=crop"
                  alt="Farming"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 gradient-primary opacity-10 rounded-2xl"></div>
              </div>
              
              {/* Floating cards */}
              <Card className="absolute top-4 right-4 p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Leaf className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Organic Certified</span>
                </div>
              </Card>
              
              <Card className="absolute bottom-4 left-4 p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Fast Delivery</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Sokovuma?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to supporting farmers with quality products, competitive prices, and exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover-lift">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">Quality Assured</h3>
                <p className="text-sm text-muted-foreground">
                  All products are tested and verified for quality standards
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover-lift">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Quick delivery to your farm within 2-3 business days
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover-lift">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">Expert Support</h3>
                <p className="text-sm text-muted-foreground">
                  Agricultural experts available to help with your farming needs
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover-lift">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">Community</h3>
                <p className="text-sm text-muted-foreground">
                  Join thousands of farmers who trust Sokovuma
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
              <p className="text-muted-foreground">Find everything you need for your farm</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/categories">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <Link key={category.id} to={`/categories/${category.id}`}>
                <Card className="group overflow-hidden hover-lift cursor-pointer">
                  <div className="aspect-[4/3] relative">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.description}</p>
                      <Badge variant="secondary" className="mt-2">
                        {category.count} products
                      </Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Top picks for your farming needs</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/products">
                Shop All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="gradient-primary text-white p-8 md:p-12 text-center">
            <CardContent className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Start Farming?
              </h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Join thousands of successful farmers who trust Sokovuma for their agricultural needs. 
                Get started today and see the difference quality makes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  <Link to="/auth">Create Account</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;