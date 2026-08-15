import React from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="border-b border-slate-800 pb-6">
        <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Saved Items</span>
        <h1 className="text-3xl font-heading font-extrabold text-white mt-1">My Saved STEM Kits</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <Heart className="w-16 h-16 text-slate-600 mx-auto" />
          <h2 className="text-xl font-bold text-white">Your Wishlist is Empty</h2>
          <p className="text-slate-400 text-xs">Save your favorite hardware kits for later.</p>
          <Link href="/products" className="inline-block px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-semibold">
            Explore 20 STEM Kits
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between">
              <div>
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                <div className="p-5 space-y-2">
                  <span className="text-cyan-400 text-[10px] font-bold uppercase">{product.category}</span>
                  <h3 className="text-sm font-semibold text-white line-clamp-1">{product.name}</h3>
                  <div className="text-sm font-bold text-white font-heading">₹{product.price}</div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-4">
                <button onClick={() => toggleWishlist(product)} className="text-slate-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => addToCart(product)} className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1">
                  <ShoppingCart className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
