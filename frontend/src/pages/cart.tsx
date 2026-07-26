import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'STEM10') {
      setDiscount(subtotal * 0.1);
      alert("Coupon STEM10 applied: 10% Discount!");
    } else {
      alert("Invalid Coupon Code. Try 'STEM10'");
    }
  };

  const total = Math.max(0, subtotal - discount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="border-b border-slate-800 pb-6">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Shopping Cart</span>
        <h1 className="text-3xl font-heading font-extrabold text-white mt-1">Review Your STEM Order</h1>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <ShoppingCart className="w-16 h-16 text-slate-600 mx-auto" />
          <h2 className="text-xl font-bold text-white">Your Shopping Cart is Empty</h2>
          <p className="text-slate-400 text-xs">Explore our 20 STEM Product Kits and hardware accessories.</p>
          <Link href="/products" className="inline-block px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-semibold">
            Browse STEM Kits
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div key={item.product.id} className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl border border-slate-700" />
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase">{item.product.category}</span>
                    <h3 className="text-sm font-semibold text-white">{item.product.name}</h3>
                    <div className="text-sm font-bold text-white font-heading mt-1">₹{item.product.price}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl p-1">
                    <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="p-1 text-slate-400 hover:text-white">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-white">{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="p-1 text-slate-400 hover:text-white">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button onClick={() => removeFromCart(item.product.id)} className="p-2 text-slate-500 hover:text-red-400">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Side Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white font-heading border-b border-slate-800 pb-3">Order Summary</h3>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon (Try STEM10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase"
                />
                <button type="submit" className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-semibold">
                  Apply
                </button>
              </form>

              <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount (STEM10)</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping (India)</span>
                  <span className="text-emerald-400 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800 font-heading">
                  <span>Total Payable</span>
                  <span className="text-blue-400">₹{total}</span>
                </div>
              </div>

              <Link href="/checkout" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30">
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
