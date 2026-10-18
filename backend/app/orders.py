"""Small SQLite order store (no external database needed). The txnid is the public order reference."""
import json
import sqlite3
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from app.core.config import settings

_lock = threading.Lock()


def _conn() -> sqlite3.Connection:
    Path(settings.DATA_DIR).mkdir(parents=True, exist_ok=True)
    c = sqlite3.connect(Path(settings.DATA_DIR) / "orders.db")
    c.row_factory = sqlite3.Row
    c.execute(
        """CREATE TABLE IF NOT EXISTS orders (
            txnid TEXT PRIMARY KEY, status TEXT NOT NULL, amount REAL NOT NULL, subtotal REAL, shipping REAL, discount REAL,
            coupon TEXT, items TEXT, customer TEXT, payu_id TEXT, payment_mode TEXT, bank_ref TEXT, error TEXT,
            created_at TEXT, updated_at TEXT)"""
    )
    return c


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def create(txnid: str, amount: float, subtotal: float, shipping: float, discount: float, coupon: str, items: list, customer: dict) -> None:
    with _lock, _conn() as c:
        c.execute(
            "INSERT INTO orders (txnid,status,amount,subtotal,shipping,discount,coupon,items,customer,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            (txnid, "pending", amount, subtotal, shipping, discount, coupon, json.dumps(items), json.dumps(customer), _now(), _now()),
        )


def get(txnid: str) -> Optional[dict]:
    with _lock, _conn() as c:
        row = c.execute("SELECT * FROM orders WHERE txnid=?", (txnid,)).fetchone()
    if not row:
        return None
    d = dict(row)
    d["items"] = json.loads(d["items"] or "[]")
    d["customer"] = json.loads(d["customer"] or "{}")
    return d


def update_payment(txnid: str, status: str, payu_id: str = "", mode: str = "", bank_ref: str = "", error: str = "") -> None:
    with _lock, _conn() as c:
        # never downgrade a paid order because of a later duplicate / failed callback
        c.execute(
            "UPDATE orders SET status=?, payu_id=?, payment_mode=?, bank_ref=?, error=?, updated_at=? WHERE txnid=? AND status!='paid'",
            (status, payu_id, mode, bank_ref, error, _now(), txnid),
        )


def mark_refunded(txnid: str) -> None:
    with _lock, _conn() as c:
        c.execute("UPDATE orders SET status='refunded', updated_at=? WHERE txnid=?", (_now(), txnid))


def list_all(limit: int = 200) -> list:
    with _lock, _conn() as c:
        rows = c.execute("SELECT txnid,status,amount,payment_mode,created_at,customer FROM orders ORDER BY created_at DESC LIMIT ?", (limit,)).fetchall()
    out = []
    for r in rows:
        d = dict(r)
        d["customer"] = json.loads(d["customer"] or "{}")
        out.append(d)
    return out
