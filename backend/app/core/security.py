from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import jwt

from app.core.config import settings


def create_access_token(subject: str, role: str, expires_delta: Optional[timedelta] = None) -> str:
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    return jwt.encode({"exp": expire, "sub": str(subject), "role": role}, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
