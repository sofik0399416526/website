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
  Trash2
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

function ProductCard({ product, onAdd, isAdding }: { product: Product; onAdd: (p: Product) => void, isAdding: boolean, key: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden border border-emerald-50 hover:shadow-xl transition-all duration-300 flex flex-col group relative"
    >
      {product.discount && (
        <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
          {product.discount}
        </div>
      )}
      <div className="relative aspect-square overflow-hidden bg-emerald-50/30">
        <img src={product.image} alt={product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-zinc-400 hover:text-emerald-600 transition-colors">
          <Heart size={16} />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mb-1">{product.category}</span>
        <h3 className="text-zinc-800 text-sm font-semibold line-clamp-2 h-10 mb-1 group-hover:text-emerald-700 transition-colors">{product.name}</h3>
        <p className="text-zinc-400 text-[11px] mb-3">{product.unit}</p>
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-emerald-700 font-black text-lg">৳{product.price}</span>
            {product.oldPrice && <span className="text-zinc-400 line-through text-xs italic">৳{product.oldPrice}</span>}
          </div>
          <button disabled={isAdding} onClick={() => onAdd(product)} className={`w-full ${isAdding ? 'bg-zinc-400' : 'bg-emerald-600 hover:bg-emerald-700'} text-white py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95`}>
            <ShoppingCart size={16} /> {isAdding ? 'Adding...' : 'Add to Cart'}
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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) { setCartItems([]); return; }
    const cartRef = collection(db, 'users', user.uid, 'cart');
    const unsub = onSnapshot(cartRef, (snap) => {
      setCartItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % BANNERS.length), 5000);
    const scroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', scroll);
    return () => { clearInterval(timer); window.removeEventListener('scroll', scroll); };
  }, []);

  const handleLogin = async () => { try { await loginWithGoogle(); } catch (e) { console.error(e); } };
  const handleLogout = async () => { await logout(); setUser(null); };

  const handleAddToCartClick = async (product: Product) => {
    if (!user) { handleLogin(); return; }
    setAddingId(product.id);
    try {
      await addToCart(user.uid, { id: product.id, name: product.name, price: product.price, image: product.image });
    } finally { setAddingId(null); }
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const cartTotal = useMemo(() => cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cartItems]);

  return (
    <div className="min-h-screen bg-[#fcfdfc] font-sans text-zinc-900 overflow-x-hidden">
      <header className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' : 'bg-white py-4 border-b border-emerald-50'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => { setActiveCategory('All'); setSearchQuery(''); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
              <Leaf size={24} fill="white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-black text-emerald-800 tracking-tighter leading-none italic">FreshMarket</h1>
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-[2px]">Premium Grocery</p>
            </div>
          </div>
          <div className="hidden md:flex flex-grow max-w-2xl relative">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for fresh items..." className="w-full bg-zinc-100/50 border-emerald-100 border rounded-2xl px-6 py-2.5 pr-14 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all text-sm" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-600 p-2 rounded-xl text-white"><Search size={18} /></div>
          </div>
          <div className="flex items-center gap-2 md:gap-5">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">Welcome</p>
                  <p className="text-xs font-black text-emerald-800 italic">{user.displayName}</p>
                </div>
                <div className="relative group">
                  <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-xl border-2 border-emerald-100 cursor-pointer" />
                  <button onClick={handleLogout} className="absolute top-12 right-0 bg-white border border-rose-100 text-rose-600 p-2 rounded-xl text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 whitespace-nowrap"><LogOut size={14} /> Log Out</button>
                </div>
              </div>
            ) : (
              <button onClick={handleLogin} className="hidden lg:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all border border-emerald-100/50"><User size={18} /> Login</button>
            )}
            <button onClick={() => setIsCartOpen(true)} className="relative bg-emerald-600 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-90 transition-transform">
              <ShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">{cartItems.reduce((a, b) => a + b.quantity, 0)}</span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: '100% '}} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col">
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <h2 className="text-2xl font-black text-emerald-900 italic">Your Basket</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors"><X size={24} /></button>
              </div>
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <ShoppingCart size={80} className="mb-4" />
                    <p className="font-bold uppercase tracking-[2px]">Empty Basket</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-20 h-20 bg-zinc-50 rounded-2xl overflow-hidden shrink-0 border border-emerald-50">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-zinc-800 text-sm leading-tight mb-1">{item.name}</h4>
                        <p className="text-emerald-700 font-black text-base">৳{item.price}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center bg-zinc-50 rounded-lg p-1 border border-zinc-100">
                            <button onClick={() => updateCartQuantity(user.uid, item.id, item.quantity - 1)} className="p-1"><Minus size={14} /></button>
                            <span className="px-3 font-bold text-sm">{item.quantity}</span>
                            <button onClick={() => updateCartQuantity(user.uid, item.id, item.quantity + 1)} className="p-1"><Plus size={14} /></button>
                          </div>
                          <button onClick={() => removeFromCart(user.uid, item.id)} className="text-rose-400 hover:text-rose-600"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {cartItems.length > 0 && (
                <div className="p-8 bg-zinc-50 border-t border-zinc-100 space-y-4">
                  <div className="flex justify-between items-center text-lg"><span className="font-bold text-zinc-500 uppercase">Subtotal</span><span className="font-black text-2xl text-emerald-900">৳{cartTotal}</span></div>
                  <button onClick={() => alert("Checkout placeholder")} className="w-full bg-emerald-600 text-white py-4 rounded-[2rem] font-black text-lg hover:bg-emerald-700 shadow-xl active:scale-95">Checkout Now</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="pt-24 pb-20">
        <section className="max-w-7xl mx-auto px-4 mb-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.name)} className={`flex items-center gap-2 border px-5 py-2.5 rounded-2xl whitespace-nowrap shadow-sm text-sm font-semibold transition-all ${activeCategory === cat.name ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-emerald-50 text-zinc-700'}`}>
                <span className="text-xl">{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>
        </section>

        {!searchQuery && activeCategory === 'All' && (
          <section className="max-w-7xl mx-auto px-4 mb-16 h-[300px] md:h-[450px]">
            <div className="relative h-full rounded-[2rem] overflow-hidden shadow-2xl group">
              <AnimatePresence mode="wait">
                <motion.div key={currentSlide} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className={`absolute inset-0 ${BANNERS[currentSlide].bgColor}`}>
                  <img src={BANNERS[currentSlide].image} alt={BANNERS[currentSlide].title} className="w-full h-full object-cover mix-blend-overlay opacity-50" />
                  <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 text-white">
                    <span className="uppercase tracking-[4px] font-black text-xs text-emerald-100 mb-4">{BANNERS[currentSlide].subtitle}</span>
                    <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight italic">{BANNERS[currentSlide].title}</h2>
                    <button className="bg-white text-emerald-900 px-10 py-4 w-fit rounded-2xl font-black text-lg shadow-xl active:scale-95">Shop Now</button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
        )}

        <section className="max-w-7xl mx-auto px-4 mb-20">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-emerald-900 italic uppercase tracking-tighter">{activeCategory} Selection</h2>
            <p className="text-zinc-500 text-sm mt-1">Farm fresh quality guaranteed for your family</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => <ProductCard key={p.id} product={p} onAdd={handleAddToCartClick} isAdding={addingId === p.id} />)}
          </div>
          {filteredProducts.length === 0 && <p className="text-center py-20 text-zinc-400 font-bold uppercase tracking-widest">No items found</p>}
        </section>

        <section className="bg-emerald-900 py-20">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            {[{Icon: Truck, t: "Fast Delivery"}, {Icon: Leaf, t: "100% Organic"}, {Icon: CreditCard, t: "Secure Pay"}, {Icon: ShieldCheck, t: "Top Trusted"}].map((f, i) => (
              <div key={i} className="text-center p-8 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 group hover:bg-white/10 transition-all">
                <f.Icon className="mx-auto mb-6 text-emerald-400 group-hover:scale-110 transition-transform" size={48} />
                <h3 className="text-white font-black text-xl mb-2">{f.t}</h3>
                <p className="text-emerald-100/50 text-sm">Best in class service for you</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-emerald-950 text-white py-12 text-center border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Leaf className="text-emerald-400" />
            <h1 className="text-2xl font-black italic">FreshMarket</h1>
          </div>
          <p className="max-w-md mx-auto text-emerald-100/40 text-sm mb-10">Premium grocery shopping experience delivered directly to your door.</p>
          <div className="pt-10 border-t border-white/5 text-[10px] uppercase font-bold text-emerald-100/20 tracking-widest flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2026 FreshMarket. Freshness in Every Byte.</p>
            <div>Developer: <span className="text-emerald-400">Mohammad Shafiqul Islam</span> | Roll: 3206</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
