/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  ShoppingCart, 
  Search, 
  Menu, 
  User, 
  Heart, 
  Star, 
  ChevronRight, 
  ChevronLeft,
  Truck,
  Leaf,
  CreditCard,
  ShieldCheck,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

// --- Types & Data ---

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  discount?: string;
  unit: string;
}

const CATEGORIES = [
  { id: 1, name: "Vegetables", icon: "🥬", count: "120+ Products" },
  { id: 2, name: "Fruits", icon: "🍎", count: "80+ Products" },
  { id: 3, name: "Fish", icon: "🐟", count: "45+ Products" },
  { id: 4, name: "Meat", icon: "🥩", count: "30+ Products" },
  { id: 5, name: "Grocery", icon: "🌾", count: "250+ Products" },
  { id: 6, name: "Snacks", icon: "🍿", count: "95+ Products" },
  { id: 7, name: "Dairy", icon: "🥛", count: "40+ Products" },
];

const PRODUCTS: Product[] = [
  { id: 1, name: "Fresh Green Spinach", price: 35, oldPrice: 45, image: "https://picsum.photos/seed/spinach/400/400", category: "Vegetables", discount: "22% Off", unit: "per bunch" },
  { id: 2, name: "Red Tomatoes", price: 80, oldPrice: 100, image: "https://picsum.photos/seed/tomato/400/400", category: "Vegetables", discount: "20% Off", unit: "1 kg" },
  { id: 3, name: "Himsagar Mango (Premium)", price: 120, image: "https://picsum.photos/seed/mango/400/400", category: "Fruits", unit: "1 kg" },
  { id: 4, name: "Fresh Rohu Fish (Medium)", price: 350, oldPrice: 380, image: "https://picsum.photos/seed/fish/400/400", category: "Fish", discount: "৳30 Off", unit: "1 kg" },
  { id: 5, name: "Broiler Chicken (Full)", price: 180, image: "https://picsum.photos/seed/chicken/400/400", category: "Meat", unit: "1 kg" },
  { id: 6, name: "Pure Cow Milk", price: 90, image: "https://picsum.photos/seed/milk/400/400", category: "Dairy", unit: "1 L" },
  { id: 7, name: "Fortune Soyabean Oil", price: 165, image: "https://picsum.photos/seed/oil/400/400", category: "Grocery", unit: "1 L" },
  { id: 8, name: "Deshi Onions", price: 60, oldPrice: 75, image: "https://picsum.photos/seed/onion/400/400", category: "Vegetables", discount: "৳15 Off", unit: "1 kg" },
];

const BANNERS = [
  { 
    id: 1, 
    title: "Fresh Vegetables Daily", 
    subtitle: "Up to 30% Off", 
    image: "https://picsum.photos/seed/grocery-banner1/1200/500", 
    bgColor: "bg-[#2d5a27]" 
  },
  { 
    id: 2, 
    title: "Premium Quality Fruits", 
    subtitle: "Direct from the Farm", 
    image: "https://picsum.photos/seed/grocery-banner2/1200/500", 
    bgColor: "bg-[#5c4033]" 
  },
  { 
    id: 3, 
    title: "Pure Organic Honey", 
    subtitle: "100% Genuine Guarantee", 
    image: "https://picsum.photos/seed/grocery-banner3/1200/500", 
    bgColor: "bg-[#a67c00]" 
  },
];

// --- Components ---

