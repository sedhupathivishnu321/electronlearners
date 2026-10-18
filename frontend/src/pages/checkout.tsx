import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { API_V1, paymentsConfigured } from '../utils/api';
import { ShieldCheck, CreditCard, Truck, Info, Loader2, AlertTriangle } from 'lucide-react';

const FREE_SHIPPING_OVER = 1500;
const SHIPPING_FEE = 50;

type Method = 'payu' | 'cod';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, placeOrder, user, validateCoupon } = useApp();

  const [coupon, setCoupon] = useState('');
  useEffect(() => {
    if (router.isReady) setCoupon(String(router.query.coupon || '').toUpperCase());
  }, [router.isReady, router.query]);

  // Display totals (the server recomputes everything from the catalogue before charging)
  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    let discount = 0;
    if (coupon) {
      const res = validateCoupon(coupon, subtotal);
      if (res.success && res.discountAmount !== undefined) discount = res.discountAmount;
    }
    const shipping = subtotal === 0 || subtotal > FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
    return { subtotal, discount, shipping, total: Math.max(0, subtotal + shipping - discount) };
  }, [cart, coupon, validateCoupon]);

  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [gstin, setGstin] = useState('');
  const [method, setMethod] = useState<Method>(paymentsConfigured ? 'payu' : 'cod');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const customer = { name: fullName.trim(), email: email.trim(), phone: phone.trim(), address: address.trim(), city: city.trim(), state: state.trim(), zip: zip.trim(), gstin: gstin.trim() || undefined };

  const payWithPayU = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`${API_V1}/payments/payu/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart.map((c) => ({ id: c.product.id, quantity: c.quantity })), coupon: coupon || null, customer }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const detail = Array.isArray(data.detail) ? data.detail.map((d: { loc?: string[]; msg: string }) => `${(d.loc || []).slice(-1)[0] ?? ''}: ${d.msg}`).join('; ') : data.detail;
        throw new Error(detail || `Payment could not be started (${res.status})`);
      }
      // PayU's hosted checkout expects a normal form POST from the browser
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.action;
      Object.entries(data.fields as Record<string, string>).forEach(([k, v]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = k;
        input.value = v;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      setError((e as Error).message || 'Could not reach the payment server. Please try again.');
      setBusy(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || busy) return;
    if (method === 'payu') {
      void payWithPayU();
      return;
    }
    const newOrder = placeOrder({ name: customer.name, email: customer.email, phone: customer.phone, address: customer.address, city: customer.city, state: customer.state, zip: customer.zip, gstin: customer.gstin }, 'Cash on Delivery', totals.subtotal, totals.shipping, totals.discount, totals.total);
    if (newOrder) router.push('/dashboard?tab=orders');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-300">
        <p>Your cart is empty. Please add a kit to check out.</p>
        <Link href="/products" className="text-blue-500 hover:underline mt-4 inline-block">Browse the 8 kits</Link>
      </div>
    );
  }

  const field = 'w-full rounded-xl px-3 py-2 text-xs';
  const label = 'block text-[10px] uppercase font-bold text-slate-500 mb-1';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-slate-300 pb-6">
        <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Secure Checkout</span>
        <h1 className="text-3xl font-heading font-extrabold mt-1 uppercase">Shipping & Payment</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl glass-card space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-500" /> Shipping Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={label} htmlFor="co-name">Full Name *</label>
                <input id="co-name" className={field} type="text" required minLength={2} maxLength={60} autoComplete="name" placeholder="e.g. Priyan S." value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div>
                <label className={label} htmlFor="co-email">Email *</label>
                <input id="co-email" className={field} type="email" required autoComplete="email" placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className={label} htmlFor="co-phone">Phone *</label>
                <input id="co-phone" className={field} type="tel" required pattern="[0-9+\-\s]{8,16}" autoComplete="tel" placeholder="e.g. 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className={label} htmlFor="co-gst">GSTIN (optional)</label>
                <input id="co-gst" className={field} type="text" maxLength={15} placeholder="e.g. 29ABCDE1234F1Z5" value={gstin} onChange={(e) => setGstin(e.target.value.toUpperCase())} />
              </div>
            </div>
            <div>
              <label className={label} htmlFor="co-address">Street Address *</label>
              <input id="co-address" className={field} type="text" required minLength={5} maxLength={200} autoComplete="street-address" placeholder="Flat / House No., Building, Street" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={label} htmlFor="co-city">City *</label>
                <input id="co-city" className={field} type="text" required autoComplete="address-level2" placeholder="e.g. Chennai" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div>
                <label className={label} htmlFor="co-state">State *</label>
                <input id="co-state" className={field} type="text" required autoComplete="address-level1" placeholder="e.g. Tamil Nadu" value={state} onChange={(e) => setState(e.target.value)} />
              </div>
              <div>
                <label className={label} htmlFor="co-zip">Pincode *</label>
                <input id="co-zip" className={field} type="text" required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="postal-code" placeholder="600001" value={zip} onChange={(e) => setZip(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-500" /> Payment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {([
                { id: 'payu', label: 'Pay online with PayU', note: 'UPI, cards, netbanking, wallets, EMI', disabled: !paymentsConfigured },
                { id: 'cod', label: 'Cash on Delivery', note: 'Pay when the kit arrives', disabled: false },
              ] as { id: Method; label: string; note: string; disabled: boolean }[]).map((m) => (
                <label
                  key={m.id}
                  className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${m.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${
                    method === m.id ? 'border-blue-600 bg-blue-50' : 'border-slate-300 bg-white'
                  }`}
                >
                  <input type="radio" name="method" disabled={m.disabled} checked={method === m.id} onChange={() => setMethod(m.id)} className="mt-0.5 accent-blue-600" />
                  <span>
                    <span className="block font-semibold">{m.label}</span>
                    <span className="block text-[11px] text-slate-500">{m.disabled ? 'Not available yet' : m.note}</span>
                  </span>
                </label>
              ))}
            </div>
            {!paymentsConfigured && (
              <p className="text-[11px] text-amber-500 flex items-start gap-2"><AlertTriangle className="w-4 h-4 shrink-0" /> Online payment is switched off until the payment server address is configured. Cash on Delivery works now.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl glass-card space-y-5 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-3">Order Summary</h3>
            <ul className="space-y-2 text-xs">
              {cart.map((item) => (
                <li key={item.product.id} className="flex justify-between gap-3">
                  <span>{item.product.name} <span className="text-slate-500">× {item.quantity}</span></span>
                  <span className="font-semibold shrink-0">₹{item.product.price * item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-2.5 text-xs border-t border-slate-300 pt-3">
              <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">₹{totals.subtotal}</span></div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-500"><span>Discount ({coupon})</span><span>-₹{totals.discount}</span></div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                {totals.shipping === 0 ? <span className="text-emerald-500 font-bold uppercase text-[10px]">Free</span> : <span>₹{totals.shipping}</span>}
              </div>
              <div className="flex justify-between text-sm font-bold pt-3 border-t border-slate-300 font-heading">
                <span>Total Payable</span>
                <span className="text-blue-500">₹{totals.total}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-100 border border-slate-300 text-[11px] flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>You are redirected to PayU's secure page to pay; card and UPI details never touch this website. Prices are verified on the server before you are charged.</span>
            </div>

            {error && (
              <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-300 text-xs text-red-500 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 font-bold text-xs shadow-lg shadow-blue-600/20 transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Connecting to PayU…</> : <><ShieldCheck className="w-4 h-4" /> {method === 'payu' ? `Pay ₹${totals.total} securely` : 'Place order (Cash on Delivery)'}</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
