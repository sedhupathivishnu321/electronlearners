"""Password hashing (scrypt), JWT access tokens, password policy and a small in-memory rate limiter."""
import hashlib
import hmac
import os
import re
import threading
import time
from collections import defaultdict, deque
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import HTTPException
from jose import JWTError, jwt

from app.core.config import settings

# ---------------------------------------------------------------- passwords
_N, _R, _P = 2 ** 14, 8, 1


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    dk = hashlib.scrypt(password.encode("utf-8"), salt=salt, n=_N, r=_R, p=_P, dklen=32)
    return f"scrypt${_N}${_R}${_P}${salt.hex()}${dk.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        _, n, r, p, salt, dk = stored.split("$")
        calc = hashlib.scrypt(password.encode("utf-8"), salt=bytes.fromhex(salt), n=int(n), r=int(r), p=int(p), dklen=32)
        return hmac.compare_digest(calc, bytes.fromhex(dk))
    except Exception:
        return False


DUMMY_HASH = hash_password("dummy-password-for-timing")      # compared against when the e-mail is unknown (same cost either way)


def check_password_policy(password: str) -> Optional[str]:
    if len(password) < 8:
        return "Password must be at least 8 characters."
    if len(password) > 128:
        return "Password is too long (max 128 characters)."
    if not re.search(r"[A-Za-z]", password) or not re.search(r"[0-9]", password):
        return "Password must contain at least one letter and one digit."
    return None


# ---------------------------------------------------------------- tokens
def create_access_token(user_id: int, role: str, token_version: int, expires_delta: Optional[timedelta] = None) -> str:
    now = datetime.now(timezone.utc)
    payload = {"sub": str(user_id), "role": role, "tv": token_version, "iat": now, "exp": now + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Your session has expired. Please sign in again.")


# ---------------------------------------------------------------- rate limiting
_hits: dict = defaultdict(deque)
_lock = threading.Lock()


def rate_limit(key: str, limit: int, window_s: int) -> None:
    """Raise 429 when `key` has been used more than `limit` times in the last `window_s` seconds."""
    now = time.time()
    with _lock:
        q = _hits[key]
        while q and q[0] < now - window_s:
            q.popleft()
        if len(q) >= limit:
            raise HTTPException(status_code=429, detail="Too many attempts. Please wait a few minutes and try again.")
        q.append(now)
