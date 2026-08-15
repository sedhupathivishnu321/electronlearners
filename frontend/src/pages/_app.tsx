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
        <title>ElectronLearners | Hands-On STEM Kits, Projects & Courses</title>
        <meta name="description" content="Master Electronics, Arduino, ESP32, Robotics, AI & PCB Design with ElectronLearners physical STEM kits, structured courses, and open-source project guides." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col bg-[#0F172A] text-slate-100 selection:bg-blue-600 selection:text-white">
        <Header />
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        <Footer />
        <NotificationToast />
      </div>
    </AppProvider>
  );
}
