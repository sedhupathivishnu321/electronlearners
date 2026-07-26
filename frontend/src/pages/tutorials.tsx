import React, { useState } from 'react';
import { YOUTUBE_TUTORIALS, YOUTUBE_CHANNEL_URL, YouTubeTutorial } from '../data/youtubeData';
import { YouTubeModal } from '../components/youtube/YouTubeModal';
import { Youtube, Search, Play, Code, Download, ExternalLink, Sparkles } from 'lucide-react';

export default function YouTubeTutorialsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalTutorial, setActiveModalTutorial] = useState<YouTubeTutorial | null>(null);

  const categories = ['All', 'Arduino', 'ESP32', 'Robotics', 'PCB Design', 'AI & ML', 'Electronics'];

  const filteredTutorials = YOUTUBE_TUTORIALS.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-red-950/60 via-slate-900 to-slate-950 border border-red-900/40 relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-bold uppercase tracking-wider">
            <Youtube className="w-4 h-4" /> YouTube Channel Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
            Official Tutorials by <span className="text-red-500">@LetsGetEngagedin</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Structured video walkthroughs for electronics, Arduino C++, ESP32 IoT, KiCad PCB design, and autonomous robotics. Download verified source code files (.ino, .py, .c) for every lesson!
          </p>
          <div className="pt-2 flex items-center space-x-4">
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/30 flex items-center gap-2"
            >
              <Youtube className="w-4 h-4" /> Visit Channel
            </a>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search YouTube tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutorials.map((tutorial) => (
          <div
            key={tutorial.id}
            className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div
                onClick={() => setActiveModalTutorial(tutorial)}
                className="relative aspect-video bg-black cursor-pointer group"
              >
                <img src={tutorial.thumbnail} alt={tutorial.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/80 text-white text-[10px] font-mono">
                  {tutorial.duration}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <span className="text-[10px] font-bold uppercase text-cyan-400">{tutorial.category}</span>
                <h3
                  onClick={() => setActiveModalTutorial(tutorial)}
                  className="text-sm font-semibold text-white cursor-pointer hover:text-red-400 transition-colors line-clamp-2"
                >
                  {tutorial.title}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-2">{tutorial.description}</p>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-4">
              <button
                onClick={() => setActiveModalTutorial(tutorial)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Code className="w-3.5 h-3.5" /> Download Code
              </button>
              <button
                onClick={() => setActiveModalTutorial(tutorial)}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-current" /> Watch
              </button>
            </div>
          </div>
        ))}
      </div>

      <YouTubeModal tutorial={activeModalTutorial} onClose={() => setActiveModalTutorial(null)} />

    </div>
  );
}
