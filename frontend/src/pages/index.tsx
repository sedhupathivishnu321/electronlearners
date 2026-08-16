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
    <div className="min-h-screen text-slate-100 bg-[#000B1C] flex flex-col w-full">

      {/* 1. HERO SECTION (Dark Panel) */}
      <section className="relative overflow-hidden pt-24 pb-28 border-b border-slate-900 w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[#FBBF24] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High-Grade Hardware & Structured Learning</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-heading font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight uppercase">
              Learn Electronics by <span className="text-[#FBBF24]">Building</span>
            </h1>
            <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Electronics kits, projects and learning resources for students, makers, and educators.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-[#000B1C] font-bold shadow-lg shadow-yellow-500/10 flex items-center justify-center space-x-2 transition-all"
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-12 border-t border-slate-800/40 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
              <CheckCircle2 className="w-4 h-4 text-[#FBBF24]" />
              <span>Solderless Breadboard Focus</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
              <CheckCircle2 className="w-4 h-4 text-[#FBBF24]" />
              <span>Tested Component Batches</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
              <CheckCircle2 className="w-4 h-4 text-[#FBBF24]" />
              <span>Step-by-Step PDF Manuals</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-xs">
              <CheckCircle2 className="w-4 h-4 text-[#FBBF24]" />
              <span>Expert Support Ticket Desk</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SHOP BY CATEGORY (Light Contrast Section) */}
      <section className="w-full bg-white text-[#000B1C] py-20 border-y border-slate-200 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#000B1C] uppercase tracking-tight">Shop By Category</h2>
            <p className="text-slate-500 text-sm">Find curated components and comprehensive learning kits tailored to your level.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { name: "Electronics", icon: Wrench, query: "category=Electronics" },
              { name: "Arduino", icon: Cpu, query: "category=Arduino" },
              { name: "Sensors", icon: Zap, query: "category=Sensors" },
              { name: "Robotics", icon: Sparkles, query: "category=Robotics" },
              { name: "Project Kits", icon: BookOpen, query: "type=kits" },
              { name: "Components", icon: Award, query: "category=Components" },
              { name: "Learning Kits", icon: Users, query: "category=Learning Kits" }
            ].map((cat, idx) => (
              <Link
                key={idx}
                href={`/products?${cat.query}`}
                className="p-6 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:-translate-y-1 transition-all text-center space-y-3 block shadow-sm"
              >
                <cat.icon className="w-7 h-7 mx-auto text-[#000B1C]" />
                <h3 className="text-xs font-semibold text-[#000B1C] tracking-wide">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BEST SELLING (Dark Contrast Section) */}
      <section className="w-full bg-[#000d21] text-white py-20 relative z-10 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold text-[#FBBF24] uppercase tracking-wider">Top Rated Hardware</span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-1 uppercase">Best Selling Kits</h2>
            </div>
            <Link href="/products" className="text-xs font-semibold text-[#FBBF24] hover:text-[#F59E0B] flex items-center gap-1">
              Browse All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => {
              const isWishlisted = wishlist.some((p) => p.id === product.id);
              return (
                <div key={product.id} className="high-contrast-dark-card rounded-xl overflow-hidden flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="relative aspect-video bg-slate-950 overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      {product.badge && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#FBBF24] text-[#000B1C] text-[10px] font-bold uppercase tracking-wider shadow">
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
                      <span className="text-xs font-semibold text-[#FBBF24] uppercase tracking-wider block">{product.category}</span>
                      <Link href={`/products/${product.id}`} className="block">
                        <h3 className="text-sm font-semibold text-white line-clamp-1 hover:text-[#FBBF24] transition-colors">
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
                      className="px-3.5 py-2 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-[#000B1C] text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-yellow-500/10"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PROJECT KITS (Light Contrast Section) */}
      <section className="w-full bg-white text-[#000B1C] py-20 border-y border-slate-200 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 border-b border-slate-200 pb-6">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">All-in-One Solutions</span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#000B1C] mt-1 uppercase">Project Kits</h2>
              <p className="text-slate-500 text-xs mt-1">Build a complete electronics project from one kit. Everything you need in one box.</p>
            </div>
            <Link href="/products?type=kits" className="text-xs font-semibold text-[#000B1C] hover:text-slate-600 flex items-center gap-1">
              View Project Kits <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projectKits.map((product) => {
              const isWishlisted = wishlist.some((p) => p.id === product.id);
              return (
                <div key={product.id} className="high-contrast-light-card rounded-xl overflow-hidden flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="relative aspect-video bg-slate-100 overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => toggleWishlist(product)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${isWishlisted ? 'bg-red-600 text-white' : 'bg-slate-900/80 text-slate-300 hover:text-red-400'}`}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>COMPLETE KIT</span>
                        <span>{product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}</span>
                      </div>
                      <Link href={`/products/${product.id}`} className="block">
                        <h3 className="text-sm font-semibold text-[#000B1C] line-clamp-1 hover:text-[#FBBF24] transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                        {product.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-200 mt-4">
                    <span className="text-lg font-bold text-[#000B1C] font-heading">₹{product.price}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-3.5 py-2 rounded-xl bg-[#000B1C] hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Buy Kit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. LEARN SECTION (Dark Contrast Section) */}
      <section className="w-full bg-[#000B1C] text-white py-20 relative z-10 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <div className="max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#FBBF24] uppercase tracking-widest">Knowledge Hub</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white uppercase">Learn Electronics & Coding</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Structured lessons and guides to take you from hello-world circuits to advanced IoT systems.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Structured Courses", desc: "Enroll in comprehensive, video-supported STEM classes with hardware kit dependencies.", link: "/courses", color: "border-slate-800" },
              { title: "Step-by-Step Manuals", desc: "Download high-resolution schematics and instructional documents for products.", link: "/resources", color: "border-slate-800" },
              { title: "Funnel Projects", desc: "Follow circuit guides, code templates, and instantly add the required components to your cart.", link: "/projects", color: "border-slate-800" },
              { title: "Resistor Calculators", desc: "Interact with simple code tools to calculate resistor bands, voltage dividers, and more.", link: "/resources", color: "border-slate-800" }
            ].map((box, idx) => (
              <Link key={idx} href={box.link} className={`p-6 rounded-xl high-contrast-dark-card border ${box.color} text-center space-y-3 block transition-all`}>
                <h3 className="text-base font-bold text-white tracking-wide font-heading">{box.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{box.desc}</p>
                <div className="text-[11px] font-bold text-[#FBBF24] uppercase tracking-wider flex items-center justify-center gap-1 pt-2">
                  <span>Explore Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY JR Learners (Light Contrast Section) */}
      <section className="w-full bg-white text-[#000B1C] py-20 border-y border-slate-200 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#000B1C] uppercase tracking-tight">Why Choose JR Learners?</h2>
            <p className="text-slate-500 text-sm">We construct a complete operational experience—from hardware parts to structured curriculum.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "Educational Quality", desc: "Every kit is designed to map directly to core scientific principles and engineering workflows.", icon: BookOpen },
              { title: "Tested Batches", desc: "Components are thoroughly tested in-house before packing to prevent dead-on-arrival sensors.", icon: ShieldCheck },
              { title: "Documented Guides", desc: "Clear, color PDF manuals with Fritzing breadboard diagrams and detailed code annotations.", icon: Award },
              { title: "Direct Ticket Support", desc: "Need hardware troubleshooting? Open a support ticket directly from your account dashboard.", icon: Users }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-xl high-contrast-light-card text-center space-y-3 shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-[#F59E0B] flex items-center justify-center mx-auto border border-yellow-500/20">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-[#000B1C] tracking-wide font-heading">{item.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. SCHOOLS & COLLEGES (Dark Contrast Section) */}
      <section className="w-full bg-[#000d21] text-white py-20 relative z-10 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 md:p-12 rounded-3xl bg-[#0A122C] border border-[#1E293B] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="space-y-4 max-w-2xl text-center md:text-left relative z-10">
              <span className="px-3 py-1 rounded bg-yellow-500/10 text-[#FBBF24] border border-yellow-500/20 text-xs font-bold uppercase tracking-wider">
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
                className="w-full sm:w-auto inline-flex px-8 py-4 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-[#000B1C] font-bold shadow-lg shadow-yellow-500/20 items-center justify-center transition-all"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

