import re
import secrets
import time
from typing import List, Optional

from fastapi import Depends, FastAPI, Header, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from jose import JWTError, jwt
from pydantic import BaseModel, Field

from app import orders, payu
from app.catalog import KIT_BY_ID, KITS
from app.core.config import settings
from app.core.security import create_access_token

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="REST API for the JR Learners Arduino kit shop: the 8-kit catalogue, PayU payments and orders.",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

API = settings.API_V1_STR

# Coupons (same table the shop front end shows). Validated here so a customer can never invent a discount.
COUPONS = {
    "WELCOME10": {"percent": 10, "min_spend": 500, "max_discount": 200},
    "STUDENT20": {"percent": 20, "min_spend": 800, "max_discount": 500},
    "BULK15": {"percent": 15, "min_spend": 5000, "max_discount": 2000},
    "FESTIVE25": {"percent": 25, "min_spend": 1500, "max_discount": 600},
}
FREE_SHIPPING_OVER = 1500
SHIPPING_FEE = 50


# ------------------------------------------------------------------------------------------------ models
class UserLogin(BaseModel):
    email: str
    password: str
    role: Optional[str] = "student"


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str


class CartLine(BaseModel):
    id: str
    quantity: int = Field(ge=1, le=20)


class Customer(BaseModel):
    name: str = Field(min_length=2, max_length=60)
    email: str = Field(pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$", max_length=100)
    phone: str = Field(pattern=r"^[0-9+\-\s]{8,16}$")
    address: str = Field(min_length=5, max_length=200)
    city: str = Field(min_length=2, max_length=60)
    state: str = Field(min_length=2, max_length=60)
    zip: str = Field(pattern=r"^[0-9]{6}$")
    gstin: Optional[str] = Field(default=None, max_length=15)


class InitiatePayment(BaseModel):
    items: List[CartLine] = Field(min_length=1, max_length=20)
    coupon: Optional[str] = None
    customer: Customer


class RefundRequest(BaseModel):
    txnid: str
    amount: Optional[float] = None


# ------------------------------------------------------------------------------------------------ helpers
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


def current_admin(authorization: Optional[str] = Header(default=None)) -> str:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    try:
        data = jwt.decode(authorization[7:], settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if data.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return data.get("sub", "")


def _frontend_result(txnid: str, state: str) -> RedirectResponse:
    return RedirectResponse(f"{settings.FRONTEND_URL}/checkout/result/?txnid={txnid}&status={state}", status_code=303)


async def _payload(request: Request) -> dict:
    ctype = request.headers.get("content-type", "")
    if "json" in ctype:
        data = await request.json()
        return {k: ("" if v is None else str(v)) for k, v in data.items()}
    form = await request.form()
    return {k: str(v) for k, v in form.items()}


def _apply_payu_result(p: dict) -> str:
    """Verify a PayU response and update the order. Returns paid | failed | invalid."""
    txnid = p.get("txnid", "")
    order = orders.get(txnid)
    if not order or not payu.verify_response(p):
        return "invalid"
    if abs(float(p.get("amount", "0")) - float(order["amount"])) > 0.01:      # amount in the response must be what we asked for
        orders.update_payment(txnid, "failed", error="amount mismatch")
        return "invalid"
    if p.get("status") == "success":
        orders.update_payment(txnid, "paid", p.get("mihpayid", ""), p.get("mode", ""), p.get("bank_ref_num", ""))
        return "paid"
    orders.update_payment(txnid, "failed", p.get("mihpayid", ""), p.get("mode", ""), p.get("bank_ref_num", ""), p.get("error_Message") or p.get("error") or "payment failed")
    return "failed"


# ------------------------------------------------------------------------------------------------ routes
@app.get("/")
def root():
    return {"message": "JR Learners API", "version": settings.VERSION, "docs_url": "/docs", "payments": "PayU" if settings.PAYU_ENABLED else "not configured"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post(f"{API}/auth/login", response_model=TokenResponse)
def login(user: UserLogin):
    role = user.role or "student"
    if role == "admin":
        ok = bool(settings.ADMIN_EMAIL and settings.ADMIN_PASSWORD) and secrets.compare_digest(user.email.lower(), settings.ADMIN_EMAIL.lower()) and secrets.compare_digest(user.password, settings.ADMIN_PASSWORD)
        if not ok:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin credentials")
    return {"access_token": create_access_token(subject=user.email, role=role), "token_type": "bearer", "role": role}


@app.get(f"{API}/products")
def get_products():
    return {"count": len(KITS), "products": KITS}


@app.get(f"{API}/payments/config")
def payment_config():
    return {"provider": "payu", "enabled": settings.PAYU_ENABLED, "environment": settings.PAYU_ENV, "currency": "INR"}


@app.post(f"{API}/payments/payu/initiate")
def payu_initiate(body: InitiatePayment):
    if not settings.PAYU_ENABLED:
        raise HTTPException(status_code=503, detail="Online payment is not configured on the server")
    cart = price_cart(body.items, body.coupon)
    txnid = f"JRL{int(time.time())}{secrets.token_hex(4).upper()}"
    cust = body.customer
    orders.create(txnid, cart["total"], cart["subtotal"], cart["shipping"], cart["discount"], cart["coupon"], cart["items"], cust.model_dump())
    info = ", ".join(f"{re.sub(r'[^A-Za-z0-9 ]', '', l['name'])} x{l['quantity']}" for l in cart["items"])[:100]
    callback = f"{settings.PUBLIC_API_URL}{API}/payments/payu/callback"
    fields = payu.build_checkout_form(
        txnid=txnid, amount=f"{cart['total']:.2f}", productinfo=info, firstname=re.sub(r"[^A-Za-z0-9 ]", "", cust.name)[:60] or "Customer",
        email=cust.email, phone=re.sub(r"[^0-9]", "", cust.phone)[-10:], surl=callback, furl=callback,
        address1=cust.address[:100], city=cust.city, state=cust.state, zipcode=cust.zip,
    )
    return {"txnid": txnid, "action": settings.PAYU_PAYMENT_URL, "fields": fields, "totals": {k: cart[k] for k in ("subtotal", "discount", "shipping", "total")}}


@app.post(f"{API}/payments/payu/callback")
async def payu_callback(request: Request):
    """PayU posts the customer's browser here (surl and furl). Verify, record, then send the browser back to the shop."""
    p = await _payload(request)
    state = _apply_payu_result(p)
    return _frontend_result(p.get("txnid", ""), state)


@app.post(f"{API}/payments/payu/webhook")
async def payu_webhook(request: Request):
    """Server-to-server notification configured in the PayU dashboard (covers customers who close the browser)."""
    p = await _payload(request)
    state = _apply_payu_result(p)
    return JSONResponse({"ok": state in ("paid", "failed"), "state": state}, status_code=200 if state != "invalid" else 400)


@app.get(f"{API}/orders/{{txnid}}")
def get_order(txnid: str):
    o = orders.get(txnid)
    if not o:
        raise HTTPException(status_code=404, detail="Order not found")
    return {k: o[k] for k in ("txnid", "status", "amount", "subtotal", "shipping", "discount", "coupon", "items", "customer", "payment_mode", "created_at")}


@app.post(f"{API}/payments/payu/verify/{{txnid}}")
def payu_verify(txnid: str):
    """Re-check a transaction directly with PayU (used when the customer never came back from the bank page)."""
    o = orders.get(txnid)
    if not o:
        raise HTTPException(status_code=404, detail="Order not found")
    if not settings.PAYU_ENABLED:
        raise HTTPException(status_code=503, detail="Online payment is not configured on the server")
    try:
        res = payu.verify_payment(txnid)
    except Exception as e:  # network / PayU error
        raise HTTPException(status_code=502, detail=f"PayU verification failed: {e}")
    st = str(res.get("status", "")).lower()
    if st == "success" and abs(float(res.get("amt", res.get("amount", "0")) or 0) - float(o["amount"])) < 0.01:
        orders.update_payment(txnid, "paid", str(res.get("mihpayid", "")), str(res.get("mode", "")), str(res.get("bank_ref_num", "")))
    elif st in ("failure", "failed", "usercancelled", "dropped", "bounced"):
        orders.update_payment(txnid, "failed", str(res.get("mihpayid", "")), error=st)
    return {"txnid": txnid, "payu_status": st, "order_status": orders.get(txnid)["status"]}


@app.get(f"{API}/admin/orders")
def admin_orders(_: str = Depends(current_admin)):
    return {"orders": orders.list_all()}


@app.get(f"{API}/admin/analytics")
def admin_analytics(_: str = Depends(current_admin)):
    rows = orders.list_all(10000)
    paid = [r for r in rows if r["status"] == "paid"]
    return {"orders": len(rows), "paid_orders": len(paid), "revenue": round(sum(r["amount"] for r in paid), 2), "pending": sum(r["status"] == "pending" for r in rows)}


@app.post(f"{API}/admin/payments/payu/refund")
def admin_refund(body: RefundRequest, _: str = Depends(current_admin)):
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
    if str(res.get("status")) == "1":
        if abs(amount - o["amount"]) < 0.01:
            orders.mark_refunded(body.txnid)
    return {"payu": res}
