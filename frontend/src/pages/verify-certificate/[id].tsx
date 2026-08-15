import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ShieldCheck, Award, CheckCircle, ArrowLeft } from 'lucide-react';

export default function VerifyCertificate() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
      
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
        <ShieldCheck className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full bg-emerald-600/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          Official Record Verified
        </span>
        <h1 className="text-2xl font-bold text-white font-heading">Valid STEM Certificate Record</h1>
        <p className="text-slate-400 text-xs font-mono">Verification ID: {id || "EL-2026-8942"}</p>
      </div>

      <div className="p-6 rounded-2xl glass-card border border-slate-800 text-left space-y-3 text-xs">
        <div className="flex justify-between border-b border-slate-800/80 pb-2">
          <span className="text-slate-400">Student Name:</span>
          <span className="text-white font-semibold">Alex Learner</span>
        </div>
        <div className="flex justify-between border-b border-slate-800/80 pb-2">
          <span className="text-slate-400">Course Completed:</span>
          <span className="text-amber-400 font-semibold">Arduino C++ Programming & Hardware Interfacing</span>
        </div>
        <div className="flex justify-between border-b border-slate-800/80 pb-2">
          <span className="text-slate-400">Issuing Organization:</span>
          <span className="text-cyan-400 font-semibold">ElectronLearners STEM Education</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Status:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Authenticated & Permanent</span>
        </div>
      </div>

      <Link href="/" className="inline-flex items-center space-x-2 text-xs text-slate-400 hover:text-white pt-4">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to ElectronLearners Home</span>
      </Link>

    </div>
  );
}
