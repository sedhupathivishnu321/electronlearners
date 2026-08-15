import React from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { Cpu, BookOpen, ArrowRight, Star, ShoppingCart, Heart, ShieldCheck, CheckCircle2, Award, Users, Wrench, Sparkles, Zap } from 'lucide-react';

export default function Home() {
  const { products, addToCart, toggleWishlist, wishlist } = useApp();

  // Filter best selling (highest rating & reviews)
  const bestSellers = [...products]
    .sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount)
    .slice(0, 4);

  // Filter project kits (category is Robotics, IoT, or Arduino)
  const projectKits = products
    .filter(p => p.category === 'Robotics' || p.category === 'IoT' || p.category === 'Arduino')
    .slice(0, 4);

  return (
    <div className="space-y-24 pb-20 bg-[#0F172A] text-slate-100">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-24 bg-gradient-to-b from-[#0F172A] via-[#1E293B]/40 to-[#0F172A] border-b border-slate-800/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Grade Hardware & Structured Learning</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-heading font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight uppercase">
              Learn Electronics by <span className="gradient-text-blue">Building</span>
            </h1>
            <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Electronics kits, projects and learning resources for students, makers, and educators.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/projects"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold flex items-center justify-center space-x-2 transition-all"
            >
              <span>Explore Projects</span>
            </Link>
          </div>

          {/* Simple Trust Elements */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-12 border-t border-slate-800/60 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              <span>Solderless Breadboard Focus</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              <span>Tested Component Batches</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              <span>Step-by-Step PDF Manuals</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              <span>Expert Support Ticket Desk</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white uppercase tracking-tight">Shop By Category</h2>
          <p className="text-slate-400 text-sm">Find curated components and comprehensive learning kits tailored to your level.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { name: "Electronics", icon: Wrench, query: "category=Electronics", bg: "from-blue-500/10 to-blue-600/5 text-blue-400 border-blue-500/20" },
            { name: "Arduino", icon: Cpu, query: "category=Arduino", bg: "from-cyan-500/10 to-cyan-600/5 text-cyan-400 border-cyan-500/20" },
            { name: "Sensors", icon: Zap, query: "category=Sensors", bg: "from-amber-500/10 to-amber-600/5 text-amber-400 border-amber-500/20" },
            { name: "Robotics", icon: Sparkles, query: "category=Robotics", bg: "from-orange-500/10 to-orange-600/5 text-orange-400 border-orange-500/20" },
            { name: "Project Kits", icon: BookOpen, query: "type=kits", bg: "from-purple-500/10 to-purple-600/5 text-purple-400 border-purple-500/20" },
            { name: "Components", icon: Award, query: "category=Components", bg: "from-pink-500/10 to-pink-600/5 text-pink-400 border-pink-500/20" },
            { name: "Learning Kits", icon: Users, query: "category=Learning Kits", bg: "from-emerald-500/10 to-emerald-600/5 text-emerald-400 border-emerald-500/20" }
          ].map((cat, idx) => (
            <Link key={idx} href={`/products?${cat.query}`} className={`p-6 rounded-2xl bg-gradient-to-b ${cat.bg} border hover:scale-105 transition-all text-center space-y-3 block shadow-md`}>
              <cat.icon className="w-7 h-7 mx-auto" />
              <h3 className="text-xs font-semibold text-white tracking-wide">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Top Rated Hardware</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-1 uppercase">Best Selling Kits</h2>
          </div>
          <Link href="/products" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
            Browse All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => {
            const isWishlisted = wishlist.some((p) => p.id === product.id);
            return (
              <div key={product.id} className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between shadow-xl">
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
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${isWishlisted ? 'bg-red-600 text-white' : 'bg-slate-900/80 text-slate-300 hover:text-red-400'}`}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
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
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-4">
                  <div>
                    <span className="text-lg font-bold text-white font-heading">₹{product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-slate-500 line-through ml-2">₹{product.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PROJECT KITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">All-in-One Solutions</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-1 uppercase">Project Kits</h2>
            <p className="text-slate-400 text-xs mt-1">Build a complete electronics project from one kit. Everything you need in one box.</p>
          </div>
          <Link href="/products?type=kits" className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1">
            View Project Kits <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projectKits.map((product) => {
            const isWishlisted = wishlist.some((p) => p.id === product.id);
            return (
              <div key={product.id} className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${isWishlisted ? 'bg-red-600 text-white' : 'bg-slate-900/80 text-slate-300 hover:text-red-400'}`}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="text-purple-400 font-medium">COMPLETE KIT</span>
                      <span className="text-slate-500 font-semibold">{product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}</span>
                    </div>

                    <Link href={`/products/${product.id}`} className="block">
                      <h3 className="text-sm font-semibold text-white line-clamp-1 hover:text-purple-400 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                      {product.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-4">
                  <span className="text-lg font-bold text-white font-heading">₹{product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/20"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Buy Kit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. LEARN SECTION */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 py-16 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <div className="max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Knowledge Hub</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white uppercase">Learn Electronics & Coding</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Structured lessons and guides to take you from hello-world circuits to advanced IoT systems.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Structured Courses", desc: "Enroll in comprehensive, video-supported STEM classes with hardware kit dependencies.", link: "/courses", color: "border-blue-500/20 hover:border-blue-500/50 text-blue-400" },
              { title: "Step-by-Step Manuals", desc: "Download high-resolution schematics and instructional documents for products.", link: "/resources", color: "border-cyan-500/20 hover:border-cyan-500/50 text-cyan-400" },
              { title: "Funnel Projects", desc: "Follow circuit guides, code templates, and instantly add the required components to your cart.", link: "/projects", color: "border-orange-500/20 hover:border-orange-500/50 text-orange-400" },
              { title: "Resistor Calculators", desc: "Interact with simple code tools to calculate resistor bands, voltage dividers, and more.", link: "/resources", color: "border-emerald-500/20 hover:border-emerald-500/50 text-emerald-400" }
            ].map((box, idx) => (
              <Link key={idx} href={box.link} className={`p-6 rounded-2xl glass-card border ${box.color} text-center space-y-3 block transition-all hover:scale-105`}>
                <h3 className="text-base font-bold text-white tracking-wide font-heading">{box.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{box.desc}</p>
                <div className="text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 pt-2">
                  <span>Explore Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY JR Learners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white uppercase tracking-tight">Why Choose JR Learners?</h2>
          <p className="text-slate-400 text-sm">We construct a complete operational experience—from hardware parts to structured curriculum.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: "Educational Quality", desc: "Every kit is designed to map directly to core scientific principles and engineering workflows.", icon: BookOpen },
            { title: "Tested Batches", desc: "Components are thoroughly tested in-house before packing to prevent dead-on-arrival sensors.", icon: ShieldCheck },
            { title: "Documented Guides", desc: "Clear, color PDF manuals with Fritzing breadboard diagrams and detailed code annotations.", icon: Award },
            { title: "Direct Ticket Support", desc: "Need hardware troubleshooting? Open a support ticket directly from your account dashboard.", icon: Users }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl glass-card border border-slate-800 text-center space-y-3 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center mx-auto border border-blue-500/20">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-white tracking-wide font-heading">{item.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. SCHOOLS & COLLEGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-900/60 border border-blue-500/25 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="space-y-4 max-w-2xl text-center md:text-left relative z-10">
            <span className="px-3 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              B2B Institutional Solutions
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white uppercase">
              Schools & Colleges Lab Equipment
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              We process institutional purchase orders and bulk custom kit configurations. Get institutional discounts, dedicated support channels, and tailored teacher manuals.
            </p>
          </div>

          <div className="w-full md:w-auto flex-shrink-0 text-center relative z-10">
            <Link
              href="/schools"
              className="w-full sm:w-auto inline-flex px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/25 items-center justify-center transition-all"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
