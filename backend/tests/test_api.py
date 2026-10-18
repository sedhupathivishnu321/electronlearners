# Backend API test: node-free, run with `python backend/tests/test_api.py` (needs: pip install -r backend/requirements.txt aiosmtpd httpx)
import os, sys, tempfile, time, hashlib
tmp = tempfile.mkdtemp()
os.environ.update({"DATA_DIR": tmp, "ADMIN_EMAIL": "boss@test.com", "ADMIN_PASSWORD": "AdminPass123", "PAYU_KEY": "k_test", "PAYU_SALT": "salt_test", "PAYU_ENV": "test",
                   "SECRET_KEY": "x" * 40, "SMTP_HOST": "127.0.0.1", "SMTP_PORT": "8025", "SMTP_SECURITY": "none", "SMTP_FROM": "no-reply@jrlearners.com", "FRONTEND_URL": "http://localhost:3000"})
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from aiosmtpd.controller import Controller

received = []
class H:
    async def handle_DATA(self, server, session, envelope):
        received.append((envelope.rcpt_tos, envelope.content.decode('utf8', 'replace')))
        return '250 OK'
ctl = Controller(H(), hostname='127.0.0.1', port=8025); ctl.start()

from fastapi.testclient import TestClient
from app.main import app
from app import payu, mailer, db

with TestClient(app) as c:
    A = '/api/v1'
    reg = {"name": "Asha Kumar", "email": "Asha@Example.com", "phone": "9876543210", "password": "Secret123", "role": "student"}
    assert c.post(A + '/auth/register', json={**reg, "password": "short"}).status_code == 422
    assert c.post(A + '/auth/register', json={**reg, "password": "alllettersonly"}).status_code == 422
    r = c.post(A + '/auth/register', json=reg); assert r.status_code == 201, r.text
    tok = r.json()['access_token']; H1 = {"Authorization": "Bearer " + tok}
    assert c.post(A + '/auth/register', json=reg).status_code == 409                      # duplicate e-mail (case-insensitive)
    assert c.post(A + '/auth/register', json={**reg, "email": "asha@example.com"}).status_code == 409
    me = c.get(A + '/auth/me', headers=H1).json(); assert me['user']['email'] == 'asha@example.com' and 'password' not in str(me)
    assert c.get(A + '/auth/me').status_code == 401 and c.get(A + '/auth/me', headers={"Authorization": "Bearer junk"}).status_code == 401
    # db file holds a hash, never the password
    raw = open(os.path.join(tmp, 'jrlearners.db'), 'rb').read(); assert b'Secret123' not in raw
    # login + lockout
    assert c.post(A + '/auth/login', json={"email": "asha@example.com", "password": "Secret123"}).status_code == 200
    for i in range(5): c.post(A + '/auth/login', json={"email": "asha@example.com", "password": "wrong" + str(i)})
    r = c.post(A + '/auth/login', json={"email": "asha@example.com", "password": "Secret123"}); assert r.status_code == 401 and 'locked' in r.json()['detail'], r.text
    print('lockout ok')
    # orders need sign-in
    cust = {"name": "Asha Kumar", "email": "asha@example.com", "phone": "9876543210", "address": "12 Main Street", "city": "Chennai", "state": "TN", "zip": "600001"}
    body = {"items": [{"id": "prod-9", "quantity": 1}], "coupon": None, "customer": cust}
    assert c.post(A + '/orders/cod', json=body).status_code == 401 and c.post(A + '/payments/payu/initiate', json=body).status_code == 401
    r = c.post(A + '/orders/cod', json=body, headers=H1); assert r.status_code == 201, r.text
    cod = r.json(); assert cod['amount'] == 7665 and cod['shipping'] == 0, cod
    print('all-in-one price', cod['amount'])
    # PayU
    body2 = {"items": [{"id": "prod-1", "quantity": 1}, {"id": "prod-2", "quantity": 1}], "coupon": "welcome10", "customer": cust}
    r = c.post(A + '/payments/payu/initiate', json=body2, headers=H1); assert r.status_code == 200, r.text
    d = r.json(); f = d['fields']; assert d['totals']['total'] == 848 + 1092 + 0 - 194, d['totals']
    resp = {"txnid": f['txnid'], "status": "success", "amount": f['amount'], "productinfo": f['productinfo'], "firstname": f['firstname'], "email": f['email'], "mihpayid": "999", "mode": "UPI"}
    resp['hash'] = payu.response_hash(resp)
    r = c.post(A + '/payments/payu/callback', data=resp, follow_redirects=False); assert 'status=paid' in r.headers['location'], r.headers
    r = c.post(A + '/payments/payu/callback', data=resp, follow_redirects=False)           # duplicate callback: still paid, no second mail
    other = c.post(A + '/auth/register', json={**reg, "email": "other@example.com", "name": "Other Person"}).json()['access_token']
    assert c.get(A + f"/orders/{f['txnid']}", headers={"Authorization": "Bearer " + other}).status_code == 404   # not your order
    mine = c.get(A + '/orders', headers=H1).json()['orders']; assert len(mine) == 2 and {o['status'] for o in mine} == {'placed', 'paid'}, mine
    assert c.get(A + '/auth/me', headers=H1).json()['purchasedProductIds'] == ['prod-1', 'prod-2', 'prod-9']
    # inquiry + honeypot
    q = {"kind": "contact", "name": "Visitor", "email": "v@example.com", "message": "Hello there, question about kit 3", "subject": "Kit 3"}
    assert c.post(A + '/inquiries', json=q).json()['ok']
    assert c.post(A + '/inquiries', json={**q, "website": "http://spam"}).json()['ok']
    # admin
    ad = c.post(A + '/auth/login', json={"email": "boss@test.com", "password": "AdminPass123"}).json(); assert ad['user']['role'] == 'admin'
    HA = {"Authorization": "Bearer " + ad['access_token']}
    assert c.get(A + '/admin/orders', headers=H1).status_code == 403
    assert len(c.get(A + '/admin/orders', headers=HA).json()['orders']) == 2
    assert c.post(A + f"/admin/orders/{f['txnid']}/fulfilment", json={"value": "Shipped"}, headers=HA).json()['fulfilment'] == 'Shipped'
    print(c.get(A + '/admin/analytics', headers=HA).json())
    # password change revokes the old token
    r = c.post(A + '/auth/change-password', json={"current_password": "Secret123", "new_password": "NewSecret456"}, headers=H1)
    # (account is locked from the earlier failures, so change-password with a valid token is still allowed)
    assert r.status_code == 200, r.text
    assert c.get(A + '/auth/me', headers=H1).status_code == 401
    # drain the mail queue
    mailer.flush(); time.sleep(0.5); mailer.flush(); time.sleep(0.5)
    subs = [m[1].split('\n')[0] for m in received]
    to_admin = [m for m in received if 'admin@jrlearners.com' in m[0]]
    print('mails total', len(received), 'to admin', len(to_admin))
    joined = '\n'.join(m[1] for m in to_admin)
    for needle in ('New account: Asha Kumar', 'New COD order', 'Paid order', 'Contact from Visitor', '12 Main Street', 'All-in-One Kit', 'Asha@Example.com'.lower()):
        assert needle.lower() in joined.lower(), needle
    assert 'spam' not in joined
    rows = db.conn().execute("SELECT status,COUNT(*) FROM mail_outbox GROUP BY status").fetchall(); print([tuple(r) for r in rows])
print('ALL OK')
ctl.stop()
