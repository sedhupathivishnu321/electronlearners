import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { PRODUCTS_DATA, STEMProduct } from '../../data/productsData';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, Heart, Star, Download, Play, CheckCircle, Shield, FileText, Cpu, ArrowLeft } from 'lucide-react';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart, toggleWishlist, wishlist } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'specs' | 'assembly' | 'faqs'>('overview');

  const product = PRODUCTS_DATA.find((p) => p.id === id || p.slug === id) || PRODUCTS_DATA[0];
  const isWishlisted = wishlist.some((p) => p.id === product.id);

  const relatedProducts = PRODUCTS_DATA.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Back Button */}
      <Link href="/products" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to 20 STEM Product Kits</span>
      </Link>

      {/* Main Product Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Image & Download Badges */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-video rounded-2xl overflow-hidden glass-card border border-slate-800">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow">
                {product.badge}
              </span>
            )}
          </div>

          {/* Download Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href={product.manualUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Assembly Manual PDF</span>
            </a>
            <a
              href={product.datasheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>IC Datasheets</span>
            </a>
          </div>
        </div>

        {/* Right Column: Title, Pricing & Cart Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">{product.category} Kit</span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">{product.name}</h1>
            
            <div className="flex items-center space-x-4 text-xs pt-1">
              <div className="flex items-center text-amber-400 gap-1">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-slate-500">({product.reviewsCount} reviews)</span>
              </div>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-semibold">{product.stock} Units in Stock</span>
            </div>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">{product.description}</p>

          {/* Pricing Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Kit Price (Incl. GST)</div>
              <div className="text-3xl font-extrabold text-white font-heading">
                ₹{product.price}
                <span className="text-sm font-normal text-slate-500 line-through ml-3">₹{product.originalPrice}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors ${
                  isWishlisted ? 'bg-red-600 text-white border-red-500' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-red-400'
                }`}
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
              <button
                onClick={() => addToCart(product)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
            </div>
          </div>

          {/* Learning Outcomes Preview */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">What You Will Learn</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              {product.learningObjectives.map((obj, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Tabs Breakdown */}
      <div className="border-t border-slate-800 pt-8 space-y-6">
        <div className="flex border-b border-slate-800 space-x-6 text-xs font-semibold overflow-x-auto">
          {[
            { key: 'overview', label: 'Overview & Learning' },
            { key: 'components', label: `Included Components (${product.components.length})` },
            { key: 'specs', label: 'Technical Specifications' },
            { key: 'assembly', label: 'Assembly Guide' },
            { key: 'faqs', label: 'FAQs' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-3 border-b-2 whitespace-nowrap ${
                activeTab === tab.key ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          
          {activeTab === 'overview' && (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <h3 className="text-sm font-bold text-white">Comprehensive Learning Experience</h3>
              <p>{product.description}</p>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Play className="w-6 h-6 text-red-500" />
                  <div>
                    <div className="text-white font-semibold">Video Tutorial Available on YouTube</div>
                    <div className="text-slate-400 text-[11px]">Watch step-by-step assembly on @LetsGetEngagedin</div>
                  </div>
                </div>
                <a href={product.videoUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold">
                  Watch Video
                </a>
              </div>
            </div>
          )}

          {activeTab === 'components' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {product.components.map((c, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs text-slate-200">
                  <span className="flex items-center gap-2"><Cpu className="w-4 h-4 text-cyan-400" /> {c.name}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">x{c.quantity}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400 font-medium">{key}</span>
                  <span className="text-white font-semibold">{val}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'assembly' && (
            <div className="space-y-3">
              {product.assemblySteps.map((step, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-4 text-xs text-slate-300">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="space-y-4">
              {product.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <div className="font-semibold text-white">Q: {faq.question}</div>
                  <div className="text-slate-400">A: {faq.answer}</div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
