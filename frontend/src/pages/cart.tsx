import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag, Gift, Award } from 'lucide-react';

export default function CartPage() {
  const { cart, products, removeFromCart, updateCartQuantity, validateCoupon } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const res = validateCoupon(couponCode, subtotal);
    if (res.success && res.discountAmount !== undefined) {
      setAppliedCoupon(couponCode.toUpperCase());
      setDiscountAmount(res.discountAmount);
      setCouponMessage(res.message);
    } else {
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setCouponMessage(res.message);
    }
  };

  const shipping = subtotal > 0 ? 50 : 0;
  // Free shipping over ₹1500
  const finalShipping = subtotal > 1500 ? 0 : shipping;
  const total = Math.max(0, subtotal + finalShipping - discountAmount);

  // Recommendations: frequently bought together
  const cartProductIds = cart.map(item => item.product.id);
  const recommendations = products
    .filter(p => !cartProductIds.includes(p.id))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-transparent text-slate-100">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <span className="text-xs font-bold text-blue-450 uppercase tracking-widest">Shopping Cart</span>
        <h1 className="text-3xl font-heading font-extrabold text-white mt-1 uppercase">Your Cart Items</h1>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 space-y-4 glass-card border border-slate-800 rounded-3xl">
          <ShoppingCart className="w-16 h-16 text-slate-650 mx-auto" />
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">Your Cart is Empty</h2>
          <p className="text-slate-400 text-xs max-w-sm mx-auto">Build the future! Explore our 20 hardware kits and complete projects tutorials.</p>
          <Link href="/products" className="inline-block px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow shadow-blue-600/10">
            Browse STEM Kits
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                  <div className="flex items-center space-x-4">
                    <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl border border-slate-800" />
                    <div>
                      <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">{item.product.category}</span>
                      <h3 className="text-xs font-bold text-white line-clamp-1">{item.product.name}</h3>
                      <div className="text-xs font-bold text-slate-400 mt-1">₹{item.product.price} each</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-2 bg-slate-950 border border-slate-850 rounded-xl p-1">
                      <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="p-1.5 text-slate-400 hover:text-white transition-colors">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-white">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="p-1.5 text-slate-400 hover:text-white transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <div className="text-sm font-bold text-white">₹{item.product.price * item.quantity}</div>
                    </div>

                    <button onClick={() => removeFromCart(item.product.id)} className="p-2 text-slate-550 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommends Block: Frequently Bought Together */}
            {recommendations.length > 0 && (
              <div className="p-6 rounded-2xl glass-card border border-slate-850 space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Frequently Bought Together</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {recommendations.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl bg-slate-950/40 border border-slate-850 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="text-[9px] text-cyan-400 font-bold uppercase">{p.category}</div>
                        <div className="text-xs font-bold text-white truncate">{p.name}</div>
                        <div className="text-xs font-extrabold text-slate-400 mt-1">₹{p.price}</div>
                      </div>
                      <button
                        onClick={() => addToCart(p, 1)}
                        className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white text-[10px] font-bold border border-slate-700 transition-all flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Part
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Checkout Summary Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-5 shadow-xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">Checkout Summary</h3>

              {/* Coupon Form */}
              <div className="space-y-2">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                  <button type="submit" className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-750 text-xs text-white font-semibold transition-all">
                    Apply
                  </button>
                </form>
                {couponMessage && (
                  <div className={`text-[10px] font-bold ${appliedCoupon ? 'text-emerald-450' : 'text-red-400'}`}>
                    {couponMessage}
                  </div>
                )}
                {/* Coupon Tip Box */}
                {!appliedCoupon && (
                  <div className="p-2.5 rounded-lg bg-slate-950 text-[10px] text-slate-500 leading-relaxed border border-slate-900">
                    💡 Try <strong className="text-slate-400">WELCOME10</strong> (10% off, min spend ₹500) or <strong className="text-slate-400">STUDENT20</strong> (20% off, min spend ₹800) for discounts!
                  </div>
                )}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2.5 text-xs text-slate-350 border-t border-slate-850 pt-4">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-white">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-405">
                    <span>Discount ({appliedCoupon})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Cost</span>
                  {finalShipping === 0 ? (
                    <span className="text-emerald-450 font-bold uppercase text-[10px]">FREE</span>
                  ) : (
                    <span>₹{finalShipping}</span>
                  )}
                </div>
                {subtotal <= 1500 && (
                  <div className="text-[10px] text-slate-500 italic text-right">
                    Add ₹{1501 - subtotal} more to get FREE shipping!
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-white pt-3 border-t border-slate-850 font-heading">
                  <span>Total Payable</span>
                  <span className="text-blue-400">₹{total}</span>
                </div>
              </div>

              {/* Action */}
              <Link
                href={`/checkout?subtotal=${subtotal}&shipping=${finalShipping}&discount=${discountAmount}&total=${total}&coupon=${appliedCoupon || ''}`}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/20 transition-all uppercase tracking-wider"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

