import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { ShieldCheck, CreditCard, ArrowRight, Truck, Info } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, placeOrder, user } = useApp();

  // Retrieve checkout values from URL query params
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  useEffect(() => {
    if (!router.isReady) return;
    setSubtotal(Number(router.query.subtotal || 0));
    setShipping(Number(router.query.shipping || 0));
    setDiscount(Number(router.query.discount || 0));
    setTotal(Number(router.query.total || 0));
    setAppliedCoupon(String(router.query.coupon || ''));
  }, [router.isReady, router.query]);

  // Form Fields
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [gstin, setGstin] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Razorpay (UPI/Cards)');

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const shippingAddress = {
      name: fullName,
      email,
      phone,
      address,
      city,
      zip,
      gstin: gstin || undefined
    };

    const newOrder = placeOrder(
      shippingAddress,
      paymentMethod,
      subtotal,
      shipping,
      discount,
      total
    );

    if (newOrder) {
      router.push('/dashboard?tab=orders');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-350">
        <p>Your cart is empty. Please add items to checkout.</p>
        <Link href="/products" className="text-blue-500 hover:underline mt-4 inline-block">Go to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-transparent text-slate-100">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <span className="text-xs font-bold text-emerald-450 uppercase tracking-widest">Secure Checkout</span>
        <h1 className="text-3xl font-heading font-extrabold text-white mt-1 uppercase">Shipping & Checkout</h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Shipping & Billing Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" /> Shipping Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyan S."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Official Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">GSTIN Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 29ABCDE1234F1Z5"
                  value={gstin}
                  onChange={(e) => setGstDetails(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Detailed Street Address *</label>
              <input
                type="text"
                required
                placeholder="Flat / House No., Building Name, Street / Sector"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bangalore"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">State *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Karnataka"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Pincode *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 560001"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Gateways Selection */}
          <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-400" /> Secure Payment Gateways
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { id: 'Razorpay (UPI/Cards)', label: 'Razorpay (UPI, GPay, Debit Cards)' },
                { id: 'Stripe (Cards)', label: 'Stripe Gateway (International Cards)' },
                { id: 'Direct Bank Wire', label: 'NEFT / RTGS Bank Transfer' },
                { id: 'Cash on Delivery', label: 'Cash on Delivery (COD)' }
              ].map((method) => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 rounded-xl border cursor-pointer flex items-center gap-2 transition-all ${
                    paymentMethod === method.id
                      ? 'bg-blue-600/10 border-blue-500 text-white font-semibold'
                      : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'
                  }`}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === method.id}
                    onChange={() => {}}
                    className="accent-blue-500 pointer-events-none"
                  />
                  <span>{method.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-5 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">Payable Breakdown</h3>
            
            <div className="space-y-2.5 text-xs text-slate-350">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-white">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-450">
                  <span>Discount Applied ({appliedCoupon})</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Express Shipping</span>
                {shipping === 0 ? (
                  <span className="text-emerald-450 font-bold uppercase text-[10px]">FREE</span>
                ) : (
                  <span>₹{shipping}</span>
                )}
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-3 border-t border-slate-850 font-heading">
                <span>Total Payable</span>
                <span className="text-blue-400">₹{total}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-900 text-[10px] text-slate-450 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>Payments are encrypted using bank-grade security. A GST invoice will be sent to your email after checkout.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-450" /> Complete Secure Checkout
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}

