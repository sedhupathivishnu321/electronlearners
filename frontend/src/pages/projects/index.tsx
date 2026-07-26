import React, { useState } from 'react';
import Link from 'next/link';
import { PROJECTS_DATA } from '../../data/projectsData';
import { Layers, Search, Code, Cpu, Clock, ArrowRight } from 'lucide-react';

export default function ProjectsLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Arduino', 'ESP32', 'STM32', 'Electronics', 'IoT', 'Robotics', 'Python', 'AI'];

  const filteredProjects = PROJECTS_DATA.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Open Source Repository</span>
          <h1 className="text-3xl font-heading font-extrabold text-white mt-1">100 STEM Projects Library</h1>
          <p className="text-slate-400 text-xs mt-1">Complete step-by-step DIY projects with wiring schematics, hardware bill of materials, and verified source code.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search 100 STEM projects..."
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-orange-500/10 text-orange-400 text-[10px] font-bold uppercase">
                  {project.category}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> {project.timeEstimate}
                </span>
              </div>

              <Link href={`/projects/${project.id}`} className="block">
                <h3 className="text-base font-bold text-white hover:text-orange-400 transition-colors line-clamp-2">
                  {project.title}
                </h3>
              </Link>

              <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                {project.shortDesc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] font-mono text-cyan-400">{project.codeLanguage.toUpperCase()} Code</span>
              <Link href={`/projects/${project.id}`} className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1">
                View Project <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
