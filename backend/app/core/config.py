import os
from pathlib import Path


def _load_dotenv() -> None:
    """Tiny .env loader (no extra dependency). Real environment variables always win."""
    env = Path(__file__).resolve().parents[2] / ".env"
    if not env.exists():
        return
    for line in env.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


_load_dotenv()


class Settings:
    PROJECT_NAME: str = "JR Learners STEM Platform"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Admin login (set both in the environment; there is no built-in default password)
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "")

    # Public URLs
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "https://jrlearners.com").rstrip("/")
    PUBLIC_API_URL: str = os.getenv("PUBLIC_API_URL", "http://localhost:8000").rstrip("/")
    CORS_ORIGINS: list = [o.strip() for o in os.getenv("CORS_ORIGINS", "https://jrlearners.com,http://localhost:3000").split(",") if o.strip()]

    # PayU (https://payu.in/business/developer/api). Secrets come ONLY from the environment / .env, never from code.
    PAYU_KEY: str = os.getenv("PAYU_KEY", "")
    PAYU_SALT: str = os.getenv("PAYU_SALT", "")
    PAYU_CLIENT_ID: str = os.getenv("PAYU_CLIENT_ID", "")          # payment-links / split-payment APIs
    PAYU_CLIENT_SECRET: str = os.getenv("PAYU_CLIENT_SECRET", "")
    PAYU_ENV: str = os.getenv("PAYU_ENV", "test").lower()          # "test" or "live"

    DATA_DIR: str = os.getenv("DATA_DIR", str(Path(__file__).resolve().parents[2] / "data"))

    @property
    def PAYU_PAYMENT_URL(self) -> str:
        return "https://secure.payu.in/_payment" if self.PAYU_ENV == "live" else "https://test.payu.in/_payment"

    @property
    def PAYU_API_URL(self) -> str:
        return "https://info.payu.in/merchant/postservice.php?form=2" if self.PAYU_ENV == "live" else "https://test.payu.in/merchant/postservice.php?form=2"

    @property
    def PAYU_ENABLED(self) -> bool:
        return bool(self.PAYU_KEY and self.PAYU_SALT)


settings = Settings()
