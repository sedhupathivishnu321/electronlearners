import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, Heart, Search, Star, Filter, Cpu, Check, Layers, Tag, HelpCircle } from 'lucide-react';

export default function ProductsCatalog() {
  const { products, addToCart, toggleWishlist, wishlist } = useApp();
  const router = useRouter();

  // Sidebar Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'level' | 'price-asc' | 'price-desc'>('level');
  const [showComparison, setShowComparison] = useState<boolean>(true);
  const [selectedKitsModal, setSelectedKitsModal] = useState<any | null>(null);

  // Sync state with URL Query Params
  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.category) {
      setSelectedCategory(router.query.category as string);
    }
    if (router.query.search) {
      setSearchQuery(router.query.search as string);
    }
  }, [router.isReady, router.query]);

  // The shop sells exactly 8 kits (Level 1 - Level 8); the sidebar filters by level
  const categories = ['All', ...products.map((p) => p.name)];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.name === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = q === '' ||
      product.name.toLowerCase().includes(q) ||
      product.shortDesc.toLowerCase().includes(q) ||
      product.components.some((c) => c.name.toLowerCase().includes(q)) ||
      (product.projects ?? []).some((pr) => pr.name.toLowerCase().includes(q));

    let matchesPrice = true;
    if (priceRange === 'under-1000') matchesPrice = product.price < 1000;
    else if (priceRange === '1000-2000') matchesPrice = product.price >= 1000 && product.price <= 2000;
    else if (priceRange === 'over-2000') matchesPrice = product.price > 2000;

    let matchesAvailability = true;
    if (selectedAvailability === 'in-stock') matchesAvailability = product.stock > 0;
    else if (selectedAvailability === 'out-of-stock') matchesAvailability = product.stock === 0;

    return matchesCategory && matchesSearch && matchesPrice && matchesAvailability;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return a.id.localeCompare(b.id, undefined, { numeric: true });   // default: Level 1 -> Level 8
  });

  // Kit comparison matrix: one column per kit
  const comparisonProducts = products.map((p) => ({
    name: p.name.replace(/ Kit$/, ''),
    focus: p.specifications['Level'] ?? (p.specifications['Levels'] ? `All ${p.specifications['Levels']} levels` : ''),
    pieces: p.specifications['Total Pieces'] ?? '',
    levelParts: p.specifications['Level-specific Parts'] ?? (p.specifications['BOM Lines'] ? `${p.specifications['BOM Lines']} lines` : ''),
    projectsCount: p.specifications['Projects'] ?? '',
    addOnComponents: p.components.slice(12).map((c) => c.name).join(', '),
    projects: p.projects ?? [],
    price: p.price,
    product: p,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* 1. Header Title & Search Controls */}
      <div className="border-b border-slate-800 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Business Catalog</span>
          <h1 className="text-3xl font-heading font-extrabold text-white mt-1 uppercase">JR Learners Arduino Kits</h1>
          <p className="text-slate-400 text-xs mt-1">8 levels from first blink to a smart-systems capstone - 50 projects in every kit, 400 in total - or get everything in the All-in-One kit. Each kit includes its own Arduino UNO R3.</p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search store catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 w-full sm:w-auto"
          >
            <option value="level">Sort by Level</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all w-full sm:w-auto ${
              showComparison ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-450 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" /> Compare Kits
          </button>
        </div>
      </div>

      {/* 2. Product Comparison Matrix (Arduino boards) */}
      {showComparison && (
        <div className="p-6 rounded-2xl glass-card border border-blue-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
                <Cpu className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">Kit Comparison - Level 1 to Level 8</h3>
                <p className="text-[10px] text-slate-400">Every kit contains an Arduino UNO R3, breadboard, jumper wires, resistors, button and LEDs plus the level-specific parts.</p>
              </div>
            </div>
            <button onClick={() => setShowComparison(false)} className="text-xs text-slate-500 hover:text-white">Hide</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Feature</th>
                  {comparisonProducts.map((p, idx) => (
                    <th key={idx} className="p-3 text-center text-white font-bold">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="p-3 font-semibold text-slate-450">Level</td>
                  {comparisonProducts.map((p, idx) => (
                    <td key={idx} className="p-3 text-center text-[10px] text-slate-300">{p.focus}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-450">Projects</td>
                  {comparisonProducts.map((p, idx) => (
                    <td key={idx} className="p-3 text-center font-semibold text-blue-300">{p.projectsCount}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-450">Total Pieces</td>
                  {comparisonProducts.map((p, idx) => (
                    <td key={idx} className="p-3 text-center font-mono">{p.pieces}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-450">Level-specific Parts</td>
                  {comparisonProducts.map((p, idx) => (
                    <td key={idx} className="p-3 text-center font-mono">{p.levelParts}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-450">Project List</td>
                  {comparisonProducts.map((p, idx) => (
                    <td key={idx} className="p-3 text-center">
                      {p.projects.length > 0 ? (
                        <button
                          onClick={() => setSelectedKitsModal(p)}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-[10px] font-bold transition-all cursor-pointer shadow-md"
                        >
                          View {p.projects.length} projects
                        </button>
                      ) : (
                        <Link href="/projects" className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-[10px] font-bold inline-block">All 400 projects</Link>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white">Price</td>
                  {comparisonProducts.map((p, idx) => (
                    <td key={idx} className="p-3 text-center font-extrabold text-blue-450 text-sm">₹{p.price}</td>
                  ))}
                </tr>
                <tr className="bg-slate-900/10">
                  <td className="p-3"></td>
                  {comparisonProducts.map((p, idx) => (
                    <td key={idx} className="p-3 text-center">
                      <button
                        onClick={() => addToCart(p.product)}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition-all shadow-md shadow-blue-600/10"
                      >
                        Add to Cart
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Sidebar Filters & Products Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-6 bg-slate-900/40 p-5 border border-slate-800 rounded-2xl h-fit">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-white font-bold">
            <Filter className="w-4 h-4 text-blue-500" />
            <span>Filters</span>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Kit Level</label>
            <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-xs px-2.5 py-1.5 rounded-lg transition-all flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-blue-600/15 border-l-2 border-blue-500 text-blue-400 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Price Range</label>
            <div className="flex flex-col gap-1.5 text-xs">
              {[
                { key: 'All', label: 'All Prices' },
                { key: 'under-1000', label: 'Under ₹1,000' },
                { key: '1000-2000', label: '₹1,000 - ₹2,000' },
                { key: 'over-2000', label: 'Over ₹2,000' }
              ].map((range) => (
                <button
                  key={range.key}
                  onClick={() => setPriceRange(range.key)}
                  className={`text-left px-2.5 py-1.5 rounded-lg transition-all flex items-center justify-between ${
                    priceRange === range.key
                      ? 'bg-blue-600/15 border-l-2 border-blue-500 text-blue-400 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{range.label}</span>
                  {priceRange === range.key && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Availability</label>
            <div className="flex flex-col gap-1.5 text-xs">
              {[
                { key: 'All', label: 'All Stock Status' },
                { key: 'in-stock', label: 'In Stock' },
                { key: 'out-of-stock', label: 'Out of Stock' }
              ].map((status) => (
                <button
                  key={status.key}
                  onClick={() => setSelectedAvailability(status.key)}
                  className={`text-left px-2.5 py-1.5 rounded-lg transition-all flex items-center justify-between ${
                    selectedAvailability === status.key
                      ? 'bg-blue-600/15 border-l-2 border-blue-500 text-blue-400 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{status.label}</span>
                  {selectedAvailability === status.key && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSelectedCategory('All');
              setPriceRange('All');
              setSelectedAvailability('All');
              setSearchQuery('');
            }}
            className="w-full py-2 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-all mt-4"
          >
            Clear Filters
          </button>
        </aside>

        {/* Products Grid Section */}
        <section className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-450">
            <span>Showing {filteredProducts.length} of {products.length} (8 level kits + the All-in-One)</span>
            {selectedCategory !== 'All' && (
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 font-semibold">
                {selectedCategory}
              </span>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isWishlisted = wishlist.some((p) => p.id === product.id);
                return (
                  <div key={product.id} className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between shadow-lg">
                    <div>
                      <div className="relative aspect-video bg-slate-900 overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        {product.badge && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow">
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
                        <div className="flex items-center justify-between text-xs text-slate-450">
                          <span className="text-cyan-400 font-medium">{product.category}</span>
                        </div>

                        <Link href={`/products/${product.id}`} className="block">
                          <h3 className="text-sm font-semibold text-white line-clamp-1 hover:text-blue-400 transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                          {product.shortDesc}
                        </p>

                        <div className="text-[10px] font-bold text-slate-500">
                          SKU: {product.id === 'prod-9' ? 'JRL-ARD-ALL' : `JRL-ARD-L${product.id.split('-')[1]}`} · {product.specifications['Projects']}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex flex-col gap-3 border-t border-slate-800/80 mt-4">
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <span className="text-base font-extrabold text-white font-heading">₹{product.price}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs text-slate-500 line-through ml-2">₹{product.originalPrice}</span>
                          )}
                        </div>
                        
                        <span className={`text-[10px] font-bold ${
                          product.stock > 10 ? 'text-emerald-500' : product.stock > 0 ? 'text-amber-500' : 'text-red-500'
                        }`}>
                          {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="flex-grow text-center py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold transition-all"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center border border-slate-800 rounded-2xl glass-card text-slate-400 space-y-3">
              <HelpCircle className="w-10 h-10 mx-auto text-slate-650" />
              <h3 className="text-sm font-semibold text-white">No kits found</h3>
              <p className="text-xs">Try adjusting your filters or search terms to find what you are looking for.</p>
            </div>
          )}
        </section>
      </div>

      {/* Experiments List Modal */}
      {selectedKitsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl max-w-xl w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">{selectedKitsModal.name}</h3>
                <span className="text-[10px] text-cyan-400 font-semibold">{selectedKitsModal.projectsCount}</span>
              </div>
              <button
                onClick={() => setSelectedKitsModal(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800 transition-all text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Level-specific Components</h4>
                <p className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 leading-relaxed text-slate-200">
                  {selectedKitsModal.addOnComponents}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">The 50 Projects</h4>
                <div className="space-y-1.5">
                  {selectedKitsModal.projects?.map((pr: { tier: string; name: string; desc: string }, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/40 border border-slate-850">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                      <span><span className="text-slate-100 font-semibold">{pr.name}</span> <span className="text-[10px] text-cyan-400">({pr.tier})</span><br /><span className="text-slate-400">{pr.desc}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/20 text-center">
              <button
                onClick={() => setSelectedKitsModal(null)}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow"
              >
                Understood, Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
