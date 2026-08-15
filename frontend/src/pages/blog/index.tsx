import React, { useState } from 'react';
import Link from 'next/link';
import { BLOGS_DATA } from '../../data/blogsData';
import { Search, Clock, User, ArrowRight } from 'lucide-react';

export default function BlogIndex() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Arduino', 'Electronics', 'Embedded', 'IoT', 'Robotics', 'Sensors', 'AI', 'Engineering'];

  const filteredBlogs = BLOGS_DATA.filter((b) => {
    const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Engineering Knowledge Base</span>
          <h1 className="text-3xl font-heading font-extrabold text-white mt-1">100 STEM Blog Articles</h1>
          <p className="text-slate-400 text-xs mt-1">In-depth technical guides, micro-controller deep dives, circuit design theory, and hardware debugging.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search 100 blog posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
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
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <div key={blog.id} className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between">
            <div>
              <img src={blog.image} alt={blog.title} className="w-full h-44 object-cover" />
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold uppercase text-orange-400">{blog.category}</span>
                  <span>{blog.readTime}</span>
                </div>
                <Link href={`/blog/${blog.id}`} className="block">
                  <h3 className="text-sm font-semibold text-white line-clamp-2 hover:text-orange-400 transition-colors">
                    {blog.title}
                  </h3>
                </Link>
                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">{blog.summary}</p>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-4">
              <span className="text-[11px] text-slate-500">{blog.author}</span>
              <Link href={`/blog/${blog.id}`} className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1">
                Read Article <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
