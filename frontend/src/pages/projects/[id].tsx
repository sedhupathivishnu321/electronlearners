import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { PROJECTS_DATA } from '../../data/projectsData';
import { ArrowLeft, Code, Cpu, CheckCircle, Youtube, Copy, Check } from 'lucide-react';

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [copied, setCopied] = useState(false);

  const project = PROJECTS_DATA.find((p) => p.id === id || p.slug === id) || PROJECTS_DATA[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(project.sourceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <Link href="/projects" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to 100 STEM Projects</span>
      </Link>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded bg-orange-600/20 text-orange-400 text-xs font-bold uppercase tracking-wider">
            {project.category} Project
          </span>
          <span className="text-xs text-slate-400">Est. Time: {project.timeEstimate}</span>
        </div>

        <h1 className="text-3xl font-heading font-extrabold text-white">{project.title}</h1>
        <p className="text-slate-300 text-sm leading-relaxed">{project.shortDesc}</p>
      </div>

      {/* Objectives & Hardware BOM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Project Objectives</h3>
          <div className="space-y-2">
            {project.objectives.map((obj, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Bill of Materials (Hardware)</h3>
          <ul className="space-y-2">
            {project.componentsNeeded.map((comp, idx) => (
              <li key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
                <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{comp}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Circuit Description */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Circuit Schematic Instructions</h3>
        <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950 p-4 rounded-xl border border-slate-800">
          {project.circuitDescription}
        </p>
      </div>

      {/* Source Code Box */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Source Code ({project.codeLanguage.toUpperCase()})</h3>
          <button
            onClick={handleCopyCode}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy Source Code"}
          </button>
        </div>
        <pre className="bg-slate-950 text-emerald-400 p-5 rounded-2xl text-xs border border-slate-800 overflow-x-auto font-mono max-h-96">
          <code>{project.sourceCode}</code>
        </pre>
      </div>

    </div>
  );
}
