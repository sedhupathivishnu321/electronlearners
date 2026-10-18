import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { KIT_FOCUS, KIT_NAMES, KitProjectFull, loadKitProjects, simulatorLink } from '../../data/kitProjects';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Copy, Download, PlayCircle, ShoppingCart, Check } from 'lucide-react';

const RE = /^k([1-8])-(\d\d)$/;

export default function ProjectGuide() {
  const router = useRouter();
  const { products, addToCart } = useApp();
  const id = String(router.query.id || '');
  const m = RE.exec(id);
  const [proj, setProj] = useState<KitProjectFull | null>(null);
  const [neighbours, setNeighbours] = useState<{ prev?: KitProjectFull; next?: KitProjectFull }>({});
  const [missing, setMissing] = useState(false);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    if (!router.isReady) return;
    if (!m) { setMissing(true); return; }
    let live = true;
    loadKitProjects(Number(m[1])).then((list) => {
      if (!live) return;
      const i = list.findIndex((p) => p.id === id);
      if (i < 0) { setMissing(true); return; }
      setProj(list[i]);
      setNeighbours({ prev: list[i - 1], next: list[i + 1] });
    }).catch(() => live && setMissing(true));
    return () => { live = false; };
  }, [router.isReady, id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (missing) {
    return <div className="max-w-3xl mx-auto px-4 py-16 text-center"><p>Project not found.</p><Link href="/projects" className="text-blue-500 hover:underline mt-3 inline-block">Back to all projects</Link></div>;
  }
  if (!proj) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-500">Loading project…</div>;

  const kitProduct = products.find((p) => p.id === `prod-${proj.kit}`);
  const copy = async (text: string, key: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(''), 1500); } catch { /* clipboard blocked */ }
  };
  const download = (text: string, name: string) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const base = `${String(proj.num).padStart(2, '0')}_${proj.name.replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 40)}`;
  const partList = Object.entries(proj.parts as Record<string, number>);

  const CodeBlock = ({ title, code, file, k }: { title: string; code: string; file: string; k: string }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wider">{title}</h3>
        <div className="flex gap-2">
          <button onClick={() => copy(code, k)} className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-[11px] font-semibold flex items-center gap-1">
            {copied === k ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
          </button>
          <button onClick={() => download(code, file)} className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-[11px] font-semibold flex items-center gap-1"><Download className="w-3.5 h-3.5" /> .ino</button>
        </div>
      </div>
      <pre className="rounded-xl p-4 text-[11px] leading-relaxed overflow-x-auto max-h-[28rem]"><code>{code}</code></pre>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link href={`/projects?kit=${proj.kit}`} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-500"><ArrowLeft className="w-4 h-4" /> Kit {proj.kit} projects</Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
          <span className="px-2.5 py-1 rounded bg-blue-600">Kit {proj.kit} · {KIT_NAMES[proj.kit]}</span>
          <span className="px-2.5 py-1 rounded bg-slate-200">{proj.tier}</span>
          <span className="text-slate-500">Project {proj.num} of 50</span>
        </div>
        <h1 className="text-3xl font-heading font-extrabold">{proj.name}</h1>
        <p className="text-sm text-slate-500">{proj.desc}</p>
        <div className="flex flex-wrap gap-3 pt-1">
          <a href={simulatorLink(proj.simId)} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold flex items-center gap-2"><PlayCircle className="w-4 h-4" /> Open in the simulator</a>
          {kitProduct && <button onClick={() => addToCart(kitProduct)} className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold flex items-center gap-2"><ShoppingCart className="w-4 h-4" /> Buy Kit {proj.kit} · ₹{kitProduct.price}</button>}
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl glass-card space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider">Parts used</h2>
          <ul className="text-xs space-y-1.5">
            {partList.map(([name, n]) => <li key={name} className="flex justify-between gap-3"><span>{name}</span><span className="font-mono text-slate-500">× {n}</span></li>)}
          </ul>
          <p className="text-[11px] text-slate-500">Plus the Arduino UNO R3, breadboard and jumper wires that come with every kit.</p>
        </div>
        <div className="p-5 rounded-2xl glass-card space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider">Circuit notes</h2>
          <ul className="text-xs space-y-1.5 list-disc list-inside">
            {proj.circuit.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
          <p className="text-[11px] text-slate-500">The simulator shows the exact breadboard wiring and lets you press Start to run the project before you build it.</p>
        </div>
      </section>

      <section className="space-y-6">
        <CodeBlock title={proj.nodeSketch ? 'Arduino UNO sketch' : 'Arduino sketch'} code={proj.sketch} file={`${base}.ino`} k="uno" />
        {proj.nodeSketch && <CodeBlock title="NodeMCU (ESP8266) sketch" code={proj.nodeSketch} file={`NodeMCU_${base}.ino`} k="node" />}
      </section>

      <nav className="flex justify-between gap-4 border-t border-slate-300 pt-6 text-xs font-semibold">
        {neighbours.prev ? <Link href={`/projects/${neighbours.prev.id}`} className="hover:text-blue-500">← {neighbours.prev.name}</Link> : <span />}
        {neighbours.next ? <Link href={`/projects/${neighbours.next.id}`} className="hover:text-blue-500 text-right">{neighbours.next.name} →</Link> : <span />}
      </nav>
      <p className="text-[11px] text-slate-500">Focus of this kit: {KIT_FOCUS[proj.kit]}.</p>
    </div>
  );
}

// Static export: one page per project (400)
export const getStaticPaths: GetStaticPaths = async () => {
  const fs = await import('fs');
  const path = await import('path');
  const idx = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'kit-projects', 'index.json'), 'utf8')) as { id: string }[];
  return { paths: idx.map((p) => ({ params: { id: p.id } })), fallback: false };
};
export const getStaticProps: GetStaticProps = async () => ({ props: {} });
