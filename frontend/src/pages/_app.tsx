import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AppProvider } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { NotificationToast } from '../components/ui/NotificationToast';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Head>
        <title>JR Learners | Hands-On STEM Kits, Projects & Courses</title>
        <meta name="description" content="Master Electronics, Arduino, ESP32, Robotics, AI & PCB Design with JR Learners physical STEM kits, structured courses, and open-source project guides." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white relative overflow-hidden">
        
        {/* Global Background Layer with Tech Design & Mesh Gradients */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Base Light Background */}
          <div className="absolute inset-0 bg-white"></div>
          
          {/* Yellow, White, Blue Mesh Gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,#FDE047_0%,rgba(253,224,71,0.4)_30%,transparent_70%),radial-gradient(circle_at_90%_90%,#E0F2FE_0%,rgba(224,242,254,0.4)_55%,transparent_80%),radial-gradient(circle_at_50%_50%,#FFFFFF_0%,rgba(255,255,255,0.8)_25%,transparent_60%)]"></div>
          
          {/* Tech Grid Overlay - Square Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          {/* Tech Dotted Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

          {/* Floating tech elements / circle orbits */}
          <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full border border-blue-500/10 border-dashed animate-[spin_120s_linear_infinite]"></div>
          <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full border border-yellow-500/10 border-double animate-[spin_180s_linear_infinite]"></div>
          
          {/* Floating 3D Shapes & Glow outlines */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Rectangles */}
            <div className="absolute top-[12%] left-[8%] w-16 h-28 border border-yellow-600/30 rounded-lg rotate-12 animate-float"></div>
            <div className="absolute top-[65%] right-[6%] w-24 h-12 border border-blue-600/30 rounded-lg -rotate-45 animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[35%] right-[12%] w-10 h-20 border border-slate-900/15 rounded-md rotate-45 animate-float" style={{ animationDelay: '4s' }}></div>

            {/* Circles */}
            <div className="absolute top-[25%] left-[75%] w-24 h-24 rounded-full border border-blue-500/20 animate-bubble-1"></div>
            <div className="absolute top-[80%] left-[15%] w-36 h-36 rounded-full border border-yellow-650/15 animate-bubble-2"></div>

            {/* Bubbles */}
            <div className="absolute top-[18%] left-[20%] w-6 h-6 rounded-full bg-yellow-500/35 blur-[1px] animate-bubble-3"></div>
            <div className="absolute top-[50%] left-[45%] w-10 h-10 rounded-full bg-blue-500/20 blur-[2px] animate-bubble-1"></div>
            <div className="absolute top-[70%] left-[80%] w-8 h-8 rounded-full bg-slate-900/10 blur-[1px] animate-bubble-2"></div>
            <div className="absolute top-[40%] left-[85%] w-5 h-5 rounded-full bg-yellow-500/30 blur-[1px] animate-bubble-3"></div>
            <div className="absolute top-[85%] left-[60%] w-12 h-12 rounded-full bg-blue-500/20 blur-[3px] animate-bubble-1"></div>
          </div>
        </div>

        <Header />
        <main className="flex-grow relative z-10">
          <Component {...pageProps} />
        </main>
        <Footer />
        <NotificationToast />
      </div>
    </AppProvider>
  );
}
