import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { API_V1 } from '../../utils/api';
import { CheckCircle, XCircle, Clock, ShieldAlert, Loader2 } from 'lucide-react';

interface ServerOrder {
  txnid: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  amount: number;
  subtotal: number;
  shipping: number;
  discount: number;
  coupon: string;
  payment_mode: string;
  customer: { name: string; email: string; phone: string; address: string; city: string; state: string; zip: string; gstin?: string };
}

// PayU sends the customer back here (via the backend, which has already verified PayU's signature).
export default function CheckoutResult() {
  const router = useRouter();
  const { cart, placeOrder } = useApp();
  const [order, setOrder] = useState<ServerOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const recorded = useRef(false);

  const txnid = String(router.query.txnid || '');
  const hint = String(router.query.status || '');

  const load = useCallback(async () => {
    if (!txnid) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_V1}/orders/${encodeURIComponent(txnid)}`);
      if (!res.ok) throw new Error('not found');
      setOrder(await res.json());
    } catch {
      setNote('We could not load this order from the payment server.');
    }
    setLoading(false);
  }, [txnid]);

  useEffect(() => {
    if (router.isReady) void load();
  }, [router.isReady, load]);

  // Record a paid order once in "My orders" and empty the cart
  useEffect(() => {
    if (!order || order.status !== 'paid' || recorded.current) return;
    const key = `el_paid_${order.txnid}`;
    if (localStorage.getItem(key)) return;
    recorded.current = true;
    const saved = placeOrder(order.customer, `PayU (${order.payment_mode || 'online'})`, order.subtotal, order.shipping, order.discount, order.amount, order.txnid);
    if (saved) localStorage.setItem(key, '1');
  }, [order, placeOrder]);

  const recheck = async () => {
    setNote('Asking PayU for the latest status…');
    try {
      const res = await fetch(`${API_V1}/payments/payu/verify/${encodeURIComponent(txnid)}`, { method: 'POST' });
      if (!res.ok) throw new Error();
      await load();
      setNote('');
    } catch {
      setNote('PayU did not answer yet. Please try again in a minute.');
    }
  };

  let view: { icon: React.ReactNode; title: string; text: string };
  if (hint === 'invalid') {
    view = { icon: <ShieldAlert className="w-12 h-12 text-red-500" />, title: 'Payment could not be verified', text: 'The response did not pass our security check, so no order was confirmed. If money left your account it is returned automatically; contact support with your transaction id.' };
  } else if (order?.status === 'paid') {
    view = { icon: <CheckCircle className="w-12 h-12 text-emerald-500" />, title: 'Payment successful', text: 'Thank you! Your kit order is confirmed. A confirmation will be sent to your email, and the order appears under My Orders.' };
  } else if (order?.status === 'failed' || hint === 'failed') {
    view = { icon: <XCircle className="w-12 h-12 text-red-500" />, title: 'Payment failed', text: 'Your payment was not completed and you have not been charged. Your cart is unchanged, so you can try again.' };
  } else if (order?.status === 'refunded') {
    view = { icon: <CheckCircle className="w-12 h-12 text-blue-500" />, title: 'Payment refunded', text: 'This payment has been refunded to your original payment method.' };
  } else {
    view = { icon: <Clock className="w-12 h-12 text-amber-500" />, title: 'Payment pending', text: 'We are waiting for the bank to confirm. This usually takes a few minutes.' };
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="p-8 rounded-2xl glass-card text-center space-y-5">
        {loading ? <Loader2 className="w-10 h-10 mx-auto animate-spin text-blue-500" /> : <div className="flex justify-center">{view.icon}</div>}
        <h1 className="text-2xl font-heading font-extrabold uppercase">{loading ? 'Checking payment…' : view.title}</h1>
        {!loading && <p className="text-sm text-slate-500">{view.text}</p>}
        {order && (
          <dl className="text-xs text-left grid grid-cols-2 gap-y-2 p-4 rounded-xl bg-slate-100 border border-slate-300">
            <dt className="text-slate-500">Order reference</dt><dd className="font-mono font-semibold break-all">{order.txnid}</dd>
            <dt className="text-slate-500">Amount</dt><dd className="font-semibold">₹{order.amount}</dd>
            {order.payment_mode && <><dt className="text-slate-500">Paid with</dt><dd>{order.payment_mode}</dd></>}
            <dt className="text-slate-500">Status</dt><dd className="font-semibold uppercase">{order.status}</dd>
          </dl>
        )}
        {note && <p className="text-xs text-amber-500">{note}</p>}
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          {order?.status === 'pending' && (
            <button onClick={recheck} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold">Check payment status</button>
          )}
          {order?.status === 'paid' ? (
            <Link href="/dashboard?tab=orders" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold">View my orders</Link>
          ) : (
            <Link href={cart.length ? '/cart' : '/products'} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold">{cart.length ? 'Back to cart' : 'Browse kits'}</Link>
          )}
          <Link href="/support" className="px-5 py-2.5 rounded-xl bg-slate-200 text-xs font-bold">Contact support</Link>
        </div>
      </div>
    </div>
  );
}
