import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, Heart, User, Search, Youtube, Shield, Cpu, Menu, X, BookOpen, Layers, Award } from 'lucide-react';
import { Logo } from '../ui/Logo';

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
            <div className="group-hover:scale-105 transition-transform">
              <Logo size="sm" />
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
            <Link href="/products" className="hover:text-blue-400 transition-colors">Shop</Link>
            <Link href="/products?type=kits" className="hover:text-blue-400 transition-colors">Project Kits</Link>
            <Link href="/courses" className="hover:text-blue-400 transition-colors">Courses</Link>
            <Link href="/projects" className="hover:text-blue-400 transition-colors">Projects</Link>
            <Link href="/resources" className="hover:text-blue-400 transition-colors">Resources</Link>
            <Link href="/schools" className="hover:text-blue-400 transition-colors">For Schools</Link>
            
            {user && (user.role === 'admin' || user.role === 'store_manager' || user.role === 'support_agent' || user.role === 'content_manager') && (
              <Link href="/admin" className="px-3 py-1 rounded-lg bg-slate-800 text-amber-400 hover:bg-amber-500/10 border border-amber-500/30 transition-all text-xs font-semibold flex items-center gap-1">
                <Shield className="w-3 h-3" /> Admin
              </Link>
            )}
          </nav>

          {/* Search bar, Action Icons & User State */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Embedded Search */}
            <div className="relative w-48 lg:w-56">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            
            <Link href="/wishlist" className="relative p-2 text-slate-300 hover:text-red-400 transition-colors" title="Wishlist">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative p-2 text-slate-300 hover:text-blue-400 transition-colors" title="Cart">
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
                  <span>{user.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 top-full hidden group-hover:block w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] text-slate-400 border-b border-slate-800 uppercase tracking-wider font-bold">
                    Role: {user.role.replace('_', ' ')}
                  </div>
                  <Link href="/dashboard" className="block px-3 py-2 text-xs rounded-lg hover:bg-slate-800 text-slate-200">My Account</Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="block px-3 py-2 text-xs rounded-lg hover:bg-slate-800 text-slate-200">Admin Control</Link>
                  )}
                  <button onClick={logout} className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-slate-800 rounded-lg">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="p-2 text-slate-300 hover:text-white transition-colors" title="Account">
                <User className="w-5 h-5" />
              </Link>
            )}

            <Link href="/products" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all">
              Shop Now
            </Link>
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
          <div className="relative my-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search store..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  setIsMobileMenuOpen(false);
                  window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                }
              }}
              className="w-full bg-slate-850 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white"
            />
          </div>
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-slate-200 py-1">Home</Link>
          <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-slate-200 py-1">Shop</Link>
          <Link href="/products?type=kits" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-slate-200 py-1">Project Kits</Link>
          <Link href="/courses" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-slate-200 py-1">Courses</Link>
          <Link href="/projects" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-slate-200 py-1">Projects</Link>
          <Link href="/resources" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-slate-200 py-1">Resources</Link>
          <Link href="/schools" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-slate-200 py-1">For Schools</Link>
          <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium text-slate-200 py-1">My Account</Link>
          {user && (user.role === 'admin' || user.role === 'store_manager' || user.role === 'support_agent' || user.role === 'content_manager') && (
            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-semibold text-amber-400 py-1">Admin Panel</Link>
          )}
        </div>
      )}
    </header>
  );
};
