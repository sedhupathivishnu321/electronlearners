// End-to-end test of the Worker: starts `wrangler dev --local` (real workerd + local D1) and a fake mail webhook, then
// registers, signs in, orders (COD + PayU with signed callbacks), sends enquiries and checks the admin side and the e-mails.
// run: cd worker && npm install && npm test
import { spawn, spawnSync } from 'node:child_process';
import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const persist = fs.mkdtempSync(path.join(os.tmpdir(), 'jrl-d1-'));
const PORT = 8787, MAIL_PORT = 8799;
const sha512 = (s) => crypto.createHash('sha512').update(s).digest('hex');

// ---- fake Apps Script mail endpoint
const mails = [];
const mailServer = http.createServer((req, res) => {
  let b = '';
  req.on('data', (c) => (b += c));
  req.on('end', () => { const m = JSON.parse(b); if (m.secret === 'mail-secret') { mails.push(m); res.end(JSON.stringify({ ok: true })); } else res.end(JSON.stringify({ ok: false, error: 'bad secret' })); });
});
await new Promise((r) => mailServer.listen(MAIL_PORT, '127.0.0.1', r));

// ---- secrets for the local worker
fs.writeFileSync(path.join(root, '.dev.vars'), [
  'SECRET_KEY=test-secret-key-test-secret-key-1234', 'ADMIN_EMAIL=boss@test.com', 'ADMIN_PASSWORD=AdminPass123',
  'PAYU_KEY=k_test', 'PAYU_SALT=salt_test', 'PAYU_ENV=test', `MAIL_WEBHOOK_URL=http://127.0.0.1:${MAIL_PORT}/`, 'MAIL_WEBHOOK_SECRET=mail-secret',
].join('\n'));

const sh = (args) => spawnSync('npx', ['wrangler', ...args], { cwd: root, shell: true, encoding: 'utf8' });
const mig = sh(['d1', 'execute', 'DB', '--local', `--persist-to=${persist}`, '--file=schema.sql']);
assert.equal(mig.status, 0, mig.stdout + mig.stderr);

const dev = spawn('npx', ['wrangler', 'dev', '--local', `--persist-to=${persist}`, '--port', String(PORT)], { cwd: root, shell: true });
let log = '';
dev.stdout.on('data', (d) => (log += d));
dev.stderr.on('data', (d) => (log += d));
const stop = () => { spawnSync('taskkill', ['/F', '/T', '/PID', String(dev.pid)], { shell: true }); try { dev.kill(); } catch { /* gone */ } mailServer.close(); try { fs.unlinkSync(path.join(root, '.dev.vars')); } catch { /* gone */ } };

const base = `http://127.0.0.1:${PORT}`;
for (let i = 0; i < 90; i++) { try { if ((await fetch(base + '/health')).ok) break; } catch { /* not up yet */ } await new Promise((r) => setTimeout(r, 1000)); }

