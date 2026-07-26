import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, Heart, User, Search, Youtube, Shield, Cpu, Menu, X, BookOpen, Layers, Award } from 'lucide-react';

export const Header: React.FC = () => {
  const { cart, wishlist, user, logout } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-11 flex items-center justify-center p-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-md group-hover:scale-105 transition-transform">
              <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo.png`} alt="ElectronLearners Logo" className="h-8 w-auto object-contain" />
            </div>
            <div>
              <span className="text-xl font-heading font-extrabold tracking-tight text-white">
                Electron<span className="gradient-text-blue">Learners</span>
              </span>
              <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-widest">
                Learn. Build. Innovate.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-slate-300">
            <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <Link href="/products" className="hover:text-blue-400 transition-colors flex items-center gap-1">
              <Cpu className="w-4 h-4 text-blue-500" /> Kits (20)
            </Link>
            <Link href="/manual" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-amber-400" /> 15 Circuits Manual
            </Link>
            <Link href="/tutorials" className="hover:text-red-400 transition-colors flex items-center gap-1">
              <Youtube className="w-4 h-4 text-red-500" /> YouTube
            </Link>
            <Link href="/courses" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-cyan-500" /> Courses
            </Link>
            <Link href="/projects" className="hover:text-orange-400 transition-colors flex items-center gap-1">
              <Layers className="w-4 h-4 text-orange-500" /> 100 Projects
            </Link>
            <Link href="/blog" className="hover:text-blue-400 transition-colors">Blog</Link>
            
            {/* Portals Dropdown */}
            <div className="relative group py-2">
              <button className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                Portals ▾
              </button>
              <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
                <Link href="/dashboard" className="block px-3 py-2 text-xs rounded-lg hover:bg-slate-800 text-slate-200">Student Dashboard</Link>
                <Link href="/teachers" className="block px-3 py-2 text-xs rounded-lg hover:bg-slate-800 text-slate-200">Teacher Portal</Link>
                <Link href="/schools" className="block px-3 py-2 text-xs rounded-lg hover:bg-slate-800 text-slate-200">School Portal</Link>
              </div>
            </div>

            <Link href="/admin" className="px-3 py-1.5 rounded-lg bg-slate-800 text-amber-400 hover:bg-amber-500/10 border border-amber-500/30 transition-all text-xs font-semibold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Admin Panel
            </Link>
          </nav>

          {/* Action Icons & User State */}
          <div className="hidden md:flex items-center space-x-4">
            
            <Link href="/wishlist" className="relative p-2 text-slate-300 hover:text-red-400 transition-colors">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative p-2 text-slate-300 hover:text-blue-400 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group py-2">
                <button className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all text-xs text-white">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>{user.name}</span>
                </button>
                <div className="absolute right-0 top-full hidden group-hover:block w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] text-slate-400 border-b border-slate-800 uppercase tracking-wider font-bold">
                    Role: {user.role}
                  </div>
                  <Link href="/dashboard" className="block px-3 py-2 text-xs rounded-lg hover:bg-slate-800 text-slate-200">My Account & Certificates</Link>
                  <button onClick={logout} className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-slate-800 rounded-lg">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center space-x-3">
            <Link href="/cart" className="relative p-2 text-slate-300">
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-300">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link href="/" className="block text-sm font-medium text-slate-200 py-1">Home</Link>
          <Link href="/products" className="block text-sm font-medium text-slate-200 py-1">20 STEM Product Kits</Link>
          <Link href="/tutorials" className="block text-sm font-medium text-red-400 py-1">YouTube Tutorials (@LetsGetEngagedin)</Link>
          <Link href="/courses" className="block text-sm font-medium text-cyan-400 py-1">STEM Online Courses</Link>
          <Link href="/projects" className="block text-sm font-medium text-orange-400 py-1">100 Projects Library</Link>
          <Link href="/blog" className="block text-sm font-medium text-slate-200 py-1">Blog</Link>
          <Link href="/dashboard" className="block text-sm font-medium text-slate-200 py-1">Student Dashboard</Link>
          <Link href="/teachers" className="block text-sm font-medium text-slate-200 py-1">Teacher Portal</Link>
          <Link href="/schools" className="block text-sm font-medium text-slate-200 py-1">School Portal</Link>
          <Link href="/admin" className="block text-sm font-semibold text-amber-400 py-1">Enterprise Admin Panel</Link>
        </div>
      )}
    </header>
  );
};
