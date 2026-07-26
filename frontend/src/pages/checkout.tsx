import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../context/AppContext';
import { ShieldCheck, CreditCard, CheckCircle, ArrowRight, Truck } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'stripe' | 'upi' | 'cod'>('razorpay');

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    alert("Payment Successful! Order EL-2026-9041 has been placed.");
    router.push('/order-tracking');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="border-b border-slate-800 pb-6">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Secure Payment</span>
        <h1 className="text-3xl font-heading font-extrabold text-white mt-1">Shipping & Checkout</h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Shipping Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" /> Shipping Address (India)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Full Name</label>
                <input type="text" required defaultValue="Alex Learner" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Mobile Number</label>
                <input type="tel" required defaultValue="+91 9876543210" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Street Address</label>
              <input type="text" required defaultValue="Plot 42, STEM Innovation Road" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">City</label>
                <input type="text" required defaultValue="New Delhi" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">State</label>
                <input type="text" required defaultValue="Delhi" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">PIN Code</label>
                <input type="text" required defaultValue="110001" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>
            </div>
          </div>

          {/* Payment Gateways */}
          <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-400" /> Payment Gateway Selection
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { id: 'razorpay', label: 'Razorpay (UPI, GPay, Cards)' },
                { id: 'stripe', label: 'Stripe (Credit / Debit Card)' },
                { id: 'upi', label: 'Direct PhonePe / BHIM UPI' },
                { id: 'cod', label: 'Cash on Delivery (COD)' }
              ].map((method) => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2 transition-all ${
                    paymentMethod === method.id
                      ? 'bg-blue-600/20 border-blue-500 text-white font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <input type="radio" checked={paymentMethod === method.id} onChange={() => {}} className="accent-blue-500" />
                  <span>{method.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white font-heading border-b border-slate-800 pb-3">Payable Total</h3>
            <div className="text-3xl font-extrabold text-blue-400 font-heading">₹{subtotal}</div>
            <p className="text-slate-400 text-xs">Includes GST invoice & free insured express shipping.</p>

            <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Complete Payment & Place Order</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}