const A = '/api/v1';
const call = async (p, { method = 'GET', body, token, form, headers = {} } = {}) => {
  const h = { ...headers };
  if (token) h.Authorization = 'Bearer ' + token;
  let payload;
  if (form) { payload = new URLSearchParams(form); } else if (body !== undefined) { h['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }
  const r = await fetch(base + p, { method: body !== undefined || form ? (method === 'GET' ? 'POST' : method) : method, headers: h, body: payload, redirect: 'manual' });
  let data = null; try { data = await r.json(); } catch { /* no body */ }
  return { status: r.status, data, headers: r.headers };
};
let passed = 0;
const ok = (cond, what) => { assert.ok(cond, what); passed++; console.log('ok  ', what); };

try {
  assert.ok((await fetch(base + '/health')).ok, 'worker did not start:\n' + log.slice(-1500));
  const reg = { name: 'Asha Kumar', email: 'Asha@Example.com', phone: '9876543210', password: 'Secret123', role: 'student' };
  ok((await call(A + '/auth/register', { method: 'POST', body: { ...reg, password: 'short' } })).status === 422, 'short password rejected');
  ok((await call(A + '/auth/register', { method: 'POST', body: { ...reg, password: 'onlyletters' } })).status === 422, 'password without a digit rejected');
  let r = await call(A + '/auth/register', { method: 'POST', body: reg });
  ok(r.status === 201 && r.data.access_token, 'registration works');
  const tok = r.data.access_token;
  ok((await call(A + '/auth/register', { method: 'POST', body: reg })).status === 409, 'duplicate e-mail refused');
  ok((await call(A + '/auth/register', { method: 'POST', body: { ...reg, email: 'asha@example.com' } })).status === 409, 'e-mail match is case-insensitive');
  r = await call(A + '/auth/me', { token: tok });
  ok(r.data.user.email === 'asha@example.com' && !JSON.stringify(r.data).includes('password'), '/auth/me hides the hash');
  ok((await call(A + '/auth/me')).status === 401 && (await call(A + '/auth/me', { token: 'junk.junk.junk' })).status === 401, 'no / bad token -> 401');
  ok((await call(A + '/auth/login', { method: 'POST', body: { email: 'asha@example.com', password: 'Secret123' } })).status === 200, 'login works');
  for (let i = 0; i < 5; i++) await call(A + '/auth/login', { method: 'POST', body: { email: 'asha@example.com', password: 'wrong' + i } });
  r = await call(A + '/auth/login', { method: 'POST', body: { email: 'asha@example.com', password: 'Secret123' } });
  ok(r.status === 401 && /locked/.test(r.data.detail), 'account locks after 5 wrong passwords');

  const cust = { name: 'Asha Kumar', email: 'asha@example.com', phone: '9876543210', address: '12 Main Street', city: 'Chennai', state: 'TN', zip: '600001' };
  const aio = { items: [{ id: 'prod-9', quantity: 1 }], coupon: null, customer: cust };
  ok((await call(A + '/orders/cod', { method: 'POST', body: aio })).status === 401, 'ordering needs sign-in');
  r = await call(A + '/orders/cod', { method: 'POST', body: aio, token: tok });
  ok(r.status === 201 && r.data.subtotal === 7665 && r.data.tax === 1380 && r.data.shipping === 100 && r.data.amount === 9145, 'All-in-One COD order: 7665 + 18% GST 1380 + shipping 100 = Rs 9145');
  ok((await call(A + '/orders/cod', { method: 'POST', body: { ...aio, items: [{ id: 'prod-99', quantity: 1 }] }, token: tok })).status === 400, 'unknown product refused');
  ok((await call(A + '/orders/cod', { method: 'POST', body: { ...aio, coupon: 'NOPE' }, token: tok })).status === 400, 'bad coupon refused');
  ok((await call(A + '/orders/cod', { method: 'POST', body: { ...aio, customer: { ...cust, zip: '12' } }, token: tok })).status === 422, 'bad pincode refused');

  const two = { items: [{ id: 'prod-1', quantity: 1 }, { id: 'prod-2', quantity: 1 }], coupon: 'welcome10', customer: cust };
  r = await call(A + '/payments/payu/initiate', { method: 'POST', body: two, token: tok });
  ok(r.status === 200 && r.data.totals.discount === 194 && r.data.totals.tax === 314 && r.data.totals.shipping === 100 && r.data.totals.total === 2160, 'PayU initiate: (1940 - 194 coupon) + GST 314 + shipping 100 = Rs 2160');
  const f = r.data.fields;
  const expect = sha512(['k_test', f.txnid, f.amount, f.productinfo, f.firstname, f.email, '', '', '', '', '', '', '', '', '', '', 'salt_test'].join('|'));
  ok(f.hash === expect, 'PayU request hash is correct');
  ok(f.surl === `${base}${A}/payments/payu/callback`, 'callback URL uses the worker address');
  const resp = { txnid: f.txnid, status: 'success', amount: f.amount, productinfo: f.productinfo, firstname: f.firstname, email: f.email, mihpayid: '999', mode: 'UPI', udf1: '', udf2: '', udf3: '', udf4: '', udf5: '' };
  const rh = (p) => sha512(['salt_test', p.status, '', '', '', '', '', '', '', '', '', '', p.email, p.firstname, p.productinfo, p.amount, p.txnid, 'k_test'].join('|'));
  r = await call(A + '/payments/payu/callback', { form: { ...resp, hash: '0'.repeat(128) } });
  ok(r.status === 303 && /status=invalid/.test(r.headers.get('location')), 'tampered hash rejected');
  r = await call(A + '/payments/payu/callback', { form: { ...resp, amount: '1.00', hash: rh({ ...resp, amount: '1.00' }) } });
  ok(/status=invalid/.test(r.headers.get('location')), 'amount mismatch rejected');
  r = await call(A + '/payments/payu/callback', { form: { ...resp, hash: rh(resp) } });
  ok(r.status === 303 && /status=paid/.test(r.headers.get('location')), 'signed success callback marks the order paid');
  await call(A + '/payments/payu/callback', { form: { ...resp, hash: rh(resp) } });
  const other = (await call(A + '/auth/register', { method: 'POST', body: { ...reg, email: 'other@example.com', name: 'Other Person' } })).data.access_token;
  ok((await call(A + `/orders/${f.txnid}`, { token: other })).status === 404, "another user cannot read your order");
  r = await call(A + '/orders', { token: tok });
  ok(r.data.orders.length === 2 && new Set(r.data.orders.map((o) => o.status)).size === 2, 'order history lists both orders');
  r = await call(A + '/auth/me', { token: tok });
  ok(JSON.stringify(r.data.purchasedProductIds) === JSON.stringify(['prod-1', 'prod-2', 'prod-9']), 'purchased product ids are derived from orders');

  const q = { kind: 'contact', name: 'Visitor', email: 'v@example.com', message: 'Hello, question about kit 3', subject: 'Kit 3' };
  ok((await call(A + '/inquiries', { method: 'POST', body: q })).data.ok, 'contact form accepted');
  await call(A + '/inquiries', { method: 'POST', body: { ...q, website: 'http://spam.example' } });

  const ad = await call(A + '/auth/login', { method: 'POST', body: { email: 'boss@test.com', password: 'AdminPass123' } });
  ok(ad.status === 200 && ad.data.user.role === 'admin', 'admin account is created from the secrets');
  ok((await call(A + '/admin/orders', { token: tok })).status === 403, 'normal users cannot use admin routes');
  r = await call(A + '/admin/orders', { token: ad.data.access_token });
  ok(r.data.orders.length === 2, 'admin sees all orders');
  r = await call(A + `/admin/orders/${f.txnid}/fulfilment`, { method: 'POST', body: { value: 'Shipped' }, token: ad.data.access_token });
  ok(r.data.fulfilment === 'Shipped', 'admin can update delivery status');
  r = await call(A + '/admin/analytics', { token: ad.data.access_token });
  ok(r.data.orders === 2 && r.data.revenue === 11305 && r.data.users === 3, 'analytics: 2 orders, Rs 11305, 3 users');
  for (const st of ['Puducherry', 'pondicherry', ' PUDUCHERRY (UT) ']) {
    r = await call(A + '/payments/payu/initiate', { method: 'POST', body: { items: [{ id: 'prod-9', quantity: 1 }], coupon: null, customer: { ...cust, state: st } }, token: tok });
    ok(r.status === 200 && r.data.totals.shipping === 50 && r.data.totals.total === 7665 + 1380 + 50, `delivery to "${st.trim()}": shipping Rs 50, total Rs 9095`);
  }
  r = await call(A + '/payments/payu/initiate', { method: 'POST', body: { items: [{ id: 'prod-1', quantity: 2 }], coupon: null, customer: { ...cust, state: 'Tamil Nadu' } }, token: tok });
  ok(r.data.totals.shipping === 100 && r.data.totals.tax === Math.round(1696 * 0.18) && r.data.totals.total === 1696 + 305 + 100, 'outside Puducherry: shipping Rs 100, no free-shipping threshold');

  r = await call(A + '/auth/change-password', { method: 'POST', body: { current_password: 'Secret123', new_password: 'NewSecret456' }, token: tok });
  ok(r.status === 200, 'password change works');
  ok((await call(A + '/auth/me', { token: tok })).status === 401, 'old token is revoked after a password change');

  // mail: wait for the background sends
  for (let i = 0; i < 20 && mails.length < 10; i++) await new Promise((x) => setTimeout(x, 500));
  const toAdmin = mails.filter((m) => m.to === 'admin@jrlearners.com');
  const text = toAdmin.map((m) => m.subject + '\n' + m.body).join('\n');
  ok(toAdmin.length >= 5, `admin received ${toAdmin.length} notification mails`);
  for (const n of ['New account: Asha Kumar', 'New COD order', 'Paid order', 'Contact from Visitor', '12 Main Street', 'All-in-One Kit', 'asha@example.com']) ok(text.includes(n), `admin mail contains "${n}"`);
  ok(!text.includes('spam.example'), 'honeypot enquiry sent no mail');
  ok(mails.some((m) => m.to === 'asha@example.com' && /Your JR Learners order/.test(m.subject)), 'customer got an order confirmation');
  console.log(`\nALL OK (${passed} checks)`);
} catch (e) {
  console.error('\nFAILED:', e.message);
  console.error(log.slice(-1200));
  process.exitCode = 1;
} finally {
  stop();
  setTimeout(() => process.exit(process.exitCode || 0), 500);
}
