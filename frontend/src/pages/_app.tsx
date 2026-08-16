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
      <div className="min-h-screen flex flex-col bg-[#070A13] text-slate-100 selection:bg-blue-600 selection:text-white relative overflow-hidden">
        
        {/* Global Background Layer with Tech Design & Mesh Gradients */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Base Deep Navy Background */}
          <div className="absolute inset-0 bg-[#070A13]"></div>
          
          {/* Yellow, White, Navy Blue Mesh Gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(251,191,36,0.75)_0%,rgba(251,191,36,0.35)_30%,transparent_70%),radial-gradient(circle_at_90%_90%,rgba(30,58,138,0.95)_0%,rgba(7,10,19,0.95)_55%,transparent_80%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0.15)_25%,transparent_60%),radial-gradient(circle_at_80%_20%,rgba(251,191,36,0.45)_0%,transparent_60%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.25)_0%,transparent_55%)]"></div>
          
          {/* Tech Grid Overlay - Square Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          {/* Tech Dotted Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

          {/* Floating tech elements / circle orbits */}
          <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full border border-blue-500/5 border-dashed animate-[spin_120s_linear_infinite]"></div>
          <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full border border-yellow-500/5 border-double animate-[spin_180s_linear_infinite]"></div>
          
          {/* Floating 3D Shapes & Glow outlines */}
          <div className="absolute inset-0 overflow-hidden">
            {/* 3D Cube 1: Yellow Glowing Cube in Top-Left */}
            <div className="absolute top-[15%] left-[10%] w-16 h-16 [perspective:800px] hidden md:block">
              <div className="w-full h-full relative [transform-style:preserve-3d] animate-spin-3d">
                <div className="cube-face cube-front border-yellow-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]"></div>
                <div className="cube-face cube-back border-yellow-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]"></div>
                <div className="cube-face cube-left border-yellow-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]"></div>
                <div className="cube-face cube-right border-yellow-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]"></div>
                <div className="cube-face cube-top border-yellow-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]"></div>
                <div className="cube-face cube-bottom border-yellow-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]"></div>
              </div>
            </div>

            {/* 3D Cube 2: Blue Glowing Cube in Bottom-Right */}
            <div className="absolute bottom-[20%] right-[10%] w-20 h-20 [perspective:800px] hidden md:block">
              <div className="w-full h-full relative [transform-style:preserve-3d] animate-spin-3d-slow">
                <div className="cube-face cube-front border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.2)]"></div>
                <div className="cube-face cube-back border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.2)]"></div>
                <div className="cube-face cube-left border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.2)]"></div>
                <div className="cube-face cube-right border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.2)]"></div>
                <div className="cube-face cube-top border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.2)]"></div>
                <div className="cube-face cube-bottom border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.2)]"></div>
              </div>
            </div>

            {/* 3D Wireframe Globe (Intersecting Circles) in Middle-Right */}
            <div className="absolute top-[40%] right-[15%] w-16 h-16 [perspective:800px] hidden lg:block animate-float-slow">
              <div className="w-full h-full relative [transform-style:preserve-3d] animate-spin-3d-reverse">
                <div className="absolute inset-0 rounded-full border border-yellow-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]"></div>
                <div className="absolute inset-0 rounded-full border border-yellow-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)] [transform:rotateY(60deg)]"></div>
                <div className="absolute inset-0 rounded-full border border-yellow-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)] [transform:rotateY(120deg)]"></div>
                <div className="absolute inset-0 rounded-full border border-yellow-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)] [transform:rotateX(90deg)]"></div>
              </div>
            </div>

            {/* 3D Wireframe Globe (Blue) in Middle-Left */}
            <div className="absolute top-[55%] left-[8%] w-12 h-12 [perspective:800px] hidden lg:block animate-float">
              <div className="w-full h-full relative [transform-style:preserve-3d] animate-spin-3d">
                <div className="absolute inset-0 rounded-full border border-blue-500/40 shadow-[0_0_10px_rgba(37,99,235,0.3)]"></div>
                <div className="absolute inset-0 rounded-full border border-blue-500/40 shadow-[0_0_10px_rgba(37,99,235,0.3)] [transform:rotateY(60deg)]"></div>
                <div className="absolute inset-0 rounded-full border border-blue-500/40 shadow-[0_0_10px_rgba(37,99,235,0.3)] [transform:rotateY(120deg)]"></div>
              </div>
            </div>

            {/* Floating Glowing Tech Torus Ring 1 */}
            <div className="absolute top-[30%] left-[18%] w-12 h-12 rounded-full border-2 border-double border-yellow-500/40 shadow-[0_0_12px_rgba(245,158,11,0.4)] animate-float-slow"></div>

            {/* Floating Glowing Tech Torus Ring 2 */}
            <div className="absolute bottom-[35%] left-[8%] w-16 h-16 rounded-full border-2 border-dashed border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.4)] animate-float"></div>

            {/* Floating Glowing Tech Torus Ring 3 */}
            <div className="absolute top-[65%] right-[20%] w-10 h-10 rounded-full border border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.3)] animate-float" style={{ animationDelay: '2s' }}></div>

            {/* Neon Glowing Hexagons/Nodes */}
            <div className="absolute top-[50%] left-[25%] w-3 h-3 rounded-full bg-yellow-500/60 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse"></div>
            <div className="absolute top-[75%] left-[30%] w-2 h-2 rounded-full bg-blue-500/60 shadow-[0_0_8px_rgba(37,99,235,0.8)] animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-[20%] right-[30%] w-2.5 h-2.5 rounded-full bg-white/60 shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
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
