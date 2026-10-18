import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-5">
      <p className="text-6xl font-heading font-extrabold text-blue-500">404</p>
      <h1 className="text-2xl font-heading font-bold uppercase">Page not found</h1>
      <p className="text-sm text-slate-500">The page you are looking for does not exist or has moved.</p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold">Home</Link>
        <Link href="/products" className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold">The 8 kits</Link>
        <Link href="/projects" className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold">400 projects</Link>
      </div>
    </div>
  );
}
