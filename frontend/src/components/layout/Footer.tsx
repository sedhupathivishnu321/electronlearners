import React from 'react';
import Link from 'next/link';
import { Cpu, Youtube, Github, Mail, MapPin, Phone, ShieldCheck, Heart } from 'lucide-react';
import { YOUTUBE_CHANNEL_URL } from '../../data/youtubeData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B1120] text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-10 flex items-center justify-center p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo.png`} alt="JR Learners Logo" className="h-7 w-auto object-contain" />
              </div>
              <span className="text-xl font-heading font-bold text-white">
                Electron<span className="text-blue-500">Learners</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Empowering students, makers, and schools across India with high-quality physical STEM kits, structured online courses, open-source projects, and YouTube tutorials.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="mailto:support@jrlearners.com" className="w-9 h-9 rounded-lg bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4 font-heading">Explore Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/products" className="hover:text-blue-400 transition-colors">20 STEM Product Kits</Link></li>
              <li><Link href="/tutorials" className="hover:text-red-400 transition-colors">YouTube Tutorials</Link></li>
              <li><Link href="/courses" className="hover:text-cyan-400 transition-colors">STEM Courses</Link></li>
              <li><Link href="/projects" className="hover:text-orange-400 transition-colors">100 STEM Projects</Link></li>
              <li><Link href="/downloads" className="hover:text-emerald-400 transition-colors">PDF & Code Downloads</Link></li>
              <li><Link href="/documentation" className="hover:text-white transition-colors">Setup Documentation</Link></li>
            </ul>
          </div>

          {/* Portals & Ecosystem */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4 font-heading">Portals & Support</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/dashboard" className="hover:text-blue-400 transition-colors">Student Dashboard</Link></li>
              <li><Link href="/teachers" className="hover:text-cyan-400 transition-colors">Teacher Portal</Link></li>
              <li><Link href="/schools" className="hover:text-orange-400 transition-colors">School & Lab Packages</Link></li>
              <li><Link href="/certificates" className="hover:text-emerald-400 transition-colors">Certificates & QR Check</Link></li>
              <li><Link href="/admin" className="hover:text-amber-400 transition-colors">Enterprise Admin</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Support & FAQs</Link></li>
            </ul>
          </div>

          {/* Legal & Newsletter */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4 font-heading">Legal & Policies</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/privacy" className="hover:text-slate-200 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-slate-200 transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-slate-200 transition-colors">Refund Policy</Link></li>
              <li><Link href="/shipping" className="hover:text-slate-200 transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/contact" className="hover:text-slate-200 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 JR Learners Education. All rights reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for STEM Makers & Engineers.
          </p>
        </div>
      </div>
    </footer>
  );
};
