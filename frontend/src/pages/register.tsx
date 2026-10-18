import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { paymentsConfigured, safeNext } from '../utils/api';
import { Cpu, Loader2, AlertTriangle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'school'>('student');
  const [institution, setInstitution] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const next = safeNext(router.query.next);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('The two passwords do not match.'); return; }
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) { setError('Password needs at least 8 characters with a letter and a digit.'); return; }
    setBusy(true);
    const res = await registerUser({ name: name.trim(), email: email.trim(), phone: phone.trim(), password, role, institution: institution.trim() || undefined });
    setBusy(false);
    if (res.ok) router.push(next);
    else setError(res.message || 'Registration failed. Please try again.');
  };

  const field = 'w-full rounded-xl px-3 py-2';
  const label = 'block text-slate-500 mb-1 font-semibold';

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-600/30"><Cpu className="w-6 h-6" /></div>
        <h1 className="text-2xl font-bold font-heading">Create your account</h1>
        <p className="text-slate-500 text-xs">An account lets you order kits, track deliveries and keep your course progress.</p>
      </div>

      {!paymentsConfigured && (
        <p className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" /> Account services are not connected yet. Please check back soon or e-mail help.jrlearners@gmail.com.</p>
      )}

      <form onSubmit={handleSubmit} className="p-8 rounded-3xl glass-card space-y-4 text-xs" noValidate={false}>
        <div>
          <label className={label} htmlFor="rg-name">Full name</label>
          <input id="rg-name" className={field} type="text" required minLength={2} maxLength={60} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Learner" />
        </div>
        <div>
          <label className={label} htmlFor="rg-email">E-mail</label>
          <input id="rg-email" className={field} type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@example.com" />
        </div>
        <div>
          <label className={label} htmlFor="rg-phone">Phone</label>
          <input id="rg-phone" className={field} type="tel" required pattern="[0-9+\-\s]{8,16}" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98765 43210" />
        </div>
        <div>
          <label className={label} htmlFor="rg-role">I am a…</label>
          <select id="rg-role" className={field} value={role} onChange={(e) => setRole(e.target.value as 'student' | 'teacher' | 'school')}>
            <option value="student">Student / hobbyist maker</option>
            <option value="teacher">Teacher / educator</option>
            <option value="school">School or institution representative</option>
          </select>
        </div>
        {role !== 'student' && (
          <div>
            <label className={label} htmlFor="rg-inst">School / institution</label>
            <input id="rg-inst" className={field} type="text" maxLength={100} value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Name of your school or college" />
          </div>
        )}
        <div>
          <label className={label} htmlFor="rg-pw">Password</label>
          <input id="rg-pw" className={field} type="password" required minLength={8} maxLength={128} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8+ characters, a letter and a digit" />
        </div>
        <div>
          <label className={label} htmlFor="rg-pw2">Confirm password</label>
          <input id="rg-pw2" className={field} type="password" required minLength={8} maxLength={128} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat the password" />
        </div>

        {error && <p role="alert" className="p-3 rounded-lg bg-red-50 border border-red-300 text-red-500 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> {error}</p>}

        <button type="submit" disabled={busy || !paymentsConfigured} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 font-semibold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2">
          {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</> : 'Create account'}
        </button>
        <p className="text-center text-slate-500">Already registered? <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-blue-500 hover:underline font-semibold">Sign in</Link></p>
      </form>
    </div>
  );
}
