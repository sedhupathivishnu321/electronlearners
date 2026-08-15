import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { PROJECTS_DATA } from '../../data/projectsData';
import { ShoppingCart, Heart, Star, Download, Play, CheckCircle, Shield, FileText, Cpu, ArrowLeft, Plus, Minus, Send } from 'lucide-react';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { products, addToCart, toggleWishlist, wishlist, reviews, submitReview } = useApp();

  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'included' | 'compat' | 'how' | 'projects' | 'docs' | 'reviews' | 'qna'>('desc');
  
  // Review form states
  const [reviewName, setReviewName] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('');

  // Find product by id or slug
  const product = products.find((p) => p.id === id || p.slug === id) || products[0];

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-350">
        <p>Product not found.</p>
        <Link href="/products" className="text-blue-500 hover:underline mt-4 inline-block">Back to Shop</Link>
      </div>
    );
  }

  const isWishlisted = wishlist.some((p) => p.id === product.id);

  // Gallery mockup images
  const galleryImages = [
    product.image,
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600&auto=format&fit=crop&q=80"
  ];
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  // Dynamic projects using this product
  const relatedProjects = PROJECTS_DATA.filter(proj => 
    proj.category.toLowerCase() === product.category.toLowerCase() ||
    proj.shortDescription.toLowerCase().includes(product.name.toLowerCase().split(' ')[0])
  );

  // Filter reviews
  const approvedReviews = reviews.filter(r => r.productId === product.id && r.status === 'Approved');

  // Related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/cart');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    submitReview(product.id, reviewRating, reviewText);
    setReviewText('');
    setReviewName('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-[#0F172A] text-slate-100">
      
      {/* Back Link */}
      <Link href="/products" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to STEM Catalog</span>
      </Link>

      {/* Main product card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-video rounded-2xl overflow-hidden glass-card border border-slate-800 shadow-lg">
            <img src={galleryImages[activeImageIdx]} alt={product.name} className="w-full h-full object-cover transition-all duration-300" />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow">
                {product.badge}
              </span>
            )}
          </div>
          {/* Thumbnails */}
          <div className="grid grid-cols-3 gap-3">
            {galleryImages.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`aspect-video rounded-xl overflow-hidden border transition-all ${
                  activeImageIdx === idx ? 'border-blue-500 scale-95 ring-2 ring-blue-600/30' : 'border-slate-800 hover:border-slate-600'
                }`}
              >
                <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">{product.category} Section</span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">{product.name}</h1>
            
            <div className="flex items-center space-x-4 text-xs pt-1">
              <div className="flex items-center text-amber-400 gap-1">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">{product.rating.toFixed(1)}</span>
                <span className="text-slate-500">({approvedReviews.length + product.reviewsCount} reviews)</span>
              </div>
              <span className="text-slate-700">•</span>
              <span className={`font-semibold ${product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {product.stock > 0 ? `In Stock (Only ${product.stock} units left!)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-350 leading-relaxed">
            {product.shortDesc}
          </div>

          {/* Pricing & Metadata Table */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-heading">₹{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm font-normal text-slate-500 line-through">₹{product.originalPrice}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-slate-500">SKU:</span> <span className="font-mono text-white ml-1">EL-{product.id.split('-')[1] || '001'}</span>
              </div>
              <div>
                <span className="text-slate-500">Brand:</span> <span className="text-white ml-1">JR Learners</span>
              </div>
              <div>
                <span className="text-slate-500">Availability:</span> <span className="text-white ml-1">{product.stock > 0 ? 'Available' : 'Out of Stock'}</span>
              </div>
              <div>
                <span className="text-slate-500">Warranty:</span> <span className="text-white ml-1">6 Months Limited</span>
              </div>
            </div>
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-slate-800 pt-6">
            <div className="flex items-center border border-slate-700 rounded-xl bg-slate-950">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-slate-400 hover:text-white transition-colors"
                disabled={product.stock === 0}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-4 text-sm font-bold text-white w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-3 text-slate-400 hover:text-white transition-colors"
                disabled={product.stock === 0}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex gap-2 w-full">
              <button
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock === 0}
                className="flex-grow py-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-grow py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-blue-600/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-all ${
                  isWishlisted ? 'bg-red-650 text-white border-red-500' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-red-400'
                }`}
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs Breakdown */}
      <div className="border-t border-slate-850 pt-8 space-y-6">
        <div className="flex border-b border-slate-800 space-x-6 text-xs font-semibold overflow-x-auto scrollbar-none pb-1">
          {[
            { key: 'desc', label: 'Description' },
            { key: 'specs', label: 'Specifications' },
            { key: 'included', label: "What's Included" },
            { key: 'compat', label: 'Compatibility' },
            { key: 'how', label: 'How to Use' },
            { key: 'projects', label: `Projects (${relatedProjects.length})` },
            { key: 'docs', label: 'Documentation' },
            { key: 'reviews', label: `Reviews (${approvedReviews.length})` },
            { key: 'qna', label: 'Q&A' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-3 border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.key ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl">
          
          {activeTab === 'desc' && (
            <div className="space-y-4 text-xs text-slate-355 leading-relaxed">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Product Details Overview</h3>
              <p>{product.description}</p>
              
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-semibold text-white">Target Audience</h4>
                  <p>Students, hobbyists, engineering colleges, and secondary teachers launching STEM project labs.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-semibold text-white">Tested Batches Guarantee</h4>
                  <p>Every single sensor and microcontroller is loaded with test firmware and checked before leaving our Bangalore hub.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-450 font-medium">{key}</span>
                  <span className="text-white font-semibold">{val}</span>
                </div>
              ))}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-450 font-medium">Warranty Duration</span>
                <span className="text-white font-semibold">6 Months Limited</span>
              </div>
            </div>
          )}

          {activeTab === 'included' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Pack Component List</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {product.components.map((c, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs text-slate-200">
                    <span className="flex items-center gap-2"><Cpu className="w-4 h-4 text-cyan-400" /> {c.name}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">x{c.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'compat' && (
            <div className="space-y-3 text-xs text-slate-350 leading-relaxed">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Cross-Platform Compatibility</h3>
              <p>This kit utilizes standardized headers and signal lines, offering direct compatibility with:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
                <li>Arduino IDE (C++ programming)</li>
                <li>ESP32 / ESP8266 NodeMCU microcontrollers</li>
                <li>Raspberry Pi OS Python GPIO libraries</li>
                <li>Standard 3.3V and 5V logic signal levels</li>
                <li>Solderless breadboards (0.1" pitch components)</li>
              </ul>
            </div>
          )}

          {activeTab === 'how' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Step-by-Step Getting Started Guide</h3>
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

          {activeTab === 'projects' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Guided Projects Using This Product</h3>
              {relatedProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedProjects.map((proj) => (
                    <div key={proj.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase">{proj.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{proj.shortDescription}</p>
                      </div>
                      <Link href={`/projects/${proj.id}`} className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1 pt-2">
                        View Project Guide <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No project tutorials registered for this exact kit yet. Check back soon!</p>
              )}
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-4 text-xs text-slate-300">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Downloadable Materials & Datasheets</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={product.manualUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-400" />
                    <div>
                      <div className="text-white font-semibold">User Assembly Manual PDF</div>
                      <div className="text-slate-400 text-[10px]">Schematics & 15 code examples</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400" />
                </a>

                <a
                  href={product.datasheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-8 h-8 text-cyan-400" />
                    <div>
                      <div className="text-white font-semibold">IC Technical Datasheets</div>
                      <div className="text-slate-400 text-[10px]">Reference manuals & pinouts</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              {product.videoUrl && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3">
                    <Play className="w-6 h-6 text-red-500" />
                    <div>
                      <div className="text-white font-semibold">Step-by-Step Video Assembly Guide</div>
                      <div className="text-slate-400 text-[10px]">Video guide with visual wiring walkthroughs</div>
                    </div>
                  </div>
                  <a href={product.videoUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-red-650 hover:bg-red-550 text-white font-semibold">
                    Watch Video
                  </a>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Approved Customer Reviews ({approvedReviews.length})</h3>

              {approvedReviews.length > 0 ? (
                <div className="space-y-4">
                  {approvedReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{rev.customerName}</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[8px] font-bold uppercase tracking-wider">Verified Purchase</span>
                        </div>
                        <span className="text-slate-500 font-mono text-[10px]">{rev.createdAt.split('T')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 text-xs">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-slate-300 text-xs">{rev.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No approved reviews yet for this product. Be the first to leave a review below!</p>
              )}

              {/* Submit Review Form */}
              <form onSubmit={handleAddReview} className="border-t border-slate-800 pt-6 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wide">Submit a Product Review</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Rating (1 to 5 Stars)</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                      <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                      <option value="3">⭐⭐⭐ (3 - Average)</option>
                      <option value="2">⭐⭐ (2 - Poor)</option>
                      <option value="1">⭐ (1 - Unusable)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Priyan S."
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Your Review Content</label>
                  <textarea
                    rows={3}
                    placeholder="Describe component quality, accuracy of manual, packaging..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Review for Moderation
                </button>
              </form>
            </div>
          )}

          {activeTab === 'qna' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Frequently Asked Questions</h3>
              {product.faqs && product.faqs.length > 0 ? (
                product.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                    <div className="font-semibold text-white">Q: {faq.question}</div>
                    <div className="text-slate-400">A: {faq.answer}</div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-450 text-center">
                  No Q&As added for this kit yet.
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-slate-850 pt-10 space-y-6">
          <h3 className="text-lg font-bold text-white uppercase tracking-tight font-heading">Related Hardware Kits</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <div key={p.id} className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between shadow-md">
                <div>
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-1.5">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase">{p.category}</span>
                    <Link href={`/products/${p.id}`} className="block">
                      <h4 className="text-xs font-bold text-white line-clamp-1 hover:text-blue-400 transition-all">{p.name}</h4>
                    </Link>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{p.shortDesc}</p>
                  </div>
                </div>
                <div className="p-4 pt-0 border-t border-slate-800/80 mt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-white">₹{p.price}</span>
                  <Link href={`/products/${p.id}`} className="text-[10px] font-bold text-blue-400 hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
