import React from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { KIT_FOCUS, KIT_NAMES } from '../data/kitProjects';
import { Download, BookOpen, PlayCircle, Cpu } from 'lucide-react';

// The "manual" is now the kit guide: every kit has 50 projects, each with parts, circuit notes, sketch and simulator.
export default function KitGuides() {
  const { products } = useApp();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-slate-300 pb-6">
        <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Learning path</span>
        <h1 className="text-3xl font-heading font-extrabold mt-1 uppercase">The 8-Kit Guide</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl">Work through the kits in order, or start at the level that fits you. Each kit has 50 projects: 10 Basic, 20 Intermediate and 20 Advanced. Open any project to see its parts, circuit notes and sketch, and run it in the simulator before you build it.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(KIT_NAMES).map(([k, name]) => {
          const n = Number(k);
          const product = products.find((p) => p.id === `prod-${n}`);
          return (
            <div key={k} className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Level {n} of 8</span>
                  <h2 className="text-lg font-heading font-bold">{name}</h2>
                  <p className="text-xs text-slate-500 mt-1">{KIT_FOCUS[n]}</p>
                </div>
                {product && <span className="text-base font-extrabold shrink-0">₹{product.price}</span>}
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link href={`/projects?kit=${n}`} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> 50 projects</Link>
                <Link href={`/products/prod-${n}`} className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5" /> Kit details</Link>
                <a href={`/arduinoforge/`} className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold flex items-center gap-1.5"><PlayCircle className="w-3.5 h-3.5" /> Simulator</a>
                <Link href="/downloads" className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> Sketches (.zip)</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
