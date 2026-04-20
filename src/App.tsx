/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingCart, Search, Menu, User, Heart, Star } from 'lucide-react';
import { motion } from 'motion/react';

// Product Data for the grid
const products = [
  {
    id: 1,
    name: "Wireless Noise Cancelling Headphones",
    price: 12500,
    image: "https://picsum.photos/seed/headphones/400/400",
    rating: 4.8,
    reviews: 124
  },
  {
    id: 2,
    name: "Premium Leather Wallet - Black",
    price: 1200,
    image: "https://picsum.photos/seed/wallet/400/400",
    rating: 4.5,
    reviews: 89
  },
  {
    id: 3,
    name: "Smart Watch Series 7 (Clone)",
    price: 3500,
    image: "https://picsum.photos/seed/watch/400/400",
    rating: 4.2,
    reviews: 256
  },
  {
    id: 4,
    name: "Mechanical Gaming Keyboard - RGB",
    price: 4800,
    image: "https://picsum.photos/seed/keyboard/400/400",
    rating: 4.9,
    reviews: 42
  },
  {
    id: 5,
    name: "Ergonomic Office Chair - Mesh",
    price: 15500,
    image: "https://picsum.photos/seed/chair/400/400",
    rating: 4.7,
    reviews: 67
  },
  {
    id: 6,
    name: "Stainless Steel Water Bottle - 1L",
    price: 850,
    image: "https://picsum.photos/seed/bottle/400/400",
    rating: 4.4,
    reviews: 112
  }
];

/**
 * Product Card Component
 * Reusable layout for each product in the grid
 */
function ProductCard({ product, isFeatured = false }: { product: typeof products[0], isFeatured?: boolean, key?: any }) {
  const handleAddToCart = () => {
    alert(`${product.name} has been added to your cart!`);
  };

  return (
    /* Product Start */
    <motion.div 
      whileHover={{ y: -4, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className={`bg-white rounded-xl border border-zinc-200 overflow-hidden transition-all duration-300 flex flex-col group ${isFeatured ? 'md:col-span-2 md:row-span-2' : ''}`}
      id={`product-${product.id}`}
    >
      <div className={`relative overflow-hidden bg-zinc-50 ${isFeatured ? 'aspect-video md:aspect-auto md:flex-grow' : 'aspect-square'}`}>
        <img 
          src={product.image} 
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <button className="absolute top-2 right-2 p-2 bg-white/60 backdrop-blur-md rounded-lg text-zinc-400 hover:text-orange-600 transition-colors">
          <Heart size={16} />
        </button>
        {isFeatured && (
          <div className="absolute top-2 left-2 bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className={`font-semibold text-zinc-900 truncate ${isFeatured ? 'text-lg' : 'text-sm'}`}>
            {product.name}
          </h3>
          {!isFeatured && (
            <div className="flex items-center text-zinc-400 text-[10px]">
              <Star size={10} className="text-orange-400 mr-0.5" fill="currentColor" />
              {product.rating}
            </div>
          )}
        </div>
        
        <div className="flex items-end justify-between mt-1">
          <div>
            <p className="text-orange-600 font-bold text-base">
              ৳{product.price.toLocaleString()}
            </p>
            {isFeatured && (
              <div className="flex items-center gap-1 mt-1">
                <div className="flex text-orange-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-[10px] text-zinc-400">({product.reviews} reviews)</span>
              </div>
            )}
          </div>
          <button 
            onClick={handleAddToCart}
            className={`bg-orange-600 text-white rounded-lg font-bold transition-all hover:bg-orange-700 shadow-sm active:scale-95 ${isFeatured ? 'px-6 py-2.5 text-sm' : 'p-2'}`}
          >
            {isFeatured ? 'Add to Cart' : <ShoppingCart size={16} />}
          </button>
        </div>
      </div>
    </motion.div>
    /* Product End */
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#f4f4f5] font-sans antialiased text-zinc-900" id="ecommerce-app">
      {/* Header Section */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50 h-[60px] flex items-center" id="header">
        <div className="max-w-7xl mx-auto w-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-zinc-600">
              <Menu size={20} />
            </button>
            <div className="text-2xl font-bold text-orange-600 tracking-tight">
              SHOPLY
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-600">
            <a href="#" className="hover:text-orange-600 transition-colors">Home</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Products</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-4 text-zinc-600">
            <div className="hidden sm:flex items-center bg-zinc-100 rounded-lg px-3 py-1.5 focus-within:ring-1 focus-within:ring-orange-500/20 transition-all">
              <Search size={16} className="text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none text-sm px-2 focus:outline-none w-32 md:w-48"
              />
            </div>
            <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors">
              <User size={18} />
            </button>
            <button className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-900 hover:bg-zinc-200 transition-colors relative">
              <ShoppingCart size={16} />
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8 space-y-6">
        {/* Banner Section - Immersive Gradient Card */}
        <section className="h-[180px] md:h-[240px]" id="banner">
          <div className="w-full h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl flex items-center px-8 md:px-16 text-white shadow-lg relative overflow-hidden group">
            <div className="relative z-10 w-full md:w-2/3">
              <h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight">Flash Sale is Live!</h1>
              <p className="text-orange-50 opacity-90 text-sm md:text-lg mb-6">Up to 50% off on the latest tech essentials and daily upgrades.</p>
              <button className="bg-white text-orange-600 px-6 py-2 rounded-lg font-bold text-sm hover:shadow-xl transition-all active:scale-95">
                Explore Now
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl group-hover:bg-white/20 transition-colors"></div>
          </div>
        </section>

        {/* Product Grid Section - Bento Grid Style */}
        <section id="products-grid">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-zinc-800 tracking-tight">Featured Collection</h2>
            <div className="h-[1px] flex-grow mx-4 bg-zinc-200"></div>
            <a href="#" className="text-orange-600 text-xs font-bold uppercase tracking-wider hover:opacity-80">View All</a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} isFeatured={index === 0} />
            ))}
          </div>
        </section>

        {/* Brand Highlights - Compact Bento elements */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="highlights">
          <div className="bg-white p-5 rounded-xl border border-zinc-200 flex items-center gap-4 hover:shadow-sm transition-shadow">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center shrink-0">
              <ShoppingCart size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-zinc-900">Next Day Delivery</h4>
              <p className="text-[11px] text-zinc-500 uppercase tracking-wide">For select items</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-zinc-200 flex items-center gap-4 hover:shadow-sm transition-shadow">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center shrink-0">
              <Star size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-zinc-900">Global Warranty</h4>
              <p className="text-[11px] text-zinc-500 uppercase tracking-wide">Authorized support</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-zinc-200 flex items-center gap-4 hover:shadow-sm transition-shadow">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center shrink-0">
              <Heart size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-zinc-900">Pay on Delivery</h4>
              <p className="text-[11px] text-zinc-500 uppercase tracking-wide">Safe and secure</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-zinc-900 text-zinc-400 h-[60px] flex items-center border-t border-zinc-800" id="footer">
        <div className="max-w-7xl mx-auto w-full px-8 flex justify-between items-center text-[11px]">
          <div>&copy; 2026 SHOPLY Modern eCommerce.</div>
          <div className="flex gap-8 items-center uppercase tracking-widest font-medium">
            <span>Developer: <b className="text-zinc-200">Mohammad Shafiqul Islam</b></span>
            <span className="bg-zinc-800 px-2 py-1 rounded">Roll: <b className="text-zinc-200">3206</b></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
