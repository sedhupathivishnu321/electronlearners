import React from 'react';
import Link from 'next/link';
import { Package, Truck, CheckCircle2, Clock, MapPin } from 'lucide-react';

export default function OrderTrackingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="border-b border-slate-800 pb-6 text-center space-y-2">
        <span className="px-3 py-1 rounded-full bg-emerald-600/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          Order Confirmed
        </span>
        <h1 className="text-3xl font-heading font-extrabold text-white">Track STEM Kit Delivery</h1>
        <p className="text-slate-400 text-xs font-mono">Order Tracking ID: EL-2026-9041 • Shiprocket Express</p>
      </div>

      {/* Progress Timeline */}
      <div className="p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
          <div className="text-emerald-400 space-y-2">
            <CheckCircle2 className="w-6 h-6 mx-auto fill-emerald-500/20" />
            <span>Order Placed</span>
          </div>
          <div className="text-emerald-400 space-y-2">
            <Package className="w-6 h-6 mx-auto fill-emerald-500/20" />
            <span>Packed at Warehouse</span>
          </div>
          <div className="text-blue-400 space-y-2">
            <Truck className="w-6 h-6 mx-auto animate-pulse" />
            <span>In Transit</span>
          </div>
          <div className="text-slate-500 space-y-2">
            <MapPin className="w-6 h-6 mx-auto" />
            <span>Out for Delivery</span>
          </div>
        </div>

        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-cyan-500 w-3/4"></div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link href="/dashboard" className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold">
          View in Student Dashboard
        </Link>
      </div>

    </div>
  );
}
