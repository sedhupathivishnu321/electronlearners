import React from 'react';
import { HelpCircle, MessageSquare, Mail, Phone, LifeBuoy } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="border-b border-slate-800 pb-6 text-center space-y-2">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">24/7 Assistance</span>
        <h1 className="text-3xl font-heading font-extrabold text-white">Support & Knowledge Center</h1>
        <p className="text-slate-400 text-xs">Have questions about your STEM Kit order or Arduino circuit code? We're here to help!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass-card border border-slate-800 text-center space-y-3">
          <MessageSquare className="w-8 h-8 text-cyan-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Live Chat Support</h3>
          <p className="text-slate-400 text-xs">Chat directly with an engineer for hardware troubleshooting.</p>
          <button onClick={() => alert("Connecting to live STEM support engineer...")} className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-semibold">Start Chat</button>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-800 text-center space-y-3">
          <Mail className="w-8 h-8 text-blue-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Email Ticket</h3>
          <p className="text-slate-400 text-xs">Send detailed circuit photos or log files for technical review.</p>
          <a href="mailto:support@jrlearners.com" className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold">Email Us</a>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-800 text-center space-y-3">
          <Phone className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Call Support</h3>
          <p className="text-slate-400 text-xs">Speak with our educator helpline Mon-Sat 9AM-6PM IST.</p>
          <a href="tel:+919876543210" className="inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold">+91 98765 43210</a>
        </div>
      </div>

    </div>
  );
}
