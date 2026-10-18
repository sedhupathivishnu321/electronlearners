"""PayU India integration: request hash, response (reverse) hash, status verification and refunds.

Hash formulas (PayU "Hosted checkout" / Merchant API):
  request : sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
  response: sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
            (if the response carries `additional_charges`, it is prepended: additional_charges|SALT|status|...)
  api     : sha512(key|command|var1|SALT)
The salt never leaves the server.
"""
import hashlib
import hmac
import json
from typing import Dict, Optional

import requests

from app.core.config import settings


def _sha512(text: str) -> str:
    return hashlib.sha512(text.encode("utf-8")).hexdigest()


def request_hash(p: Dict[str, str]) -> str:
    seq = "|".join([
        settings.PAYU_KEY, p["txnid"], p["amount"], p["productinfo"], p["firstname"], p["email"],
        p.get("udf1", ""), p.get("udf2", ""), p.get("udf3", ""), p.get("udf4", ""), p.get("udf5", ""),
        "", "", "", "", "", settings.PAYU_SALT,
    ])
    return _sha512(seq)


def response_hash(p: Dict[str, str]) -> str:
    seq = "|".join([
        settings.PAYU_SALT, p.get("status", ""), "", "", "", "", "",
        p.get("udf5", ""), p.get("udf4", ""), p.get("udf3", ""), p.get("udf2", ""), p.get("udf1", ""),
        p.get("email", ""), p.get("firstname", ""), p.get("productinfo", ""), p.get("amount", ""), p.get("txnid", ""), settings.PAYU_KEY,
    ])
    if p.get("additional_charges"):
        seq = p["additional_charges"] + "|" + seq
    return _sha512(seq)


def verify_response(p: Dict[str, str]) -> bool:
    """True when the hash PayU sent matches the one we compute (i.e. the callback really came from PayU)."""
    got = (p.get("hash") or "").lower()
    return bool(got) and hmac.compare_digest(got, response_hash(p))


def build_checkout_form(txnid: str, amount: str, productinfo: str, firstname: str, email: str, phone: str,
                        surl: str, furl: str, udf1: str = "", address1: str = "", city: str = "", state: str = "", zipcode: str = "") -> Dict[str, str]:
    fields = {
        "key": settings.PAYU_KEY, "txnid": txnid, "amount": amount, "productinfo": productinfo,
        "firstname": firstname, "email": email, "phone": phone, "surl": surl, "furl": furl,
        "udf1": udf1, "udf2": "", "udf3": "", "udf4": "", "udf5": "",
        "address1": address1, "city": city, "state": state, "country": "India", "zipcode": zipcode,
    }
    fields["hash"] = request_hash(fields)
    return fields


def _api(command: str, var1: str, extra: Optional[Dict[str, str]] = None) -> dict:
    data = {"key": settings.PAYU_KEY, "command": command, "var1": var1, "hash": _sha512(f"{settings.PAYU_KEY}|{command}|{var1}|{settings.PAYU_SALT}")}
    data.update(extra or {})
    r = requests.post(settings.PAYU_API_URL, data=data, timeout=20, headers={"Accept": "application/json"})
    r.raise_for_status()
    return json.loads(r.text)


def verify_payment(txnid: str) -> dict:
    """Ask PayU for the authoritative status of a transaction (use this if a browser never returned from the bank)."""
    res = _api("verify_payment", txnid)
    return (res.get("transaction_details") or {}).get(txnid) or res


def refund(mihpayid: str, token_id: str, amount: str) -> dict:
    """Refund (cancel_refund_transaction). token_id is a unique id you choose for this refund request."""
    return _api("cancel_refund_transaction", mihpayid, {"var2": token_id, "var3": amount})
