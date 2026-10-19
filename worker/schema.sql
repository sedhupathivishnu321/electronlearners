CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student','teacher','school','admin')),
  institution TEXT,
  password_hash TEXT NOT NULL,
  token_version INTEGER NOT NULL DEFAULT 0,
  failed_logins INTEGER NOT NULL DEFAULT 0,
  locked_until REAL NOT NULL DEFAULT 0,
  enrolled_courses TEXT NOT NULL DEFAULT '[]',
  certificates TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  last_login_at TEXT
);
CREATE TABLE IF NOT EXISTS orders (
  txnid TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  method TEXT NOT NULL CHECK (method IN ('payu','cod')),
  status TEXT NOT NULL CHECK (status IN ('pending','paid','failed','refunded','placed')),
  fulfilment TEXT NOT NULL DEFAULT 'Ordered' CHECK (fulfilment IN ('Ordered','Packed','Shipped','Delivered')),
  amount REAL NOT NULL, subtotal REAL NOT NULL, tax REAL NOT NULL DEFAULT 0, shipping REAL NOT NULL, discount REAL NOT NULL,
  coupon TEXT, items TEXT NOT NULL, customer TEXT NOT NULL,
  payu_id TEXT, payment_mode TEXT, bank_ref TEXT, error TEXT,
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id, created_at DESC);
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT NOT NULL, user_id INTEGER REFERENCES users(id),
  name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, subject TEXT, message TEXT NOT NULL, extra TEXT, ip TEXT, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS mail_outbox (
  id INTEGER PRIMARY KEY AUTOINCREMENT, to_addr TEXT NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','failed')),
  attempts INTEGER NOT NULL DEFAULT 0, last_error TEXT, created_at TEXT NOT NULL, sent_at TEXT
);
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT NOT NULL, user_id INTEGER, action TEXT NOT NULL, ip TEXT, detail TEXT
);
CREATE TABLE IF NOT EXISTS rate_hits (key TEXT NOT NULL, ts INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS idx_rate ON rate_hits(key, ts);
CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT NOT NULL);
