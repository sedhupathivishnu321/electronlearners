import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { POLICIES, POLICY_BY_SLUG } from '../data/policies';
import { COMPANY, POLICIES_UPDATED, SUPPORT_EMAIL } from '../data/siteConfig';

export const PolicyPage: React.FC<{ slug: string }> = ({ slug }) => {
  const policy = POLICY_BY_SLUG[slug];
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Head><title>{policy.title} | JR Learners</title></Head>
      <div className="border-b border-slate-300 pb-6 mb-8">
        <Link href="/policies" className="text-xs font-bold text-blue-500 uppercase tracking-widest hover:underline">All policies</Link>
        <h1 className="text-3xl font-heading font-extrabold mt-1">{policy.title}</h1>
        <p className="text-sm text-slate-500 mt-1">{policy.summary}</p>
        <p className="text-xs text-slate-500 mt-2">Last updated {POLICIES_UPDATED} · {COMPANY.name}, {COMPANY.address}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <nav aria-label="On this page" className="lg:col-span-1 lg:sticky lg:top-24 h-fit p-4 rounded-2xl glass-card text-xs space-y-2">
          <p className="font-bold uppercase tracking-wider text-slate-500 mb-2">On this page</p>
          {policy.sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="block hover:text-blue-500 hover:underline">{s.title}</a>
          ))}
          <div className="pt-3 mt-3 border-t border-slate-300 space-y-1.5">
            <p className="font-bold uppercase tracking-wider text-slate-500">Other policies</p>
            {POLICIES.filter((p) => p.slug !== slug).map((p) => (
              <Link key={p.slug} href={`/${p.slug}`} className="block hover:text-blue-500 hover:underline">{p.title}</Link>
            ))}
          </div>
        </nav>

        <article className="lg:col-span-3 p-6 sm:p-8 rounded-2xl glass-card space-y-8 text-sm leading-relaxed">
          {policy.sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24 space-y-3">
              <h2 className="text-lg font-heading font-bold">{s.title}</h2>
              {s.body.map((b, i) =>
                typeof b === 'string' ? (
                  <p key={i}>{b}</p>
                ) : (
                  <ul key={i} className="list-disc pl-5 space-y-1.5">
                    {b.list.map((li, j) => <li key={j}>{li}</li>)}
                  </ul>
                ),
              )}
            </section>
          ))}
          <p className="text-xs text-slate-500 border-t border-slate-300 pt-4">
            Questions about this policy? <a className="text-blue-500 underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> · <Link className="text-blue-500 underline" href="/contact">Contact page</Link>
          </p>
        </article>
      </div>
    </div>
  );
};

export default PolicyPage;
