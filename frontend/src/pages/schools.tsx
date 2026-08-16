import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, ShieldCheck, Cpu, Users, Award, Mail, Phone, Calendar, ClipboardCheck } from 'lucide-react';

export default function SchoolPortal() {
  const { products, submitRFQ } = useApp();

  // Form States
  const [institutionName, setInstitutionName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [institutionType, setInstitutionType] = useState<'school' | 'college' | 'university' | 'training_center'>('school');
  const [selectedProduct, setSelectedProduct] = useState('Arduino Starter Kit');
  const [quantity, setQuantity] = useState(10);
  const [requiredDate, setRequiredDate] = useState('');
  const [gstDetails, setGstDetails] = useState('');
  const [requirements, setRequirements] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionName || !contactPerson || !email || !phone) return;

    // Estimate value based on matching product price
    const prodMatch = products.find(p => p.name.includes(selectedProduct)) || products[0];
    const estimatedValue = (prodMatch?.price || 1499) * quantity;

    submitRFQ({
      institutionName,
      contactPerson,
      email,
      phone,
      institutionType,
      products: [{ name: selectedProduct, quantity }],
      requiredDate,
      gstDetails,
      requirements,
      estimatedValue
    });

    // Reset Form
    setInstitutionName('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setRequiredDate('');
    setGstDetails('');
    setRequirements('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-transparent text-slate-100">
      
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-6">
        <span className="text-xs font-bold text-blue-450 uppercase tracking-widest">Institutional Partnerships</span>
        <h1 className="text-3xl font-heading font-extrabold text-white mt-1 uppercase">Schools & Colleges Solutions</h1>
        <p className="text-slate-400 text-xs mt-1">Get custom lab layouts, volume-discounted hardware kits, and dedicated support for your engineering/coding labs.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Info Grid */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
            <Building2 className="w-8 h-8 text-blue-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wide">Lab Setup Packages</h2>
            <p className="text-slate-350 text-xs leading-relaxed">
              We configure customized laboratory packages including solderless prototyping kits, microcontrollers, storage cases, and teacher reference manuals.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3 text-xs text-slate-300">
            <h3 className="font-bold text-white uppercase text-[10px] tracking-wider mb-2">Institutional Benefits</h3>
            <div className="flex items-center gap-2">✓ Bulk Volume Discounts (15% to 25% Off)</div>
            <div className="flex items-center gap-2">✓ Dynamic GST-Compliant Invoicing</div>
            <div className="flex items-center gap-2">✓ Custom Lab Manuals matching your syllabus</div>
            <div className="flex items-center gap-2">✓ Priority Technical Support Ticket Desk</div>
          </div>
        </div>

        {/* Right: Dynamic RFQ Form */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-blue-500" /> Request a Bulk Quote
            </h3>
            <p className="text-[10px] text-slate-450 mt-0.5">Submit your requirements below to generate an RFQ quotation record.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Institution Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PSG College of Technology"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Institution Type *</label>
                <select
                  value={institutionType}
                  onChange={(e) => setInstitutionType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-blue-500"
                >
                  <option value="school">Secondary/High School</option>
                  <option value="college">Engineering College</option>
                  <option value="university">State/Central University</option>
                  <option value="training_center">DIY Training Center</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Contact Person *</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Rajesh Patel"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Official Email *</label>
                <input
                  type="email"
                  required
                  placeholder="name@institution.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">GST details (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 29ABCDE1234F1Z5"
                  value={gstDetails}
                  onChange={(e) => setGstDetails(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Core Product *</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-350 focus:outline-none focus:border-blue-500"
                >
                  <option value="Arduino Starter Kit">Arduino Starter Kit</option>
                  <option value="Electronics Fundamentals Kit">Electronics Fundamentals Kit</option>
                  <option value="Sensor Explorer Kit">Sensor Explorer Kit</option>
                  <option value="IoT ESP32 Starter Kit">IoT ESP32 Starter Kit</option>
                  <option value="Robotics Beginner Kit">Robotics Beginner Kit</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Quantity *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Required Delivery Date *</label>
                <input
                  type="date"
                  required
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-350 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Additional Requirements / Customizations</label>
              <textarea
                rows={3}
                placeholder="Include details about syllabus mappings, shipping split instructions, or support needs..."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/10 transition-all uppercase tracking-wider"
            >
              Request Quote
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}

