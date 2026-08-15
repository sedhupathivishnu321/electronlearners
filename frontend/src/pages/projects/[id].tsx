import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { PROJECTS_DATA, STEMProject } from '../../data/projectsData';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Code, Cpu, CheckCircle, Youtube, Copy, Check, ShoppingCart, HelpCircle, FileText, Download } from 'lucide-react';

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { products, addToCart } = useApp();
  const [copied, setCopied] = useState(false);

  // Find project
  const project = PROJECTS_DATA.find((p) => p.id === id || p.slug === id) || PROJECTS_DATA[0];

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-300">
        <p>Project not found.</p>
        <Link href="/projects" className="text-blue-500 hover:underline mt-4 inline-block">Back to Projects</Link>
      </div>
    );
  }

  // Find corresponding kit for the project category
  const getProjectKitLink = (category: string) => {
    if (category === 'Arduino') return products.find(p => p.id === 'prod-1') || products[0];
    if (category === 'Electronics') return products.find(p => p.id === 'prod-2') || products[1];
    if (category === 'IoT') return products.find(p => p.id === 'prod-6') || products[5];
    if (category === 'Robotics') return products.find(p => p.id === 'prod-8') || products[7];
    if (category === 'AI') return products.find(p => p.id === 'prod-12') || products[11];
    return products.find(p => p.category === category) || products[0];
  };

  const kitProduct = getProjectKitLink(project.category);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(project.sourceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Checkbox tracker for individual components checklist
  const [checkedComponents, setCheckedComponents] = useState<Record<number, boolean>>({});
  const toggleComponentCheck = (idx: number) => {
    setCheckedComponents(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Buy single component mockup
  const handleBuyComponent = (compName: string) => {
    const isMainController = compName.toLowerCase().includes('controller') || compName.toLowerCase().includes('board') || compName.toLowerCase().includes('arduino') || compName.toLowerCase().includes('esp32');
    
    const mockComponentProduct = {
      id: `comp-${compName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      name: compName,
      slug: compName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: 'Components' as any,
      price: isMainController ? 599 : compName.includes('Breadboard') ? 150 : 25,
      originalPrice: isMainController ? 799 : compName.includes('Breadboard') ? 199 : 40,
      rating: 4.8,
      reviewsCount: 15,
      stock: 100,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop&q=80",
      shortDesc: `Component for project: ${project.title}`,
      description: `High-quality individual component: ${compName}. Guaranteed compatible.`,
      learningObjectives: [],
      components: [],
      specifications: {},
      assemblySteps: [],
      manualUrl: '',
      datasheetUrl: '',
      videoUrl: ''
    };
    
    addToCart(mockComponentProduct, 1);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-[#0F172A] text-slate-100">
      
      {/* Back Link */}
      <Link href="/projects" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects Library</span>
      </Link>

      {/* Project Header Banner */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded bg-orange-600/20 text-orange-400 text-xs font-bold uppercase tracking-wider">
            {project.category} Project
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            project.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-450' : 
            project.difficulty === 'Intermediate' ? 'bg-blue-500/10 text-blue-450' : 
            'bg-red-500/10 text-red-450'
          }`}>
            {project.difficulty} Level
          </span>
          <span className="text-slate-400 text-xs font-semibold">Build Time: {project.timeEstimate}</span>
        </div>

        <h1 className="text-3xl font-heading font-extrabold text-white">{project.title}</h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">{project.shortDesc}</p>
      </div>

      {/* Sales Funnel Section: Complete Project Kit vs Individual Components */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left: Complete Project Kit Panel */}
        {kitProduct && (
          <div className="md:col-span-7 rounded-2xl border border-blue-500/25 bg-gradient-to-b from-blue-950/20 to-slate-950 p-6 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 blur-xl rounded-full"></div>
            
            <div className="space-y-2">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wide">Complete Solution</span>
              <h2 className="text-base font-bold text-white uppercase tracking-wide">Get the Complete Project Kit</h2>
              <p className="text-slate-400 text-xs">Don't buy parts individually. Get this comprehensive hardware kit that includes every component, printed manuals, and pre-written codes.</p>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <img src={kitProduct.image} alt={kitProduct.name} className="w-20 h-20 object-cover rounded-lg border border-slate-700" />
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-white">{kitProduct.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-extrabold text-blue-400">₹{kitProduct.price}</span>
                  {kitProduct.originalPrice && kitProduct.originalPrice > kitProduct.price && (
                    <span className="text-[11px] text-slate-550 line-through">₹{kitProduct.originalPrice}</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400">✓ Tested batch components • 6 Months warranty</div>
              </div>
            </div>

            <button
              onClick={() => addToCart(kitProduct, 1)}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-blue-600/20"
            >
              <ShoppingCart className="w-4 h-4" /> Buy Complete Project Kit
            </button>
          </div>
        )}

        {/* Right: Learn Section (Objectives) */}
        <div className="md:col-span-5 p-6 rounded-2xl border border-slate-800 bg-slate-900/20 space-y-4 shadow-lg">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">What You Will Learn</h3>
          <div className="space-y-3">
            {project.objectives.map((obj, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-450 shrink-0 mt-0.5" />
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Components Checklist & Individual Buy Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left: Components Checklist */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Required Parts Checklist</h3>
          <p className="text-[10px] text-slate-400">Check off the parts you already have at home to see what components you still need to purchase.</p>
          
          <div className="space-y-2">
            {project.componentsNeeded.map((comp, idx) => (
              <div
                key={idx}
                onClick={() => toggleComponentCheck(idx)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  checkedComponents[idx]
                    ? 'bg-slate-950/60 border-slate-800 opacity-60'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!checkedComponents[idx]}
                  onChange={() => {}}
                  className="rounded border-slate-700 text-orange-500 focus:ring-orange-550 w-4 h-4 bg-slate-950 pointer-events-none"
                />
                <span className={`text-xs ${checkedComponents[idx] ? 'line-through text-slate-500' : 'text-slate-200'}`}>{comp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Buy Components Individually */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Buy Components Individually</h3>
          <p className="text-[10px] text-slate-400">Need just one or two specific parts to finish? Add them directly to your cart below.</p>
          
          <div className="space-y-3">
            {project.componentsNeeded.map((comp, idx) => {
              const isMainBoard = comp.toLowerCase().includes('board') || comp.toLowerCase().includes('controller') || comp.toLowerCase().includes('arduino');
              const compPrice = isMainBoard ? 599 : comp.includes('Breadboard') ? 150 : 25;
              
              return (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/50 border border-slate-850 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-200 line-clamp-1">{comp}</div>
                    <div className="text-[10px] font-extrabold text-blue-450">₹{compPrice}</div>
                  </div>
                  <button
                    onClick={() => handleBuyComponent(comp)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white text-[10px] font-semibold text-slate-300 transition-all flex items-center gap-1 border border-slate-700"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Resources Breakdown Section (Tabs) */}
      <div className="border-t border-slate-850 pt-8 space-y-6">
        <h2 className="text-lg font-bold text-white uppercase tracking-tight font-heading">Build Documentation & Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Circuit and Schematic Instructions */}
          <div className="md:col-span-1 p-6 rounded-2xl glass-card border border-slate-805 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-orange-500" /> Circuit Wiring Schematic
            </h3>
            <p className="text-[11px] text-slate-350 leading-relaxed font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap">
              {project.circuitDescription}
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
              💡 Ensure microcontrollers are completely powered down before connecting GPIO jumper wires to prevent short circuits.
            </div>
          </div>

          {/* Copyable Source Code */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-4 h-4 text-orange-500" /> Project Code ({project.codeLanguage.toUpperCase()})
              </h3>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>
            <pre className="bg-slate-950 text-emerald-400 p-5 rounded-2xl text-[11px] border border-slate-850 overflow-x-auto font-mono max-h-72 shadow-lg">
              <code>{project.sourceCode}</code>
            </pre>
          </div>

        </div>

        {/* Video and Manual Downloads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Youtube className="w-8 h-8 text-red-500" />
              <div>
                <div className="text-xs font-bold text-white uppercase">Assembly Video Walkthrough</div>
                <div className="text-[10px] text-slate-400">Visual guides on YouTube channel @LetsGetEngagedin</div>
              </div>
            </div>
            <a
              href={project.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-[10px] font-bold transition-all border border-slate-700"
            >
              Watch Video
            </a>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-xs font-bold text-white uppercase">Project Lab Report Manual PDF</div>
                <div className="text-[10px] text-slate-400">Printed reference guidelines for students</div>
              </div>
            </div>
            <button
              onClick={() => alert("Downloading Project PDF Manual...")}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white text-[10px] font-bold transition-all border border-slate-700 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
