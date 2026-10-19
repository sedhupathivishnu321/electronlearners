import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone, Clock, LifeBuoy, MessageCircle } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { SocialButtons } from '../ui/SocialButtons';
import { COMPANY, CONTACT_EMAIL, PHONE_URL, SUPPORT_EMAIL, WHATSAPP_NUMBER_DISPLAY, WHATSAPP_URL } from '../../data/siteConfig';

const linkCls = 'hover:text-blue-500 hover:underline transition-colors';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 bg-white/70 text-sm border-t border-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Company */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-10 flex items-center justify-center p-1.5 rounded-xl bg-white border border-slate-300">
                <Logo size="sm" />
              </div>
              <span className="text-xl font-heading font-bold">
                JR<span className="text-blue-500">Learners</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500 max-w-sm">{COMPANY.description}</p>
            <div className="text-xs space-y-1 text-slate-500">
              {COMPANY.legalName && <p><span className="font-semibold">Legal name:</span> {COMPANY.legalName}</p>}
              {COMPANY.gstin && <p><span className="font-semibold">GSTIN:</span> {COMPANY.gstin}</p>}
              {COMPANY.registration && <p><span className="font-semibold">Registration:</span> {COMPANY.registration}</p>}
            </div>
            <div className="pt-1 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Follow us</p>
              <SocialButtons size="sm" />
            </div>
          </div>

          {/* Shop & learn */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4 font-heading">Shop &amp; Learn</h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li><Link href="/products" className={linkCls}>The 8 Kits</Link></li>
              <li><Link href="/products/prod-9" className={linkCls}>All-in-One Kit</Link></li>
              <li><Link href="/projects" className={linkCls}>400 Projects</Link></li>
              <li><Link href="/simulator" className={linkCls}>Arduino Simulator</Link></li>
              <li><Link href="/custom-project" className={linkCls}>Customized Projects</Link></li>
              <li><Link href="/courses" className={linkCls}>Courses</Link></li>
              <li><Link href="/downloads" className={linkCls}>Downloads</Link></li>
              <li><Link href="/schools" className={linkCls}>Schools &amp; Bulk Orders</Link></li>
            </ul>
          </div>

          {/* Company & policies */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4 font-heading">Company &amp; Policies</h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li><Link href="/about" className={linkCls}>About JR Learners</Link></li>
              <li><Link href="/contact" className={linkCls}>Contact Us</Link></li>
              <li><Link href="/support" className={linkCls}>Support &amp; Help</Link></li>
              <li><Link href="/policies" className={linkCls}>All Policies</Link></li>
              <li><Link href="/terms" className={linkCls}>Terms of Service</Link></li>
              <li><Link href="/privacy" className={linkCls}>Privacy Policy</Link></li>
              <li><Link href="/refund" className={linkCls}>Refund &amp; Cancellation</Link></li>
              <li><Link href="/shipping" className={linkCls}>Shipping &amp; Delivery</Link></li>
              <li><Link href="/cookie" className={linkCls}>Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4 font-heading">Contact &amp; Support</h4>
            <ul className="space-y-3 text-xs text-slate-500">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
                <span><span className="block font-semibold">General enquiries</span><a href={`mailto:${CONTACT_EMAIL}`} className={linkCls}>{CONTACT_EMAIL}</a></span>
              </li>
              <li className="flex items-start gap-2.5">
                <LifeBuoy className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                <span><span className="block font-semibold">Help &amp; order support</span><a href={`mailto:${SUPPORT_EMAIL}`} className={linkCls}>{SUPPORT_EMAIL}</a></span>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 mt-0.5 shrink-0 text-green-500" />
                <span><span className="block font-semibold">WhatsApp</span><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={linkCls}>{WHATSAPP_NUMBER_DISPLAY}</a></span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-cyan-500" />
                <span><span className="block font-semibold">Call</span><a href={PHONE_URL} className={linkCls}>{WHATSAPP_NUMBER_DISPLAY}</a></span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
                <span><span className="block font-semibold">Address</span>{COMPANY.address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" />
                <span><span className="block font-semibold">Support hours</span>{COMPANY.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-300 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {COMPANY.legalName || COMPANY.name}. All rights reserved. Made in India.</p>
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link href="/terms" className={linkCls}>Terms</Link>
            <Link href="/privacy" className={linkCls}>Privacy</Link>
            <Link href="/refund" className={linkCls}>Refunds</Link>
            <Link href="/shipping" className={linkCls}>Shipping</Link>
            <Link href="/cookie" className={linkCls}>Cookies</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};
