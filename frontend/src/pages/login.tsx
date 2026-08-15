import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { Lock, Mail, Cpu, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'school' | 'admin'>('student');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password, role);
    if (success) {
      if (role === 'admin') router.push('/admin');
      else if (role === 'teacher') router.push('/teachers');
      else if (role === 'school') router.push('/schools');
      else router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-600/30">
          <Cpu className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white font-heading">Sign In to JR Learners</h1>
        <p className="text-slate-400 text-xs">Access your courses, kit orders, and STEM certificates.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 rounded-3xl glass-card border border-slate-800 space-y-4 text-xs">
        <div>
          <label className="block text-slate-400 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white" />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 mb-1">Account Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300">
            <option value="student">Student / Maker</option>
            <option value="teacher">Teacher / Educator</option>
            <option value="school">School / Institution</option>
            <option value="admin">Enterprise Administrator</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white" />
          </div>
        </div>

        <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30">
          Sign In
        </button>

        <div className="text-center pt-2">
          <span className="text-slate-400">Don't have an account? </span>
          <Link href="/register" className="text-blue-400 font-semibold hover:underline">Register Now</Link>
        </div>
      </form>

    </div>
  );
}
