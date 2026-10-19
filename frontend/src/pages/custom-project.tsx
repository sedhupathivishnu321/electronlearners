import React, { useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Wrench, Loader2, CheckCircle, AlertTriangle, Paperclip, X } from 'lucide-react';
import { api, paymentsConfigured } from '../utils/api';
import { CONTACT_EMAIL, SUPPORT_EMAIL, WHATSAPP_NUMBER_DISPLAY, WHATSAPP_URL } from '../data/siteConfig';

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = ['pdf', 'txt', 'doc', 'docx', 'ppt', 'pptx'];
const TYPES = ['Student / final-year project', 'School or college lab setup', 'Prototype for a product or startup', 'Teaching kit or workshop', 'Home or hobby project', 'Other'];
const PLATFORMS = ['Not sure yet', 'Arduino', 'ESP32 / ESP8266', 'Raspberry Pi', 'STM32', 'Other'];
const BUDGETS = ['Not decided', 'Under Rs 2,000', 'Rs 2,000 - 5,000', 'Rs 5,000 - 15,000', 'Rs 15,000 - 50,000', 'Above Rs 50,000'];

const readBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const fr = new FileReader();
  fr.onload = () => resolve(String(fr.result).split(',')[1] || '');
  fr.onerror = () => reject(new Error('Could not read the file'));
  fr.readAsDataURL(file);
});