function ProductCard({ product }: { product: Product; key?: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden border border-emerald-50 hover:shadow-xl transition-all duration-300 flex flex-col group relative"
    >
      {product.discount && (
        <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
          {product.discount}
        </div>
      )}
      
      <div className="relative aspect-square overflow-hidden bg-emerald-50/30">
        <img 
          src={product.image} 
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-zinc-400 hover:text-emerald-600 transition-colors">
          <Heart size={16} />
        </button>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1">{product.category}</span>
        <h3 className="text-zinc-800 text-sm font-semibold line-clamp-2 h-10 mb-1 group-hover:text-emerald-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-zinc-400 text-[11px] mb-3">{product.unit}</p>
        
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-emerald-700 font-black text-lg">৳{product.price}</span>
            {product.oldPrice && (
              <span className="text-zinc-400 line-through text-xs italic">৳{product.oldPrice}</span>
            )}
          </div>
          <button 
            onClick={() => alert(`${product.name} added to cart!`)}
            className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfdfc] font-sans text-zinc-900 overflow-x-hidden" id="grocery-app">
      
      {/* --- Sticky Navbar --- */}
      <header className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' : 'bg-white py-4 border-b border-emerald-50'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
              <Leaf size={24} fill="white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-black text-emerald-800 tracking-tighter leading-none italic">FreshMarket</h1>
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-[2px]">Premium Grocery</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-grow max-w-2xl relative group">
            <input 
              type="text" 
              placeholder="Search for vegetables, fruits, meat..." 
              className="w-full bg-zinc-100/50 border-emerald-100 border rounded-2xl px-6 py-2.5 pr-14 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all text-sm"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-600 p-2 rounded-xl text-white shadow-md shadow-emerald-600/20 hover:scale-105 transition-transform">
              <Search size={18} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-5">
            <button className="p-2 text-zinc-600 hover:text-emerald-600 transition-colors hidden sm:block">
              <User size={24} />
            </button>
            <button className="hidden lg:block bg-emerald-50 text-emerald-700 px-5 py-2 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all border border-emerald-100/50">
              Login / Register
            </button>
            <button className="relative bg-emerald-600 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-90 transition-transform">
              <ShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
                0
              </span>
            </button>
            <button className="md:hidden text-zinc-600">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20">
        
        {/* --- Category Menu (Horizontal Scroll) --- */}
        <section className="max-w-7xl mx-auto px-4 mb-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ y: -2 }}
                className="flex items-center gap-2 bg-white border border-emerald-50 px-5 py-2.5 rounded-2xl whitespace-nowrap shadow-sm hover:shadow-md hover:border-emerald-200 transition-all text-sm font-semibold text-zinc-700"
              >
                <span className="text-xl">{cat.icon}</span>
                {cat.name}
              </motion.button>
            ))}
          </div>
        </section>

        {/* --- Hero Section (Slider) --- */}
        <section className="max-w-7xl mx-auto px-4 mb-16 h-[300px] md:h-[450px]">
          <div className="relative h-full rounded-[2rem] overflow-hidden shadow-2xl group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className={`absolute inset-0 ${BANNERS[currentSlide].bgColor}`}
              >
                <img 
                  src={BANNERS[currentSlide].image} 
                  alt={BANNERS[currentSlide].title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover mix-blend-overlay opacity-60"
                />
                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 text-white">
                  <motion.span 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="uppercase tracking-[4px] font-black text-sm text-emerald-100 mb-4"
                  >
                    {BANNERS[currentSlide].subtitle}
                  </motion.span>
                  <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-4xl md:text-7xl font-black mb-8 leading-tight italic drop-shadow-lg"
                  >
                    {BANNERS[currentSlide].title}
                  </motion.h2>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <button className="bg-white text-emerald-900 px-10 py-4 rounded-2xl font-black text-lg hover:bg-emerald-50 transition-all shadow-xl hover:scale-105 active:scale-95">
                      Shop Now
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Controls */}
            <div className="absolute bottom-10 left-10 flex gap-3 z-10">
              {BANNERS.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 transition-all rounded-full ${idx === currentSlide ? 'w-10 bg-white' : 'w-2 bg-white/40'}`}
                />
              ))}
            </div>
            <button 
              onClick={() => setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length)}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => setCurrentSlide((prev) => (prev + 1) % BANNERS.length)}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </section>

        {/* --- Popular Categories --- */}
        <section className="max-w-7xl mx-auto px-4 mb-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-emerald-900">Popular Categories</h2>
              <p className="text-zinc-500 text-sm mt-1">Explore our freshest picked categories</p>
            </div>
            <button className="group flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700">
              View All <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-3xl border border-emerald-50 text-center cursor-pointer hover:shadow-xl hover:border-emerald-200 transition-all"
              >
                <div className="text-4xl mb-4 py-4 bg-emerald-50/50 rounded-2xl group-hover:bg-emerald-100 transition-colors">{cat.icon}</div>
                <h4 className="font-bold text-zinc-800 text-sm">{cat.name}</h4>
                <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold">{cat.count}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- Featured Products --- */}
        <section className="max-w-7xl mx-auto px-4 mb-20" id="popular">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-black text-emerald-900">Featured Freshness</h2>
              <p className="text-zinc-500 text-sm mt-1">Best selling products requested by customers</p>
            </div>
            <div className="flex bg-emerald-50 p-1 rounded-2xl border border-emerald-100">
              <button className="px-6 py-2 bg-white rounded-xl shadow-sm text-sm font-black text-emerald-700">All</button>
              <button className="px-6 py-2 text-sm font-bold text-zinc-500 hover:text-emerald-600 transition-colors">Vegetables</button>
              <button className="px-6 py-2 text-sm font-bold text-zinc-500 hover:text-emerald-600 transition-colors">Fruits</button>
              <button className="px-6 py-2 text-sm font-bold text-zinc-500 hover:text-emerald-600 transition-colors">Grocery</button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* --- Discount / Offer Section --- */}
        <section className="max-w-7xl mx-auto px-4 mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative bg-[#ffe8d6] rounded-[2.5rem] p-10 overflow-hidden group shadow-lg">
              <div className="relative z-10 w-2/3">
                <span className="text-orange-600 font-black uppercase text-xs tracking-widest mb-2 block">Summer Special</span>
                <h3 className="text-3xl font-black text-orange-950 mb-4 leading-tight italic">Sweet & Organic Seasonal Fruits</h3>
                <p className="text-orange-900/60 text-sm mb-8">Get flat 20% discount on every fruit purchase this weekend.</p>
                <button className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-orange-600/30 hover:bg-orange-700 transition-all hover:scale-105 active:scale-95">
                  Grab Deal
                </button>
              </div>
              <img 
                src="https://picsum.photos/seed/fruits-deal/400/400" 
                className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-1/2 rotate-12 group-hover:rotate-0 transition-transform duration-700 mix-blend-multiply opacity-80" 
                referrerPolicy="no-referrer"
                alt="Fruit Deal"
              />
            </div>
            <div className="relative bg-[#d8f3dc] rounded-[2.5rem] p-10 overflow-hidden group shadow-lg">
              <div className="relative z-10 w-2/3">
                <span className="text-emerald-700 font-black uppercase text-xs tracking-widest mb-2 block">Weekly Offer</span>
                <h3 className="text-3xl font-black text-emerald-950 mb-4 leading-tight italic">Fresh Hilsa Fish Direct from River</h3>
                <p className="text-emerald-900/60 text-sm mb-8">Save up to ৳200 on fresh river fish collection. Limited stock!</p>
                <button className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95">
                  Order Now
                </button>
              </div>
              <img 
                src="https://picsum.photos/seed/fish-deal/400/400" 
                className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-1/2 -rotate-12 group-hover:rotate-0 transition-transform duration-700 mix-blend-multiply opacity-80" 
                referrerPolicy="no-referrer"
                alt="Fish Deal"
              />
            </div>
          </div>
        </section>

        {/* --- Why Choose Us Section --- */}
        <section className="bg-emerald-900 overflow-hidden py-20 relative">
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-800 rounded-full translate-x-1/2 -translate-y-1/2 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-700 rounded-full -translate-x-1/2 translate-y-1/2 opacity-20 blur-3xl"></div>

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white italic mb-4 drop-shadow-md">Why Shop With Us?</h2>
              <p className="text-emerald-100/60 max-w-xl mx-auto">We are committed to delivering the best quality grocery products at your doorstep with 100% satisfaction.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 text-center hover:bg-white/10 transition-colors group">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-6 group-hover:scale-110 transition-transform border border-white/5 italic font-black text-2xl">01</div>
                <Truck className="mx-auto mb-6 text-emerald-400" size={48} />
                <h3 className="text-white font-black text-xl mb-3">Fast Delivery</h3>
                <p className="text-emerald-100/60 text-sm italic">Same day delivery in major cities with real-time tracking.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 text-center hover:bg-white/10 transition-colors group">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-6 group-hover:scale-110 transition-transform border border-white/5 italic font-black text-2xl">02</div>
                <Leaf className="mx-auto mb-6 text-emerald-400" size={48} />
                <h3 className="text-white font-black text-xl mb-3">100% Organic</h3>
                <p className="text-emerald-100/60 text-sm italic">Chemical-free and farm-fresh products guaranteed every time.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 text-center hover:bg-white/10 transition-colors group">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-6 group-hover:scale-110 transition-transform border border-white/5 italic font-black text-2xl">03</div>
                <CreditCard className="mx-auto mb-6 text-emerald-400" size={48} />
                <h3 className="text-white font-black text-xl mb-3">Cash on Delivery</h3>
                <p className="text-emerald-100/60 text-sm italic">Pay after you receive and inspect your ordered products.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 text-center hover:bg-white/10 transition-colors group">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-6 group-hover:scale-110 transition-transform border border-white/5 italic font-black text-2xl">04</div>
                <ShieldCheck className="mx-auto mb-6 text-emerald-400" size={48} />
                <h3 className="text-white font-black text-xl mb-3">Trusted Service</h3>
                <p className="text-emerald-100/60 text-sm italic">Serving 50k+ happy families with pride and care since 2020.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-emerald-950 text-white pt-20 pb-10 border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-6 group cursor-pointer">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 group-hover:rotate-12 transition-transform">
                  <Leaf size={24} fill="white" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-white tracking-tighter leading-none italic">FreshMarket</h1>
                  <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-[2px]">Premium Grocery</p>
                </div>
              </div>
              <p className="text-emerald-100/40 text-sm leading-relaxed mb-8 italic">
                We bring the best quality grocery products from the farm directly to your table with the highest standards of safety and freshness.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white hover:bg-emerald-600 transition-colors border border-white/5">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white hover:bg-emerald-600 transition-colors border border-white/5">
                  <Twitter size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white hover:bg-emerald-600 transition-colors border border-white/5">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white hover:bg-emerald-600 transition-colors border border-white/5">
                  <Youtube size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-black text-lg mb-8 uppercase tracking-widest italic">Quick Links</h4>
              <ul className="space-y-4 text-emerald-100/60 text-sm font-semibold">
                <li><a href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2">Home</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2">All Products</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2">Special Offers</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2">Track Order</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors flex items-center gap-2">My Account</a></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-white font-black text-lg mb-8 uppercase tracking-widest italic">Policies</h4>
              <ul className="space-y-4 text-emerald-100/60 text-sm font-semibold">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Return & Refund</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Customer Reviews</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-black text-lg mb-8 uppercase tracking-widest italic">Contact Us</h4>
              <ul className="space-y-4 text-emerald-100/60 text-sm">
                <li className="flex items-start gap-4">
                  <MapPin className="text-emerald-400 shrink-0" size={20} />
                  <span className="italic leading-relaxed">House #12, Road #04, Sector 10, Uttara, Dhaka-1230, Bangladesh</span>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="text-emerald-400 shrink-0" size={20} />
                  <span className="font-bold">+880 1234-567890</span>
                </li>
                <li className="flex items-center gap-4">
                  <Mail className="text-emerald-400 shrink-0" size={20} />
                  <span className="font-bold">support@freshmarket.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-emerald-100/30 text-xs uppercase tracking-[2px] font-bold">
              © 2026 FreshMarket Limited. Crafted with ❤️ for Freshness.
            </p>
            <div className="flex items-center gap-4 grayscale opacity-40">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-4" referrerPolicy="no-referrer" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" referrerPolicy="no-referrer" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" referrerPolicy="no-referrer" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/Bkash_logo.png" alt="bKash" className="h-5" referrerPolicy="no-referrer" />
            </div>
            <div className="text-right text-[10px] text-emerald-100/20 uppercase font-black uppercase-widest">
              Developed by: <span className="text-emerald-400">Mohammad Shafiqul Islam</span> <br/>
              Roll: 3206
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
