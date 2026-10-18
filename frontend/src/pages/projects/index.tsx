import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { KIT_FOCUS, KIT_NAMES, KitProjectIndexItem, Tier, loadProjectIndex, simulatorLink } from '../../data/kitProjects';
import { Search, Layers, PlayCircle } from 'lucide-react';

const PAGE = 24;
const TIERS: ('All' | Tier)[] = ['All', 'Basic', 'Intermediate', 'Advanced'];
const tierStyle: Record<Tier, string> = {
  Basic: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  Intermediate: 'bg-amber-100 text-amber-800 border-amber-300',
  Advanced: 'bg-red-100 text-red-700 border-red-300',
};

export default function ProjectsPage() {
  const router = useRouter();
  const [all, setAll] = useState<KitProjectIndexItem[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [kit, setKit] = useState<number>(0);          // 0 = all kits
  const [tier, setTier] = useState<'All' | Tier>('All');
  const [q, setQ] = useState('');
  const [shown, setShown] = useState(PAGE);

  useEffect(() => { loadProjectIndex().then(setAll).catch(() => setFailed(true)); }, []);
  useEffect(() => {
    if (!router.isReady) return;
    const k = Number(router.query.kit);
    if (k >= 1 && k <= 8) setKit(k);
    if (typeof router.query.search === 'string') setQ(router.query.search);
  }, [router.isReady, router.query]);
  useEffect(() => setShown(PAGE), [kit, tier, q]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (all ?? []).filter((p) =>
      (kit === 0 || p.kit === kit) && (tier === 'All' || p.tier === tier) &&
      (needle === '' || p.name.toLowerCase().includes(needle) || p.desc.toLowerCase().includes(needle) || p.parts.some((x) => x.toLowerCase().includes(needle))));
  }, [all, kit, tier, q]);

  const pill = (active: boolean) => `px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${active ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 hover:border-blue-500'}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-300 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">400 guided projects</span>
          <h1 className="text-3xl font-heading font-extrabold mt-1 uppercase">Kit Projects</h1>
          <p className="text-xs text-slate-500 mt-1">50 projects per kit (10 Basic, 20 Intermediate, 20 Advanced). Every project has its parts list, circuit notes, Arduino sketch and a one-click simulator.</p>
        </div>
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" aria-label="Search projects" placeholder="Search name, description or part…" value={q} onChange={(e) => setQ(e.target.value)} className="w-full rounded-xl pl-9 pr-4 py-2.5 text-xs" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Kit">
          <button className={pill(kit === 0)} onClick={() => setKit(0)}>All kits</button>
          {Object.entries(KIT_NAMES).map(([k, name]) => (
            <button key={k} className={pill(kit === Number(k))} onClick={() => setKit(Number(k))} title={KIT_FOCUS[Number(k)]}>Kit {k} · {name}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Level">
          {TIERS.map((t) => <button key={t} className={pill(tier === t)} onClick={() => setTier(t)}>{t}</button>)}
        </div>
      </div>

      {failed && <p className="p-6 rounded-xl glass-card text-sm text-red-500">The project list could not be loaded. Please refresh the page.</p>}
      {!all && !failed && <p className="text-sm text-slate-500">Loading projects…</p>}

      {all && (
        <>
          <p className="text-xs text-slate-500">Showing {Math.min(shown, filtered.length)} of {filtered.length} projects</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.slice(0, shown).map((p) => (
              <div key={p.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-blue-500 flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> Kit {p.kit} · #{p.num}</span>
                    <span className={`px-2 py-0.5 rounded border ${tierStyle[p.tier]}`}>{p.tier}</span>
                  </div>
                  <h3 className="text-sm font-bold">{p.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/projects/${p.id}`} className="flex-grow text-center py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold">Open guide</Link>
                  <a href={simulatorLink(p.simId)} className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-semibold flex items-center gap-1" title="Open in the simulator"><PlayCircle className="w-3.5 h-3.5" /> Simulate</a>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && <p className="p-10 text-center glass-card rounded-2xl text-sm text-slate-500">No project matches these filters.</p>}
          {shown < filtered.length && (
            <div className="text-center"><button onClick={() => setShown((n) => n + PAGE)} className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold">Show more</button></div>
          )}
        </>
      )}
    </div>
  );
}
