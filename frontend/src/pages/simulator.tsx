import React from 'react';
import Head from 'next/head';
import { ExternalLink } from 'lucide-react';

// The ArduinoForge simulator (all 400 kit projects) embedded in the site. It is a static web app served from /arduinoforge/.
export default function SimulatorPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-4 py-4 space-y-3">
      <Head><title>ArduinoForge Simulator | JR Learners</title></Head>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-heading font-extrabold uppercase">ArduinoForge Simulator</h1>
          <p className="text-xs text-slate-500">Open the Examples menu → Kit 1 … Kit 8 to load any of the 400 projects, then press Start.</p>
        </div>
        <a href="/arduinoforge/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold flex items-center gap-2"><ExternalLink className="w-4 h-4" /> Open full screen</a>
      </div>
      <iframe
        title="ArduinoForge circuit simulator"
        src="/arduinoforge/"
        className="w-full rounded-2xl border border-slate-300 bg-white"
        style={{ height: 'calc(100vh - 170px)', minHeight: 560 }}
        allow="fullscreen"
      />
    </div>
  );
}
