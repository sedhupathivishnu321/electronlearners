import React, { useState } from 'react';
import { PRODUCTS_DATA, STEMProduct } from '../../data/productsData';
import { COURSES_DATA } from '../../data/coursesData';
import { YOUTUBE_TUTORIALS } from '../../data/youtubeData';
import { PROJECTS_DATA } from '../../data/projectsData';
import { BLOGS_DATA } from '../../data/blogsData';
import { 
  Shield, TrendingUp, DollarSign, ShoppingBag, Users, Cpu, BookOpen, Youtube, 
  Layers, FileText, Tag, Activity, Settings, Plus, Edit, Trash2, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'courses' | 'youtube' | 'users' | 'coupons' | 'logs'>('analytics');
  
  // Local state for live admin CRUD on 20 products
  const [productsList, setProductsList] = useState<STEMProduct[]>(PRODUCTS_DATA);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState(1999);
  const [newProductCategory, setNewProductCategory] = useState<'Arduino' | 'Electronics' | 'Robotics' | 'IoT' | 'Raspberry Pi' | 'AI' | 'PCB' | 'Embedded'>('Arduino');

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newKit: STEMProduct = {
      id: `prod-${Date.now()}`,
      name: newProductName,
      slug: newProductName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newProductCategory,
      price: Number(newProductPrice),
      originalPrice: Number(newProductPrice) + 500,
      rating: 5.0,
      reviewsCount: 1,
      stock: 50,
      badge: "NEW",
      image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80",
      shortDesc: "Newly created STEM hardware kit.",
      description: "Custom STEM kit added via Enterprise Admin Panel.",
      learningObjectives: ["Understand custom hardware"],
      components: [{ name: "Main Controller Board", quantity: 1 }],
      specifications: { "Voltage": "5V DC" },
      assemblySteps: ["Unpack kit", "Power up via USB"],
      manualUrl: "/downloads/manuals/Arduino_Starter_Kit_Guide.pdf",
      datasheetUrl: "/downloads/datasheets/ATmega328P_Datasheet.pdf",
      videoUrl: "https://www.youtube.com/watch?v=nL34zDTPkcs",
      faqs: []
    };
    setProductsList([newKit, ...productsList]);
    setShowAddProductModal(false);
    setNewProductName('');
    alert(`Successfully created "${newKit.name}" in catalog!`);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this STEM Product Kit?")) {
      setProductsList(productsList.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white font-heading">Enterprise Admin Control Panel</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase">SuperAdmin</span>
            </div>
            <p className="text-slate-400 text-xs">ElectronLearners Platform Master Management • Version 2026.1</p>
          </div>
        </div>

        <button onClick={() => alert("All system caches & database connections cleared!")} className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700">
          <RefreshCw className="w-4 h-4 text-cyan-400" /> Refresh System Cache
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-4 text-xs font-semibold overflow-x-auto">
        {[
          { key: 'analytics', label: 'Analytics & Revenue', icon: TrendingUp },
          { key: 'products', label: `Products & Kits (${productsList.length})`, icon: Cpu },
          { key: 'courses', label: `Courses (${COURSES_DATA.length})`, icon: BookOpen },
          { key: 'youtube', label: `YouTube Sync (@LetsGetEngagedin)`, icon: Youtube },
          { key: 'users', label: 'Users & Roles', icon: Users },
          { key: 'coupons', label: 'Coupons & Discounts', icon: Tag },
          { key: 'logs', label: 'Audit Logs & Backup', icon: Activity }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'border-amber-400 text-amber-400 bg-amber-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT 1: ANALYTICS & REVENUE */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          
          {/* KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Total Gross Sales</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-heading">₹12,48,500</div>
              <div className="text-[11px] text-emerald-400">+18.4% from last month</div>
            </div>

            <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Total Orders Fulfilled</span>
                <ShoppingBag className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-heading">1,420</div>
              <div className="text-[11px] text-blue-400">Shiprocket Express active</div>
            </div>

            <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Active Registered Users</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-heading">18,920</div>
              <div className="text-[11px] text-cyan-400">Students, Teachers, Schools</div>
            </div>

            <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Certificates Issued</span>
                <Activity className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-heading">3,850</div>
              <div className="text-[11px] text-amber-400">QR Code Verified</div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Orders Pipeline</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {[
                    { id: "EL-9041", name: "Alex Learner", item: "Arduino Starter Kit", price: "₹1,499", status: "In Transit" },
                    { id: "EL-9042", name: "Priya Sharma", item: "IoT ESP32 Kit", price: "₹1,899", status: "Delivered" },
                    { id: "EL-9043", name: "Delhi Public School", item: "Engineering Innovation Kit (x5)", price: "₹44,995", status: "Processing" }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="p-3 font-mono font-bold text-cyan-400">{row.id}</td>
                      <td className="p-3 text-white font-semibold">{row.name}</td>
                      <td className="p-3">{row.item}</td>
                      <td className="p-3 font-bold text-white">{row.price}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">{row.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT 2: PRODUCTS MANAGER (20 KITS CRUD) */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">STEM Hardware Products Catalog ({productsList.length})</h3>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Add New STEM Product Kit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productsList.map((product) => (
              <div key={product.id} className="p-4 rounded-xl glass-card border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3 truncate">
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-white truncate">{product.name}</h4>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase">{product.category} • ₹{product.price}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-slate-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: COURSES MANAGER */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">STEM Online Courses Engine</h3>
          <div className="space-y-3">
            {COURSES_DATA.map((c) => (
              <div key={c.id} className="p-4 rounded-xl glass-card border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white">{c.title}</h4>
                  <span className="text-slate-400">{c.category} • {c.lessonsCount} Lessons • ₹{c.price}</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">Published</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: YOUTUBE SYNC */}
      {activeTab === 'youtube' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">YouTube Integration (@LetsGetEngagedin)</h3>
              <p className="text-slate-400 text-xs">Sync video IDs, code downloads, and transcripts from channel.</p>
            </div>
            <a href="https://www.youtube.com/@LetsGetEngagedin" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5">
              <Youtube className="w-4 h-4" /> Open Channel
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {YOUTUBE_TUTORIALS.map((t) => (
              <div key={t.id} className="p-4 rounded-xl glass-card border border-slate-800 space-y-2 text-xs">
                <span className="text-[10px] text-red-400 font-bold uppercase">{t.category}</span>
                <h4 className="font-bold text-white">{t.title}</h4>
                <p className="text-slate-400 text-[11px]">Code File: {t.codeDownloadName}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: USERS & ROLES */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Role-Based Access Control (RBAC)</h3>
          <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3 text-xs text-slate-300">
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-white font-bold">Admin Accounts:</span>
              <span className="text-amber-400">admin@electronlearners.com (SuperAdmin)</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-2">
              <span className="text-white font-bold">Teacher Accounts:</span>
              <span className="text-cyan-400">teacher@school.edu.in (Teacher Portal Access)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white font-bold">Student Accounts:</span>
              <span className="text-blue-400">alex@electronlearners.com (Student Access)</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Discount Coupon Codes</h3>
          <div className="p-5 rounded-xl glass-card border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="font-mono font-bold text-emerald-400 text-sm">STEM10</span>
              <div className="text-slate-400">10% Off All 20 STEM Product Kits</div>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Active</span>
          </div>
        </div>
      )}

      {/* TAB CONTENT 7: LOGS & BACKUP */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">System Security & Audit Logs</h3>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 space-y-2 max-h-64 overflow-y-auto">
            <div>[2026-07-26 11:28:01] INFO: System started successfully. PostgreSQL connection healthy.</div>
            <div>[2026-07-26 11:28:05] INFO: JWT secret verified. Role-based middleware loaded.</div>
            <div>[2026-07-26 11:28:10] INFO: YouTube channel @LetsGetEngagedin tutorial feed initialized.</div>
          </div>
        </div>
      )}

      {/* Modal for Adding New Product Kit */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Add New STEM Kit</h3>
            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Kit Name</label>
                <input type="text" required value={newProductName} onChange={(e) => setNewProductName(e.target.value)} placeholder="e.g. 21. Quantum Electronics Kit" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Price (₹)</label>
                <input type="number" required value={newProductPrice} onChange={(e) => setNewProductPrice(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select value={newProductCategory} onChange={(e) => setNewProductCategory(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300">
                  <option value="Arduino">Arduino</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Robotics">Robotics</option>
                  <option value="IoT">IoT</option>
                  <option value="AI">AI</option>
                </select>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-3">
                <button type="button" onClick={() => setShowAddProductModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold">Save STEM Kit</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
