import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Cpu, Printer, Copy, Check, Sparkles, BookOpen, Wrench, Lightbulb, Edit3, ShieldCheck, Download } from 'lucide-react';
import { EXPERIMENTS_15, ExperimentData } from './manual-editor';

export default function PerfectArduinoManualPage() {
  const [selectedExpNum, setSelectedExpNum] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  const exp = EXPERIMENTS_15.find((e) => e.num === selectedExpNum) || EXPERIMENTS_15[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(exp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white print:text-black">
      
      {/* TOP BAR ACTION HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8 print:hidden">
        <div>
          <Link href="/products/arduino-starter-kit" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white mb-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Arduino Starter Kit</span>
          </Link>
          <h1 className="text-3xl font-heading font-black text-white flex items-center gap-3">
            <span className="gradient-text-blue">Arduino STEM Kit</span> Official 15-Experiment Lab Manual
          </h1>
          <p className="text-slate-400 text-xs mt-1">Pixel-perfect printable hardware guide designed for hands-on electronics & robotics education.</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/manual-editor" className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow">
            <Edit3 className="w-4 h-4" /> Open Editable Studio
          </Link>
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF Manual
          </button>
        </div>
      </div>

      {/* EXPERIMENT SELECTOR TABS */}
      <div className="max-w-7xl mx-auto flex items-center space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-none print:hidden">
        {EXPERIMENTS_15.map((item) => (
          <button
            key={item.num}
            onClick={() => setSelectedExpNum(item.num)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedExpNum === item.num
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Exp #{item.num}: {item.title}
          </button>
        ))}
      </div>

      {/* OUTER STEM DOODLE FRAME CONTAINER (MATCHING TEMPLATE FRAME) */}
      <div className="max-w-6xl mx-auto p-4 sm:p-8 rounded-3xl bg-white border-4 border-slate-200 shadow-2xl relative print:p-0 print:border-none print:shadow-none">
        
        {/* DOODLE ICON HEADER OVERLAY BACKGROUND */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] rounded-3xl"></div>

        {/* INNER NAVY BLUE EXPERIMENT CARD CONTAINER */}
        <div className="relative z-10 p-6 sm:p-8 rounded-2xl bg-[#09152b] text-white border-2 border-blue-500/40 space-y-6 shadow-2xl print:bg-white print:text-black print:border-black">
          
          {/* HEADER BAR: EXPERIMENT BADGE | RED TITLE BOX | ARDUINO BRAND LOGO */}
          <div className="grid grid-cols-12 gap-4 items-center border-b-2 border-blue-500/30 pb-6">
            
            {/* EXPERIMENT BADGE (BLUE CHEVRON) */}
            <div className="col-span-3 sm:col-span-2">
              <div className="px-4 py-3 rounded-xl bg-blue-600 text-white text-center shadow-lg shadow-blue-600/40 border border-blue-400/40">
                <span className="block text-[9px] uppercase font-bold tracking-widest text-blue-200">EXPERIMENT</span>
                <span className="text-2xl font-black font-heading">#{exp.num}</span>
              </div>
            </div>

            {/* RED TITLE BOX */}
            <div className="col-span-6 sm:col-span-8 text-center">
              <div className="px-6 py-3 rounded-xl bg-white border-2 border-blue-600 shadow-md">
                <h2 className="text-xl sm:text-2xl font-heading font-black tracking-wider text-red-600 uppercase">
                  {exp.title}
                </h2>
              </div>
            </div>

            {/* ARDUINO LOGO & ELECTRONLEARNERS BRAND */}
            <div className="col-span-3 sm:col-span-2 flex justify-end items-center">
              <div className="flex items-center space-x-2">
                <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo.png`} alt="ElectronLearners Logo" className="h-10 w-auto object-contain" />
              </div>
            </div>
          </div>

          {/* MAIN EXPERIMENT BODY GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: CONCEPT | COMPONENTS | LEARNING */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* CONCEPT BADGE & BOX */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow">
                  <Lightbulb className="w-4 h-4 fill-current" />
                  <span>CONCEPT</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0f203c] border border-blue-900/60 text-xs text-slate-200 font-medium leading-relaxed">
                  {exp.concept}
                </div>
              </div>

              {/* COMPONENTS BADGE & LIST */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow">
                  <Wrench className="w-4 h-4" />
                  <span>COMPONENTS</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0f203c] border border-blue-900/60 space-y-1.5 text-xs text-slate-200">
                  {exp.components.map((comp, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* LEARNING BADGE & OBJECTIVES */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow">
                  <BookOpen className="w-4 h-4" />
                  <span>LEARNING</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0f203c] border border-blue-900/60 space-y-1.5 text-xs text-slate-200">
                  {exp.learning.map((obj, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <span className="text-purple-400 font-bold">•</span>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: FRITZING CIRCUIT SCHEMATIC | CODE | EXPLANATION */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* FRITZING CIRCUIT SCHEMATIC IMAGE CONTAINER */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-cyan-600 text-white font-bold text-xs uppercase tracking-wider shadow">
                  <Cpu className="w-4 h-4" />
                  <span>FRITZING HARDWARE WIRING SCHEMATIC</span>
                </div>
                <div className="p-3 rounded-xl bg-white border-2 border-cyan-500/40 shadow-inner flex flex-col items-center">
                  <img
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/circuits/exp${exp.num}.svg`}
                    alt={`Fritzing Circuit Exp ${exp.num}`}
                    className="w-full max-h-72 object-contain rounded-lg"
                  />
                </div>
              </div>

              {/* ARDUINO C++ CODE BLOCK */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow">
                    <Sparkles className="w-4 h-4" />
                    <span>ARDUINO C++ CODE SKETCH</span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 print:hidden"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy Code"}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-[#040810] border border-blue-900/60 text-emerald-400 font-mono text-xs overflow-x-auto max-h-56 leading-relaxed shadow-inner">
                  <pre><code>{exp.code}</code></pre>
                </div>
              </div>

              {/* EXPLANATION BOX */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow">
                  <span>EXPLANATION</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0f203c] border border-blue-900/60 text-xs text-slate-200 leading-relaxed">
                  {exp.explanation}
                </div>
              </div>

            </div>

          </div>

          {/* BOTTOM ROW: WORKING | RESULT | ENGINEER'S TIP */}
          <div className="border-t-2 border-blue-500/30 pt-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WORKING PRINCIPLE */}
              <div className="p-3.5 rounded-xl bg-[#0f203c] border border-blue-900/60 space-y-1">
                <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 text-[10px] font-extrabold uppercase">WORKING PRINCIPLE</span>
                <p className="text-xs text-slate-200 pt-1 leading-relaxed">{exp.working}</p>
              </div>

              {/* EXPECTED RESULT */}
              <div className="p-3.5 rounded-xl bg-[#0f203c] border border-blue-900/60 space-y-1">
                <span className="px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-300 text-[10px] font-extrabold uppercase">EXPECTED RESULT</span>
                <p className="text-xs text-slate-200 pt-1 leading-relaxed">{exp.result}</p>
              </div>
            </div>

            {/* ENGINEER'S TIP (YELLOW HIGHLIGHT CARD) */}
            <div className="lg:col-span-4 p-4 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-amber-100 space-y-1 flex flex-col justify-center shadow-lg">
              <div className="flex items-center space-x-2 font-bold text-xs text-amber-300 uppercase">
                <Lightbulb className="w-4 h-4 fill-current text-amber-300" />
                <span>ENGINEER'S TIP</span>
              </div>
              <p className="text-xs leading-relaxed text-amber-100 font-medium">{exp.tip}</p>
            </div>

          </div>

        </div>

      </div>

      {/* PROFESSIONAL CODE OF ETHICS & SAFETY STANDARDS */}
      <div className="max-w-6xl mx-auto mt-8 p-8 rounded-3xl bg-slate-900 border-2 border-cyan-500/40 space-y-6 print:border-black print:text-black print:bg-white">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-heading font-black text-white uppercase tracking-wide">Professional Code of Ethics & IEEE STEM Safety Standards</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-amber-400 uppercase text-xs">1. Hardware & Component Stewardship</h4>
            <p className="leading-relaxed text-slate-300">Always verify supply voltage polarity and insert 220Ω current-limiting resistors before applying power to prevent semiconductor breakdown and electronic waste.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-400 uppercase text-xs">2. Code Integrity & Fail-Safe Defaults</h4>
            <p className="leading-relaxed text-slate-300">Write modular, non-blocking, thoroughly commented C++ sketches. Enforce default LOW fail-safe pin states for all motor and high-voltage actuator channels.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-purple-400 uppercase text-xs">3. Responsible STEM Innovation</h4>
            <p className="leading-relaxed text-slate-300">Design embedded hardware and IoT systems that prioritize user physical safety, environmental sustainability, open hardware documentation, and public benefit.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
