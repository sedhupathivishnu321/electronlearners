import React, { useState } from 'react';
import Link from 'next/link';
import { PRODUCTS_DATA } from '../data/productsData';
import { COURSES_DATA } from '../data/coursesData';
import { YOUTUBE_TUTORIALS, YOUTUBE_CHANNEL_URL } from '../data/youtubeData';
import { BLOGS_DATA } from '../data/blogsData';
import { useApp } from '../context/AppContext';
import { YouTubeModal } from '../components/youtube/YouTubeModal';
import { YouTubeTutorial } from '../data/youtubeData';
import { Cpu, BookOpen, Youtube, ArrowRight, Star, ShoppingCart, Heart, ShieldCheck, CheckCircle2, Award, Users, Wrench, Sparkles, Layers } from 'lucide-react';

export default function Home() {
  const { addToCart, toggleWishlist, wishlist } = useApp();
  const [selectedVideo, setSelectedVideo] = useState<YouTubeTutorial | null>(null);

  const featuredKits = PRODUCTS_DATA.slice(0, 8);
  const featuredCourses = COURSES_DATA.slice(0, 4);
  const recentBlogs = BLOGS_DATA.slice(0, 3);

  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO BANNER SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-[#0F172A] via-[#1E293B]/50 to-[#0F172A]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>India's Premier STEM & Robotics Learning Ecosystem</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white tracking-tight leading-tight">
                Build the Future with <span className="gradient-text-blue">STEM Learning</span>
              </h1>
              
              <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Hands-on Electronics, Arduino, Robotics, AI, and IoT Kits for Students, Educators, and Makers. Supported by step-by-step manuals & YouTube tutorials by <strong className="text-red-400">@LetsGetEngagedin</strong>.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="/products"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 group transition-all"
                >
                  <span>Explore 20 STEM Kits</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/tutorials"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center justify-center space-x-2 text-red-400 hover:text-red-300 transition-all"
                >
                  <Youtube className="w-5 h-5 text-red-500" />
                  <span>Watch YouTube Tutorials</span>
                </Link>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-bold text-white font-heading">20+</div>
                  <div className="text-xs text-slate-400">Hardware Kits</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400 font-heading">100+</div>
                  <div className="text-xs text-slate-400">STEM Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-400 font-heading">50K+</div>
                  <div className="text-xs text-slate-400">YouTube Makers</div>
                </div>
              </div>

            </div>

            {/* Right Visual Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden glass-card p-4 border border-blue-500/30 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&auto=format&fit=crop&q=80"
                  alt="Arduino STEM Kit"
                  className="w-full h-80 object-cover rounded-xl"
                />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Flagship Kit</div>
                    <div className="text-sm font-semibold text-white">Arduino Starter Kit R3</div>
                  </div>
                  <Link href="/products/arduino-starter-kit" className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
                    View Specs
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">Explore STEM Categories</h2>
          <p className="text-slate-400 text-xs sm:text-sm">Structured learning pathways from basic circuits to autonomous robotics & edge AI.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Arduino", icon: Cpu, count: "5 Kits", color: "from-blue-500/20 to-blue-600/20 text-blue-400 border-blue-500/30" },
            { name: "Electronics", icon: Wrench, count: "4 Kits", color: "from-cyan-500/20 to-cyan-600/20 text-cyan-400 border-cyan-500/30" },
            { name: "Robotics", icon: Sparkles, count: "4 Kits", color: "from-orange-500/20 to-orange-600/20 text-orange-400 border-orange-500/30" },
            { name: "IoT", icon: BookOpen, count: "3 Kits", color: "from-emerald-500/20 to-emerald-600/20 text-emerald-400 border-emerald-500/30" },
            { name: "Raspberry Pi", icon: Layers, count: "1 Kit", color: "from-purple-500/20 to-purple-600/20 text-purple-400 border-purple-500/30" },
            { name: "AI & ML", icon: Award, count: "2 Kits", color: "from-pink-500/20 to-pink-600/20 text-pink-400 border-pink-500/30" }
          ].map((cat, idx) => (
            <Link key={idx} href={`/products?category=${cat.name}`} className={`p-5 rounded-2xl bg-gradient-to-b ${cat.color} border glass-card-hover text-center space-y-3 block`}>
              <cat.icon className="w-8 h-8 mx-auto" />
              <div>
                <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
                <span className="text-[11px] text-slate-400">{cat.count}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS (20 STEM KITS PREVIEW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="text-xs font-bold text-blue-400 uppercase tracking-widest">Hardware Catalog</div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-1">Popular STEM Product Kits</h2>
          </div>
          <Link href="/products" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
            View All 20 STEM Kits <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredKits.map((product) => {
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
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${isWishlisted ? 'bg-red-600 text-white' : 'bg-slate-900/80 text-slate-300 hover:text-red-400'}`}
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
                    <ShoppingCart className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* YOUTUBE CHANNEL HIGHLIGHT (@LetsGetEngagedin) */}
      <section className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-950 py-16 border-y border-red-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            
            <div className="space-y-4 max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-bold uppercase tracking-wider">
                <Youtube className="w-4 h-4" /> YouTube Channel Integration
              </div>
              <h2 className="text-3xl font-heading font-extrabold text-white">
                Learn Hands-On with <span className="text-red-500">@LetsGetEngagedin</span>
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Watch step-by-step assembly guides, Arduino C++ coding sessions, PCB design tutorials, and robotics experiments directly on our website. Includes downloadable code snippets for every video!
              </p>
              <div className="pt-2 flex items-center justify-center lg:justify-start space-x-4">
                <a
                  href={YOUTUBE_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/30 flex items-center gap-2"
                >
                  <Youtube className="w-4 h-4" /> Subscribe on YouTube
                </a>
                <Link href="/tutorials" className="text-xs font-semibold text-slate-300 hover:text-white">
                  Browse All Videos →
                </Link>
              </div>
            </div>

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
              {YOUTUBE_TUTORIALS.slice(0, 2).map((video) => (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="glass-card rounded-xl overflow-hidden border border-slate-800 hover:border-red-500/50 cursor-pointer transition-all group w-full sm:w-64"
                >
                  <div className="relative aspect-video bg-black">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Youtube className="w-5 h-5 fill-current" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-semibold text-white line-clamp-2">{video.title}</h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                      <span>{video.duration}</span>
                      <span className="text-cyan-400">{video.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* WHY CHOOSE ELECTRONLEARNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">Why Choose ElectronLearners?</h2>
          <p className="text-slate-400 text-xs sm:text-sm">We provide a complete ecosystem—from hardware parts to structured curriculum.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { title: "Practical Learning", desc: "Build real working projects without dry theory.", icon: Cpu },
            { title: "Affordable Kits", desc: "High-grade components at student-friendly prices.", icon: ShieldCheck },
            { title: "Step-by-Step Manuals", desc: "Color PDF manuals with circuit schematics.", icon: BookOpen },
            { title: "Video Tutorials", desc: "Video walkthroughs for every kit on YouTube.", icon: Youtube },
            { title: "Community Support", desc: "Discussion forums and teacher assistance.", icon: Users }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl glass-card border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center mx-auto">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR COURSES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Online Learning</div>
            <h2 className="text-2xl font-heading font-bold text-white">Featured STEM Courses</h2>
          </div>
          <Link href="/courses" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">
            View All Courses →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course) => (
            <div key={course.id} className="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between">
              <div>
                <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
                <div className="p-5 space-y-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase">
                    {course.category} • {course.level}
                  </span>
                  <Link href={`/courses/${course.id}`} className="block">
                    <h3 className="text-sm font-semibold text-white line-clamp-2 hover:text-cyan-400 transition-colors">
                      {course.title}
                    </h3>
                  </Link>
                  <div className="text-xs text-slate-400 flex items-center gap-3 pt-2">
                    <span>{course.durationHours} Hours</span>
                    <span>•</span>
                    <span>{course.studentsEnrolled} Students</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-4">
                <span className="text-base font-extrabold text-emerald-400 font-heading">FREE</span>
                <Link href={`/courses/${course.id}`} className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold">
                  Enroll Free
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST BLOG ARTICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-bold text-orange-400 uppercase tracking-widest">Engineering Blog</div>
            <h2 className="text-2xl font-heading font-bold text-white">Latest Technical Articles</h2>
          </div>
          <Link href="/blog" className="text-xs font-semibold text-orange-400 hover:text-orange-300">
            Browse 100 Articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentBlogs.map((blog) => (
            <div key={blog.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <span className="text-[10px] font-bold uppercase text-orange-400">{blog.category} • {blog.date}</span>
              <Link href={`/blog/${blog.id}`} className="block">
                <h3 className="text-sm font-semibold text-white hover:text-orange-400 transition-colors line-clamp-2">
                  {blog.title}
                </h3>
              </Link>
              <p className="text-slate-400 text-xs line-clamp-2">{blog.summary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Video Player */}
      <YouTubeModal tutorial={selectedVideo} onClose={() => setSelectedVideo(null)} />

    </div>
  );
}
