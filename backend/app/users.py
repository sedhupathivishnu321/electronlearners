"""User accounts: registration, authentication with lock-out, profile."""
import json
import time
from datetime import datetime, timezone
from typing import Optional

from app.core.security import DUMMY_HASH, hash_password, verify_password
from app.db import conn

MAX_FAILED = 5
LOCK_SECONDS = 15 * 60


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def norm_email(email: str) -> str:
    return email.strip().lower()


def public(u) -> dict:
    """What the browser may see about a user (never the hash)."""
    return {
        "id": u["id"], "email": u["email"], "name": u["name"], "phone": u["phone"], "role": u["role"], "institution": u["institution"],
        "enrolledCourseIds": json.loads(u["enrolled_courses"] or "[]"), "certificates": json.loads(u["certificates"] or "[]"), "createdAt": u["created_at"],
    }


def by_id(user_id: int):
    return conn().execute("SELECT * FROM users WHERE id=?", (user_id,)).fetchone()


def by_email(email: str):
    return conn().execute("SELECT * FROM users WHERE email=?", (norm_email(email),)).fetchone()


def create(email: str, name: str, phone: str, password: str, role: str, institution: Optional[str]) -> Optional[int]:
    """Returns the new id, or None when the e-mail is already registered."""
    try:
        cur = conn().execute(
            "INSERT INTO users (email,name,phone,role,institution,password_hash,created_at) VALUES (?,?,?,?,?,?,?)",
            (norm_email(email), name.strip(), phone.strip(), role, (institution or "").strip() or None, hash_password(password), _now()),
        )
        return cur.lastrowid
    except Exception as e:                      # sqlite3.IntegrityError (UNIQUE email)
        if "UNIQUE" in str(e).upper():
            return None
        raise


def ensure_admin(email: str, password: str) -> None:
    """Create or refresh the administrator account from ADMIN_EMAIL / ADMIN_PASSWORD."""
    u = by_email(email)
    if u is None:
        conn().execute(
            "INSERT INTO users (email,name,phone,role,password_hash,created_at) VALUES (?,?,?,?,?,?)",
            (norm_email(email), "Administrator", "", "admin", hash_password(password), _now()),
        )
    elif not verify_password(password, u["password_hash"]) or u["role"] != "admin":
        conn().execute("UPDATE users SET password_hash=?, role='admin', token_version=token_version+1 WHERE id=?", (hash_password(password), u["id"]))


def authenticate(email: str, password: str):
    """Returns (user_row, error_message). Same work and same message whether the e-mail exists or not."""
    u = by_email(email)
    generic = "Incorrect e-mail or password."
    if u is None:
        verify_password(password, DUMMY_HASH)
        return None, generic
    if u["locked_until"] > time.time():
        return None, "Too many failed attempts. This account is locked for a few minutes."
    if not verify_password(password, u["password_hash"]):
        failed = u["failed_logins"] + 1
        locked = time.time() + LOCK_SECONDS if failed >= MAX_FAILED else 0
        conn().execute("UPDATE users SET failed_logins=?, locked_until=? WHERE id=?", (0 if locked else failed, locked, u["id"]))
        return None, generic
    conn().execute("UPDATE users SET failed_logins=0, locked_until=0, last_login_at=? WHERE id=?", (_now(), u["id"]))
    return by_id(u["id"]), None


def change_password(user_id: int, new_password: str) -> None:
    conn().execute("UPDATE users SET password_hash=?, token_version=token_version+1 WHERE id=?", (hash_password(new_password), user_id))


def update_profile(user_id: int, enrolled: Optional[list], certificates: Optional[list]) -> None:
    if enrolled is not None:
        conn().execute("UPDATE users SET enrolled_courses=? WHERE id=?", (json.dumps(enrolled), user_id))
    if certificates is not None:
        conn().execute("UPDATE users SET certificates=? WHERE id=?", (json.dumps(certificates), user_id))


def audit(user_id: Optional[int], action: str, ip: str, detail: str = "") -> None:
    conn().execute("INSERT INTO audit_log (ts,user_id,action,ip,detail) VALUES (?,?,?,?,?)", (_now(), user_id, action, ip, detail[:500]))
