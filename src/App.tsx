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
function ProductCard({ product }: { product: typeof products[0], key?: any }) {
  const handleAddToCart = () => {
    alert(`${product.name} has been added to your cart!`);
  };

  return (
    /* Product Start */
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col group"
      id={`product-${product.id}`}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src={product.image} 
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-[#f85606] transition-colors">
          <Heart size={18} />
        </button>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-gray-800 text-sm font-medium line-clamp-2 h-10 mb-2">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">({product.reviews})</span>
        </div>

        <div className="mt-auto">
          <div className="text-[#f85606] font-bold text-lg mb-3">
            ৳{product.price.toLocaleString()}
          </div>
          <button 
            onClick={handleAddToCart}
            className="w-full bg-[#f85606] text-white py-2 rounded font-medium text-sm hover:bg-[#d44805] transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
    /* Product End */
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#eff0f5] font-sans" id="ecommerce-app">
      {/* Header Section */}
      <header className="bg-white sticky top-0 z-50 shadow-sm" id="header">
        {/* Top Navbar */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 md:gap-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-600">
              <Menu size={24} />
            </button>
            <div className="text-2xl font-black text-[#f85606] tracking-tight">
              ShopBD
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-[#f85606] transition-colors">Home</a>
            <a href="#" className="hover:text-[#f85606] transition-colors">Products</a>
            <a href="#" className="hover:text-[#f85606] transition-colors">Contact</a>
          </div>

          <div className="flex-grow max-w-2xl relative group hidden sm:block">
            <input 
              type="text" 
              placeholder="Search in ShopBD" 
              className="w-full bg-[#eff0f5] border-none rounded-md px-4 py-2 pr-12 focus:outline-none focus:ring-1 focus:ring-[#f85606] transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#f85606] p-1.5 rounded text-white">
              <Search size={18} />
            </button>
          </div>

          <div className="flex items-center gap-4 md:gap-6 text-gray-600">
            <button className="hover:text-[#f85606] transition-colors">
              <User size={24} />
            </button>
            <button className="hover:text-[#f85606] transition-colors relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-[#f85606] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                0
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Banner Section */}
        <section className="mb-10" id="banner">
          <div className="relative h-[250px] md:h-[400px] rounded-xl overflow-hidden bg-[#242424]">
            <img 
              src="https://picsum.photos/seed/tech/1200/400" 
              alt="Promotion Banner" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 text-white max-w-2xl">
              <span className="uppercase tracking-widest text-[#f85606] font-bold text-sm mb-2">Flash Sale is Live</span>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Up to 70% Off on Global Tech Gadgets!</h1>
              <p className="text-gray-300 mb-8 hidden md:block">Experience the best quality electronics with free delivery and 7 days return policy.</p>
              <div>
                <button className="bg-[#f85606] text-white px-8 py-3 rounded-md font-bold hover:bg-[#d44805] transition-all transform active:scale-95 shadow-lg">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid Section */}
        <section id="products-grid">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1 h-6 bg-[#f85606] rounded-full inline-block"></span>
              Featured Products
            </h2>
            <a href="#" className="text-[#f85606] text-sm font-semibold hover:underline">View All</a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Brand Highlights */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6" id="highlights">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-50 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 text-[#f85606] rounded-full flex items-center justify-center shrink-0">
              <ShoppingCart size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Free Delivery</h4>
              <p className="text-xs text-gray-500">On orders over ৳1,000</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-50 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 text-[#f85606] rounded-full flex items-center justify-center shrink-0">
              <Star size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Verified Quality</h4>
              <p className="text-xs text-gray-500">100% genuine products</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-50 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 text-[#f85606] rounded-full flex items-center justify-center shrink-0">
              <Heart size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Safe Payment</h4>
              <p className="text-xs text-gray-500">Secure transactions</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-white mt-20 border-t border-gray-200" id="footer">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-1">
              <div className="text-2xl font-black text-[#f85606] mb-4">ShopBD</div>
              <p className="text-sm text-gray-500 leading-relaxed">
                The leading ecommerce marketplace in Bangladesh, bringing millions of products to your doorstep with reliability and speed.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-gray-800 mb-4">Customer Care</h5>
              <ul className="text-sm text-gray-500 space-y-2">
                <li><a href="#" className="hover:text-[#f85606]">Help Center</a></li>
                <li><a href="#" className="hover:text-[#f85606]">How to Buy</a></li>
                <li><a href="#" className="hover:text-[#f85606]">Returns & Refunds</a></li>
                <li><a href="#" className="hover:text-[#f85606]">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-gray-800 mb-4">ShopBD</h5>
              <ul className="text-sm text-gray-500 space-y-2">
                <li><a href="#" className="hover:text-[#f85606]">About Us</a></li>
                <li><a href="#" className="hover:text-[#f85606]">Digital Payments</a></li>
                <li><a href="#" className="hover:text-[#f85606]">Careers</a></li>
                <li><a href="#" className="hover:text-[#f85606]">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-gray-800 mb-4">Newsletter</h5>
              <p className="text-sm text-gray-500 mb-4">Get the latest deals and coupons.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm grow focus:outline-none focus:border-[#f85606]" 
                />
                <button className="bg-[#f85606] text-white px-4 py-2 rounded text-sm font-bold">Join</button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© 2026 ShopBD Limited. All Rights Reserved.</p>
            <div className="text-right">
              <p className="font-medium text-gray-600">Developer Information:</p>
              <p>Name: <span className="text-[#f85606] font-bold text-base">Mohammad Shafiqul Islam</span></p>
              <p>Roll: <span className="font-mono text-gray-800">XXXX</span></p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
