import React, { useState } from 'react';
import Link from 'next/link';
import { PROJECTS_DATA } from '../../data/projectsData';
import { useApp } from '../../context/AppContext';
import { Search, Cpu, Clock, ArrowRight, ShieldCheck, ShoppingCart, Star } from 'lucide-react';

export default function ProjectsLibrary() {
  const { products, addToCart } = useApp();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const platforms = ['All', 'Arduino', 'ESP32', 'STM32', 'Electronics', 'IoT', 'Robotics'];

  // Filter projects
  const filteredProjects = PROJECTS_DATA.filter((p) => {
    const matchesDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesPlat = selectedPlatform === 'All' || p.category === selectedPlatform;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiff && matchesPlat && matchesSearch;
  });

  // Find corresponding kit for a project category
  const getProjectKitLink = (category: string) => {
    if (category === 'Arduino') return products.find(p => p.id === 'prod-1') || products[0];
    if (category === 'Electronics') return products.find(p => p.id === 'prod-2') || products[1];
    if (category === 'IoT') return products.find(p => p.id === 'prod-6') || products[5];
    if (category === 'Robotics') return products.find(p => p.id === 'prod-8') || products[7];
    if (category === 'AI') return products.find(p => p.id === 'prod-12') || products[11];
    return products.find(p => p.category === category) || products[0];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-[#0F172A] text-slate-100">
      
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Project Funnels</span>
          <h1 className="text-3xl font-heading font-extrabold text-white mt-1 uppercase">DIY Projects & Guides</h1>
          <p className="text-slate-400 text-xs mt-1">
            Build functioning hardware gadgets with visual schematics, annotated source code, and direct kit shopping links.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects (e.g. automatic street light)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-505 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap items-center gap-4 bg-slate-900/50 p-4 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Platform:</span>
          <div className="flex gap-1 overflow-x-auto">
            {platforms.map(p => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedPlatform === p ? 'bg-orange-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-850'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Difficulty:</span>
          <div className="flex gap-1">
            {difficulties.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedDifficulty === d ? 'bg-orange-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-850'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const kitProduct = getProjectKitLink(project.category);
          return (
            <div key={project.id} className="glass-card glass-card-hover rounded-2xl border border-slate-800 flex flex-col justify-between overflow-hidden shadow-xl">
              
              {/* Project Card Header */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-orange-600/10 text-orange-400 font-bold uppercase tracking-wider">
                    {project.category}
                  </span>
                  <span className="text-slate-500 font-semibold">{project.timeEstimate}</span>
                </div>

                <div className="space-y-2">
                  <Link href={`/projects/${project.id}`} className="block">
                    <h3 className="text-base font-bold text-white hover:text-orange-400 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                  </Link>
                  <p className="text-slate-405 text-xs line-clamp-2 leading-relaxed">
                    {project.shortDesc}
                  </p>
                </div>

                {/* Difficulty tag */}
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="font-semibold text-slate-400">Level:</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                    project.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-450' : 
                    project.difficulty === 'Intermediate' ? 'bg-blue-500/10 text-blue-450' : 
                    'bg-red-500/10 text-red-450'
                  }`}>
                    {project.difficulty}
                  </span>
                </div>
              </div>

              {/* Direct Funnel Conversion Panel */}
              <div className="p-6 bg-slate-950/60 border-t border-slate-850 space-y-4">
                {kitProduct && (
                  <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <div className="space-y-0.5">
                      <div className="text-[9px] uppercase font-bold text-slate-500">Required Kit</div>
                      <div className="text-[11px] font-bold text-slate-200 line-clamp-1">{kitProduct.name}</div>
                      <div className="text-xs font-extrabold text-blue-450">₹{kitProduct.price}</div>
                    </div>
                    <button
                      onClick={() => addToCart(kitProduct, 1)}
                      className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/10"
                      title="Buy Project Kit"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-mono text-cyan-400 text-[10px] uppercase font-bold">Code: {project.codeLanguage}</span>
                  <Link href={`/projects/${project.id}`} className="font-bold text-orange-400 hover:text-orange-350 flex items-center gap-1">
                    Build Project <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
