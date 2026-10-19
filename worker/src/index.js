// JR Learners API on Cloudflare Workers + D1: accounts, orders (COD + PayU), enquiries, admin and e-mail notifications.
// Same routes as the Python backend in /backend, so the web site works with either.
import { KITS, KIT_BY_ID } from './catalog.js';

const API = '/api/v1';
const enc = new TextEncoder();

// ------------------------------------------------------------------------------------------------ helpers
const nowIso = () => new Date().toISOString();
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const unhex = (s) => new Uint8Array(s.match(/../g).map((h) => parseInt(h, 16)));
const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64uDecode = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
const sha512 = async (text) => hex(await crypto.subtle.digest('SHA-512', enc.encode(text)));
const sha256 = async (text) => hex(await crypto.subtle.digest('SHA-256', enc.encode(text)));

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

// ------------------------------------------------------------------------------------------------ passwords and tokens
const PBKDF2_ITER = 100000;          // the maximum Workers allow

async function pbkdf2(password, salt, iter) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: iter }, key, 256));
}
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${PBKDF2_ITER}$${hex(salt)}$${await pbkdf2(password, salt, PBKDF2_ITER)}`;
}
async function verifyPassword(password, stored) {
  try {
    const [, iter, salt, dk] = stored.split('$');
    return safeEqual(await pbkdf2(password, unhex(salt), parseInt(iter, 10)), dk);
  } catch { return false; }
}
let dummyHash = null;
async function burnVerify(password) {                // unknown e-mail: do the same work so timing does not reveal accounts
  dummyHash ??= await hashPassword('dummy-password-for-timing');
  await verifyPassword(password, dummyHash);
}
function passwordProblem(p) {
  if (p.length < 8) return 'Password must be at least 8 characters.';
  if (p.length > 128) return 'Password is too long (max 128 characters).';
  if (!/[A-Za-z]/.test(p) || !/[0-9]/.test(p)) return 'Password must contain at least one letter and one digit.';
  return null;
}

async function hmacKey(env) {
  return crypto.subtle.importKey('raw', enc.encode(env.SECRET_KEY), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
async function signToken(env, user) {
  const head = b64u(enc.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const iat = Math.floor(Date.now() / 1000);
  const body = b64u(enc.encode(JSON.stringify({ sub: String(user.id), role: user.role, tv: user.token_version, iat, exp: iat + 12 * 3600 })));
  const sig = b64u(await crypto.subtle.sign('HMAC', await hmacKey(env), enc.encode(`${head}.${body}`)));
  return `${head}.${body}.${sig}`;
}
async function readToken(env, token) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new HttpError(401, 'Your session has expired. Please sign in again.');
  const ok = await crypto.subtle.verify('HMAC', await hmacKey(env), b64uDecode(parts[2]), enc.encode(`${parts[0]}.${parts[1]}`));
  const claims = ok ? JSON.parse(new TextDecoder().decode(b64uDecode(parts[1]))) : null;
  if (!claims || claims.exp < Date.now() / 1000) throw new HttpError(401, 'Your session has expired. Please sign in again.');
  return claims;
}

// ------------------------------------------------------------------------------------------------ database
const one = (env, sql, ...args) => env.DB.prepare(sql).bind(...args).first();
const all = async (env, sql, ...args) => (await env.DB.prepare(sql).bind(...args).all()).results;
const run = (env, sql, ...args) => env.DB.prepare(sql).bind(...args).run();

const userById = (env, id) => one(env, 'SELECT * FROM users WHERE id=?', id);
const userByEmail = (env, email) => one(env, 'SELECT * FROM users WHERE email=?', email.trim().toLowerCase());
const publicUser = (u) => ({
  id: u.id, email: u.email, name: u.name, phone: u.phone, role: u.role, institution: u.institution,
  enrolledCourseIds: JSON.parse(u.enrolled_courses || '[]'), certificates: JSON.parse(u.certificates || '[]'), createdAt: u.created_at,
});
const audit = (env, userId, action, ip, detail = '') => run(env, 'INSERT INTO audit_log (ts,user_id,action,ip,detail) VALUES (?,?,?,?,?)', nowIso(), userId, action, ip, detail.slice(0, 500));

async function rateLimit(env, key, limit, windowS) {
  const now = Math.floor(Date.now() / 1000);
  await run(env, 'DELETE FROM rate_hits WHERE ts < ?', now - 3600);
  const row = await one(env, 'SELECT COUNT(*) n FROM rate_hits WHERE key=? AND ts > ?', key, now - windowS);
  if (row.n >= limit) throw new HttpError(429, 'Too many attempts. Please wait a few minutes and try again.');
  await run(env, 'INSERT INTO rate_hits (key, ts) VALUES (?,?)', key, now);
}

let schemaChecked = false;
async function ensureSchema(env) {
  if (schemaChecked) return;
  const col = await one(env, "SELECT COUNT(*) n FROM pragma_table_info('orders') WHERE name='tax'");
  if (col && col.n === 0) await run(env, 'ALTER TABLE orders ADD COLUMN tax REAL NOT NULL DEFAULT 0');
  const att = await one(env, "SELECT COUNT(*) n FROM pragma_table_info('mail_outbox') WHERE name='attach_id'");
  if (att && att.n === 0) await run(env, 'ALTER TABLE mail_outbox ADD COLUMN attach_id INTEGER');
  await run(env, `CREATE TABLE IF NOT EXISTS custom_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT, reference TEXT NOT NULL, user_id INTEGER, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
    organisation TEXT, project_type TEXT, title TEXT NOT NULL, description TEXT NOT NULL, platform TEXT, budget TEXT, deadline TEXT, link TEXT,
    file_name TEXT, file_mime TEXT, file_size INTEGER, ip TEXT, created_at TEXT NOT NULL)`);
  await run(env, 'CREATE TABLE IF NOT EXISTS attachment_chunks (request_id INTEGER NOT NULL, idx INTEGER NOT NULL, data TEXT NOT NULL, PRIMARY KEY (request_id, idx))');
  schemaChecked = true;
}

// the administrator account follows ADMIN_EMAIL / ADMIN_PASSWORD (checked cheaply with a marker, so no hashing per request)
async function ensureAdmin(env) {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD || passwordProblem(env.ADMIN_PASSWORD)) return;
  const marker = await sha256(`${env.ADMIN_EMAIL.toLowerCase()}|${env.ADMIN_PASSWORD}|${env.SECRET_KEY}`);
  const cur = await one(env, "SELECT v FROM meta WHERE k='admin_marker'");
  if (cur && cur.v === marker) return;
  const u = await userByEmail(env, env.ADMIN_EMAIL);
  const hash = await hashPassword(env.ADMIN_PASSWORD);
  if (!u) await run(env, "INSERT INTO users (email,name,phone,role,password_hash,created_at) VALUES (?,?,?,?,?,?)", env.ADMIN_EMAIL.trim().toLowerCase(), 'Administrator', '', 'admin', hash, nowIso());
  else await run(env, "UPDATE users SET password_hash=?, role='admin', token_version=token_version+1 WHERE id=?", hash, u.id);
  await run(env, "INSERT INTO meta (k,v) VALUES ('admin_marker',?) ON CONFLICT(k) DO UPDATE SET v=excluded.v", marker);
}

// ------------------------------------------------------------------------------------------------ mail (via a Google Apps Script web app that sends as help.jrlearners@gmail.com)
async function queueMail(env, to, subject, body, attachId = null) {
  const r = await run(env, 'INSERT INTO mail_outbox (to_addr,subject,body,created_at,attach_id) VALUES (?,?,?,?,?)', to, subject.slice(0, 200), body, nowIso(), attachId);
  return r.meta.last_row_id;
}
const notifyAdmin = (env, subject, body) => queueMail(env, env.ADMIN_NOTIFY_EMAIL || 'admin@jrlearners.com', `[JR Learners] ${subject}`, body);

async function loadAttachment(env, attachId) {
  const meta = await one(env, 'SELECT file_name, file_mime FROM custom_requests WHERE id=?', attachId);
  const chunks = await all(env, 'SELECT data FROM attachment_chunks WHERE request_id=? ORDER BY idx', attachId);
  if (!meta || !chunks.length) return null;
  return { name: meta.file_name, mime: meta.file_mime, data: chunks.map((c) => c.data).join('') };
}

async function flushMail(env) {
  if (!env.MAIL_WEBHOOK_URL) return 0;
  const rows = await all(env, "SELECT * FROM mail_outbox WHERE status='pending' AND attempts < 10 ORDER BY id LIMIT 20");
  let sent = 0;
  for (const m of rows) {
    try {
      const payload = { secret: env.MAIL_WEBHOOK_SECRET || '', to: m.to_addr, subject: m.subject, body: m.body };
      if (m.attach_id) {
        const att = await loadAttachment(env, m.attach_id);
        if (att) payload.attachment = att;
      }
      const res = await fetch(env.MAIL_WEBHOOK_URL, {
        method: 'POST', redirect: 'follow', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || out.ok !== true) throw new Error(out.error || `HTTP ${res.status}`);
      await run(env, "UPDATE mail_outbox SET status='sent', sent_at=?, attempts=attempts+1, last_error=NULL WHERE id=?", nowIso(), m.id);
      if (m.attach_id) await run(env, 'DELETE FROM attachment_chunks WHERE request_id=?', m.attach_id);   // the file now lives in the e-mail
      sent++;
    } catch (e) {
      const attempts = m.attempts + 1;
      await run(env, 'UPDATE mail_outbox SET attempts=?, last_error=?, status=? WHERE id=?', attempts, String(e.message).slice(0, 300), attempts >= 10 ? 'failed' : 'pending', m.id);
    }
  }
  return sent;
}

// ------------------------------------------------------------------------------------------------ validation
const EMAIL = /^[^@\s]{1,64}@[^@\s]+\.[^@\s]{2,}$/;
const PHONE = /^[0-9+\-\s]{8,16}$/;
function str(v, name, min, max) {
  if (typeof v !== 'string' || v.trim().length < min || v.length > max) throw new HttpError(422, `${name}: must be ${min}-${max} characters`);
  return v.trim();
}
function email(v, name = 'email') {
  if (typeof v !== 'string' || v.length > 120 || !EMAIL.test(v.trim())) throw new HttpError(422, `${name}: enter a valid e-mail address`);
  return v.trim();
}
function phone(v, name = 'phone') {
  if (typeof v !== 'string' || !PHONE.test(v)) throw new HttpError(422, `${name}: enter a valid phone number`);
  return v.trim();
}
function address(a) {
  if (!a || typeof a !== 'object') throw new HttpError(422, 'customer: missing');
  if (typeof a.zip !== 'string' || !/^[0-9]{6}$/.test(a.zip)) throw new HttpError(422, 'zip: enter a 6-digit pincode');
  return {
    name: str(a.name, 'name', 2, 60), email: email(a.email), phone: phone(a.phone), address: str(a.address, 'address', 5, 200),
    city: str(a.city, 'city', 2, 60), state: str(a.state, 'state', 2, 60), zip: a.zip, gstin: a.gstin ? String(a.gstin).slice(0, 15) : null,
  };
}

// ------------------------------------------------------------------------------------------------ pricing
const GST_RATE = 0.18;                                   // added on the kit price
const SHIPPING_PUDUCHERRY = 50;                         // delivery inside Puducherry (Pondicherry)
const SHIPPING_STANDARD = 100;                          // everywhere else in India
function isPuducherry(state) {
  const t = String(state || '').toLowerCase().replace(/[^a-z]/g, '');
  return t.includes('puducherry') || t.includes('pondicherry') || t === 'pondy' || t === 'py';
}
function priceCart(items, couponIn, state) {
  if (!Array.isArray(items) || items.length < 1 || items.length > 20) throw new HttpError(422, 'items: 1-20 lines required');
  const lines = [];
  let subtotal = 0;
  for (const it of items) {
    const kit = KIT_BY_ID[it?.id];
    if (!kit) throw new HttpError(400, `Unknown product ${it?.id}`);
    const q = Number(it.quantity);
    if (!Number.isInteger(q) || q < 1 || q > 20) throw new HttpError(422, 'quantity: 1-20');
    lines.push({ id: kit.id, name: kit.name, price: kit.price, quantity: q });
    subtotal += kit.price * q;
  }
  if (String(couponIn || '').trim()) throw new HttpError(400, 'Coupons are no longer available');
  const discount = 0, code = '';
  const taxable = Math.max(0, subtotal - discount);
  const tax = Math.round(taxable * GST_RATE);
  const shipping = isPuducherry(state) ? SHIPPING_PUDUCHERRY : SHIPPING_STANDARD;
  return { items: lines, subtotal, discount, tax, shipping, coupon: code, total: taxable + tax + shipping };
}

// ------------------------------------------------------------------------------------------------ PayU
const payuReady = (env) => !!(env.PAYU_KEY && env.PAYU_SALT);
const payuPayUrl = (env) => (env.PAYU_ENV === 'live' ? 'https://secure.payu.in/_payment' : 'https://test.payu.in/_payment');
const payuApiUrl = (env) => (env.PAYU_ENV === 'live' ? 'https://info.payu.in/merchant/postservice.php?form=2' : 'https://test.payu.in/merchant/postservice.php?form=2');

const payuRequestHash = (env, p) => sha512([env.PAYU_KEY, p.txnid, p.amount, p.productinfo, p.firstname, p.email, p.udf1 || '', p.udf2 || '', p.udf3 || '', p.udf4 || '', p.udf5 || '', '', '', '', '', '', env.PAYU_SALT].join('|'));
async function payuResponseHash(env, p) {
  let seq = [env.PAYU_SALT, p.status || '', '', '', '', '', '', p.udf5 || '', p.udf4 || '', p.udf3 || '', p.udf2 || '', p.udf1 || '', p.email || '', p.firstname || '', p.productinfo || '', p.amount || '', p.txnid || '', env.PAYU_KEY].join('|');
  if (p.additional_charges) seq = `${p.additional_charges}|${seq}`;
  return sha512(seq);
}
async function payuApi(env, command, var1, extra = {}) {
  const data = new URLSearchParams({ key: env.PAYU_KEY, command, var1, hash: await sha512(`${env.PAYU_KEY}|${command}|${var1}|${env.PAYU_SALT}`), ...extra });
  const res = await fetch(payuApiUrl(env), { method: 'POST', body: data, headers: { Accept: 'application/json' } });
  return JSON.parse(await res.text());
}

// ------------------------------------------------------------------------------------------------ orders
function orderView(o) {
  return {
    txnid: o.txnid, method: o.method, status: o.status, fulfilment: o.fulfilment, amount: o.amount, subtotal: o.subtotal, tax: o.tax || 0, shipping: o.shipping, discount: o.discount,
    coupon: o.coupon, items: JSON.parse(o.items), customer: JSON.parse(o.customer), payment_mode: o.payment_mode, created_at: o.created_at,
  };
}
const getOrder = (env, txnid) => one(env, 'SELECT * FROM orders WHERE txnid=?', txnid);
const newTxn = () => `JRL${Math.floor(Date.now() / 1000)}${hex(crypto.getRandomValues(new Uint8Array(4))).toUpperCase()}`;

async function createOrder(env, userId, method, status, cart, customer) {
  const txnid = newTxn();
  await run(env, 'INSERT INTO orders (txnid,user_id,method,status,amount,subtotal,tax,shipping,discount,coupon,items,customer,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    txnid, userId, method, status, cart.total, cart.subtotal, cart.tax, cart.shipping, cart.discount, cart.coupon, JSON.stringify(cart.items), JSON.stringify(customer), nowIso(), nowIso());
  return txnid;
}
async function updatePayment(env, txnid, status, payuId = '', mode = '', bankRef = '', error = '') {
  const r = await run(env, "UPDATE orders SET status=?, payu_id=?, payment_mode=?, bank_ref=?, error=?, updated_at=? WHERE txnid=? AND status NOT IN ('paid','refunded')", status, payuId, mode, bankRef, error, nowIso(), txnid);
  return r.meta.changes > 0;
}
function orderMail(o, u, headline) {
  const c = JSON.parse(o.customer);
  const items = JSON.parse(o.items);
  const lines = [headline, '='.repeat(headline.length), '', `Order reference : ${o.txnid}`, `Placed          : ${o.created_at}`,
    `Payment         : ${o.method === 'payu' ? 'PayU' : 'Cash on Delivery'}  (${o.status}${o.payment_mode ? ', ' + o.payment_mode : ''})`];
  if (o.payu_id) lines.push(`PayU payment id : ${o.payu_id}`);
  lines.push('', 'CUSTOMER', `  Account       : #${u.id}  ${u.email}`, `  Name          : ${c.name}`, `  E-mail        : ${c.email}`, `  Phone         : ${c.phone}`);
  if (c.gstin) lines.push(`  GSTIN         : ${c.gstin}`);
  lines.push('', 'SHIP TO', `  ${c.address}`, `  ${c.city}, ${c.state} ${c.zip}`, '', 'ITEMS');
  for (const it of items) lines.push(`  ${it.quantity} x ${it.name}  @ Rs ${it.price}  = Rs ${it.quantity * it.price}`);
  lines.push('', `  Subtotal : Rs ${o.subtotal}`, `  GST 18%  : Rs ${o.tax || 0}`, `  Shipping : Rs ${o.shipping}${isPuducherry(c.state) ? '  (Puducherry)' : ''}`, `  TOTAL    : Rs ${o.amount}`);
  return lines.join('\n');
}
async function announceOrder(env, txnid, what) {
  const o = await getOrder(env, txnid);
  const u = await userById(env, o.user_id);
  await notifyAdmin(env, `${what}: ${txnid} (Rs ${o.amount})`, orderMail(o, u, `${what.toUpperCase()} - ${txnid}`));
  await queueMail(env, u.email, `Your JR Learners order ${txnid}`, `${orderMail(o, u, 'Thank you for your order')}\n\nQuestions? Reply to help.jrlearners@gmail.com\n`);
}

