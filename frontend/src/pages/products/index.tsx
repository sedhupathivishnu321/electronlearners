import React, { useState } from 'react';
import Link from 'next/link';
import { PRODUCTS_DATA } from '../../data/productsData';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, Heart, Search, Star, Filter, Cpu } from 'lucide-react';

export default function ProductsCatalog() {
  const { addToCart, toggleWishlist, wishlist } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc'>('rating');

  const categories = ['All', 'Arduino', 'Electronics', 'Robotics', 'IoT', 'Raspberry Pi', 'AI', 'PCB', 'Embedded'];

  const filteredProducts = PRODUCTS_DATA.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return b.rating - a.rating;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header Title */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Complete STEM Catalog</span>
          <h1 className="text-3xl font-heading font-extrabold text-white mt-1">20 Physical STEM Product Kits</h1>
          <p className="text-slate-400 text-xs mt-1">Solderless breadboard kits, robotics, IoT modules, edge AI vision, and embedded microcontrollers.</p>
        </div>
        
        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 20 STEM kits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="rating">Sort by Rating</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const isWishlisted = wishlist.some((p) => p.id === product.id);
          return (
            <div key={product.id} className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  {product.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                      {product.badge}
                    </span>
                  )}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                      isWishlisted ? 'bg-red-600 text-white' : 'bg-slate-900/80 text-slate-300 hover:text-red-400'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-cyan-400 font-medium">{product.category}</span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{product.rating} ({product.reviewsCount})</span>
                    </div>
                  </div>

                  <Link href={`/products/${product.id}`} className="block">
                    <h3 className="text-sm font-semibold text-white line-clamp-1 hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {product.shortDesc}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-4">
                <div>
                  <span className="text-lg font-bold text-white font-heading">₹{product.price}</span>
                  <span className="text-xs text-slate-500 line-through ml-2">₹{product.originalPrice}</span>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
