import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { 
  Shield, TrendingUp, DollarSign, ShoppingBag, Users, Cpu, MessageSquare, Star, 
  Layers, FileText, Tag, Activity, Settings, Plus, Edit, Trash2, CheckCircle, AlertCircle, RefreshCw, ClipboardCheck, ArrowRight, Eye, Trash, UserCheck, Send, Check
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    user, products, orders, rfqs, supportTickets, reviews, auditLogs, coupons,
    updateProductStock, addProduct, deleteProduct, updateRFQStatus, updateTicketStatus, replyToTicket, approveReview, deleteReview, addCoupon, deleteCoupon, clearAuditLogs 
  } = useApp();

  // Role verification
  const isAuthorized = user && ['admin', 'store_manager', 'support_agent', 'content_manager'].includes(user.role);
  
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'rfqs' | 'tickets' | 'reviews' | 'coupons' | 'logs'>('analytics');

  // Product CRUD states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'Arduino' | 'Electronics' | 'Robotics' | 'IoT' | 'PCB Design' | 'Analog Kits'>('Arduino');
  const [newProdPrice, setNewProdPrice] = useState(999);
  const [newProdStock, setNewProdStock] = useState(50);
  const [newProdDesc, setNewProdDesc] = useState('');

  // Ticket Response states
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // Coupon Manager states
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);
  const [newCouponMinSpend, setNewCouponMinSpend] = useState(500);

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Shield className="w-16 h-16 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">Access Denied</h2>
        <p className="text-slate-400 text-xs leading-relaxed">
          You do not have permissions to view this control panel. If you are an administrator, please sign in with an official admin account.
        </p>
        <Link href="/login" className="inline-block px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow">
          Sign In
        </Link>
      </div>
    );
  }

  // Role permissions filtering helper
  const hasTabAccess = (tab: typeof activeTab) => {
    if (user.role === 'admin') return true;
    if (user.role === 'store_manager') return ['analytics', 'products', 'coupons', 'logs'].includes(tab);
    if (user.role === 'support_agent') return ['tickets', 'reviews'].includes(tab);
    if (user.role === 'content_manager') return ['products', 'reviews'].includes(tab);
    return false;
  };

  // Calculate stats
  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingRFQsCount = rfqs.filter(r => r.status === 'Pending').length;
  const openTicketsCount = supportTickets.filter(t => t.status === 'Open' || t.status === 'Waiting').length;
  const pendingReviewsCount = reviews.filter(r => r.status === 'Pending').length;

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdDesc.trim()) return;

    addProduct({
      id: `prod-${Date.now()}`,
      name: newProdName,
      slug: newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newProdCategory as any,
      price: Number(newProdPrice),
      originalPrice: Number(newProdPrice) + 400,
      stock: Number(newProdStock),
      image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80",
      shortDesc: newProdDesc,
      description: `Premium STEM development package: ${newProdName}.`,
      learningObjectives: ["Prototyping logic", "Interface circuitry"],
      components: [{ name: "Controller core", quantity: 1 }],
      specifications: { "Core Voltage": "5V DC" },
      assemblySteps: ["Assemble board components"],
      manualUrl: "/downloads/manuals/Arduino_Starter_Kit_Guide.pdf",
      datasheetUrl: "/downloads/datasheets/ATmega328P_Datasheet.pdf",
      videoUrl: "https://www.youtube.com/watch?v=nL34zDTPkcs",
      faqs: []
    });

    setNewProdName('');
    setNewProdDesc('');
    setShowAddModal(false);
    alert("New STEM product kit successfully added to index catalog!");
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    addCoupon({
      code: newCouponCode.toUpperCase(),
      discountPercent: Number(newCouponDiscount),
      minSpend: Number(newCouponMinSpend),
      description: `${newCouponDiscount}% Discount on store purchases above ₹${newCouponMinSpend}`
    });

    setNewCouponCode('');
    alert(`Coupon "${newCouponCode.toUpperCase()}" added successfully!`);
  };

  const handleSendTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketReplyText.trim() || !selectedTicketId) return;

    replyToTicket(selectedTicketId, 'agent', ticketReplyText);
    updateTicketStatus(selectedTicketId, 'Waiting');
    setTicketReplyText('');
  };

  const activeTicket = supportTickets.find(t => t.id === selectedTicketId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#0F172A] text-slate-100">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white font-heading uppercase">Admin Control Desk</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">{user.role}</span>
            </div>
            <p className="text-slate-400 text-xs">Manage products catalog, school quote RFQs, support tickets, and moderator reviews.</p>
          </div>
        </div>

        <button onClick={() => alert("Cache systems synchronized with localStorage!")} className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-350 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors">
          <RefreshCw className="w-4 h-4 text-cyan-400" /> Synced Database
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-4 text-xs font-semibold overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'analytics', label: 'Dashboard Stats', icon: TrendingUp },
          { key: 'products', label: `Products (${products.length})`, icon: Cpu },
          { key: 'rfqs', label: `B2B RFQs (${rfqs.length})`, icon: ClipboardCheck },
          { key: 'tickets', label: `Tickets (${supportTickets.length})`, icon: MessageSquare },
          { key: 'coupons', label: 'Coupons Manager', icon: Tag },
          { key: 'logs', label: 'Audit Log Desk', icon: Activity }
        ].map((tab) => {
          const visible = hasTabAccess(tab.key as any);
          if (!visible) return null;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'border-amber-500 text-amber-450 bg-amber-500/5 rounded-t-xl'
                  : 'border-transparent text-slate-405 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TABS CONTAINER */}
      <div className="space-y-8">
        
        {/* 1. DASHBOARD STATS */}
        {activeTab === 'analytics' && hasTabAccess('analytics') && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl glass-card border border-slate-850 space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Gross Sales</span>
                <div className="text-2xl font-extrabold text-white">₹{totalSales}</div>
                <div className="text-[9px] text-emerald-450">✓ Direct checkouts enabled</div>
              </div>
              <div className="p-5 rounded-2xl glass-card border border-slate-850 space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Pending RFQs</span>
                <div className="text-2xl font-extrabold text-white">{pendingRFQsCount}</div>
                <div className="text-[9px] text-blue-450">Needs price evaluation</div>
              </div>
              <div className="p-5 rounded-2xl glass-card border border-slate-850 space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Support Inquiries</span>
                <div className="text-2xl font-extrabold text-white">{openTicketsCount}</div>
                <div className="text-[9px] text-amber-450">Active customer threads</div>
              </div>
              <div className="p-5 rounded-2xl glass-card border border-slate-850 space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Unmoderated Reviews</span>
                <div className="text-2xl font-extrabold text-white">{pendingReviewsCount}</div>
                <div className="text-[9px] text-red-405">Awaiting content check</div>
              </div>
            </div>

            {/* Orders pipeline table */}
            <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Store Orders pipeline</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-450 uppercase text-[9px]">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer Email</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Items Count</th>
                      <th className="p-3">Total Payable</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {orders.slice(0, 10).map((o) => (
                      <tr key={o.id} className="hover:bg-slate-950/20">
                        <td className="p-3 font-mono font-bold text-cyan-405">#{o.id}</td>
                        <td className="p-3">{o.customerEmail}</td>
                        <td className="p-3 text-[10px] text-slate-400">{o.paymentMethod}</td>
                        <td className="p-3 font-bold">{o.items.length} kits</td>
                        <td className="p-3 font-extrabold text-white">₹{o.total}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                            o.status === 'Placed' ? 'bg-red-500/10 text-red-405' :
                            o.status === 'Processing' ? 'bg-blue-500/10 text-blue-405' :
                            o.status === 'Shipped' ? 'bg-amber-500/10 text-amber-405' :
                            'bg-emerald-500/10 text-emerald-405'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCTS CRUD */}
        {activeTab === 'products' && hasTabAccess('products') && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Catalog Inventory Manager</h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 shadow"
              >
                <Plus className="w-4 h-4" /> Add Product Kit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 truncate">
                    <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg border border-slate-800" />
                    <div className="truncate text-xs">
                      <h4 className="font-bold text-white truncate">{p.name}</h4>
                      <div className="text-[10px] text-slate-500">Category: {p.category} • Price: ₹{p.price}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">Stock:</span>
                      <input
                        type="number"
                        min={0}
                        defaultValue={p.stock}
                        onBlur={(e) => updateProductStock(p.id, Number(e.target.value))}
                        className="w-14 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-center font-bold text-white text-xs"
                      />
                    </div>
                    <button onClick={() => deleteProduct(p.id)} className="p-2 text-slate-600 hover:text-red-500" title="Delete Product">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. B2B RFQS MANAGER */}
        {activeTab === 'rfqs' && hasTabAccess('rfqs') && (
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Institutional Bulk RFQs</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rfqs.map((rfq) => (
                <div key={rfq.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-850 space-y-4">
                  <div className="flex justify-between items-start text-xs border-b border-slate-850 pb-2">
                    <div>
                      <h4 className="font-bold text-white">{rfq.institutionName}</h4>
                      <span className="text-[10px] text-slate-500">Contact: {rfq.contactPerson} ({rfq.phone})</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      rfq.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                      rfq.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>{rfq.status}</span>
                  </div>

                  <div className="text-xs text-slate-350 space-y-1.5">
                    <div><strong>Email:</strong> {rfq.email}</div>
                    <div><strong>Type:</strong> {rfq.institutionType}</div>
                    <div><strong>Product Required:</strong> {rfq.products.map(p => `${p.name} (x${p.quantity})`).join(', ')}</div>
                    <div><strong>Delivery Date:</strong> {rfq.requiredDate}</div>
                    {rfq.gstDetails && <div><strong>GSTIN:</strong> {rfq.gstDetails}</div>}
                    {rfq.requirements && <div className="italic text-[11px] bg-slate-900 p-2.5 rounded border border-slate-850 mt-2">"{rfq.requirements}"</div>}
                  </div>

                  {rfq.status === 'Pending' && (
                    <div className="flex gap-2 pt-2 border-t border-slate-850 text-xs">
                      <button
                        onClick={() => updateRFQStatus(rfq.id, 'Approved')}
                        className="flex-grow py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all"
                      >
                        Approve RFQ
                      </button>
                      <button
                        onClick={() => updateRFQStatus(rfq.id, 'Rejected')}
                        className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-red-650 hover:text-white text-slate-400 font-bold border border-slate-700 transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SUPPORT TICKETS MANAGER */}
        {activeTab === 'tickets' && hasTabAccess('tickets') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Tickets list */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950 border border-slate-850 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Ticket Logs</h3>
              <div className="divide-y divide-slate-850">
                {supportTickets.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`w-full text-left py-3.5 transition-colors flex items-center justify-between ${
                      selectedTicketId === t.id ? 'bg-slate-900/60 px-2 rounded-xl border border-slate-850' : 'hover:bg-slate-900/20'
                    }`}
                  >
                    <div className="space-y-1 truncate pr-2 text-xs">
                      <div className="font-bold text-white truncate">{t.subject}</div>
                      <div className="text-[10px] text-slate-500 font-mono">#{t.id} • {t.email}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                      t.status === 'Open' ? 'bg-red-500/10 text-red-405' :
                      t.status === 'Waiting' ? 'bg-amber-500/10 text-amber-405' :
                      'bg-emerald-500/10 text-emerald-405'
                    }`}>{t.status}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Panel */}
            <div className="lg:col-span-7">
              {selectedTicketId && activeTicket ? (
                <div className="p-6 rounded-2xl glass-card border border-blue-500/20 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
                    <div>
                      <h4 className="font-bold text-white">{activeTicket.subject}</h4>
                      <span className="text-[10px] text-slate-500">Contact Email: {activeTicket.email}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateTicketStatus(activeTicket.id, 'Resolved')}
                        className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-bold uppercase text-[9px]"
                      >
                        Resolve Ticket
                      </button>
                      <button
                        onClick={() => setSelectedTicketId(null)}
                        className="text-slate-500 hover:text-white"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {activeTicket.messages.map((msg, idx) => (
                      <div key={idx} className={`p-3 rounded-xl max-w-[85%] text-xs ${
                        msg.sender === 'agent' 
                          ? 'bg-blue-600/10 border border-blue-500/20 ml-auto text-right' 
                          : 'bg-slate-950 border border-slate-850 mr-auto text-left'
                      }`}>
                        <div className="font-bold text-[9px] text-slate-500 mb-0.5">{msg.sender === 'agent' ? 'Agent Support' : 'Customer'}</div>
                        <p className="text-slate-205 leading-relaxed">{msg.text}</p>
                        <span className="text-[8px] text-slate-550 block mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Reply Form */}
                  <form onSubmit={handleSendTicketReply} className="flex gap-2 border-t border-slate-850 pt-3">
                    <input
                      type="text"
                      required
                      placeholder="Type reply as Support Agent..."
                      value={ticketReplyText}
                      onChange={(e) => setTicketReplyText(e.target.value)}
                      className="flex-grow bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <button type="submit" className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="p-10 rounded-2xl bg-slate-950/40 border border-slate-850 text-center text-xs text-slate-500">
                  Select an active support ticket from the log index to reply.
                </div>
              )}
            </div>

          </div>
        )}

        {/* 6. COUPONS MANAGER */}
        {activeTab === 'coupons' && hasTabAccess('coupons') && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Create Coupon */}
            <div className="md:col-span-5 p-6 rounded-2xl bg-slate-950 border border-slate-850 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Create Discount Rule</h3>
              <form onSubmit={handleAddCoupon} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MONSOON20"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-250 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Discount % *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={100}
                      value={newCouponDiscount}
                      onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Min Spend *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={newCouponMinSpend}
                      onChange={(e) => setNewCouponMinSpend(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all">
                  Add Coupon Code
                </button>
              </form>
            </div>

            {/* Active Coupons List */}
            <div className="md:col-span-7 p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Store Coupon List</h3>
              
              <div className="space-y-3 text-xs">
                {coupons.map((c) => (
                  <div key={c.code} className="p-4 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-emerald-450 text-sm">{c.code}</span>
                      <div className="text-slate-400 text-[10px]">{c.description}</div>
                    </div>
                    <button onClick={() => deleteCoupon(c.code)} className="p-2 text-slate-500 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 7. AUDIT LOGS */}
        {activeTab === 'logs' && hasTabAccess('logs') && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Platform Security & Audit Logs</h3>
              <button
                onClick={clearAuditLogs}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-[10px] font-bold border border-slate-700 transition-all text-slate-350"
              >
                Clear Log history
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 text-[11px] font-mono text-slate-400 space-y-2 max-h-[450px] overflow-y-auto shadow-inner">
              {auditLogs.slice().reverse().map((log) => (
                <div key={log.id} className="hover:bg-slate-900/30 py-1 border-b border-slate-900 last:border-0 flex justify-between">
                  <span>
                    <span className="text-slate-600 mr-2">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className="text-amber-500 font-bold mr-1">[{log.userRole.toUpperCase()}]</span>
                    <span className="text-slate-200">{log.actionMessage}</span>
                  </span>
                  <span className="text-slate-700 text-[9px]">{log.userEmail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modal for Adding New Product Kit */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Add New Product Kit</h3>
            
            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Kit Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Drone Automation Kit"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Category *</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none"
                  >
                    <option value="Arduino">Arduino</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Robotics">Robotics</option>
                    <option value="IoT">IoT</option>
                    <option value="PCB Design">PCB Design</option>
                    <option value="Analog Kits">Analog Kits</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Initial Stock *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Short Description *</label>
                <textarea
                  required
                  placeholder="Summarize components or learning goals in one sentence..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-350 text-[10px] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px]"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
