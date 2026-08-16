import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { User, BookOpen, ShoppingBag, Award, Heart, Shield, CheckCircle, ExternalLink, QrCode, FileText, Download, Code, MessageSquare, Clock, HelpCircle, Package, ArrowRight } from 'lucide-react';

export default function StudentDashboard() {
  const router = useRouter();
  const { user, wishlist, toggleWishlist, addToCart, orders, supportTickets } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'orders' | 'tickets' | 'wishlist'>('overview');

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.tab) {
      setActiveTab(router.query.tab as any);
    }
  }, [router.isReady, router.query]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">Please Sign In</h2>
        <p className="text-slate-400 text-xs">You must be logged in to view your orders, courses, and certificates.</p>
        <Link href="/login" className="inline-block px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow">
          Sign In
        </Link>
      </div>
    );
  }

  // Filter entities for user
  const userOrders = orders.filter(o => o.customerEmail.toLowerCase() === user.email.toLowerCase());
  const userTickets = supportTickets.filter(t => t.email.toLowerCase() === user.email.toLowerCase());

  // Mock enrolled courses matching user profile IDs
  const enrolledCourses = [
    { id: "course-1", title: "Basic Electronics Mastery", category: "Electronics", duration: "12 Hours", progress: 85, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop&q=80" },
    { id: "course-2", title: "Arduino Fundamentals", category: "Arduino", duration: "18 Hours", progress: 40, image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=200&auto=format&fit=crop&q=80" }
  ].filter(c => user.enrolledCourseIds.includes(c.id));

  // Determine order status index for timeline
  const getStatusIndex = (status: string) => {
    if (status === 'Placed') return 0;
    if (status === 'Processing') return 1;
    if (status === 'Shipped') return 2;
    if (status === 'Delivered') return 3;
    return 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-transparent text-slate-100">
      
      {/* Profile Header */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold font-heading shadow-lg shadow-blue-500/20">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white font-heading">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                {user.role}
              </span>
            </div>
            <p className="text-slate-400 text-xs">{user.email} • {user.institution || "Independent Maker"}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {user.role === 'admin' && (
            <Link href="/admin" className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700">
              <Shield className="w-4 h-4 text-cyan-400" /> Admin Panel
            </Link>
          )}
          <Link href="/certificates" className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow">
            <Award className="w-4 h-4" /> My Certificates
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-6 text-xs font-semibold overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'overview', label: 'Maker Overview', icon: User },
          { key: 'courses', label: `My Courses (${enrolledCourses.length})`, icon: BookOpen },
          { key: 'orders', label: `Order History (${userOrders.length})`, icon: ShoppingBag },
          { key: 'tickets', label: `Support Tickets (${userTickets.length})`, icon: MessageSquare },
          { key: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: Heart }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-3 border-b-2 whitespace-nowrap flex items-center gap-2 transition-all ${
              activeTab === tab.key ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="space-y-8">
        
        {/* OVERVIEW PANEL */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Quick Summary Stats */}
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Courses</span>
                  <div className="text-xl font-bold text-cyan-400 font-heading">{enrolledCourses.length}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Orders Placed</span>
                  <div className="text-xl font-bold text-blue-400 font-heading">{userOrders.length}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Certificates</span>
                  <div className="text-xl font-bold text-amber-400 font-heading">{user.certificates.length}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Wishlist Items</span>
                  <div className="text-xl font-bold text-red-400 font-heading">{wishlist.length}</div>
                </div>
              </div>

              {/* Recent Course */}
              <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recently Accessed Course</h3>
                {enrolledCourses.length > 0 ? (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <div className="flex items-center gap-3">
                      <img src={enrolledCourses[0].image} alt={enrolledCourses[0].title} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="space-y-1 text-xs">
                        <span className="text-[10px] text-cyan-400 font-bold uppercase">{enrolledCourses[0].category}</span>
                        <h4 className="font-bold text-white">{enrolledCourses[0].title}</h4>
                        <div className="w-32 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-cyan-500 h-full" style={{ width: `${enrolledCourses[0].progress}%` }}></div>
                        </div>
                        <p className="text-[10px] text-slate-500">{enrolledCourses[0].progress}% Complete</p>
                      </div>
                    </div>
                    <Link href={`/courses/${enrolledCourses[0].id}`} className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all">
                      Resume Lessons
                    </Link>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-4">No active courses. Explore catalog to enroll!</p>
                )}
              </div>
            </div>

            {/* Right: Issued Certificates List */}
            <div className="lg:col-span-4 p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Syllabus Certificates</h3>
              {user.certificates.length > 0 ? (
                <div className="space-y-3">
                  {user.certificates.map(cert => (
                    <div key={cert.id} className="p-4 rounded-xl bg-slate-950 border border-slate-850 text-xs space-y-2">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-mono text-amber-500">#{cert.id}</span>
                        <span className="text-slate-500">{cert.issueDate}</span>
                      </div>
                      <h4 className="font-bold text-white">{cert.courseTitle}</h4>
                      <Link href={`/verify-certificate/${cert.id}`} className="text-[10px] text-amber-450 hover:underline flex items-center gap-1">
                        <QrCode className="w-3.5 h-3.5" /> View Verification Link
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-4">Complete coursework to generate verify-ready certificates.</p>
              )}
            </div>

          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((c) => (
              <div key={c.id} className="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between shadow-lg">
                <img src={c.image} alt={c.title} className="w-full h-40 object-cover" />
                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] text-cyan-400 font-bold uppercase">{c.category} Course</span>
                    <h3 className="text-xs font-bold text-white line-clamp-1">{c.title}</h3>
                    <p className="text-[10px] text-slate-500">{c.duration}</p>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-[10px] text-slate-405">
                      <span>Course Progress</span>
                      <span>{c.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                      <div className="bg-cyan-500 h-full" style={{ width: `${c.progress}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="p-5 pt-0 border-t border-slate-850 mt-2">
                  <Link href={`/courses/${c.id}`} className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1 shadow mt-3">
                    Continue Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ORDERS TAB (TIMELINE & DOWNLOADABLE RESOURCES) */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {userOrders.length > 0 ? (
              userOrders.map((order) => {
                const stepIdx = getStatusIndex(order.status);
                const steps = ['Placed', 'Processing', 'Shipped', 'Delivered'];
                
                return (
                  <div key={order.id} className="p-6 rounded-2xl glass-card border border-slate-800 space-y-6 shadow-xl">
                    {/* Order Meta Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-850 pb-4 gap-2 text-xs">
                      <div>
                        <div className="text-white font-bold">Order ID: <span className="font-mono text-cyan-455">#{order.id}</span></div>
                        <div className="text-slate-500 text-[10px]">Placed on: {new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right sm:text-right">
                        <div className="text-slate-400">Total Paid: <span className="font-bold text-white">₹{order.total}</span></div>
                        <div className="text-[10px] text-slate-550">via {order.paymentMethod}</div>
                      </div>
                    </div>

                    {/* Timeline Visual Progress */}
                    <div className="space-y-3">
                      <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Shipping Status</div>
                      <div className="grid grid-cols-4 gap-2 relative pt-2">
                        {/* Connecting Line */}
                        <div className="absolute top-5 left-[12.5%] right-[12.5%] h-1 bg-slate-800 z-0">
                          <div
                            className="bg-emerald-500 h-full transition-all duration-550"
                            style={{ width: `${(stepIdx / 3) * 100}%` }}
                          ></div>
                        </div>

                        {steps.map((step, idx) => {
                          const isDone = idx <= stepIdx;
                          const isCurrent = idx === stepIdx;
                          return (
                            <div key={step} className="flex flex-col items-center relative z-10 text-center text-[10px]">
                              <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                                isDone 
                                  ? 'bg-emerald-600 border-emerald-500 text-white font-bold shadow shadow-emerald-600/20' 
                                  : 'bg-slate-950 border-slate-800 text-slate-600'
                              }`}>
                                {isDone ? '✓' : idx + 1}
                              </div>
                              <span className={`mt-2 font-bold uppercase tracking-wider ${
                                isCurrent ? 'text-blue-400 font-extrabold' : isDone ? 'text-slate-205' : 'text-slate-550'
                              }`}>{step}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Purchased Products & Downloadable Resources Funnel */}
                    <div className="border-t border-slate-850 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      {/* Products list */}
                      <div className="space-y-2">
                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Ordered Items</div>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                              <span className="text-slate-300 font-semibold">{item.productName}</span>
                              <span className="text-slate-500 font-bold">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Downloadable Guides/Codes */}
                      <div className="space-y-2">
                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Digital Resources (.pdf, .zip)</div>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => {
                            const isHardware = item.productName.toLowerCase().includes('kit') || item.productName.toLowerCase().includes('board') || item.productName.toLowerCase().includes('sensor');
                            if (!isHardware) return null;
                            
                            return (
                              <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-900 space-y-2">
                                <div className="font-semibold text-slate-400">{item.productName} Materials</div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => alert(`Downloading User Assembly Lab Manual for: ${item.productName}`)}
                                    className="flex-grow py-1.5 rounded bg-slate-900 hover:bg-blue-600 hover:text-white text-[9px] font-bold border border-slate-800 flex items-center justify-center gap-1 transition-all"
                                  >
                                    <FileText className="w-3 h-3 text-cyan-400" /> Manual
                                  </button>
                                  <button
                                    onClick={() => alert(`Downloading Verified Microcontroller Codes for: ${item.productName}`)}
                                    className="flex-grow py-1.5 rounded bg-slate-900 hover:bg-blue-600 hover:text-white text-[9px] font-bold border border-slate-800 flex items-center justify-center gap-1 transition-all"
                                  >
                                    <Code className="w-3 h-3 text-emerald-400" /> Code Pack
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 space-y-3 glass-card border border-slate-850 rounded-2xl">
                <Package className="w-12 h-12 text-slate-650 mx-auto" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">No Orders Found</h3>
                <p className="text-[10px] text-slate-405">Purchase any of our hardware kits to track shipping & access download manuals here.</p>
              </div>
            )}
          </div>
        )}

        {/* TICKETS TAB */}
        {activeTab === 'tickets' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Support Ticketing</h3>
              <Link href="/support" className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition-all shadow flex items-center gap-1">
                Open New Ticket <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {userTickets.length > 0 ? (
              <div className="space-y-3 text-xs">
                {userTickets.map(t => (
                  <div key={t.id} className="p-4 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-205">{t.subject}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">#{t.id} • Last Updated: {new Date(t.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        t.status === 'Open' ? 'bg-red-500/15 text-red-400' :
                        t.status === 'Waiting' ? 'bg-amber-500/15 text-amber-400' :
                        'bg-emerald-500/15 text-emerald-450'
                      }`}>{t.status}</span>
                      <Link href="/support" className="text-[10px] font-bold text-blue-450 hover:underline">
                        View Thread
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-550 py-4">No support inquiries opened. Use the form in support center to submit queries.</p>
            )}
          </div>
        )}

        {/* WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((p) => (
              <div key={p.id} className="glass-card rounded-2xl overflow-hidden border border-slate-850 flex flex-col justify-between shadow-md">
                <img src={p.image} alt={p.name} className="w-full h-36 object-cover" />
                <div className="p-4 space-y-2">
                  <span className="text-[9px] text-cyan-405 font-bold uppercase">{p.category}</span>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{p.name}</h4>
                  <div className="text-xs font-extrabold text-blue-400">₹{p.price}</div>
                </div>
                <div className="p-4 pt-0 border-t border-slate-850/80 mt-2 flex justify-between items-center">
                  <button onClick={() => toggleWishlist(p)} className="text-slate-500 hover:text-red-500 text-[10px] font-semibold transition-colors">
                    Remove
                  </button>
                  <button onClick={() => addToCart(p, 1)} className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition-all shadow flex items-center gap-1">
                    <ShoppingCart className="w-3.5 h-3.5" /> Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

