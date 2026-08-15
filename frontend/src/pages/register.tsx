import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { Cpu, Mail, Lock, User } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'school'>('student');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = registerUser(name, email, password, role);
    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-cyan-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-cyan-600/30">
          <Cpu className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white font-heading">Create STEM Account</h1>
        <p className="text-slate-400 text-xs">Join 50,000+ makers learning electronics & robotics.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 rounded-3xl glass-card border border-slate-800 space-y-4 text-xs">
        <div>
          <label className="block text-slate-400 mb-1">Full Name</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Learner" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" />
        </div>

        <div>
          <label className="block text-slate-400 mb-1">Email Address</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" />
        </div>

        <div>
          <label className="block text-slate-400 mb-1">I am a...</label>
          <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300">
            <option value="student">Student / Hobbyist Maker</option>
            <option value="teacher">Teacher / School Educator</option>
            <option value="school">School Representative</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 mb-1">Create Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" />
        </div>

        <button type="submit" className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-lg shadow-cyan-600/30">
          Create Account
        </button>

        <div className="text-center pt-2">
          <span className="text-slate-400">Already registered? </span>
          <Link href="/login" className="text-cyan-400 font-semibold hover:underline">Sign In</Link>
        </div>
      </form>

    </div>
  );
}
