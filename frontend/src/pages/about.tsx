import React from 'react';
import { Cpu, Target, Eye, Award, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
          Company Story
        </span>
        <h1 className="text-4xl font-heading font-extrabold text-white">About ElectronLearners</h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          Empowering millions of learners across India through hands-on practical electronics, microcontrollers, robotics, IoT, and edge artificial intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl glass-card border border-slate-800 space-y-4">
          <Target className="w-10 h-10 text-blue-400" />
          <h2 className="text-xl font-bold text-white font-heading">Our Mission</h2>
          <p className="text-slate-300 text-xs leading-relaxed">
            To provide affordable, practical STEM education through high-quality electronics kits, online learning, and project-based experiences that inspire innovation among students, educators, and makers.
          </p>
        </div>

        <div className="p-8 rounded-3xl glass-card border border-slate-800 space-y-4">
          <Eye className="w-10 h-10 text-cyan-400" />
          <h2 className="text-xl font-bold text-white font-heading">Our Vision</h2>
          <p className="text-slate-300 text-xs leading-relaxed">
            To become India's leading STEM education platform, empowering millions of learners with practical skills in electronics, robotics, IoT, embedded systems, AI, and engineering.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-white font-heading text-center">Our Journey & Milestones</h3>
        <div className="space-y-4 text-xs text-slate-300">
          <div className="flex items-start gap-4">
            <span className="px-3 py-1 rounded bg-blue-600 text-white font-bold font-mono">2024</span>
            <p className="pt-0.5">Launched YouTube channel @LetsGetEngagedin providing free Arduino & electronics tutorials.</p>
          </div>
          <div className="flex items-start gap-4">
            <span className="px-3 py-1 rounded bg-cyan-600 text-white font-bold font-mono">2025</span>
            <p className="pt-0.5">Designed first 10 physical STEM hardware kits and established school robotics lab partnerships.</p>
          </div>
          <div className="flex items-start gap-4">
            <span className="px-3 py-1 rounded bg-amber-500 text-slate-950 font-bold font-mono">2026</span>
            <p className="pt-0.5">Expanded to 20 product kits, 100 STEM projects, certified online courses, and QR verification.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