async function applyPayuResult(env, p) {
  const txnid = p.txnid || '';
  const o = txnid ? await getOrder(env, txnid) : null;
  if (!o || !payuReady(env)) return 'invalid';
  const got = String(p.hash || '').toLowerCase();
  if (!got || !safeEqual(got, await payuResponseHash(env, p))) return 'invalid';
  if (Math.abs(parseFloat(p.amount || '0') - o.amount) > 0.01) { await updatePayment(env, txnid, 'failed', '', '', '', 'amount mismatch'); return 'invalid'; }
  if (p.status === 'success') {
    if (await updatePayment(env, txnid, 'paid', p.mihpayid || '', p.mode || '', p.bank_ref_num || '')) await announceOrder(env, txnid, 'Paid order');
    return 'paid';
  }
  await updatePayment(env, txnid, 'failed', p.mihpayid || '', p.mode || '', p.bank_ref_num || '', p.error_Message || p.error || 'payment failed');
  return 'failed';
}

// ------------------------------------------------------------------------------------------------ request handling
const clientIp = (req) => req.headers.get('cf-connecting-ip') || 'unknown';

function corsHeaders(env, req) {
  const origins = (env.CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const origin = req.headers.get('Origin');
  const h = { 'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS', 'Access-Control-Allow-Headers': 'Authorization, Content-Type', 'Access-Control-Max-Age': '86400', Vary: 'Origin' };
  if (origin && origins.includes(origin)) h['Access-Control-Allow-Origin'] = origin;
  return h;
}
const SEC = { 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'no-referrer', 'Cache-Control': 'no-store' };
const json = (data, status = 200, extra = {}) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...SEC, ...extra } });