export default function CustomProjectPage() {
  const [f, setF] = useState({ name: '', email: '', phone: '', organisation: '', projectType: TYPES[0], title: '', description: '', platform: PLATFORMS[0], budget: BUDGETS[0], deadline: '', link: '' });
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF((v) => ({ ...v, [k]: e.target.value }));

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0] || null;
    setError('');
    if (!chosen) { setFile(null); return; }
    const ext = chosen.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED.includes(ext)) { setError('Only PDF, TXT, DOC, DOCX, PPT or PPTX files can be attached.'); e.target.value = ''; setFile(null); return; }
    if (chosen.size > MAX_BYTES) { setError('That file is larger than 2 MB. Please attach a smaller file or paste a link to it below.'); e.target.value = ''; setFile(null); return; }
    setFile(chosen);
  };
  const clearFile = () => { setFile(null); if (fileInput.current) fileInput.current.value = ''; };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    setError('');
    try {
      const payload: Record<string, unknown> = { ...f, consent, website: trap };
      if (file) payload.file = { name: file.name, data: await readBase64(file) };
      const res = await api<{ reference: string }>('/custom-requests', { body: payload, auth: false });
      setReference(res.reference);
      setState('sent');
    } catch (err) {
      setError((err as Error).message);
      setState('error');
    }
  };

  const field = 'w-full rounded-xl px-3 py-2';
  const label = 'block text-slate-500 mb-1 font-semibold';

  if (state === 'sent') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <Head><title>Request sent | JR Learners</title></Head>
        <div className="p-8 rounded-2xl glass-card text-center space-y-4">
          <CheckCircle className="w-12 h-12 mx-auto text-emerald-500" />
          <h1 className="text-2xl font-heading font-extrabold uppercase">Request sent</h1>
          <p className="text-sm text-slate-500">Thank you! Your project details{file ? ' and file' : ''} are with our team. We will reply by e-mail or phone soon.</p>
          <p className="text-sm">Your reference: <span className="font-mono font-bold">{reference}</span></p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Link href="/" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold">Back to home</Link>
            <Link href="/products" className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold">See the kits</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Head><title>Customised projects | JR Learners</title></Head>
      <div className="border-b border-slate-300 pb-6">
        <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5"><Wrench className="w-4 h-4" /> Customised projects</span>
        <h1 className="text-3xl font-heading font-extrabold mt-1">Tell us what you want built</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">Need something beyond our 400 ready-made projects? Describe your idea, add a document if you have one, and our team will come back with a plan and a quote. Prefer to talk? Message us on <a className="text-blue-500 underline" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp {WHATSAPP_NUMBER_DISPLAY}</a> or write to <a className="text-blue-500 underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
      </div>

      {!paymentsConfigured && (
        <p className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" /> The request form is not connected yet. Please e-mail your details to <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
      )}

      <form onSubmit={submit} className="space-y-6 text-xs">
        <section className="p-6 rounded-2xl glass-card space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider">1. About you</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={label} htmlFor="cp-name">Full name *</label><input id="cp-name" className={field} type="text" required minLength={2} maxLength={80} autoComplete="name" value={f.name} onChange={set('name')} placeholder="Your name" /></div>
            <div><label className={label} htmlFor="cp-email">E-mail *</label><input id="cp-email" className={field} type="email" required autoComplete="email" value={f.email} onChange={set('email')} placeholder="you@example.com" /></div>
            <div><label className={label} htmlFor="cp-phone">Phone / WhatsApp *</label><input id="cp-phone" className={field} type="tel" required pattern="[0-9+\-\s]{8,16}" autoComplete="tel" value={f.phone} onChange={set('phone')} placeholder="98765 43210" /></div>
            <div><label className={label} htmlFor="cp-org">School, college or company (optional)</label><input id="cp-org" className={field} type="text" maxLength={120} autoComplete="organization" value={f.organisation} onChange={set('organisation')} placeholder="Where are you from?" /></div>
          </div>
        </section>

        <section className="p-6 rounded-2xl glass-card space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider">2. Your project</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><label className={label} htmlFor="cp-title">Project title *</label><input id="cp-title" className={field} type="text" required minLength={3} maxLength={150} value={f.title} onChange={set('title')} placeholder="e.g. Smart plant watering box" /></div>
            <div><label className={label} htmlFor="cp-type">What is it for?</label><select id="cp-type" className={field} value={f.projectType} onChange={set('projectType')}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
            <div><label className={label} htmlFor="cp-platform">Preferred platform</label><select id="cp-platform" className={field} value={f.platform} onChange={set('platform')}>{PLATFORMS.map((t) => <option key={t}>{t}</option>)}</select></div>
            <div><label className={label} htmlFor="cp-budget">Budget</label><select id="cp-budget" className={field} value={f.budget} onChange={set('budget')}>{BUDGETS.map((t) => <option key={t}>{t}</option>)}</select></div>
            <div><label className={label} htmlFor="cp-deadline">Needed by (optional)</label><input id="cp-deadline" className={field} type="date" value={f.deadline} onChange={set('deadline')} /></div>
            <div className="sm:col-span-2"><label className={label} htmlFor="cp-desc">Describe what you want it to do *</label><textarea id="cp-desc" className={field} rows={6} required minLength={10} maxLength={5000} value={f.description} onChange={set('description')} placeholder="What should it do? Which sensors, displays or motors? Any size, power or budget limits? Where will it be used?" /></div>
          </div>
        </section>

        <section className="p-6 rounded-2xl glass-card space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider">3. Files and links (optional)</h2>
          <div>
            <label className={label} htmlFor="cp-file">Attach a document (PDF, TXT, DOC, DOCX, PPT or PPTX, up to 2 MB)</label>
            <input ref={fileInput} id="cp-file" className={field} type="file" accept=".pdf,.txt,.doc,.docx,.ppt,.pptx" onChange={pick} />
            {file && (
              <p className="mt-2 flex items-center gap-2 text-slate-600"><Paperclip className="w-4 h-4 text-blue-500" /> {file.name} ({Math.max(1, Math.round(file.size / 1024))} KB)
                <button type="button" onClick={clearFile} className="ml-1 px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 inline-flex items-center gap-1" aria-label="Remove file"><X className="w-3 h-3" /> remove</button></p>
            )}
          </div>
          <div><label className={label} htmlFor="cp-link">Link to larger files (Google Drive, OneDrive, GitHub…)</label><input id="cp-link" className={field} type="url" maxLength={300} value={f.link} onChange={set('link')} placeholder="https://" /></div>
        </section>

        <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px' }}><label>Website<input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} /></label></div>

        <label className="flex items-start gap-3 p-4 rounded-xl glass-card cursor-pointer">
          <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-blue-600" />
          <span>I agree that JR Learners may contact me about this request by e-mail, phone or WhatsApp, and may keep my details and file to prepare a reply. See the <Link href="/privacy" className="text-blue-500 underline">Privacy Policy</Link>.</span>
        </label>

        {(state === 'error' || error) && <p role="alert" className="p-3 rounded-lg bg-red-50 border border-red-300 text-red-500 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> {error}</p>}

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={state === 'sending' || !paymentsConfigured} className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2">
            {state === 'sending' ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : 'Send my project request'}
          </button>
          <span className="text-slate-500">Questions first? <a className="text-blue-500 underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></span>
        </div>
      </form>
    </div>
  );
}
