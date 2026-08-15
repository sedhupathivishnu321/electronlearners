import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck, Cpu, Users, Award, Mail } from 'lucide-react';

export default function SchoolPortal() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="border-b border-slate-800 pb-6">
        <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Institutional Partnerships</span>
        <h1 className="text-3xl font-heading font-extrabold text-white mt-1">School & Institution STEM Lab Portal</h1>
        <p className="text-slate-400 text-xs mt-1">Turn your school into an advanced STEM & Robotics Innovation Center with turn-key hardware labs and teacher training.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="p-8 rounded-3xl glass-card border border-slate-800 space-y-4">
          <Building2 className="w-10 h-10 text-blue-400" />
          <h2 className="text-xl font-bold text-white font-heading">Turn-Key STEM Robotics Lab Packages</h2>
          <p className="text-slate-300 text-xs leading-relaxed">
            We equip schools and colleges with complete physical STEM infrastructure including 20 product kits, 500+ component inventories, storage units, teacher training workshops, and co-branded certificates.
          </p>
          <div className="space-y-2 text-xs text-slate-300 pt-2">
            <div className="flex items-center gap-2">✓ Custom GST Invoicing & Institutional Credit Terms</div>
            <div className="flex items-center gap-2">✓ Faculty Development Programs (FDP) & On-site Workshops</div>
            <div className="flex items-center gap-2">✓ National STEM Competition Hosting & Student Badges</div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Request Institution Proposal</h3>
          <form onSubmit={(e) => { e.preventDefault(); alert("Institutional inquiry submitted successfully!"); }} className="space-y-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">School / Institution Name</label>
              <input type="text" required placeholder="e.g. Delhi Public School" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Official Contact Email</label>
              <input type="email" required placeholder="principal@school.edu.in" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Estimated Student Count</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300">
                <option>100 - 500 Students</option>
                <option>500 - 2000 Students</option>
                <option>2000+ Students</option>
              </select>
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs shadow-lg shadow-orange-600/30">
              Submit School Partnership Request
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
