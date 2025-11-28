/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ShoppingCart, Search, Check, XCircle } from 'lucide-react'; // ✅ Icons එකතු කළා
import Navbar from '../components/Navbar';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

// 🎯 Backend Constants
const BASE_URL = "https://grilmelt-burger.onrender.com";
const API_URL = `${BASE_URL}/api`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }, // ✅ Animation එක smooth කළා
  },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};


// 🍔 BurgerCard Component
const BurgerCard = ({ product, onAddToCart }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCartClick = () => {
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000); // Reset after 2 seconds
  };

  return (
    <motion.div
    // ✅ 3D effect එක සඳහා perspective එකතු කළා
    className="flex [perspective:800px]"
    variants={itemVariants}
    >
    {/* ✅ Electric border effect එක සහ 3D effect එක එකතු කළා */}
    <Card className="relative flex flex-col w-full h-full overflow-hidden transition-all duration-500 border-transparent glass group hover:shadow-primary/20 [transform-style:preserve-3d] hover:[transform:rotateY(10deg)_rotateX(5deg)] electric-border">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={`${BASE_URL}${product.image}`}
          alt={product.name}
          // ✅ Image එකට 3D hover effect එකක් ලබා දුන්නා
          className="object-cover w-full h-56 transition-transform duration-500 ease-in-out group-hover:scale-125 group-hover:[transform:translateZ(20px)]"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-xs select-none">
            {product.category}
          </Badge>
        </div>
        {/* ✅ 3D effect එක සඳහා අමතර layer එකක් */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      {/* ✅ Card content එකට 3D hover effect එකක් ලබා දුන්නා */}
      <div className="flex flex-col flex-grow p-4 space-y-3 transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:translateZ(30px)]">
        <h3 className="text-xl font-bold truncate">{product.name}</h3>
        <p className="flex-grow text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        {/* ✅ Layout එක fix කර, 3D effect එකක් එකතු කළා */}
        <div className="flex items-end justify-between pt-2 mt-auto flex-nowrap [transform-style:preserve-3d]">
          <span className="text-xl font-bold text-primary whitespace-nowrap transition-transform duration-500 group-hover:[transform:translateZ(40px)]">
            LKR {Number(product.price).toFixed(2)}
          </span>
          <Button
            onClick={handleAddToCartClick}
            disabled={isAdded}
            className={`gap-2 flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:[transform:translateZ(40px)] ${
              isAdded
                ? 'bg-green-600 hover:bg-green-700 w-28' // ✅ Added state style
                : 'gold-glow w-24'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" /> Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" /> Add
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  </motion.div>
  );
};


// 🍔 Main Menu Page
const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  
  // ✅ Category state for dynamic filtering
  const [availableCategories, setAvailableCategories] = useState([]); 

  const { addItem } = useCart();
  const { toast } = useToast();

  // 🎯 Fetch Data from Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) {
          throw new Error("Failed to fetch menu items from server.");
        }
        const data = await res.json();
        setProducts(data);
        
        // 🎯 FIX: Extract unique categories from fetched data
        // Filter out empty/null categories
        const categories = [...new Set(data.map(p => p.category).filter(c => c && c.trim()))];
        setAvailableCategories(categories);

      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load menu. Please check the backend server.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 🎯 Filtering Logic (unchanged)
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  // 🎯 Add to Cart (unchanged)
  const handleAddToCart = (product) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast({ title: `${product.name} added to cart!`, duration: 2000 });
  };

  // ✅ Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="p-4 space-y-3 rounded-lg glass">
      <div className="w-full h-56 rounded-md bg-muted animate-pulse"></div>
      <div className="w-3/4 h-6 rounded bg-muted animate-pulse"></div>
      <div className="w-full h-4 rounded bg-muted animate-pulse"></div>
      <div className="w-1/2 h-4 rounded bg-muted animate-pulse"></div>
      <div className="flex items-center justify-between pt-2">
        <div className="w-1/3 h-8 rounded bg-muted animate-pulse"></div>
        <div className="w-1/4 h-10 rounded bg-muted animate-pulse"></div>
      </div>
    </div>
  );

  // 🎯 Loading/Error UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
        <Navbar />
        <main className="container px-4 py-8 mx-auto">
          {/* Placeholder for header and filters */}
          <div className="w-full h-48 mb-8 rounded-md bg-background/30 animate-pulse"></div>
          {/* ✅ Skeleton Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </main>
      </div>
    );
  }
  if (error) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary text-center">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-3xl font-bold mb-2">Oops! Something went wrong.</h2>
            <p className="text-xl font-semibold text-red-400">{error}</p>
            <p className="mt-4 text-muted-foreground">Please try refreshing the page or check if the server is running.</p>
        </div>
    );
  }

  // 🎯 Render UI
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary selection:bg-yellow-300 selection:text-black">
      <Navbar />
      <main className="container px-4 py-8 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold md:text-5xl tracking-tight">
              Explore Our{' '}
              <span className="text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
                Menu
              </span>
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Find your next favorite burger.
            </p>
          </div>

          {/* 🔍 Filters */}
          <div className="sticky top-[60px] z-10 py-4 mb-8 bg-background/80 backdrop-blur-sm rounded-md shadow-md">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search burgers by name or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12"
                  aria-label="Search burgers"
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full md:w-[220px]" aria-label="Filter by Category">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {/* ✅ Dynamically generate SelectItems */}
                  {availableCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {/* Display category name with capitalized first letter */}
                      {cat.charAt(0).toUpperCase() + cat.slice(1)} 
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* 🍔 Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          // ✅ Grid එකට items 5ක් එන ලෙස වෙනස් කළා
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          {filteredProducts.map((product) => (
            <BurgerCard key={product._id} product={product} onAddToCart={handleAddToCart}/>
          ))}
        </motion.div>

        {/* ✅ Engaging Empty State */}
        {filteredProducts.length === 0 && !loading && (
          <div className="py-20 text-center col-span-full">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-bold">No Burgers Found</h3>
            <p className="mt-2 text-muted-foreground">
              Your search for "{search}" in "{category}" didn't return any results.
            </p>
            <Button 
              variant="outline" 
              className="mt-6" 
              onClick={() => { setSearch(''); setCategory('all'); }}>
              Clear All Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Menu;