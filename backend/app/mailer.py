"""E-mail: every message is stored in `mail_outbox` first and then sent over SMTP by a background worker, so nothing is lost
if the mail server is down (failed messages are retried for ~10 attempts)."""
import logging
import smtplib
import threading
import time
from datetime import datetime, timezone
from email.message import EmailMessage
from email.utils import formatdate, make_msgid

from app.core.config import settings
from app.db import conn

log = logging.getLogger("jrlearners.mail")
_wake = threading.Event()
_started = False


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def queue(to_addr: str, subject: str, body: str) -> int:
    cur = conn().execute("INSERT INTO mail_outbox (to_addr, subject, body, created_at) VALUES (?,?,?,?)", (to_addr, subject[:200], body, _now()))
    _wake.set()
    return cur.lastrowid


def notify_admin(subject: str, body: str) -> int:
    return queue(settings.ADMIN_NOTIFY_EMAIL, f"[JR Learners] {subject}", body)


def _send(row) -> None:
    sender = settings.SMTP_FROM or settings.SMTP_USER
    msg = EmailMessage()
    msg["From"] = f"JR Learners <{sender}>"
    msg["To"] = row["to_addr"]
    msg["Subject"] = row["subject"]
    msg["Date"] = formatdate(localtime=False)
    msg["Message-ID"] = make_msgid(domain=sender.split("@")[-1])
    msg.set_content(row["body"])
    if settings.SMTP_SECURITY == "ssl":
        server = smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, timeout=20)
    else:
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=20)
    try:
        if settings.SMTP_SECURITY == "starttls":
            server.starttls()
        if settings.SMTP_USER:
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.send_message(msg)
    finally:
        try:
            server.quit()
        except Exception:
            pass


def flush() -> int:
    """Try to send every pending message once. Returns how many were sent."""
    if not settings.MAIL_ENABLED:
        return 0
    sent = 0
    rows = conn().execute("SELECT * FROM mail_outbox WHERE status='pending' AND attempts < 10 ORDER BY id LIMIT 50").fetchall()
    for r in rows:
        try:
            _send(r)
            conn().execute("UPDATE mail_outbox SET status='sent', sent_at=?, attempts=attempts+1, last_error=NULL WHERE id=?", (_now(), r["id"]))
            sent += 1
        except Exception as e:
            attempts = r["attempts"] + 1
            conn().execute("UPDATE mail_outbox SET attempts=?, last_error=?, status=? WHERE id=?", (attempts, str(e)[:300], "failed" if attempts >= 10 else "pending", r["id"]))
            log.warning("mail %s failed (attempt %s): %s", r["id"], attempts, e)
    return sent


def _worker() -> None:
    while True:
        _wake.wait(timeout=60)
        _wake.clear()
        try:
            flush()
        except Exception as e:  # never let the worker die
            log.error("mail worker error: %s", e)
        time.sleep(1)


def start() -> None:
    global _started
    if _started:
        return
    _started = True
    threading.Thread(target=_worker, name="mail-worker", daemon=True).start()
    if not settings.MAIL_ENABLED:
        log.warning("SMTP is not configured: e-mails are stored in the mail_outbox table and will be sent once SMTP_* variables are set")
    else:
        _wake.set()
