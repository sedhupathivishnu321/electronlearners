import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { FileText, ShieldCheck, RotateCcw, Truck, Cookie } from 'lucide-react';
import { POLICIES } from '../data/policies';
import { COMPANY, CONTACT_EMAIL, POLICIES_UPDATED, SUPPORT_EMAIL, WHATSAPP_NUMBER_DISPLAY, WHATSAPP_URL } from '../data/siteConfig';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = { terms: FileText, privacy: ShieldCheck, refund: RotateCcw, shipping: Truck, cookie: Cookie };

export default function PoliciesHub() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <Head><title>Company policies | JR Learners</title></Head>
      <div className="border-b border-slate-300 pb-6">
        <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Company</span>
        <h1 className="text-3xl font-heading font-extrabold mt-1">Terms &amp; Policies</h1>
        <p className="text-sm text-slate-500 mt-1">How we run the shop, handle your data and look after your orders. Last updated {POLICIES_UPDATED}.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {POLICIES.map((p) => {
          const Icon = ICONS[p.slug] ?? FileText;
          return (
            <Link key={p.slug} href={`/${p.slug}`} className="p-6 rounded-2xl glass-card glass-card-hover flex gap-4 items-start">
              <span className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></span>
              <span>
                <span className="block font-heading font-bold">{p.title}</span>
                <span className="block text-xs text-slate-500 mt-1">{p.summary}</span>
              </span>
            </Link>
          );
        })}
      </div>

      <section className="p-6 rounded-2xl glass-card space-y-3 text-sm">
        <h2 className="text-lg font-heading font-bold">About the company</h2>
        <p>{COMPANY.description}</p>
        <ul className="text-xs space-y-1.5">
          <li><span className="font-semibold">Brand:</span> {COMPANY.name} – {COMPANY.tagline}</li>
          {COMPANY.legalName && <li><span className="font-semibold">Legal name:</span> {COMPANY.legalName}</li>}
          {COMPANY.gstin && <li><span className="font-semibold">GSTIN:</span> {COMPANY.gstin}</li>}
          {COMPANY.registration && <li><span className="font-semibold">Registration:</span> {COMPANY.registration}</li>}
          <li><span className="font-semibold">Address:</span> {COMPANY.address}</li>
          <li><span className="font-semibold">Support hours:</span> {COMPANY.hours}</li>
          <li><span className="font-semibold">General enquiries:</span> <a className="text-blue-500 underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
          <li><span className="font-semibold">Help &amp; order support:</span> <a className="text-blue-500 underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></li>
          <li><span className="font-semibold">WhatsApp:</span> <a className="text-blue-500 underline" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">{WHATSAPP_NUMBER_DISPLAY}</a></li>
          <li><span className="font-semibold">Grievance officer:</span> {COMPANY.grievanceOfficer} ({SUPPORT_EMAIL})</li>
        </ul>
      </section>
    </div>
  );
}
