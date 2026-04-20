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
  MapPin,
  X,
  LogOut,
  Plus,
  Minus,
  Trash2,
  Trash
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo } from 'react';
import { 
  auth, 
  loginWithGoogle, 
  logout, 
  onAuthStateChanged, 
  addToCart, 
  onSnapshot, 
  collection, 
  db,
  updateCartQuantity,
  removeFromCart
} from './firebase';

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
  { id: 0, name: "All", icon: "🍱", count: "Total" },
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
  { id: 1, title: "Fresh Vegetables Daily", subtitle: "Up to 30% Off", image: "https://picsum.photos/seed/grocery-banner1/1200/500", bgColor: "bg-[#2d5a27]" },
  { id: 2, title: "Premium Quality Fruits", subtitle: "Direct from the Farm", image: "https://picsum.photos/seed/grocery-banner2/1200/500", bgColor: "bg-[#5c4033]" },
  { id: 3, title: "Pure Organic Honey", subtitle: "100% Genuine Guarantee", image: "https://picsum.photos/seed/grocery-banner3/1200/500", bgColor: "bg-[#a67c00]" },
];

// --- Components ---

interface ProductCardProps {
  product: Product;
  onAdd: (p: Product) => void;
  isAdding: boolean;
  key?: any;
}

function ProductCard({ product, onAdd, isAdding }: ProductCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
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
            disabled={isAdding}
            onClick={() => onAdd(product)}
            className={`w-full ${isAdding ? 'bg-zinc-400' : 'bg-emerald-600 hover:bg-emerald-700'} text-white py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95`}
          >
            <ShoppingCart size={16} />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // --- Auth & Cart Listeners ---
  useEffect(() => {
    console.log("App mounted. Firebase initialized.");
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      console.log("Auth state changed:", u ? u.email : "No user");
      setUser(u);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }

    const unsubCart = onSnapshot(collection(db, 'users', user.uid, 'cart'), (snap) => {
      setCartItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubCart();
  }, [user]);

  // --- Animation & Scroll ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % BANNERS.length), 6000);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // --- Handlers ---
  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
      console.log("Login sequence completed");
    } catch (err: any) {
      console.error("HandleLogin Error:", err);
      alert(err.message || "An unknown login error occurred. Please check your browser's popup settings.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      alert("Please login first!");
      handleLogin();
      return;
    }
    setAddingId(product.id);
    try {
      await addToCart(user.uid, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    } catch (err) {
      console.error(err);
    } finally {
      setAddingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [searchQuery, activeCategory]);

  const cartTotal = useMemo(() => cartItems.reduce((a, b) => a + (b.price * b.quantity), 0), [cartItems]);

  return (
    <div className="min-h-screen bg-[#fcfdfc] font-sans text-zinc-900 overflow-x-hidden">
      
      {/* 1. Header/Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-white py-4 border-b border-emerald-50'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => { setActiveCategory('All'); setSearchQuery(''); window.scrollTo({top:0, behavior:'smooth'}); }}>
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Leaf size={24} fill="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-emerald-800 tracking-tighter italic">FreshMarket</h1>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Premium Grocery</p>
            </div>
          </div>

          <div className="flex-grow max-w-2xl relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vegetables, fruits, meat..." 
              className="w-full bg-zinc-100/50 border border-emerald-100 rounded-2xl px-5 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-sm"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-600 text-white p-2 rounded-xl"><Search size={18} /></div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            {user ? (
               <div className="flex items-center gap-3 group relative">
                 <div className="hidden lg:block text-right">
                    <p className="text-[10px] font-bold text-zinc-400 tracking-widest">USER</p>
                    <p className="text-xs font-black text-emerald-700 italic">{user.displayName}</p>
                 </div>
                 <img src={user.photoURL} referrerPolicy="no-referrer" alt="Profile" className="w-10 h-10 rounded-xl border-2 border-emerald-100 cursor-pointer" />
                 <button onClick={handleLogout} className="absolute top-12 right-0 bg-white border border-rose-100 text-rose-600 p-2 rounded-lg text-[10px] font-black shadow-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                   <LogOut size={12} /> LOG OUT
                 </button>
               </div>
            ) : (
              <button 
                onClick={handleLogin} 
                disabled={isLoggingIn}
                className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 md:px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-100 active:scale-95 transition-all"
              >
                {isLoggingIn ? '...' : <><User size={18} className="hidden xs:block" /><span className="xs:hidden">Login</span><span className="hidden xs:inline">Login</span></>}
              </button>
            )}

            <button onClick={() => setIsCartOpen(true)} className="relative bg-emerald-600 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-90 transition-all">
              <ShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartItems.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setIsCartOpen(false)} className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-2xl font-black text-emerald-800 italic">My Basket</h2>
                <button onClick={()=>setIsCartOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full"><X size={24}/></button>
              </div>
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                    <ShoppingCart size={100} className="mb-4 text-emerald-600" />
                    <p className="font-bold uppercase tracking-widest">Basket is empty</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-20 h-20 bg-zinc-50 rounded-2xl overflow-hidden border">
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-emerald-700 font-black text-base mt-0.5">৳{item.price}</p>
                        <div className="flex items-center gap-4 mt-2">
                           <div className="flex items-center bg-zinc-50 rounded-lg p-1 border">
                              <button onClick={()=>updateCartQuantity(user.uid, item.id, item.quantity - 1)} className="p-1 hover:text-emerald-600"><Minus size={14}/></button>
                              <span className="px-3 font-bold text-sm">{item.quantity}</span>
                              <button onClick={()=>updateCartQuantity(user.uid, item.id, item.quantity + 1)} className="p-1 hover:text-emerald-600"><Plus size={14}/></button>
                           </div>
                           <button onClick={()=>removeFromCart(user.uid, item.id)} className="text-rose-400 hover:text-rose-600"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {cartItems.length > 0 && (
                <div className="p-8 bg-zinc-50 border-t space-y-4">
                  <div className="flex justify-between items-center text-lg"><span className="font-bold text-zinc-400 tracking-widest uppercase text-xs">Total Amount</span><span className="font-black text-2xl text-emerald-800">৳{cartTotal}</span></div>
                  <button onClick={()=>alert("Checkout feature coming soon!")} className="w-full bg-emerald-600 text-white py-4 rounded-[2rem] font-black text-lg hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 active:scale-95 transition-all">Proceed to Checkout</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="pt-24 md:pt-32 pb-20">
        
        {/* 2. Category Menu */}
        <section className="max-w-7xl mx-auto px-4 mb-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 border px-5 py-2.5 rounded-2xl whitespace-nowrap shadow-sm text-sm font-semibold transition-all ${activeCategory === cat.name ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-emerald-50 text-zinc-700 hover:border-emerald-200'}`}
              >
                <span className="text-xl">{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* 3. Hero Section (Banner Slider) */}
        {!searchQuery && activeCategory === 'All' && (
          <section className="max-w-7xl mx-auto px-4 mb-16">
            <div className="relative h-[250px] md:h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl group">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentSlide} 
                  initial={{opacity:0, scale:1.05}} 
                  animate={{opacity:1, scale:1}} 
                  exit={{opacity:0, scale:0.95}} 
                  transition={{duration:0.8}} 
                  className={`absolute inset-0 ${BANNERS[currentSlide].bgColor}`}
                >
                  <img src={BANNERS[currentSlide].image} alt="" className="w-full h-full object-cover mix-blend-overlay opacity-60" />
                  <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 text-white">
                    <span className="uppercase tracking-[4px] font-black text-[10px] md:text-xs text-emerald-100 mb-2 md:mb-4">{BANNERS[currentSlide].subtitle}</span>
                    <h2 className="text-3xl md:text-7xl font-black mb-6 md:mb-8 leading-tight italic">{BANNERS[currentSlide].title}</h2>
                    <button className="bg-white text-emerald-900 px-8 md:px-10 py-3 md:py-4 w-fit rounded-2xl font-black text-sm md:text-lg hover:scale-105 active:scale-95 transition-all shadow-xl">Shop Now</button>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 flex gap-2 md:gap-3 z-10">
                {BANNERS.map((_, idx) => (
                  <button key={idx} onClick={()=>setCurrentSlide(idx)} className={`h-1 md:h-2 transition-all rounded-full ${idx === currentSlide ? 'w-8 md:w-12 bg-white' : 'w-2 bg-white/40'}`} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 6. Popular Categories Section */}
        {activeCategory === 'All' && !searchQuery && (
          <section className="max-w-7xl mx-auto px-4 mb-20 scroll-mt-20" id="categories">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-emerald-900 italic">Popular Categories</h2>
                <p className="text-xs text-zinc-500 font-medium">Explore what most people are picking today</p>
              </div>
              <button className="text-emerald-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">View All <Plus size={14} /></button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {CATEGORIES.slice(1).map((cat) => (
                <motion.div 
                  key={cat.id} 
                  whileHover={{ y:-5, shadow:'0 20px 25px -5px rgb(0 0 0 / 0.1)' }} 
                  onClick={() => setActiveCategory(cat.name)}
                  className="bg-white p-5 rounded-3xl border border-emerald-50 text-center cursor-pointer group"
                >
                  <div className="text-4xl mb-3 py-4 bg-emerald-50/50 rounded-2xl group-hover:bg-emerald-100 transition-colors">{cat.icon}</div>
                  <h4 className="font-bold text-zinc-800 text-xs tracking-tighter">{cat.name}</h4>
                  <p className="text-[9px] text-zinc-400 font-black uppercase mt-1 tracking-widest">{cat.count}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Featured Products Section */}
        <section className="max-w-7xl mx-auto px-4 mb-20 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-emerald-900 italic uppercase">
                {searchQuery ? `Searching for "${searchQuery}"` : activeCategory === 'All' ? 'Featured Freshness' : activeCategory}
              </h2>
              <p className="text-xs text-zinc-500 font-medium">{filteredProducts.length} items found for your selection</p>
            </div>
          </div>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  onAdd={handleAddToCart} 
                  isAdding={addingId === p.id} 
                />
              ))}
            </div>
          ) : (
             <div className="py-20 text-center flex flex-col items-center justify-center opacity-30">
                <Search size={64} className="mb-4" />
                <p className="font-black uppercase tracking-[3px]">No matching products FOUND</p>
                <button onClick={()=>{setSearchQuery(''); setActiveCategory('All');}} className="mt-4 text-emerald-600 underline font-bold">Clear All Filters</button>
             </div>
          )}
        </section>

        {/* 5. Discount / Offer Section */}
        {activeCategory === 'All' && !searchQuery && (
          <section className="max-w-7xl mx-auto px-4 mb-20">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
               <div className="relative bg-[#ffe8d6] rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-xl group">
                 <div className="relative z-10 max-w-[60%]">
                    <span className="bg-white/50 backdrop-blur-sm text-orange-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Flash Deal</span>
                    <h3 className="text-3xl md:text-4xl font-black text-orange-950 mb-4 leading-tight italic">Sweet Seasonal Fruits</h3>
                    <button className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-orange-700 transition-all shadow-lg active:scale-95">Grab Now</button>
                 </div>
                 <img src="https://picsum.photos/seed/fruit-deal/400/400" className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-1/2 rotate-12 group-hover:rotate-0 transition-transform duration-700 mix-blend-multiply opacity-80" alt="" />
               </div>
               <div className="relative bg-[#d1e9ff] rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-xl group">
                 <div className="relative z-10 max-w-[60%]">
                    <span className="bg-white/50 backdrop-blur-sm text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Weekly Best</span>
                    <h3 className="text-3xl md:text-4xl font-black text-blue-950 mb-4 leading-tight italic">Fresh Sea Fish Special</h3>
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg active:scale-95">Order Today</button>
                 </div>
                 <img src="https://picsum.photos/seed/fish-deal/400/400" className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-1/2 rotate-12 group-hover:rotate-0 transition-transform duration-700 mix-blend-multiply opacity-80" alt="" />
               </div>
            </div>
          </section>
        )}

        {/* 7. Why Choose Us Section */}
        <section className="bg-emerald-900 py-20 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-800 rounded-full translate-x-1/2 -translate-y-1/2 opacity-20 blur-3xl"></div>
           <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
              <h2 className="text-3xl md:text-5xl font-black text-white italic mb-12 drop-shadow-md tracking-tighter">Why Shop from FreshMarket?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                 {[
                   { Icon: Truck, t: "Fast Delivery", d: "Same day shipping in Dhaka" },
                   { Icon: Leaf, t: "100% Organic", d: "Pesticide free garden items" },
                   { Icon: CreditCard, t: "Secure Pay", d: "Cash on delivery & Bkash" },
                   { Icon: ShieldCheck, t: "Trusted Source", d: "50k+ Happy Customers" }
                 ].map((feat, i) => (
                   <div key={i} className="bg-white/5 backdrop-blur-lg p-8 rounded-[2.5rem] border border-white/10 group hover:bg-white/10 transition-all">
                      <div className="w-16 h-16 bg-emerald-700/50 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-6 group-hover:scale-110 transition-all">
                        <feat.Icon size={32} />
                      </div>
                      <h3 className="text-white font-black text-xl mb-3 tracking-tighter">{feat.t}</h3>
                      <p className="text-emerald-100/40 text-xs italic leading-relaxed">{feat.d}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>
      </main>

      {/* 8. Footer */}
      <footer className="bg-emerald-950 text-white pt-20 pb-10 border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-1">
                 <div className="flex items-center gap-2 mb-6">
                    <Leaf size={32} className="text-emerald-400" />
                    <h1 className="text-2xl font-black italic">FreshMarket</h1>
                 </div>
                 <p className="text-emerald-100/40 text-sm italic mb-8">Bringing farm freshness directly to your home with world-class logistics and quality check.</p>
                 <div className="flex gap-4">
                    {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                      <a key={i} href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-all"><Icon size={20}/></a>
                    ))}
                 </div>
              </div>
              <div>
                 <h4 className="font-black text-lg mb-8 italic text-emerald-400">Quick Menu</h4>
                 <ul className="space-y-4 text-emerald-100/60 text-sm font-bold">
                    <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Shop All</a></li>
                    <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">My Profile</a></li>
                    <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Special Offers</a></li>
                    <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Cart History</a></li>
                 </ul>
              </div>
              <div>
                 <h4 className="font-black text-lg mb-8 italic text-emerald-400">Support</h4>
                 <ul className="space-y-4 text-emerald-100/60 text-sm font-bold">
                    <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Return Policy</a></li>
                    <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Shipping Info</a></li>
                    <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Help Center</a></li>
                 </ul>
              </div>
              <div>
                 <h4 className="font-black text-lg mb-8 italic text-emerald-400">Contact Us</h4>
                 <ul className="space-y-4 text-emerald-100/60 text-xs italic">
                    <li className="flex gap-3"><MapPin size={18} className="text-emerald-500 shrink-0"/><p>House 12, Uttara, Dhaka</p></li>
                    <li className="flex gap-3"><Phone size={18} className="text-emerald-500 shrink-0"/><p>+880 1234 56789</p></li>
                    <li className="flex gap-3"><Mail size={18} className="text-emerald-500 shrink-0"/><p>help@freshmarket.com</p></li>
                 </ul>
              </div>
           </div>

           <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-[10px] text-emerald-100/20 font-black uppercase tracking-[3px]">© 2026 FreshMarket Limited. Built for Quality.</p>
              <div className="flex items-center gap-4 grayscale opacity-20">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/Bkash_logo.png" className="h-5" alt=""/>
                 <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt=""/>
                 <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt=""/>
              </div>
              <div className="text-right text-[10px] text-zinc-500 font-black uppercase tracking-tighter">
                Dev: <span className="text-emerald-600">Mohammad Shafiqul Islam</span> <br/>
                Roll: 3206
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}
