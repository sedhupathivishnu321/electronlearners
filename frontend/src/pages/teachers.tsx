import React from 'react';
import Link from 'next/link';
import { Users, BookOpen, CheckSquare, Package, Award, FileText } from 'lucide-react';

export default function TeacherPortal() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="border-b border-slate-800 pb-6">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Educator Suite</span>
        <h1 className="text-3xl font-heading font-extrabold text-white mt-1">Teacher & Educator Portal</h1>
        <p className="text-slate-400 text-xs mt-1">Access teacher lab manuals, create assignment rubrics, track student quiz scores, and order bulk STEM lab kits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Teacher Lab Manuals</h3>
          <p className="text-slate-400 text-xs leading-relaxed">Download complete curriculum lesson plans, grading answer keys, and lab safety checklists.</p>
          <a href="/downloads/manuals/Arduino_Starter_Kit_Guide.pdf" className="inline-block text-xs font-semibold text-cyan-400 hover:underline">Download Lab Manuals →</a>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Student Roster & Progress</h3>
          <p className="text-slate-400 text-xs leading-relaxed">Monitor class attendance, assignment uploads, quiz scores, and student project submissions.</p>
          <Link href="/dashboard" className="inline-block text-xs font-semibold text-blue-400 hover:underline">View Class Roster →</Link>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Bulk Lab Kit Requisitions</h3>
          <p className="text-slate-400 text-xs leading-relaxed">Request institutional discounts on 20+ Arduino, Robotics, and IoT physical hardware kits.</p>
          <Link href="/contact" className="inline-block text-xs font-semibold text-orange-400 hover:underline">Request Quotation →</Link>
        </div>
      </div>

    </div>
  );
}
