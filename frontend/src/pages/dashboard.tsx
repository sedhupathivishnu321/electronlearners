import React from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { User, BookOpen, ShoppingBag, Award, Heart, Shield, CheckCircle, ExternalLink, QrCode } from 'lucide-react';
import { PRODUCTS_DATA } from '../data/productsData';
import { COURSES_DATA } from '../data/coursesData';

export default function StudentDashboard() {
  const { user, cart, wishlist } = useApp();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Please Sign In to Access Dashboard</h2>
        <Link href="/login" className="inline-block px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-semibold">
          Sign In
        </Link>
      </div>
    );
  }

  const enrolledCourses = COURSES_DATA.filter((c) => user.enrolledCourseIds.includes(c.id));
  const purchasedProducts = PRODUCTS_DATA.filter((p) => user.purchasedProductIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Profile Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold font-heading shadow-lg shadow-blue-500/20">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white font-heading">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-bold uppercase">
                {user.role}
              </span>
            </div>
            <p className="text-slate-400 text-xs">{user.email} • {user.institution || "Independent Maker"}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/certificates" className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow">
            <Award className="w-4 h-4" /> My Certificates
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Enrolled Courses</span>
          <div className="text-2xl font-bold text-cyan-400 font-heading">{enrolledCourses.length}</div>
        </div>
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">STEM Kits Purchased</span>
          <div className="text-2xl font-bold text-blue-400 font-heading">{purchasedProducts.length}</div>
        </div>
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Earned Certificates</span>
          <div className="text-2xl font-bold text-amber-400 font-heading">{user.certificates.length}</div>
        </div>
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Saved Wishlist</span>
          <div className="text-2xl font-bold text-red-400 font-heading">{wishlist.length}</div>
        </div>
      </div>

      {/* Enrolled Courses & Orders Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Enrolled Courses */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-lg font-bold text-white font-heading">My Active Courses</h2>
          <div className="space-y-4">
            {enrolledCourses.map((c) => (
              <div key={c.id} className="p-5 rounded-2xl glass-card border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase">{c.category}</span>
                  <h3 className="text-sm font-semibold text-white">{c.title}</h3>
                  <div className="text-xs text-slate-400">{c.durationHours} Hours • 60% Completed</div>
                </div>
                <Link href={`/courses/${c.id}`} className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shrink-0">
                  Continue Lesson
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Issued Certificates */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-bold text-white font-heading">Issued STEM Certificates</h2>
          <div className="space-y-4">
            {user.certificates.map((cert) => (
              <div key={cert.id} className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">ID: {cert.id}</span>
                  <span className="text-[11px] text-slate-400">Issued {cert.issueDate}</span>
                </div>
                <h3 className="text-sm font-bold text-white">{cert.courseTitle}</h3>
                <div className="flex items-center justify-between pt-2">
                  <Link href={`/verify-certificate/${cert.id}`} className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold">
                    <QrCode className="w-4 h-4" /> Verify QR & Download PDF
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
