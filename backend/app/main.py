import json
import logging
import re
import secrets
import time
from typing import List, Optional

from fastapi import Depends, FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from pydantic import BaseModel, Field

from app import db, mailer, orders, payu, users
from app.catalog import KIT_BY_ID, KITS
from app.core.config import settings
from app.core.security import check_password_policy, create_access_token, decode_token, rate_limit, verify_password

log = logging.getLogger("jrlearners")
API = settings.API_V1_STR

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="JR Learners shop API: accounts, the 8-kit catalogue plus the All-in-One kit, PayU payments, orders and e-mail notifications.",
    openapi_url=f"{API}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=False,                      # bearer tokens, no cookies
    allow_methods=["GET", "POST", "PUT"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    resp = await call_next(request)
    resp.headers["X-Content-Type-Options"] = "nosniff"
    resp.headers["X-Frame-Options"] = "DENY"
    resp.headers["Referrer-Policy"] = "no-referrer"
    resp.headers["Cache-Control"] = "no-store"
    return resp


@app.on_event("startup")
def startup() -> None:
    if settings.PAYU_ENV == "live" and settings.SECRET_KEY in ("", "change-me-in-production", "local-dev-secret-please-change"):
        raise RuntimeError("SECRET_KEY must be set to a long random value before running with PAYU_ENV=live")
    db.init()
    if settings.ADMIN_EMAIL and settings.ADMIN_PASSWORD:
        if check_password_policy(settings.ADMIN_PASSWORD):
            raise RuntimeError("ADMIN_PASSWORD is too weak (8+ characters with a letter and a digit)")
        users.ensure_admin(settings.ADMIN_EMAIL, settings.ADMIN_PASSWORD)
    mailer.start()


# ------------------------------------------------------------------------------------------------ models
EMAIL_RE = r"^[^@\s]{1,64}@[^@\s]+\.[^@\s]{2,}$"


class RegisterIn(BaseModel):
    name: str = Field(min_length=2, max_length=60)
    email: str = Field(pattern=EMAIL_RE, max_length=120)
    phone: str = Field(pattern=r"^[0-9+\-\s]{8,16}$")
    password: str = Field(min_length=8, max_length=128)
    role: str = Field(default="student", pattern=r"^(student|teacher|school)$")
    institution: Optional[str] = Field(default=None, max_length=100)


class LoginIn(BaseModel):
    email: str = Field(max_length=120)
    password: str = Field(max_length=128)


class PasswordChangeIn(BaseModel):
    current_password: str = Field(max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


class ProfileIn(BaseModel):
    enrolled_courses: Optional[List[str]] = Field(default=None, max_length=50)
    certificates: Optional[List[dict]] = Field(default=None, max_length=50)


class CartLine(BaseModel):
    id: str
    quantity: int = Field(ge=1, le=20)


class Address(BaseModel):
    name: str = Field(min_length=2, max_length=60)
    email: str = Field(pattern=EMAIL_RE, max_length=120)
    phone: str = Field(pattern=r"^[0-9+\-\s]{8,16}$")
    address: str = Field(min_length=5, max_length=200)
    city: str = Field(min_length=2, max_length=60)
    state: str = Field(min_length=2, max_length=60)
    zip: str = Field(pattern=r"^[0-9]{6}$")
    gstin: Optional[str] = Field(default=None, max_length=15)


class CheckoutIn(BaseModel):
    items: List[CartLine] = Field(min_length=1, max_length=20)
    coupon: Optional[str] = Field(default=None, max_length=30)
    customer: Address


class InquiryIn(BaseModel):
    kind: str = Field(pattern=r"^(contact|support|quote|feedback)$")
    name: str = Field(min_length=2, max_length=80)
    email: str = Field(pattern=EMAIL_RE, max_length=120)
    phone: Optional[str] = Field(default=None, max_length=20)
    subject: Optional[str] = Field(default=None, max_length=150)
    message: str = Field(min_length=3, max_length=4000)
    extra: Optional[dict] = None
    website: Optional[str] = Field(default=None, max_length=100)       # honeypot: real visitors never fill this in


class FulfilmentIn(BaseModel):
    value: str = Field(pattern=r"^(Ordered|Packed|Shipped|Delivered)$")


class RefundIn(BaseModel):
    txnid: str
    amount: Optional[float] = None


# ------------------------------------------------------------------------------------------------ helpers
COUPONS = {
    "WELCOME10": {"percent": 10, "min_spend": 500, "max_discount": 200},
    "STUDENT20": {"percent": 20, "min_spend": 800, "max_discount": 500},
    "BULK15": {"percent": 15, "min_spend": 5000, "max_discount": 2000},
    "FESTIVE25": {"percent": 25, "min_spend": 1500, "max_discount": 600},
}
FREE_SHIPPING_OVER = 1500
SHIPPING_FEE = 50


def client_ip(request: Request) -> str:
    if settings.TRUST_PROXY:
        fwd = request.headers.get("x-forwarded-for", "")
        if fwd:
            return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def price_cart(items: List[CartLine], coupon: Optional[str]) -> dict:
    """Server-side pricing: prices come from the catalogue, never from the browser."""
    lines, subtotal = [], 0
    for it in items:
        kit = KIT_BY_ID.get(it.id)
        if not kit:
            raise HTTPException(status_code=400, detail=f"Unknown product {it.id}")
        lines.append({"id": kit["id"], "name": kit["name"], "price": kit["price"], "quantity": it.quantity})
        subtotal += kit["price"] * it.quantity
    discount = 0
    code = (coupon or "").strip().upper()
    if code:
        c = COUPONS.get(code)
        if not c:
            raise HTTPException(status_code=400, detail="Invalid coupon code")
        if subtotal < c["min_spend"]:
            raise HTTPException(status_code=400, detail=f"Coupon {code} needs a minimum spend of Rs {c['min_spend']}")
        discount = min(round(subtotal * c["percent"] / 100), c["max_discount"])
    shipping = 0 if subtotal > FREE_SHIPPING_OVER else SHIPPING_FEE
    return {"items": lines, "subtotal": subtotal, "discount": discount, "shipping": shipping, "coupon": code, "total": max(0, subtotal + shipping - discount)}


def current_user(authorization: Optional[str] = Header(default=None)):
    """Dependency: the signed-in user row (401 when the token is missing, expired or revoked)."""
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Please sign in to continue.")
    claims = decode_token(authorization[7:])
    u = users.by_id(int(claims["sub"]))
    if u is None or u["token_version"] != claims.get("tv"):
        raise HTTPException(status_code=401, detail="Your session has expired. Please sign in again.")
    return u


def current_admin(u=Depends(current_user)):
    if u["role"] != "admin":
        raise HTTPException(status_code=403, detail="Administrator access only.")
    return u


def optional_user(authorization: Optional[str] = Header(default=None)):
    try:
        return current_user(authorization)
    except HTTPException:
        return None


def order_view(o: dict) -> dict:
    keys = ("txnid", "method", "status", "fulfilment", "amount", "subtotal", "shipping", "discount", "coupon", "items", "customer", "payment_mode", "created_at")
    return {k: o[k] for k in keys}


def order_mail_text(o: dict, u, headline: str) -> str:
    c = o["customer"]
    lines = [headline, "=" * len(headline), "",
             f"Order reference : {o['txnid']}", f"Placed          : {o['created_at']}",
             f"Payment         : {'PayU' if o['method'] == 'payu' else 'Cash on Delivery'}  ({o['status']}{', ' + o['payment_mode'] if o.get('payment_mode') else ''})"]
    if o.get("payu_id"):
        lines.append(f"PayU payment id : {o['payu_id']}")
    lines += ["", "CUSTOMER", f"  Account       : #{u['id']}  {u['email']}", f"  Name          : {c['name']}", f"  E-mail        : {c['email']}", f"  Phone         : {c['phone']}"]
    if c.get("gstin"):
        lines.append(f"  GSTIN         : {c['gstin']}")
    lines += ["", "SHIP TO", f"  {c['address']}", f"  {c['city']}, {c['state']} {c['zip']}", "", "ITEMS"]
    for it in o["items"]:
        lines.append(f"  {it['quantity']} x {it['name']}  @ Rs {it['price']}  = Rs {it['quantity'] * it['price']}")
    lines += ["", f"  Subtotal : Rs {o['subtotal']:.0f}", f"  Discount : Rs {o['discount']:.0f}" + (f"  ({o['coupon']})" if o.get("coupon") else ""),
              f"  Shipping : Rs {o['shipping']:.0f}", f"  TOTAL    : Rs {o['amount']:.0f}"]
    return "\n".join(lines)


def announce_order(o: dict, u, what: str) -> None:
    """E-mail the full order to the administrator and a confirmation to the customer."""
    mailer.notify_admin(f"{what}: {o['txnid']} (Rs {o['amount']:.0f})", order_mail_text(o, u, f"{what.upper()} - {o['txnid']}"))
    mailer.queue(u["email"], f"Your JR Learners order {o['txnid']}", order_mail_text(o, u, "Thank you for your order") + "\n\nQuestions? Reply to help.jrlearners@gmail.com\n")


def _frontend_result(txnid: str, state: str) -> RedirectResponse:
    return RedirectResponse(f"{settings.FRONTEND_URL}/checkout/result/?txnid={txnid}&status={state}", status_code=303)


async def _payload(request: Request) -> dict:
    if "json" in request.headers.get("content-type", ""):
        data = await request.json()
        return {k: ("" if v is None else str(v)) for k, v in data.items()}
    form = await request.form()
    return {k: str(v) for k, v in form.items()}


def _apply_payu_result(p: dict) -> str:
    """Verify a PayU response (signature + amount) and update the order. Returns paid | failed | invalid."""
    txnid = p.get("txnid", "")
    o = orders.get(txnid)
    if not o or not payu.verify_response(p):
        return "invalid"
    if abs(float(p.get("amount", "0") or 0) - float(o["amount"])) > 0.01:
        orders.update_payment(txnid, "failed", error="amount mismatch")
        return "invalid"
    if p.get("status") == "success":
        if orders.update_payment(txnid, "paid", p.get("mihpayid", ""), p.get("mode", ""), p.get("bank_ref_num", "")):
            fresh = orders.get(txnid)
            announce_order(fresh, users.by_id(fresh["user_id"]), "Paid order")
        return "paid"
    orders.update_payment(txnid, "failed", p.get("mihpayid", ""), p.get("mode", ""), p.get("bank_ref_num", ""), p.get("error_Message") or p.get("error") or "payment failed")
    return "failed"


# ------------------------------------------------------------------------------------------------ public
@app.get("/")
def root():
    return {"message": "JR Learners API", "version": settings.VERSION, "docs_url": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get(f"{API}/products")
def get_products():
    return {"count": len(KITS), "products": KITS}


@app.get(f"{API}/config")
def public_config():
    return {"payments": settings.PAYU_ENABLED, "environment": settings.PAYU_ENV, "mail": settings.MAIL_ENABLED, "currency": "INR"}


@app.post(f"{API}/inquiries")
def create_inquiry(body: InquiryIn, request: Request, me=Depends(optional_user)):
    """Contact form, support ticket, bulk quote or feedback: stored and e-mailed to the administrator."""
    ip = client_ip(request)
    rate_limit(f"inq:{ip}", 5, 600)
    if body.website:                                           # honeypot filled in: pretend success, send nothing
        return {"ok": True}
    db.conn().execute(
        "INSERT INTO inquiries (kind,user_id,name,email,phone,subject,message,extra,ip,created_at) VALUES (?,?,?,?,?,?,?,?,?,datetime('now'))",
        (body.kind, me["id"] if me else None, body.name.strip(), body.email.strip().lower(), body.phone, body.subject, body.message.strip(), json.dumps(body.extra or {})[:4000], ip),
    )
    lines = [f"Type    : {body.kind}", f"Name    : {body.name}", f"E-mail  : {body.email}", f"Phone   : {body.phone or '-'}", f"Account : {('#%s %s' % (me['id'], me['email'])) if me else 'not signed in'}",
             f"Subject : {body.subject or '-'}", "", body.message.strip()]
    if body.extra:
        lines += ["", "DETAILS"] + [f"  {k}: {v}" for k, v in list(body.extra.items())[:30]]
    mailer.notify_admin(f"{body.kind.capitalize()} from {body.name}", "\n".join(lines))
    return {"ok": True}


# ------------------------------------------------------------------------------------------------ accounts
@app.post(f"{API}/auth/register", status_code=201)
def register(body: RegisterIn, request: Request):
    ip = client_ip(request)
    rate_limit(f"reg:{ip}", 5, 3600)
    problem = check_password_policy(body.password)
    if problem:
        raise HTTPException(status_code=422, detail=problem)
    uid = users.create(body.email, body.name, body.phone, body.password, body.role, body.institution)
    if uid is None:
        raise HTTPException(status_code=409, detail="An account with this e-mail already exists. Please sign in.")
    u = users.by_id(uid)
    users.audit(uid, "register", ip)
    mailer.notify_admin(f"New account: {u['name']}", "\n".join([
        "A new user registered.", "", f"Account id  : #{u['id']}", f"Name        : {u['name']}", f"E-mail      : {u['email']}", f"Phone       : {u['phone']}",
        f"Role        : {u['role']}", f"Institution : {u['institution'] or '-'}", f"Registered  : {u['created_at']}", f"IP address  : {ip}"]))
    mailer.queue(u["email"], "Welcome to JR Learners", f"Hi {u['name']},\n\nYour JR Learners account is ready. Sign in to order kits, track orders and follow the 400 project guides.\n\nNeed help? help.jrlearners@gmail.com\n")
    return {"access_token": create_access_token(u["id"], u["role"], u["token_version"]), "token_type": "bearer", "user": users.public(u)}


@app.post(f"{API}/auth/login")
def login(body: LoginIn, request: Request):
    ip = client_ip(request)
    rate_limit(f"login-ip:{ip}", 20, 600)
    rate_limit(f"login-acct:{users.norm_email(body.email)}", 10, 600)
    u, err = users.authenticate(body.email, body.password)
    if err:
        users.audit(None, "login_failed", ip, users.norm_email(body.email)[:80])
        raise HTTPException(status_code=401, detail=err)
    users.audit(u["id"], "login", ip)
    return {"access_token": create_access_token(u["id"], u["role"], u["token_version"]), "token_type": "bearer", "user": users.public(u)}


@app.get(f"{API}/auth/me")
def me(u=Depends(current_user)):
    return {"user": users.public(u), "purchasedProductIds": orders.purchased_product_ids(u["id"])}


@app.put(f"{API}/auth/profile")
def update_profile(body: ProfileIn, u=Depends(current_user)):
    users.update_profile(u["id"], body.enrolled_courses, body.certificates)
    return {"user": users.public(users.by_id(u["id"]))}


@app.post(f"{API}/auth/change-password")
def change_password(body: PasswordChangeIn, request: Request, u=Depends(current_user)):
    rate_limit(f"chpw:{u['id']}", 5, 600)
    if not verify_password(body.current_password, u["password_hash"]):
        raise HTTPException(status_code=401, detail="Current password is incorrect.")
    problem = check_password_policy(body.new_password)
    if problem:
        raise HTTPException(status_code=422, detail=problem)
    users.change_password(u["id"], body.new_password)             # also revokes every older token
    users.audit(u["id"], "password_changed", client_ip(request))
    fresh = users.by_id(u["id"])
    return {"access_token": create_access_token(fresh["id"], fresh["role"], fresh["token_version"]), "token_type": "bearer"}


# ------------------------------------------------------------------------------------------------ orders and payments
def _new_txnid() -> str:
    return f"JRL{int(time.time())}{secrets.token_hex(4).upper()}"


@app.post(f"{API}/orders/cod", status_code=201)
def order_cash_on_delivery(body: CheckoutIn, request: Request, u=Depends(current_user)):
    rate_limit(f"order:{u['id']}", 10, 600)
    cart = price_cart(body.items, body.coupon)
    txnid = _new_txnid()
    orders.create(txnid, u["id"], "cod", "placed", cart, body.customer.model_dump())
    o = orders.get(txnid)
    users.audit(u["id"], "order_cod", client_ip(request), txnid)
    announce_order(o, u, "New COD order")
    return order_view(o)


@app.get(f"{API}/payments/config")
def payment_config():
    return {"provider": "payu", "enabled": settings.PAYU_ENABLED, "environment": settings.PAYU_ENV, "currency": "INR"}


@app.post(f"{API}/payments/payu/initiate")
def payu_initiate(body: CheckoutIn, request: Request, u=Depends(current_user)):
    if not settings.PAYU_ENABLED:
        raise HTTPException(status_code=503, detail="Online payment is not configured on the server")
    rate_limit(f"order:{u['id']}", 10, 600)
    cart = price_cart(body.items, body.coupon)
    txnid = _new_txnid()
    cust = body.customer
    orders.create(txnid, u["id"], "payu", "pending", cart, cust.model_dump())
    info = ", ".join(f"{re.sub(r'[^A-Za-z0-9 ]', '', l['name'])} x{l['quantity']}" for l in cart["items"])[:100]
    callback = f"{settings.PUBLIC_API_URL}{API}/payments/payu/callback"
    fields = payu.build_checkout_form(
        txnid=txnid, amount=f"{cart['total']:.2f}", productinfo=info, firstname=re.sub(r"[^A-Za-z0-9 ]", "", cust.name)[:60] or "Customer",
        email=cust.email, phone=re.sub(r"[^0-9]", "", cust.phone)[-10:], surl=callback, furl=callback,
        address1=cust.address[:100], city=cust.city, state=cust.state, zipcode=cust.zip,
    )
    users.audit(u["id"], "payu_initiated", client_ip(request), txnid)
    return {"txnid": txnid, "action": settings.PAYU_PAYMENT_URL, "fields": fields, "totals": {k: cart[k] for k in ("subtotal", "discount", "shipping", "total")}}


@app.post(f"{API}/payments/payu/callback")
async def payu_callback(request: Request):
    """PayU posts the customer's browser here (surl and furl). Verify, record, then send the browser back to the shop."""
    p = await _payload(request)
    return _frontend_result(p.get("txnid", ""), _apply_payu_result(p))


@app.post(f"{API}/payments/payu/webhook")
async def payu_webhook(request: Request):
    """Server-to-server notification configured in the PayU dashboard (covers customers who close the browser)."""
    p = await _payload(request)
    state = _apply_payu_result(p)
    return JSONResponse({"ok": state in ("paid", "failed"), "state": state}, status_code=200 if state != "invalid" else 400)


@app.get(f"{API}/orders")
def my_orders(u=Depends(current_user)):
    return {"orders": [order_view(o) for o in orders.for_user(u["id"])]}


@app.get(f"{API}/orders/{{txnid}}")
def get_order(txnid: str, u=Depends(current_user)):
    o = orders.get(txnid)
    if not o or (o["user_id"] != u["id"] and u["role"] != "admin"):
        raise HTTPException(status_code=404, detail="Order not found")
    return order_view(o)


@app.post(f"{API}/payments/payu/verify/{{txnid}}")
def payu_verify(txnid: str, u=Depends(current_user)):
    """Re-check a transaction directly with PayU (when the customer never came back from the bank page)."""
    o = orders.get(txnid)
    if not o or (o["user_id"] != u["id"] and u["role"] != "admin") or o["method"] != "payu":
        raise HTTPException(status_code=404, detail="Order not found")
    if not settings.PAYU_ENABLED:
        raise HTTPException(status_code=503, detail="Online payment is not configured on the server")
    rate_limit(f"verify:{u['id']}", 10, 600)
    try:
        res = payu.verify_payment(txnid)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"PayU verification failed: {e}")
    st = str(res.get("status", "")).lower()
    if st == "success" and abs(float(res.get("amt", res.get("amount", "0")) or 0) - float(o["amount"])) < 0.01:
        if orders.update_payment(txnid, "paid", str(res.get("mihpayid", "")), str(res.get("mode", "")), str(res.get("bank_ref_num", ""))):
            announce_order(orders.get(txnid), users.by_id(o["user_id"]), "Paid order")
    elif st in ("failure", "failed", "usercancelled", "dropped", "bounced"):
        orders.update_payment(txnid, "failed", str(res.get("mihpayid", "")), error=st)
    return {"txnid": txnid, "payu_status": st, "order_status": orders.get(txnid)["status"]}


# ------------------------------------------------------------------------------------------------ admin
@app.get(f"{API}/admin/orders")
def admin_orders(_=Depends(current_admin)):
    out = []
    for o in orders.all_orders():
        v = order_view(o)
        v["user_email"], v["user_name"] = o["user_email"], o["user_name"]
        out.append(v)
    return {"orders": out}


@app.post(f"{API}/admin/orders/{{txnid}}/fulfilment")
def admin_fulfilment(txnid: str, body: FulfilmentIn, a=Depends(current_admin), request: Request = None):
    if not orders.set_fulfilment(txnid, body.value):
        raise HTTPException(status_code=404, detail="Order not found")
    o = orders.get(txnid)
    users.audit(a["id"], "fulfilment", client_ip(request) if request else "", f"{txnid}={body.value}")
    mailer.queue(o["customer"]["email"], f"Your JR Learners order {txnid} is now {body.value}", f"Hi {o['customer']['name']},\n\nYour order {txnid} status: {body.value}.\n\nQuestions? help.jrlearners@gmail.com\n")
    return order_view(o)


@app.get(f"{API}/admin/analytics")
def admin_analytics(_=Depends(current_admin)):
    c = db.conn()
    row = c.execute("SELECT COUNT(*) n, COALESCE(SUM(CASE WHEN status IN ('paid','placed') THEN amount END),0) rev, SUM(status='pending') pend FROM orders").fetchone()
    nu = c.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    mails = c.execute("SELECT SUM(status='pending') p, SUM(status='failed') f FROM mail_outbox").fetchone()
    return {"orders": row["n"], "revenue": round(row["rev"], 2), "pending_payments": row["pend"] or 0, "users": nu, "mail_pending": mails["p"] or 0, "mail_failed": mails["f"] or 0}


@app.post(f"{API}/admin/payments/payu/refund")
def admin_refund(body: RefundIn, a=Depends(current_admin)):
    o = orders.get(body.txnid)
    if not o or o["status"] != "paid" or not o["payu_id"]:
        raise HTTPException(status_code=400, detail="Only paid orders with a PayU payment id can be refunded")
    amount = body.amount if body.amount is not None else o["amount"]
    if amount <= 0 or amount > o["amount"]:
        raise HTTPException(status_code=400, detail="Invalid refund amount")
    try:
        res = payu.refund(o["payu_id"], f"RF{int(time.time())}{secrets.token_hex(3).upper()}", f"{amount:.2f}")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"PayU refund failed: {e}")
    if str(res.get("status")) == "1" and abs(amount - o["amount"]) < 0.01:
        orders.mark_refunded(body.txnid)
    mailer.notify_admin(f"Refund requested: {body.txnid}", f"Refund of Rs {amount:.2f} for {body.txnid} by {a['email']}\nPayU answer: {json.dumps(res)[:500]}")
    return {"payu": res}
