import React, { useState } from 'react';
import { DOWNLOADS_DATA } from '../data/downloadsData';
import { Download, FileText, Code, Layers, Cpu, Search } from 'lucide-react';

export default function DownloadsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'PDF Manuals', 'Circuit Diagrams', 'Arduino Code', 'Datasheets', 'PCB Gerber', '3D Models'];

  const filtered = DOWNLOADS_DATA.filter((d) => {
    const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Resource Hub</span>
          <h1 className="text-3xl font-heading font-extrabold text-white mt-1">Downloads & Open Source Resources</h1>
          <p className="text-slate-400 text-xs mt-1">Download assembly PDF manuals, high-res pinout diagrams, Gerber PCB files, and complete code repositories.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search downloads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div key={item.id} className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase">
                  {item.fileType} • {item.size}
                </span>
                <span className="text-[11px] text-slate-400">{item.downloadsCount} downloads</span>
              </div>
              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
            </div>

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
            >
              <Download className="w-4 h-4" /> Download File
            </a>
          </div>
        ))}
      </div>

    </div>
  );
}
