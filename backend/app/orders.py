"""Orders table access. The txnid is the public order reference; every order belongs to a signed-in user."""
import json
from datetime import datetime, timezone
from typing import Optional

from app.db import conn


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _row(r) -> dict:
    d = dict(r)
    d["items"] = json.loads(d["items"] or "[]")
    d["customer"] = json.loads(d["customer"] or "{}")
    return d


def create(txnid: str, user_id: int, method: str, status: str, cart: dict, customer: dict) -> None:
    conn().execute(
        "INSERT INTO orders (txnid,user_id,method,status,amount,subtotal,shipping,discount,coupon,items,customer,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
        (txnid, user_id, method, status, cart["total"], cart["subtotal"], cart["shipping"], cart["discount"], cart["coupon"], json.dumps(cart["items"]), json.dumps(customer), _now(), _now()),
    )


def get(txnid: str) -> Optional[dict]:
    r = conn().execute("SELECT * FROM orders WHERE txnid=?", (txnid,)).fetchone()
    return _row(r) if r else None


def for_user(user_id: int) -> list:
    return [_row(r) for r in conn().execute("SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC LIMIT 200", (user_id,)).fetchall()]


def all_orders(limit: int = 500) -> list:
    rows = conn().execute(
        "SELECT o.*, u.email AS user_email, u.name AS user_name FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC LIMIT ?", (limit,)
    ).fetchall()
    return [_row(r) for r in rows]


def update_payment(txnid: str, status: str, payu_id: str = "", mode: str = "", bank_ref: str = "", error: str = "") -> bool:
    """Returns True when the order changed. A paid order is never downgraded by a later duplicate / failed callback."""
    cur = conn().execute(
        "UPDATE orders SET status=?, payu_id=?, payment_mode=?, bank_ref=?, error=?, updated_at=? WHERE txnid=? AND status NOT IN ('paid','refunded')",
        (status, payu_id, mode, bank_ref, error, _now(), txnid),
    )
    return cur.rowcount > 0


def mark_refunded(txnid: str) -> None:
    conn().execute("UPDATE orders SET status='refunded', updated_at=? WHERE txnid=?", (_now(), txnid))


def set_fulfilment(txnid: str, value: str) -> bool:
    cur = conn().execute("UPDATE orders SET fulfilment=?, updated_at=? WHERE txnid=?", (value, _now(), txnid))
    return cur.rowcount > 0


def purchased_product_ids(user_id: int) -> list:
    ids: set = set()
    for r in conn().execute("SELECT items FROM orders WHERE user_id=? AND status IN ('paid','placed')", (user_id,)).fetchall():
        for it in json.loads(r["items"]):
            ids.add(it["id"])
    return sorted(ids)
