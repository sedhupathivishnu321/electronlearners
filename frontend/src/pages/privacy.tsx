import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-xs text-slate-300">
      <h1 className="text-3xl font-bold text-white font-heading">Privacy Policy</h1>
      <p>JR Learners ("we", "our", "us") values your privacy. This policy outlines how we handle personal data collected across our web platform and e-commerce store.</p>
      <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
      <p>We collect name, email address, shipping address, and phone number when you place an order for STEM product kits or register for online courses.</p>
      <h2 className="text-base font-bold text-white">2. Payment Security</h2>
      <p>Payment details are securely processed via Razorpay and Stripe with SSL encryption. We do not store raw credit card numbers on our servers.</p>
    </div>
  );
}
