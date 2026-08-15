import React from 'react';
import { DOCUMENTATION_DATA } from '../data/documentationData';
import { BookOpen, FileCode, Wrench, AlertTriangle } from 'lucide-react';

export default function DocumentationPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="border-b border-slate-800 pb-6">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Help & Setup Guides</span>
        <h1 className="text-3xl font-heading font-extrabold text-white mt-1">Official Hardware Documentation</h1>
        <p className="text-slate-400 text-xs mt-1">Software setup, USB driver installation, board configuration, and troubleshooting common errors.</p>
      </div>

      <div className="space-y-6">
        {DOCUMENTATION_DATA.map((doc) => (
          <div key={doc.id} className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
            <span className="px-2.5 py-1 rounded bg-cyan-600/20 text-cyan-400 text-[10px] font-bold uppercase">
              {doc.category}
            </span>
            <h2 className="text-lg font-bold text-white font-heading">{doc.title}</h2>
            <div className="prose prose-invert text-xs text-slate-300 leading-relaxed max-w-none bg-slate-950 p-5 rounded-xl border border-slate-800">
              <pre className="font-mono whitespace-pre-wrap">{doc.content}</pre>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
