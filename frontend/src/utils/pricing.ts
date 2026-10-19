// Display-side copy of the pricing rules. The server (worker/src/index.js) recalculates every order itself,
// so these numbers only preview what will be charged. Keep both in step.
export const GST_RATE = 0.18;               // added on the kit price after any coupon discount
export const SHIPPING_PUDUCHERRY = 50;      // delivery inside Puducherry (Pondicherry)
export const SHIPPING_STANDARD = 100;       // everywhere else in India

export function isPuducherry(state: string | undefined | null): boolean {
  const t = String(state || '').toLowerCase().replace(/[^a-z]/g, '');
  return t.includes('puducherry') || t.includes('pondicherry') || t === 'pondy' || t === 'py';
}

export function shippingFor(state: string | undefined | null): number {
  return isPuducherry(state) ? SHIPPING_PUDUCHERRY : SHIPPING_STANDARD;
}

export function computeTotals(subtotal: number, discount: number, state: string | undefined | null) {
  const taxable = Math.max(0, subtotal - discount);
  const tax = Math.round(taxable * GST_RATE);
  const shipping = subtotal > 0 ? shippingFor(state) : 0;
  return { subtotal, discount, taxable, tax, shipping, total: taxable + tax + shipping };
}

export const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Puducherry (Pondicherry)', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];
