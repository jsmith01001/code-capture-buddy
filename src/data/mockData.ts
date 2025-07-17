import { Product } from '@/components/product/ProductCard';

export const categories = [
  {
    id: 'seeds',
    name: 'Seeds',
    description: 'High-quality seeds for all your farming needs',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    count: 45
  },
  {
    id: 'tools',
    name: 'Tools',
    description: 'Essential farming tools and equipment',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    count: 32
  },
  {
    id: 'fertilizers',
    name: 'Fertilizers',
    description: 'Organic and chemical fertilizers for healthy crops',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    count: 28
  },
  {
    id: 'animal-feed',
    name: 'Animal Feed',
    description: 'Nutritious feed for all types of livestock',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    count: 19
  },
  {
    id: 'irrigation',
    name: 'Irrigation',
    description: 'Water management and irrigation systems',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    count: 15
  },
  {
    id: 'pesticides',
    name: 'Pesticides',
    description: 'Crop protection and pest control solutions',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    count: 22
  }
];

export const products: Product[] = [
  // Seeds
  {
    id: '1',
    name: 'Premium Maize Seeds (1kg)',
    description: 'High-yield hybrid maize seeds suitable for various soil types. Drought resistant and fast-growing variety.',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=400&fit=crop',
    category: 'Seeds',
    stock: 150,
    rating: 4.8,
    reviews: 34,
    inStock: true
  },
  {
    id: '2',
    name: 'Organic Bean Seeds (500g)',
    description: 'Premium climbing bean varieties with excellent protein content. Organic certified seeds.',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
    category: 'Seeds',
    stock: 89,
    rating: 4.6,
    reviews: 28,
    inStock: true
  },
  {
    id: '3',
    name: 'Sunflower Seeds (250g)',
    description: 'Large-head sunflower seeds perfect for oil production or ornamental purposes.',
    price: 12.30,
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=400&fit=crop',
    category: 'Seeds',
    stock: 67,
    rating: 4.5,
    reviews: 19,
    inStock: true
  },

  // Tools
  {
    id: '4',
    name: 'Professional Garden Hoe',
    description: 'Durable steel garden hoe for soil preparation and weeding. Ergonomic wooden handle.',
    price: 25.99,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
    category: 'Tools',
    stock: 45,
    rating: 4.7,
    reviews: 52,
    inStock: true
  },
  {
    id: '5',
    name: 'Pruning Shears Set',
    description: 'Sharp, precision pruning shears for maintaining healthy plants. Includes 3 different sizes.',
    price: 18.75,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
    category: 'Tools',
    stock: 32,
    rating: 4.4,
    reviews: 41,
    inStock: true
  },
  {
    id: '6',
    name: 'Wheelbarrow Heavy Duty',
    description: 'Large capacity wheelbarrow for transporting soil, compost, and harvested crops.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
    category: 'Tools',
    stock: 12,
    rating: 4.9,
    reviews: 15,
    inStock: true
  },

  // Fertilizers
  {
    id: '7',
    name: 'NPK Fertilizer (50kg)',
    description: 'Complete NPK fertilizer for enhanced crop growth. Balanced nutrient formula 10-10-10.',
    price: 45.50,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
    category: 'Fertilizers',
    stock: 78,
    rating: 4.6,
    reviews: 67,
    inStock: true
  },
  {
    id: '8',
    name: 'Organic Compost (25kg)',
    description: 'Rich organic compost made from decomposed plant matter. Perfect for soil conditioning.',
    price: 22.99,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
    category: 'Fertilizers',
    stock: 0,
    rating: 4.8,
    reviews: 89,
    inStock: false
  },

  // Animal Feed
  {
    id: '9',
    name: 'Chicken Feed Premium (25kg)',
    description: 'Balanced nutrition for laying hens and broilers. High protein content with vitamins.',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=400&fit=crop',
    category: 'Animal Feed',
    stock: 56,
    rating: 4.7,
    reviews: 43,
    inStock: true
  },
  {
    id: '10',
    name: 'Cattle Feed Pellets (50kg)',
    description: 'High-energy feed pellets for dairy and beef cattle. Contains essential minerals.',
    price: 48.75,
    image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop',
    category: 'Animal Feed',
    stock: 34,
    rating: 4.5,
    reviews: 26,
    inStock: true
  },

  // Irrigation
  {
    id: '11',
    name: 'Drip Irrigation Kit',
    description: 'Complete drip irrigation system for small to medium farms. Includes 100m tubing.',
    price: 150.00,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
    category: 'Irrigation',
    stock: 18,
    rating: 4.9,
    reviews: 12,
    inStock: true
  },
  {
    id: '12',
    name: 'Sprinkler System Pro',
    description: 'Professional sprinkler system with adjustable spray patterns. Covers up to 500 sq ft.',
    price: 75.99,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
    category: 'Irrigation',
    stock: 23,
    rating: 4.3,
    reviews: 18,
    inStock: true
  },

  // Pesticides
  {
    id: '13',
    name: 'Organic Pest Control Spray',
    description: 'Natural pest control solution safe for organic farming. Effective against common pests.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
    category: 'Pesticides',
    stock: 67,
    rating: 4.4,
    reviews: 35,
    inStock: true
  },
  {
    id: '14',
    name: 'Herbicide Concentrate',
    description: 'Selective herbicide for weed control in crops. Dilute before use. 1L concentrate.',
    price: 28.50,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
    category: 'Pesticides',
    stock: 41,
    rating: 4.2,
    reviews: 22,
    inStock: true
  }
];

export const orders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 125.49,
    items: [
      { id: '1', name: 'Premium Maize Seeds (1kg)', price: 15.99, quantity: 2 },
      { id: '4', name: 'Professional Garden Hoe', price: 25.99, quantity: 1 },
    ]
  },
  {
    id: 'ORD-002',
    date: '2024-01-20',
    status: 'processing',
    total: 89.99,
    items: [
      { id: '6', name: 'Wheelbarrow Heavy Duty', price: 89.99, quantity: 1 },
    ]
  },
  {
    id: 'ORD-003',
    date: '2024-01-22',
    status: 'shipped',
    total: 67.50,
    items: [
      { id: '7', name: 'NPK Fertilizer (50kg)', price: 45.50, quantity: 1 },
      { id: '8', name: 'Organic Compost (25kg)', price: 22.99, quantity: 1 },
    ]
  }
];