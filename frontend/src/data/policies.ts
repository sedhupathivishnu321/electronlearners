import { COMPANY, CONTACT_EMAIL, SUPPORT_EMAIL, WHATSAPP_NUMBER_DISPLAY } from './siteConfig';

// Company policies shown at /terms, /privacy, /refund, /shipping, /cookie and listed at /policies.
// A block is a paragraph (string) or a bullet list ({ list: [...] }).
export type Block = string | { list: string[] };
export interface PolicySection { id: string; title: string; body: Block[] }
export interface Policy { slug: string; title: string; summary: string; sections: PolicySection[] }

const who = COMPANY.legalName || COMPANY.name;
const contactLine = `E-mail ${SUPPORT_EMAIL} (help and orders) or ${CONTACT_EMAIL} (general), WhatsApp ${WHATSAPP_NUMBER_DISPLAY}, ${COMPANY.hours}.`;

export const POLICIES: Policy[] = [
  {
    slug: 'terms',
    title: 'Terms of Service',
    summary: 'The rules for using our website, the simulator and for buying our kits.',
    sections: [
      { id: 'acceptance', title: '1. Acceptance of these terms', body: [
        `These terms apply to your use of the ${COMPANY.name} website (jrlearners.com), the ArduinoForge simulator, our project guides and downloads, and your purchase of our kits. By browsing, creating an account or placing an order you agree to them. If you do not agree, please do not use the site.`,
        `"We", "us" and "JR Learners" mean ${who}, ${COMPANY.address}.`] },
      { id: 'eligibility', title: '2. Who can use the site', body: [
        'You must be 18 or older to create an account and place an order. Younger learners are welcome to use the kits and the simulator under the supervision of a parent, guardian or teacher, who accepts these terms on their behalf. Schools and institutions ordering in bulk confirm that the person placing the order is authorised to do so.'] },
      { id: 'accounts', title: '3. Your account', body: [
        'An account is needed to place an order. Give accurate details and keep your password private. You are responsible for what happens under your account. Tell us at once if you suspect misuse.',
        'We may suspend or close an account that is used for fraud, abuse or in breach of these terms.'] },
      { id: 'orders', title: '4. Products, prices and orders', body: [
        'We sell the eight JR Learners Arduino kits (Level 1 to Level 8) and the All-in-One kit. Each kit lists its parts on its product page. Photographs and the simulator are illustrations; minor differences in the colour, make or model of equivalent components can occur.',
        'All prices are in Indian rupees (INR). The amount you pay is shown at checkout before you confirm: kit price, any coupon discount and shipping. Where GST applies it appears on the invoice. We recalculate every order on our servers, so the price shown at payment is the price that applies.',
        'An order is accepted when we confirm it by e-mail. We may cancel an order (with a full refund) if an item is unavailable, a price was shown wrongly, or we suspect fraud.',
        'Coupons are single-use offers with their own conditions (minimum spend, maximum discount, expiry). They cannot be combined unless stated and have no cash value.'] },
      { id: 'payment', title: '5. Payment', body: [
        'You can pay online through our payment partner PayU (UPI, cards, netbanking, wallets, EMI) or choose Cash on Delivery where offered. Card and bank details are entered on PayU\'s secure page; we never see or store them.',
        'An online order is confirmed only after PayU confirms the payment. If money is deducted but the order shows as failed or pending, it is normally returned automatically by the bank; contact us with your order reference if it is not.'] },
      { id: 'safety', title: '6. Safe use of kits', body: [
        'The kits contain small parts, wires, motors and electronic components. They are intended for learners aged 8 and over, and children should be supervised.',
        { list: [
          'Power projects only from a computer USB port or a low-voltage supply described in the project guide.',
          'Never connect any part of a kit directly to household mains electricity, except through a properly rated, insulated arrangement set up by a qualified adult (for example the relay examples).',
          'Keep small parts away from young children and do not put components in the mouth.',
          'Use the correct supply voltage: some modules, such as the RFID reader and radio modules, are damaged by 5 V.',
          'Stop and disconnect power if a part becomes hot, smells or smokes.'] }] },
      { id: 'content', title: '7. Guides, code and the simulator', body: [
        'Project guides, sketches, images, the ArduinoForge simulator and the website are owned by JR Learners or its licensors. You may use the sketches and guides for your own learning and for teaching in a classroom or club. You may not sell, republish or redistribute them, or reverse-engineer or copy the simulator, without our written permission.',
        'The simulator models circuits approximately. A circuit that works in the simulator may behave differently on real hardware because of component tolerances, wiring and power supply. Always check wiring and voltages on the real parts and follow the safety notes.',
        'Third-party libraries used by the sketches remain under their own licences.'] },
      { id: 'conduct', title: '8. Acceptable use', body: [
        { list: [
          'Do not attempt to break into, overload or disrupt the site, its accounts or its payment flow.',
          'Do not use automated tools to scrape the site or place orders.',
          'Do not submit false orders, misuse coupons, or post unlawful, abusive or infringing content in forms and tickets.'] }] },
      { id: 'liability', title: '9. No warranty, and limits of liability', body: [
        'Our kits, guides, code and the simulator are provided "as is". We do not give a separate product warranty. We do stand behind the delivery problems and defects described in our Refund & Cancellation Policy.',
        'To the extent the law allows, we are not liable for indirect or consequential loss, loss of data, or damage caused by using a kit in a way the guides do not describe (for example wrong voltage, or wiring to mains). Our total liability for any claim about an order is limited to the amount you paid for that order.',
        'Nothing in these terms limits any right you have under the Consumer Protection Act, 2019 or other law that cannot be excluded.'] },
      { id: 'links', title: '10. Links and third-party services', body: [
        'The site links to services we do not control, such as YouTube, PayU, social networks and courier tracking pages. Their content and policies are their own.'] },
      { id: 'law', title: '11. Governing law and disputes', body: [
        'These terms are governed by the laws of India. Courts at Villupuram, Tamil Nadu have jurisdiction, subject to any consumer-court rights you have where you live. Please contact us first at the addresses below; most problems are solved quickly that way.'] },
      { id: 'changes', title: '12. Changes', body: [
        'We may update these terms. The date at the top shows the latest version; using the site after a change means you accept it. Orders already placed stay under the terms that applied when you ordered.'] },
      { id: 'contact', title: '13. Contact', body: [contactLine] },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    summary: 'What personal data we collect, why, who sees it and how you can control it.',
    sections: [
      { id: 'intro', title: '1. Who we are', body: [
        `${who} ("we") runs jrlearners.com. This policy explains how we handle personal data under the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000. Contact for privacy matters: ${SUPPORT_EMAIL}.`] },
      { id: 'collect', title: '2. Data we collect', body: [
        { list: [
          'Account data: name, e-mail, phone number, role (student, teacher, school), institution (optional) and a salted hash of your password. We never store your password itself.',
          'Order data: items, amounts, payment status and method, delivery name, address, pincode, phone, e-mail and GSTIN if you give one. PayU processes your card, UPI or bank details; we receive only the payment result, mode and reference.',
          'Messages: what you write in the contact form, support tickets and bulk-quote requests, with your name and e-mail.',
          'Security data: your IP address and time of sign-in, registration and order events, kept in an audit log and used for rate limiting and fraud prevention.',
          'Course progress you save on your account (enrolled courses, certificates).'] },
        'We do not collect data from children knowingly without a parent or guardian\'s consent. Accounts are for adults (18+); learners under 18 use the site through a parent, teacher or school account.'] },
      { id: 'use', title: '3. Why we use it', body: [
        { list: [
          'To create and secure your account and sign you in.',
          'To process, deliver, support and (if needed) refund your orders, and send order and delivery updates.',
          'To answer your questions and complaints.',
          'To keep the site safe: detect fraud, abuse and repeated login attempts.',
          'To meet legal duties such as tax and accounting records.'] },
        'We process this data on the basis of your consent and to perform the contract of sale, and for legitimate and legally required purposes. We do not sell your data and we do not use it for third-party advertising.'] },
      { id: 'share', title: '4. Who we share it with', body: [
        { list: [
          'PayU (payment processing).',
          'Courier and delivery partners (name, address and phone, to deliver your order).',
          'Cloudflare (hosts our API and database) and GitHub (hosts the website).',
          'Google (sends our e-mails from our business Gmail account through Google Apps Script; YouTube videos and Google Fonts on some pages).',
          'Authorities, when the law requires us to.'] },
        'These providers may process data outside India. We share only what each needs to do its job.'] },
      { id: 'retention', title: '5. How long we keep it', body: [
        'Account data is kept while your account exists. Order and invoice records are kept for as long as accounting and tax law requires. Support messages are kept for as long as needed to resolve the matter and handle follow-up. Audit logs are kept for security purposes for a limited period. After that data is deleted or anonymised.'] },
      { id: 'security', title: '6. How we protect it', body: [
        'Passwords are stored only as salted PBKDF2 hashes. All traffic uses HTTPS. Sign-in tokens expire after 12 hours and stop working after a password change. Accounts lock for 15 minutes after five wrong passwords. Customers can see only their own orders, and administrator access is restricted. No system is perfectly secure; if a breach affecting you occurs we will tell you and the authorities as the law requires.'] },
      { id: 'rights', title: '7. Your rights', body: [
        { list: [
          'See what personal data we hold about you.',
          'Correct or update it.',
          'Ask us to delete it (we may need to keep order records the law requires).',
          'Withdraw consent for optional uses.',
          'Nominate someone to exercise these rights for you, and complain to our grievance officer, and to the Data Protection Board of India if you are not satisfied.'] },
        `To use these rights write to ${SUPPORT_EMAIL} from the e-mail on your account. We aim to reply within 7 working days.`] },
      { id: 'storage', title: '8. Cookies and local storage', body: [
        'We use browser storage to keep you signed in, remember your cart and wishlist, and for the site to work. We do not use advertising or tracking cookies. See the Cookie Policy for details.'] },
      { id: 'grievance', title: '9. Grievance officer', body: [
        `${COMPANY.grievanceOfficer}, ${COMPANY.address}. E-mail ${SUPPORT_EMAIL}. ${COMPANY.hours}.`] },
      { id: 'changes', title: '10. Changes', body: ['We will update this policy when our practices change and show the new date at the top. Significant changes will be announced on the site or by e-mail.'] },
    ],
  },
  {
    slug: 'refund',
    title: 'Refund & Cancellation Policy',
    summary: 'When you can cancel an order, return a kit or get your money back.',
    sections: [
      { id: 'cancel', title: '1. Cancelling an order', body: [
        'You can cancel an order before it is dispatched for a full refund. Write to us as soon as possible with your order reference. Once an order has shipped it can no longer be cancelled, but you may return it under section 2 or 3.'] },
      { id: 'problems', title: '2. Damaged, defective or wrong items', body: [
        'If your kit arrives damaged, with a missing or faulty part, or with the wrong items, tell us within 7 days of delivery at ' + SUPPORT_EMAIL + ' (or WhatsApp) with your order reference and clear photos of the parcel and the item.',
        'We will send the missing or replacement part, or replace the kit, or refund the affected amount, whichever you prefer where stock allows. We pay the return shipping when we ask for the item back. Keep the original packaging until the matter is settled.'] },
      { id: 'return', title: '3. Returning an unopened kit', body: [
        'You may return a kit within 7 days of delivery if it is unopened, unused, complete and in its original packaging. You pay the return shipping unless the return is our mistake. We refund the price of the kit once we receive and check it. Shipping charges paid at checkout are refunded only if the return is due to our error.'] },
      { id: 'nonreturn', title: '4. What cannot be returned or refunded', body: [
        { list: [
          'Kits or parts that were opened, assembled, soldered or used, except for defects reported under section 2.',
          'Parts damaged by misuse: wrong voltage or polarity, short circuits, connection to mains, physical damage.',
          'Items returned without prior approval, or after the 7-day window.',
          'Free digital content (project guides, sketches, simulator).'] },
        'Our kits are sold without a separate warranty. This policy is how we handle problems found on delivery.'] },
      { id: 'how', title: '5. How to start a return', body: [
        { list: [
          `E-mail ${SUPPORT_EMAIL} with your order reference, what is wrong and photos.`,
          'We reply within 2 working days with approval and return instructions. Please do not send anything back before approval.',
          'Pack the items safely with everything that came in the box. We inspect the return on arrival.'] }] },
      { id: 'refunds', title: '6. When and how refunds are paid', body: [
        { list: [
          'Online (PayU) payments are refunded to the original payment method within 5 to 7 working days after approval. Your bank may take a few more days to show it.',
          'Cash on Delivery orders are refunded by bank transfer or UPI to an account you give us, within 5 to 7 working days after approval.',
          'If an online payment fails or is charged twice, the amount is returned automatically by the bank or PayU, or by us on request with the transaction details.'] }] },
      { id: 'contact', title: '7. Contact', body: [contactLine] },
    ],
  },
  {
    slug: 'shipping',
    title: 'Shipping & Delivery Policy',
    summary: 'Where we deliver, how long it takes and what it costs.',
    sections: [
      { id: 'where', title: '1. Where we deliver', body: [
        'We deliver to addresses across India that our courier partners serve. We do not ship outside India at the moment. Cash on Delivery is offered where the courier supports it for your pincode; if it is not available the checkout will show online payment only.'] },
      { id: 'cost', title: '2. Shipping charges', body: [
        { list: [
          'Orders above Rs 1,500 ship free.',
          'Orders of Rs 1,500 or less pay Rs 50 shipping.',
          'The shipping amount is shown at checkout before you pay.'] }] },
      { id: 'time', title: '3. Processing and delivery time', body: [
        { list: [
          'Processing: we dispatch most orders within 1 to 2 working days of confirmation. Kits are packed and checked against the parts list first.',
          'Transit: usually 3 to 5 working days to metro cities and 5 to 9 working days to other locations, depending on the courier.',
          'These are estimates. Public holidays, weather, strikes and remote areas can add time.'] },
        'Orders placed after midday on a working day, or on Sundays and public holidays, are processed on the next working day.'] },
      { id: 'tracking', title: '4. Tracking', body: [
        'We e-mail you when your order moves to Packed, Shipped and Delivered. You can also follow the status in My Account → Order History. The courier sends a tracking link when the parcel ships.'] },
      { id: 'address', title: '5. Delivery address and delivery attempts', body: [
        'Please give a complete address with pincode and a phone number that will be reachable on delivery. We are not responsible for delay or non-delivery caused by an incorrect or incomplete address. If delivery fails repeatedly, or a Cash on Delivery parcel is refused, the parcel returns to us and we may charge the return shipping before sending it again.'] },
      { id: 'damage', title: '6. Damaged or lost parcels', body: [
        'Check the parcel when it arrives. If the outer packaging is damaged, please photograph it, ideally while opening it, and contact us within 7 days (see the Refund & Cancellation Policy). If a parcel is lost in transit, we will send a replacement or refund after the courier confirms the loss.'] },
      { id: 'contact', title: '7. Questions', body: [contactLine] },
    ],
  },
  {
    slug: 'cookie',
    title: 'Cookie Policy',
    summary: 'How the site uses cookies and your browser\'s storage.',
    sections: [
      { id: 'what', title: '1. What this covers', body: [
        'Cookies and similar technologies (local storage) are small pieces of data stored in your browser. This policy explains what jrlearners.com stores and why.'] },
      { id: 'we-use', title: '2. What we store', body: [
        { list: [
          'jrl_token (local storage): your signed sign-in token, so you stay signed in for up to 12 hours. Needed for the account to work.',
          'Cart, wishlist and catalogue version (local storage): keep your basket and the correct prices between visits.',
          'Short-lived preferences such as the simulator\'s saved view. No personal data.'] },
        'These are strictly necessary for the features you ask for. We do not use advertising cookies, and at the moment we run no analytics or tracking tools.'] },
      { id: 'third', title: '3. Third-party services', body: [
        { list: [
          'PayU: its payment pages set their own cookies to complete and secure the payment.',
          'YouTube and social links: opening a video or a social page may set cookies from those companies.',
          'Google Fonts: fonts are loaded from Google, which receives your IP address when the page loads.'] },
        'We do not control these cookies; see the providers\' own policies.'] },
      { id: 'control', title: '4. Your choices', body: [
        'You can clear local storage and cookies in your browser settings, or block them. If you do, you will be signed out and your cart will be emptied, and some features (sign-in, checkout) will not work.'] },
      { id: 'contact', title: '5. Questions', body: [`Write to ${SUPPORT_EMAIL}.`] },
    ],
  },
];

export const POLICY_BY_SLUG = Object.fromEntries(POLICIES.map((p) => [p.slug, p])) as Record<string, Policy>;
