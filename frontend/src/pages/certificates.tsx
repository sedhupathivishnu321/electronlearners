import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Award, CheckCircle2, Download, QrCode, Shield, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/ui/Logo';

export default function CertificatesPage() {
  const router = useRouter();
  const { course } = router.query;
  const { user } = useApp();

  const [studentName, setStudentName] = useState(user?.name || "Alex Learner");
  const [courseTitle, setCourseTitle] = useState((course as string) || "Arduino C++ Programming & Hardware Interfacing");
  const [certId, setCertId] = useState("EL-2026-8942");

  const issueDate = "2026-07-26";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6 print:hidden">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Official Certification</span>
          <h1 className="text-3xl font-heading font-extrabold text-white mt-1">JR Learners STEM Certificate</h1>
        </div>

        <div className="flex items-center space-x-3">
          <Link href={`/verify-certificate/${certId}`} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:text-white flex items-center gap-1.5 border border-slate-700">
            <QrCode className="w-4 h-4" /> Verify Public Record
          </Link>
          <button onClick={handlePrint} className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20">
            <Download className="w-4 h-4" /> Download Certificate PDF
          </button>
        </div>
      </div>

      {/* Printable Certificate Template Card */}
      <div className="p-10 rounded-3xl bg-gradient-to-b from-slate-900 via-[#0B1120] to-slate-950 border-4 border-amber-500/40 shadow-2xl relative overflow-hidden space-y-8 text-center print:border-black print:text-black">
        
        {/* Certificate Watermark Corner Ornaments */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-500/50 pointer-events-none"></div>
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-500/50 pointer-events-none"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-500/50 pointer-events-none"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-500/50 pointer-events-none"></div>

        {/* Header Badge */}
        <div className="flex justify-center">
          <div className="h-16 p-2 rounded-2xl bg-slate-900 border border-amber-500/50 shadow-xl flex items-center justify-center">
            <Logo size="sm" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-amber-400">
            Certificate of Engineering Completion
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">JR Learners STEM Platform</h2>
        </div>

        <p className="text-xs text-slate-400 uppercase tracking-widest">This is to certify that</p>

        <div className="py-2 border-b border-amber-500/30 max-w-lg mx-auto">
          <h3 className="text-3xl font-heading font-bold text-cyan-400 underline decoration-amber-500/50 underline-offset-8">
            {studentName}
          </h3>
        </div>

        <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
          has successfully fulfilled all academic curriculum requirements, hardware project assignments, and laboratory evaluations for the course:
        </p>

        <h4 className="text-xl font-bold text-amber-400 max-w-xl mx-auto font-heading">
          {courseTitle}
        </h4>

        {/* Signatures & QR Code */}
        <div className="pt-8 grid grid-cols-3 gap-6 items-end border-t border-slate-800 max-w-2xl mx-auto text-xs text-slate-400">
          <div>
            <div className="font-mono text-[10px] text-slate-500">Verification Code:</div>
            <div className="font-mono font-bold text-amber-400 text-xs">{certId}</div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-white p-1 rounded-lg mx-auto mb-1">
              {/* QR Code Placeholder */}
              <div className="w-full h-full bg-slate-950 rounded flex items-center justify-center text-[8px] text-amber-400 font-mono font-bold">
                QR VERIFY
              </div>
            </div>
            <span className="text-[10px]">Scan to Validate</span>
          </div>

          <div className="text-right">
            <div className="font-heading font-bold text-white">Eng. Sedhu</div>
            <div className="text-[10px]">Director of STEM Education</div>
          </div>
        </div>

      </div>

    </div>
  );
}
