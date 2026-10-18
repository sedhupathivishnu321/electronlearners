import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { paymentsConfigured, safeNext } from '../utils/api';
import { Cpu, Loader2, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, authReady } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const next = safeNext(router.query.next, '');

  // already signed in: go where the visitor was heading
  useEffect(() => {
    if (authReady && user && router.isReady) router.replace(next || (user.role === 'admin' ? '/admin' : '/dashboard'));
  }, [authReady, user, router.isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const res = await login(email.trim(), password);
    setBusy(false);
    if (!res.ok) setError(res.message || 'Sign-in failed. Please try again.');
  };

  const field = 'w-full rounded-xl px-3 py-2';
  const label = 'block text-slate-500 mb-1 font-semibold';

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30"><Cpu className="w-6 h-6" /></div>
        <h1 className="text-2xl font-bold font-heading">Sign in to JR Learners</h1>
        <p className="text-slate-500 text-xs">Order kits, track deliveries and continue your courses.</p>
      </div>

      {!paymentsConfigured && (
        <p className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" /> Account services are not connected yet. Please check back soon or e-mail help.jrlearners@gmail.com.</p>
      )}

      <form onSubmit={handleSubmit} className="p-8 rounded-3xl glass-card space-y-4 text-xs">
        <div>
          <label className={label} htmlFor="lg-email">E-mail</label>
          <input id="lg-email" className={field} type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <label className={label} htmlFor="lg-pw">Password</label>
          <input id="lg-pw" className={field} type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
        </div>

        {error && <p role="alert" className="p-3 rounded-lg bg-red-50 border border-red-300 text-red-500 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> {error}</p>}

        <button type="submit" disabled={busy || !paymentsConfigured} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 font-semibold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2">
          {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : 'Sign in'}
        </button>
        <p className="text-center text-slate-500">New here? <Link href={`/register${next ? `?next=${encodeURIComponent(next)}` : ''}`} className="text-blue-500 hover:underline font-semibold">Create an account</Link></p>
      </form>
    </div>
  );
}
