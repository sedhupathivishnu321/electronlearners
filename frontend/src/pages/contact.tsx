import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="border-b border-slate-800 pb-6">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Get In Touch</span>
        <h1 className="text-3xl font-heading font-extrabold text-white mt-1">Contact JR Learners</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="p-8 rounded-3xl glass-card border border-slate-800 space-y-4">
          <h2 className="text-xl font-bold text-white font-heading">Head Office & Innovation Lab</h2>
          
          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
              <span>JR Learners STEM Towers, Phase III, Tech Park, New Delhi, 110001, India</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>+91 98765 43210 / +91 11 2345 6789</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-orange-400 shrink-0" />
              <span>support@jrlearners.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Monday – Saturday: 9:00 AM – 6:00 PM IST</span>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Send Us a Message</h3>
          <form onSubmit={(e) => { e.preventDefault(); alert("Thank you! Your message has been received."); }} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Your Name</label>
              <input type="text" required placeholder="John Doe" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Email Address</label>
              <input type="email" required placeholder="john@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Message</label>
              <textarea rows={3} required placeholder="How can we assist you with STEM kits or courses?" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"></textarea>
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30">
              Send Message
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
