import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { HelpCircle, MessageSquare, Mail, Phone, LifeBuoy, AlertCircle, Clock, ChevronRight, Send, ShieldAlert } from 'lucide-react';

export default function SupportPage() {
  const { user, supportTickets, createTicket, replyToTicket } = useApp();

  // Ticket Form States
  const [subject, setSubject] = useState('');
  const [orderId, setOrderId] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [messageText, setMessageText] = useState('');

  // Selected Ticket to view details/messages
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const activeTicket = supportTickets.find(t => t.id === selectedTicketId);

  // Filter tickets for current user if logged in
  const userTickets = user 
    ? supportTickets.filter(t => t.email.toLowerCase() === user.email.toLowerCase()) 
    : [];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !messageText.trim()) return;

    createTicket(subject, orderId || undefined, priority, messageText);
    setSubject('');
    setOrderId('');
    setMessageText('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicketId) return;

    replyToTicket(selectedTicketId, 'customer', replyText);
    setReplyText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-transparent text-slate-100">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 text-center space-y-2">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Customer Support Center</span>
        <h1 className="text-3xl font-heading font-extrabold text-white uppercase">Help & Resolution desk</h1>
        <p className="text-slate-400 text-xs">Have queries regarding Arduino wiring, sensor calibration, or kit deliveries? Open a ticket below.</p>
      </div>

      {/* Grid: Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass-card border border-slate-800 text-center space-y-3 shadow-lg">
          <MessageSquare className="w-8 h-8 text-cyan-400 mx-auto" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">Live Chat Help</h3>
          <p className="text-slate-400 text-xs">Connect directly with a STEM hardware expert for circuit debugging.</p>
          <button onClick={() => alert("Connecting to live STEM support engineer...")} className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all">Start Chat</button>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-800 text-center space-y-3 shadow-lg">
          <Mail className="w-8 h-8 text-blue-400 mx-auto" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">Email Support</h3>
          <p className="text-slate-400 text-xs">Send schema drawings, log scripts, or order invoice requests directly.</p>
          <a href="mailto:support@JR Learners.com" className="inline-block px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all">Email Us</a>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-800 text-center space-y-3 shadow-lg">
          <Phone className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">Educator Hotline</h3>
          <p className="text-slate-400 text-xs">Speak with our academic team for institutional custom setups.</p>
          <a href="tel:+919876543210" className="inline-block px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-550 text-white text-xs font-semibold transition-all">+91 98765 43210</a>
        </div>
      </div>

      {/* Main Support Ticketing Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-slate-850 pt-10">
        
        {/* Left: Submit Ticket Form */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4 shadow-lg">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Create a Support Ticket</h3>
          <p className="text-[10px] text-slate-450">Describe the problem. If related to an order, specify the Order ID to speed up tracking.</p>

          <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Subject / Problem Summary *</label>
              <input
                type="text"
                required
                placeholder="e.g. Servo SG90 motor not turning on pin 9"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Order ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. EL000123"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Priority Level *</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-350 focus:outline-none focus:border-blue-500"
                >
                  <option value="Low">Low - Clarification query</option>
                  <option value="Medium">Medium - Component issue</option>
                  <option value="High">High - Damaged or missing part</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Description / Code logs *</label>
              <textarea
                rows={4}
                required
                placeholder="Explain the circuit connections, upload error log strings from Arduino Serial Monitor, or specify missing parts..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition-all uppercase tracking-wider"
            >
              Open Ticket
            </button>
          </form>
        </div>

        {/* Right: Ticket Tracking Thread */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Your Support Tickets</h3>
            
            {user ? (
              userTickets.length > 0 ? (
                <div className="divide-y divide-slate-850">
                  {userTickets.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTicketId(t.id)}
                      className={`w-full text-left py-3 transition-colors flex items-center justify-between ${
                        selectedTicketId === t.id ? 'bg-slate-950/40 px-2 rounded-xl border border-slate-850' : 'hover:bg-slate-950/20'
                      }`}
                    >
                      <div className="space-y-1 truncate pr-2">
                        <div className="text-xs font-bold text-white truncate">{t.subject}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-2">
                          <span className="font-mono">#{t.id}</span>
                          <span>•</span>
                          <span>Priority: {t.priority}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        t.status === 'Open' ? 'bg-red-500/10 text-red-400' :
                        t.status === 'Waiting' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {t.status}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-550 py-4">You have not submitted any support tickets yet.</p>
              )
            ) : (
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-2.5 text-xs text-amber-550 leading-relaxed">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>Please <Link href="/login" className="underline font-bold text-white">Sign In</Link> to view, track, or reply to active support tickets.</p>
              </div>
            )}
          </div>

          {/* Ticket Messages Detail Panel */}
          {selectedTicketId && activeTicket && (
            <div className="p-6 rounded-2xl glass-card border border-blue-500/20 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-xs font-bold text-white truncate max-w-xs">{activeTicket.subject}</h4>
                  <span className="text-[9px] font-mono text-slate-500">Ticket ID: #{activeTicket.id}</span>
                </div>
                <button onClick={() => setSelectedTicketId(null)} className="text-[10px] text-slate-450 hover:text-white">Close</button>
              </div>

              {/* Message thread */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {activeTicket.messages.map((msg, idx) => (
                  <div key={idx} className={`p-3 rounded-xl max-w-[85%] text-xs ${
                    msg.sender === 'customer' 
                      ? 'bg-blue-600/10 border border-blue-500/20 ml-auto text-right' 
                      : 'bg-slate-950 border border-slate-850 mr-auto text-left'
                  }`}>
                    <div className="font-bold text-[10px] text-slate-400 mb-0.5">{msg.sender === 'customer' ? 'You' : 'Admin Engineer'}</div>
                    <p className="text-slate-200 leading-relaxed font-sans">{msg.text}</p>
                    <span className="text-[8px] text-slate-550 block mt-1">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                ))}
              </div>

              {/* Quick Reply Form */}
              <form onSubmit={handleSendReply} className="flex gap-2 border-t border-slate-850 pt-3">
                <input
                  type="text"
                  required
                  placeholder="Type reply to technical support..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-grow bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

