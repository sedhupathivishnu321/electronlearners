<div align="center">
  <img src="frontend/public/logo.png" alt="JR Learners Logo" width="160" />
  <h1>JR Learners</h1>
  <p><strong>Learn. Build. Innovate.</strong></p>
  <p>The JR Learners Arduino kit series: 8 levels, 50 guided projects per kit (400 in total), a free circuit simulator and an online shop with PayU payments.</p>
</div>

---

## The 8 kits

Every kit contains an Arduino UNO R3, USB cable, breadboard, jumper wires, resistor kit, push button and LEDs, plus the level-specific parts. Each kit has **10 Basic, 20 Intermediate and 20 Advanced** projects, and every project uses only the parts of its own kit.

| Level | Kit | Focus | Price |
|---|---|---|---|
| 1 | Foundations | digital I/O, PWM, analog read, serial | ₹848 |
| 2 | Sensing the World | analog and digital sensors, thresholds, calibration | ₹1,092 |
| 3 | Displays & Interfaces | LCD / OLED / 7-segment / matrix, shift registers, human input | ₹1,632 |
| 4 | Motion & Distance | ranging, presence and position sensing, first servo | ₹1,259 |
| 5 | Motors & Power Control | transistors, H-bridges, relays, steppers | ₹1,447 |
| 6 | Smart Safety & Environment | hazard detection, data sensing, alarms | ₹1,929 |
| 7 | Wireless & Remote Control | Bluetooth, 2.4 GHz radio, IR, Wi-Fi, 3.3 V interfacing | ₹2,066 |
| 8 | Smart Systems Capstone | RFID access, RTC logging, load cell, INA219, MPU6050, MAX30102 | ₹2,560 |

**All-in-One Kit (₹7,665):** the common core once (₹527.20) + the level-specific parts of all 8 kits (₹4,947.70) = ₹5,474.90, plus 40 %. That is ₹5,168 less than the eight kits bought separately (₹12,833).

**GST and shipping at checkout:** the prices above are before tax. **18% GST** is added on the kit price. **Shipping is a flat Rs 100** per order across India and **Rs 50 for delivery inside Puducherry** (decided by the state chosen in the delivery address). There is no free-shipping threshold. Example: Level 1 (Rs 848) = 848 + GST 153 + shipping 100 = Rs 1,101, or Rs 1,051 inside Puducherry.

**Pricing rule:** price = BOM component cost of the kit (including the common core) + 40 %, rounded to the nearest rupee. The server holds the same table in [backend/app/catalog.py](backend/app/catalog.py) and always recomputes the amount itself; the browser's total is never trusted.

## Site features

- **Shop** for the 8 kits: level filter, price filter, comparison table, parts list and the 50 projects on every kit page. Cart, wishlist, order history.
- **400 project guides** (`/projects`): parts list, circuit notes, Arduino sketch (copy / download .ino), neighbour navigation and a one-click link into the simulator.
- **ArduinoForge simulator** (`/simulator`, full screen at `/arduinoforge/`): breadboard circuit simulator with all 400 projects (`/arduinoforge/?example=k8-01-rfid-uid` opens one directly).
- **Customized projects** (`/custom-project`, button on the home page): a form for custom builds with optional PDF / TXT / DOC / DOCX / PPT / PPTX upload (2 MB) or a link; the details and the file are e-mailed to learnersjr@gmail.com and sedhupathivishnu2@gmail.com and the sender gets a confirmation with a reference.
- **Downloads**: one ZIP of sketches per kit.
- **Accounts and orders**: users register and sign in (server-side, scrypt password hashes, signed 12-hour tokens, lock-out after 5 wrong passwords, rate limits); an account is required to order. Orders, accounts and enquiries live in the backend database.
- **E-mail**: every registration, order (paid or COD), contact form, support ticket and bulk quote is e-mailed to `admin@jrlearners.com`; customers get a confirmation copy.
- **Payments** with PayU (UPI, cards, netbanking, wallets, EMI) or Cash on Delivery, with server-side price checking and signature-verified callbacks.
- Courses, YouTube tutorials, blog, certificates with verification, school / teacher portals, support tickets, bulk quotes.
- Accessible colour theme: no pure black or white text, every text/background pair is checked for contrast.

## Repository layout

```
frontend/                 Next.js (static export, GitHub Pages)
  public/arduinoforge/    built ArduinoForge simulator (web app)
  public/kit-projects/    index.json + kit1..kit8.json (400 projects: parts, circuit notes, sketches)
  public/downloads/kits/  sketch ZIP per kit
  src/data/               productsData (the 8 kits), kitProjects, courses, blog, youtube
  src/pages/              shop, checkout, checkout/result, projects, simulator, ...
backend/                  OLD Python (FastAPI) version of the API. NOT maintained: it does not have the GST / Puducherry shipping rules. The live API is worker/
  app/catalog.py          the 8 kits and their server-side prices
  app/payu.py             PayU hashes, verification, refunds
  app/main.py             API routes
worker/                   the live API: Cloudflare Workers + D1 (free, no server), see worker/README.md
```

## PayU payments

Flow: the checkout page sends the cart and customer details to `POST /api/v1/payments/payu/initiate`. The backend prices the cart from its own catalogue, stores a pending order, signs the PayU request with the **salt (which never leaves the server)** and returns the form fields. The browser posts them to PayU's hosted page. PayU sends the customer back to `POST /api/v1/payments/payu/callback`; the backend verifies PayU's response hash and the amount, marks the order `paid` or `failed` and redirects to `/checkout/result/`. A webhook (`/payments/payu/webhook`), a status re-check (`/payments/payu/verify/{txnid}`) and an admin refund endpoint are included.

### Set it up

The API runs on **Cloudflare Workers + D1** (free, no card, no server) and deploys from GitHub. Follow [worker/README.md](worker/README.md): a free Cloudflare account and token, a Google Apps Script for mail, the admin login, then run the deploy workflow and set the repository variable `API_URL`. Until `API_URL` is set, checkout shows "not connected" and only browsing works.

PayU values (key, salt, client id and secret) live only as GitHub / Cloudflare secrets, never in the repository.

## Database

Cloudflare D1 (SQLite): `users` (password hash, lock-out counters, role, profile), `orders` (each belongs to a user), `inquiries`, `mail_outbox`, `audit_log`. Passwords are never stored in clear text. Schema: `worker/schema.sql`.

## Contact

Help and support: help.jrlearners@gmail.com. YouTube: [@jrlearners2](https://www.youtube.com/@jrlearners2) · [Facebook](https://www.facebook.com/profile.php?id=61595649146123) · [X](https://x.com/JRLearners) · [LinkedIn](https://www.linkedin.com/in/jr-learners-5845b4437) · WhatsApp +91 93429 45688 · learnersjr@gmail.com.

## Front end

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev      # http://localhost:3000
npm run build    # static export to frontend/out
```

Deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main` (custom domain in `frontend/public/CNAME`).

## Colour theme

`frontend/src/styles/globals.css` ends with a generated contrast theme (generated by `frontend/scripts/gen_theme.py`): every surface (light, dark, saturated, bright) sets CSS variables for its text colours so a text utility such as `text-white` or `text-blue-400` resolves to a readable colour on the surface it sits on. Form fields are always a pale field with navy text.

---

YouTube: [@jrlearners2](https://www.youtube.com/@jrlearners2) · [Facebook](https://www.facebook.com/profile.php?id=61595649146123) · [X](https://x.com/JRLearners) · [LinkedIn](https://www.linkedin.com/in/jr-learners-5845b4437) · WhatsApp +91 93429 45688 · learnersjr@gmail.com