async function body(req) {
  try { return await req.json(); } catch { throw new HttpError(422, 'Request body must be JSON'); }
}
async function formOrJson(req) {
  if ((req.headers.get('content-type') || '').includes('json')) {
    const d = await req.json();
    return Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v == null ? '' : String(v)]));
  }
  const f = await req.formData();
  return Object.fromEntries([...f.entries()].map(([k, v]) => [k, String(v)]));
}

async function currentUser(env, req) {
  const h = req.headers.get('Authorization') || '';
  if (!h.toLowerCase().startsWith('bearer ')) throw new HttpError(401, 'Please sign in to continue.');
  const claims = await readToken(env, h.slice(7));
  const u = await userById(env, parseInt(claims.sub, 10));
  if (!u || u.token_version !== claims.tv) throw new HttpError(401, 'Your session has expired. Please sign in again.');
  return u;
}
async function currentAdmin(env, req) {
  const u = await currentUser(env, req);
  if (u.role !== 'admin') throw new HttpError(403, 'Administrator access only.');
  return u;
}
const optionalUser = async (env, req) => { try { return await currentUser(env, req); } catch { return null; } };

async function route(req, env, ctx) {
  const url = new URL(req.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const m = req.method;
  const ip = clientIp(req);
  const origin = url.origin;

  if (path === '/' || path === '/health') return json({ status: 'ok', service: 'JR Learners API' });
  await ensureSchema(env);
  await ensureAdmin(env);

  if (m === 'GET' && path === `${API}/products`) return json({ count: KITS.length, products: KITS });
  if (m === 'GET' && path === `${API}/config`) return json({ payments: payuReady(env), environment: env.PAYU_ENV, mail: !!env.MAIL_WEBHOOK_URL, currency: 'INR' });
  if (m === 'GET' && path === `${API}/payments/config`) return json({ provider: 'payu', enabled: payuReady(env), environment: env.PAYU_ENV, currency: 'INR' });

  // ---- enquiries
  if (m === 'POST' && path === `${API}/inquiries`) {
    await rateLimit(env, `inq:${ip}`, 5, 600);
    const b = await body(req);
    if (!['contact', 'support', 'quote', 'feedback'].includes(b.kind)) throw new HttpError(422, 'kind: invalid');
    if (b.website) return json({ ok: true });                       // honeypot
    const me = await optionalUser(env, req);
    const name = str(b.name, 'name', 2, 80), mail = email(b.email), message = str(b.message, 'message', 3, 4000);
    const extra = b.extra && typeof b.extra === 'object' ? b.extra : {};
    await run(env, 'INSERT INTO inquiries (kind,user_id,name,email,phone,subject,message,extra,ip,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)',
      b.kind, me ? me.id : null, name, mail.toLowerCase(), b.phone ? String(b.phone).slice(0, 20) : null, b.subject ? String(b.subject).slice(0, 150) : null, message, JSON.stringify(extra).slice(0, 4000), ip, nowIso());
    const lines = [`Type    : ${b.kind}`, `Name    : ${name}`, `E-mail  : ${mail}`, `Phone   : ${b.phone || '-'}`, `Account : ${me ? `#${me.id} ${me.email}` : 'not signed in'}`, `Subject : ${b.subject || '-'}`, '', message];
    const ex = Object.entries(extra).slice(0, 30);
    if (ex.length) lines.push('', 'DETAILS', ...ex.map(([k, v]) => `  ${k}: ${v}`));
    await notifyAdmin(env, `${b.kind[0].toUpperCase()}${b.kind.slice(1)} from ${name}`, lines.join('\n'));
    return json({ ok: true });
  }

  // ---- customised project requests (details + optional file, e-mailed to the team)
  if (m === 'POST' && path === `${API}/custom-requests`) {
    await rateLimit(env, `custom:${ip}`, Number(env.CUSTOM_RATE_LIMIT) || 10, 3600);
    if (Number(req.headers.get('content-length') || 0) > 3_600_000) throw new HttpError(413, 'The upload is too large. Attach a file up to 2 MB or share a link instead.');
    const b = await body(req);
    if (b.website) return json({ ok: true, reference: 'CP-0000' });             // honeypot
    const name = str(b.name, 'name', 2, 80), mail = email(b.email), ph = phone(b.phone);
    const title = str(b.title, 'project title', 3, 150), desc = str(b.description, 'description', 10, 5000);
    if (b.consent !== true) throw new HttpError(422, 'consent: please tick the box to allow us to contact you');
    const opt = (v, max) => (v ? String(v).trim().slice(0, max) : null);
    const link = opt(b.link, 300);
    if (link && !/^https?:\/\//i.test(link)) throw new HttpError(422, 'link: must start with http:// or https://');
    let att = null;
    if (b.file) {
      const f = b.file;
      const fname = String(f.name || '').replace(/[^A-Za-z0-9._ -]/g, '_').slice(0, 100);
      const ext = (fname.split('.').pop() || '').toLowerCase();
      const TYPES = {
        pdf: 'application/pdf', txt: 'text/plain', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ppt: 'application/vnd.ms-powerpoint', pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      };
      if (!TYPES[ext]) throw new HttpError(422, 'file: only PDF, TXT, DOC, DOCX, PPT or PPTX files are accepted');
      const data = String(f.data || '').replace(/\s/g, '');
      if (!/^[A-Za-z0-9+/]+={0,2}$/.test(data.slice(0, 2000)) || data.length < 4) throw new HttpError(422, 'file: could not read the upload');
      const size = Math.floor((data.length * 3) / 4) - (data.endsWith('==') ? 2 : data.endsWith('=') ? 1 : 0);
      if (size > 2 * 1024 * 1024) throw new HttpError(413, 'file: the limit is 2 MB. Share a link to larger files instead.');
      const head = atob(data.slice(0, 16));
      const hex8 = [...head].map((c) => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
      const ok = ext === 'txt' || (ext === 'pdf' && head.startsWith('%PDF')) || ((ext === 'docx' || ext === 'pptx') && hex8.startsWith('504b')) || ((ext === 'doc' || ext === 'ppt') && hex8.startsWith('d0cf11e0'));
      if (!ok) throw new HttpError(422, 'file: the content does not match the file type');
      att = { name: fname, mime: TYPES[ext], data, size };
    }
    const me = await optionalUser(env, req);
    const reference = `CP-${Date.now().toString(36).toUpperCase()}${hex(crypto.getRandomValues(new Uint8Array(2))).toUpperCase()}`;
    const ins = await run(env, `INSERT INTO custom_requests (reference,user_id,name,email,phone,organisation,project_type,title,description,platform,budget,deadline,link,file_name,file_mime,file_size,ip,created_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, reference, me ? me.id : null, name, mail.toLowerCase(), ph, opt(b.organisation, 120), opt(b.projectType, 60), title, desc,
      opt(b.platform, 60), opt(b.budget, 60), opt(b.deadline, 20), link, att ? att.name : null, att ? att.mime : null, att ? att.size : null, ip, nowIso());
    const reqId = ins.meta.last_row_id;
    if (att) {
      for (let i = 0, idx = 0; i < att.data.length; i += 700000, idx++) await run(env, 'INSERT INTO attachment_chunks (request_id, idx, data) VALUES (?,?,?)', reqId, idx, att.data.slice(i, i + 700000));
    }
    const lines = [`CUSTOMISED PROJECT REQUEST ${reference}`, '='.repeat(40), '',
      `Name         : ${name}`, `E-mail       : ${mail}`, `Phone        : ${ph}`, `Organisation : ${opt(b.organisation, 120) || '-'}`,
      `Account      : ${me ? `#${me.id} ${me.email}` : 'not signed in'}`, '',
      `Project      : ${title}`, `Type         : ${opt(b.projectType, 60) || '-'}`, `Platform     : ${opt(b.platform, 60) || '-'}`,
      `Budget       : ${opt(b.budget, 60) || '-'}`, `Needed by    : ${opt(b.deadline, 20) || '-'}`, `Link         : ${link || '-'}`,
      `File         : ${att ? `${att.name} (${Math.round(att.size / 1024)} KB, attached)` : 'none'}`, '', 'DESCRIPTION', desc, '', `Received ${nowIso()} from ${ip}`];
    const team = env.CUSTOM_REQUEST_TO || env.ADMIN_NOTIFY_EMAIL || 'admin@jrlearners.com';
    await queueMail(env, team, `[JR Learners] Custom project request ${reference}: ${title}`.slice(0, 200), lines.join('\n'), att ? reqId : null);
    await queueMail(env, mail, `We received your project request ${reference}`, `Hi ${name},\n\nThank you for telling us about "${title}". Your reference is ${reference}. Our team will read it and reply to ${mail} (or call ${ph}) soon.\n\nQuestions? help.jrlearners@gmail.com\n`);
    await audit(env, me ? me.id : null, 'custom_request', ip, reference);
    ctx.waitUntil(flushMail(env));
    return json({ ok: true, reference }, 201);
  }

  // ---- accounts
  if (m === 'POST' && path === `${API}/auth/register`) {
    await rateLimit(env, `reg:${ip}`, 10, 3600);
    const b = await body(req);
    const name = str(b.name, 'name', 2, 60), mail = email(b.email), ph = phone(b.phone);
    const role = b.role ?? 'student';
    if (!['student', 'teacher', 'school'].includes(role)) throw new HttpError(422, 'role: invalid');
    if (typeof b.password !== 'string') throw new HttpError(422, 'password: required');
    const problem = passwordProblem(b.password);
    if (problem) throw new HttpError(422, problem);
    if (await userByEmail(env, mail)) throw new HttpError(409, 'An account with this e-mail already exists. Please sign in.');
    const inst = b.institution ? String(b.institution).slice(0, 100) : null;
    let id;
    try {
      id = (await run(env, 'INSERT INTO users (email,name,phone,role,institution,password_hash,created_at) VALUES (?,?,?,?,?,?,?)', mail.toLowerCase(), name, ph, role, inst, await hashPassword(b.password), nowIso())).meta.last_row_id;
    } catch (e) {
      if (/UNIQUE/i.test(String(e.message))) throw new HttpError(409, 'An account with this e-mail already exists. Please sign in.');
      throw e;
    }
    const u = await userById(env, id);
    await audit(env, id, 'register', ip);
    await notifyAdmin(env, `New account: ${u.name}`, ['A new user registered.', '', `Account id  : #${u.id}`, `Name        : ${u.name}`, `E-mail      : ${u.email}`, `Phone       : ${u.phone}`, `Role        : ${u.role}`, `Institution : ${u.institution || '-'}`, `Registered  : ${u.created_at}`, `IP address  : ${ip}`].join('\n'));
    await queueMail(env, u.email, 'Welcome to JR Learners', `Hi ${u.name},\n\nYour JR Learners account is ready. Sign in to order kits, track orders and follow the 400 project guides.\n\nNeed help? help.jrlearners@gmail.com\n`);
    return json({ access_token: await signToken(env, u), token_type: 'bearer', user: publicUser(u) }, 201);
  }

  if (m === 'POST' && path === `${API}/auth/login`) {
    const b = await body(req);
    const mail = String(b.email || '').trim().toLowerCase();
    await rateLimit(env, `login-ip:${ip}`, 20, 600);
    await rateLimit(env, `login-acct:${mail}`, 10, 600);
    const u = await userByEmail(env, mail);
    const generic = 'Incorrect e-mail or password.';
    if (!u) { await burnVerify(String(b.password || '')); await audit(env, null, 'login_failed', ip, mail.slice(0, 80)); throw new HttpError(401, generic); }
    if (u.locked_until > Date.now() / 1000) throw new HttpError(401, 'Too many failed attempts. This account is locked for a few minutes.');
    if (!(await verifyPassword(String(b.password || ''), u.password_hash))) {
      const failed = u.failed_logins + 1;
      const locked = failed >= 5 ? Date.now() / 1000 + 900 : 0;
      await run(env, 'UPDATE users SET failed_logins=?, locked_until=? WHERE id=?', locked ? 0 : failed, locked, u.id);
      await audit(env, null, 'login_failed', ip, mail.slice(0, 80));
      throw new HttpError(401, generic);
    }
    await run(env, 'UPDATE users SET failed_logins=0, locked_until=0, last_login_at=? WHERE id=?', nowIso(), u.id);
    await audit(env, u.id, 'login', ip);
    return json({ access_token: await signToken(env, u), token_type: 'bearer', user: publicUser(u) });
  }

  if (m === 'GET' && path === `${API}/auth/me`) {
    const u = await currentUser(env, req);
    const rows = await all(env, "SELECT items FROM orders WHERE user_id=? AND status IN ('paid','placed')", u.id);
    const ids = new Set();
    for (const r of rows) for (const it of JSON.parse(r.items)) ids.add(it.id);
    return json({ user: publicUser(u), purchasedProductIds: [...ids].sort() });
  }

  if (m === 'PUT' && path === `${API}/auth/profile`) {
    const u = await currentUser(env, req);
    const b = await body(req);
    if (Array.isArray(b.enrolled_courses)) await run(env, 'UPDATE users SET enrolled_courses=? WHERE id=?', JSON.stringify(b.enrolled_courses.slice(0, 50).map(String)), u.id);
    if (Array.isArray(b.certificates)) await run(env, 'UPDATE users SET certificates=? WHERE id=?', JSON.stringify(b.certificates.slice(0, 50)), u.id);
    return json({ user: publicUser(await userById(env, u.id)) });
  }

  if (m === 'POST' && path === `${API}/auth/change-password`) {
    const u = await currentUser(env, req);
    await rateLimit(env, `chpw:${u.id}`, 5, 600);
    const b = await body(req);
    if (!(await verifyPassword(String(b.current_password || ''), u.password_hash))) throw new HttpError(401, 'Current password is incorrect.');
    const problem = passwordProblem(String(b.new_password || ''));
    if (problem) throw new HttpError(422, problem);
    await run(env, 'UPDATE users SET password_hash=?, token_version=token_version+1 WHERE id=?', await hashPassword(b.new_password), u.id);
    await audit(env, u.id, 'password_changed', ip);
    return json({ access_token: await signToken(env, await userById(env, u.id)), token_type: 'bearer' });
  }

  // ---- orders and payments
  if (m === 'POST' && path === `${API}/orders/cod`) {
    const u = await currentUser(env, req);
    await rateLimit(env, `order:${u.id}`, 10, 600);
    const b = await body(req);
    const cust = address(b.customer);
    const cart = priceCart(b.items, b.coupon, cust.state);
    const txnid = await createOrder(env, u.id, 'cod', 'placed', cart, cust);
    await audit(env, u.id, 'order_cod', ip, txnid);
    await announceOrder(env, txnid, 'New COD order');
    ctx.waitUntil(flushMail(env));
    return json(orderView(await getOrder(env, txnid)), 201);
  }

  if (m === 'POST' && path === `${API}/payments/payu/initiate`) {
    const u = await currentUser(env, req);
    if (!payuReady(env)) throw new HttpError(503, 'Online payment is not configured on the server');
    await rateLimit(env, `order:${u.id}`, 10, 600);
    const b = await body(req);
    const cust = address(b.customer);
    const cart = priceCart(b.items, b.coupon, cust.state);
    const txnid = await createOrder(env, u.id, 'payu', 'pending', cart, cust);
    const clean = (s) => s.replace(/[^A-Za-z0-9 ]/g, '');
    const info = cart.items.map((l) => `${clean(l.name)} x${l.quantity}`).join(', ').slice(0, 100);
    const cb = `${origin}${API}/payments/payu/callback`;
    const fields = {
      key: env.PAYU_KEY, txnid, amount: cart.total.toFixed(2), productinfo: info, firstname: clean(cust.name).slice(0, 60) || 'Customer', email: cust.email,
      phone: cust.phone.replace(/[^0-9]/g, '').slice(-10), surl: cb, furl: cb, udf1: '', udf2: '', udf3: '', udf4: '', udf5: '',
      address1: cust.address.slice(0, 100), city: cust.city, state: cust.state, country: 'India', zipcode: cust.zip,
    };
    fields.hash = await payuRequestHash(env, fields);
    await audit(env, u.id, 'payu_initiated', ip, txnid);
    return json({ txnid, action: payuPayUrl(env), fields, totals: { subtotal: cart.subtotal, discount: cart.discount, tax: cart.tax, shipping: cart.shipping, total: cart.total } });
  }

  if (m === 'POST' && path === `${API}/payments/payu/callback`) {
    const p = await formOrJson(req);
    const state = await applyPayuResult(env, p);
    ctx.waitUntil(flushMail(env));
    return new Response(null, { status: 303, headers: { Location: `${env.FRONTEND_URL}/checkout/result/?txnid=${encodeURIComponent(p.txnid || '')}&status=${state}`, ...SEC } });
  }
  if (m === 'POST' && path === `${API}/payments/payu/webhook`) {
    const state = await applyPayuResult(env, await formOrJson(req));
    ctx.waitUntil(flushMail(env));
    return json({ ok: state !== 'invalid', state }, state === 'invalid' ? 400 : 200);
  }

  if (m === 'GET' && path === `${API}/orders`) {
    const u = await currentUser(env, req);
    return json({ orders: (await all(env, 'SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC LIMIT 200', u.id)).map(orderView) });
  }
  let mm;
  if (m === 'GET' && (mm = path.match(new RegExp(`^${API}/orders/([A-Za-z0-9]+)$`)))) {
    const u = await currentUser(env, req);
    const o = await getOrder(env, mm[1]);
    if (!o || (o.user_id !== u.id && u.role !== 'admin')) throw new HttpError(404, 'Order not found');
    return json(orderView(o));
  }
  if (m === 'POST' && (mm = path.match(new RegExp(`^${API}/payments/payu/verify/([A-Za-z0-9]+)$`)))) {
    const u = await currentUser(env, req);
    const o = await getOrder(env, mm[1]);
    if (!o || (o.user_id !== u.id && u.role !== 'admin') || o.method !== 'payu') throw new HttpError(404, 'Order not found');
    if (!payuReady(env)) throw new HttpError(503, 'Online payment is not configured on the server');
    await rateLimit(env, `verify:${u.id}`, 10, 600);
    let res;
    try { const r = await payuApi(env, 'verify_payment', o.txnid); res = (r.transaction_details || {})[o.txnid] || r; } catch (e) { throw new HttpError(502, `PayU verification failed: ${e.message}`); }
    const st = String(res.status || '').toLowerCase();
    if (st === 'success' && Math.abs(parseFloat(res.amt || res.amount || '0') - o.amount) < 0.01) {
      if (await updatePayment(env, o.txnid, 'paid', String(res.mihpayid || ''), String(res.mode || ''), String(res.bank_ref_num || ''))) { await announceOrder(env, o.txnid, 'Paid order'); ctx.waitUntil(flushMail(env)); }
    } else if (['failure', 'failed', 'usercancelled', 'dropped', 'bounced'].includes(st)) await updatePayment(env, o.txnid, 'failed', String(res.mihpayid || ''), '', '', st);
    return json({ txnid: o.txnid, payu_status: st, order_status: (await getOrder(env, o.txnid)).status });
  }

  // ---- admin
  if (m === 'GET' && path === `${API}/admin/orders`) {
    await currentAdmin(env, req);
    const rows = await all(env, 'SELECT o.*, u.email AS user_email, u.name AS user_name FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC LIMIT 500');
    return json({ orders: rows.map((o) => ({ ...orderView(o), user_email: o.user_email, user_name: o.user_name })) });
  }
  if (m === 'POST' && (mm = path.match(new RegExp(`^${API}/admin/orders/([A-Za-z0-9]+)/fulfilment$`)))) {
    const a = await currentAdmin(env, req);
    const b = await body(req);
    if (!['Ordered', 'Packed', 'Shipped', 'Delivered'].includes(b.value)) throw new HttpError(422, 'value: invalid');
    const r = await run(env, 'UPDATE orders SET fulfilment=?, updated_at=? WHERE txnid=?', b.value, nowIso(), mm[1]);
    if (!r.meta.changes) throw new HttpError(404, 'Order not found');
    const o = await getOrder(env, mm[1]);
    const c = JSON.parse(o.customer);
    await audit(env, a.id, 'fulfilment', ip, `${mm[1]}=${b.value}`);
    await queueMail(env, c.email, `Your JR Learners order ${mm[1]} is now ${b.value}`, `Hi ${c.name},\n\nYour order ${mm[1]} status: ${b.value}.\n\nQuestions? help.jrlearners@gmail.com\n`);
    ctx.waitUntil(flushMail(env));
    return json(orderView(o));
  }
  if (m === 'GET' && path === `${API}/admin/analytics`) {
    await currentAdmin(env, req);
    const o = await one(env, "SELECT COUNT(*) n, COALESCE(SUM(CASE WHEN status IN ('paid','placed') THEN amount END),0) rev, COALESCE(SUM(status='pending'),0) pend FROM orders");
    const u = await one(env, 'SELECT COUNT(*) n FROM users');
    const mail = await one(env, "SELECT COALESCE(SUM(status='pending'),0) p, COALESCE(SUM(status='failed'),0) f FROM mail_outbox");
    return json({ orders: o.n, revenue: Math.round(o.rev * 100) / 100, pending_payments: o.pend, users: u.n, mail_pending: mail.p, mail_failed: mail.f });
  }
  if (m === 'POST' && path === `${API}/admin/payments/payu/refund`) {
    const a = await currentAdmin(env, req);
    const b = await body(req);
    const o = await getOrder(env, String(b.txnid || ''));
    if (!o || o.status !== 'paid' || !o.payu_id) throw new HttpError(400, 'Only paid orders with a PayU payment id can be refunded');
    const amount = b.amount != null ? Number(b.amount) : o.amount;
    if (!(amount > 0) || amount > o.amount) throw new HttpError(400, 'Invalid refund amount');
    let res;
    try { res = await payuApi(env, 'cancel_refund_transaction', o.payu_id, { var2: `RF${Date.now()}`, var3: amount.toFixed(2) }); } catch (e) { throw new HttpError(502, `PayU refund failed: ${e.message}`); }
    if (String(res.status) === '1' && Math.abs(amount - o.amount) < 0.01) await run(env, "UPDATE orders SET status='refunded', updated_at=? WHERE txnid=?", nowIso(), o.txnid);
    await notifyAdmin(env, `Refund requested: ${o.txnid}`, `Refund of Rs ${amount.toFixed(2)} for ${o.txnid} by ${a.email}\nPayU answer: ${JSON.stringify(res).slice(0, 500)}`);
    ctx.waitUntil(flushMail(env));
    return json({ payu: res });
  }

  throw new HttpError(404, 'Not found');
}

export default {
  async fetch(req, env, ctx) {
    const cors = corsHeaders(env, req);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...cors, ...SEC } });
    let res;
    try {
      res = await route(req, env, ctx);
    } catch (e) {
      if (e instanceof HttpError) res = json({ detail: e.message }, e.status);
      else { console.error(e); res = json({ detail: 'Server error. Please try again.' }, 500); }
    }
    const out = new Response(res.body, res);
    for (const [k, v] of Object.entries(cors)) out.headers.set(k, v);
    return out;
  },
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(flushMail(env));
  },
};
