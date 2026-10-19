import React, { useState } from 'react';
import { Mail, MapPin, Clock, Phone, LifeBuoy, MessageCircle, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { COMPANY, CONTACT_EMAIL, PHONE_URL, SUPPORT_EMAIL, WHATSAPP_NUMBER_DISPLAY, WHATSAPP_URL } from '../data/siteConfig';
import { SocialButtons } from '../components/ui/SocialButtons';
import { api, paymentsConfigured } from '../utils/api';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [trap, setTrap] = useState('');                       // honeypot field, hidden from people
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    setError('');
    try {
      await api('/inquiries', { body: { kind: 'contact', name: name.trim(), email: email.trim(), subject: subject.trim() || null, message: message.trim(), website: trap }, auth: false });
      setState('sent');
      setName(''); setEmail(''); setSubject(''); setMessage('');
    } catch (err) {
      setError((err as Error).message);
      setState('error');
    }
  };

  const field = 'w-full rounded-xl px-3 py-2';
  const label = 'block text-slate-500 mb-1 font-semibold';
  const link = 'text-blue-500 hover:underline font-semibold';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-slate-300 pb-6">
        <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Get in touch</span>
        <h1 className="text-3xl font-heading font-extrabold mt-1">Contact JR Learners</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl glass-card space-y-5">
          <h2 className="text-xl font-bold font-heading">Contact &amp; support</h2>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3"><Mail className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /><span><span className="block text-[10px] uppercase font-bold text-slate-500">General enquiries</span><a href={`mailto:${CONTACT_EMAIL}`} className={link}>{CONTACT_EMAIL}</a></span></li>
            <li className="flex items-start gap-3"><LifeBuoy className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /><span><span className="block text-[10px] uppercase font-bold text-slate-500">Help, orders &amp; support</span><a href={`mailto:${SUPPORT_EMAIL}`} className={link}>{SUPPORT_EMAIL}</a></span></li>
            <li className="flex items-start gap-3"><MessageCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /><span><span className="block text-[10px] uppercase font-bold text-slate-500">WhatsApp</span><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={link}>{WHATSAPP_NUMBER_DISPLAY}</a></span></li>
            <li className="flex items-start gap-3"><Phone className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" /><span><span className="block text-[10px] uppercase font-bold text-slate-500">Call</span><a href={PHONE_URL} className={link}>{WHATSAPP_NUMBER_DISPLAY}</a></span></li>
            <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" /><span><span className="block text-[10px] uppercase font-bold text-slate-500">Address</span>{COMPANY.address}</span></li>
            <li className="flex items-start gap-3"><Clock className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" /><span><span className="block text-[10px] uppercase font-bold text-slate-500">Support hours</span>{COMPANY.hours}</span></li>
          </ul>
          <div className="pt-2 space-y-2 border-t border-slate-300">
            <p className="text-[10px] uppercase font-bold text-slate-500">Follow us</p>
            <SocialButtons />
          </div>
        </div>

        <div className="p-8 rounded-3xl glass-card space-y-4">
          <h2 className="text-base font-bold">Send us a message</h2>
          {state === 'sent' ? (
            <p role="status" className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-sm flex gap-2"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /> Thank you! Your message has been sent to our team. We will reply by e-mail.</p>
          ) : (
            <form onSubmit={submit} className="space-y-3 text-xs">
              <div><label className={label} htmlFor="ct-name">Your name</label><input id="ct-name" className={field} type="text" required minLength={2} maxLength={80} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></div>
              <div><label className={label} htmlFor="ct-email">E-mail</label><input id="ct-email" className={field} type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
              <div><label className={label} htmlFor="ct-subject">Subject (optional)</label><input id="ct-subject" className={field} type="text" maxLength={150} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Which kit should I start with?" /></div>
              <div><label className={label} htmlFor="ct-msg">Message</label><textarea id="ct-msg" className={field} rows={4} required minLength={3} maxLength={4000} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help you?" /></div>
              <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px' }}><label>Website<input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} /></label></div>
              {state === 'error' && <p role="alert" className="p-3 rounded-lg bg-red-50 border border-red-300 text-red-500 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> {error}</p>}
              {!paymentsConfigured && <p className="text-[11px] text-slate-500">The message form is not connected yet: please e-mail <a className="text-blue-500 underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>}
              <button type="submit" disabled={state === 'sending' || !paymentsConfigured} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 font-semibold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2">
                {state === 'sending' ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
