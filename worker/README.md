# JR Learners API on Cloudflare Workers (free, no card, no server)

Accounts, orders (Cash on Delivery and PayU), enquiries, admin routes and e-mail notifications. Same routes as the Python reference backend in `/backend`.

## One-time setup (about 10 minutes)

### 1. Cloudflare (free account, no card)
1. Sign up at https://dash.cloudflare.com/sign-up
2. Copy your **Account ID** (Workers & Pages page, right-hand side).
3. Create an API token: My Profile -> API Tokens -> Create Token -> the **Edit Cloudflare Workers** template, then add the permission **Account -> D1 -> Edit**. Copy the token.
4. In the GitHub repo: Settings -> Secrets and variables -> Actions -> add the secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

### 2. Mail (Google Apps Script, free, sends as help.jrlearners@gmail.com)
Follow the comments at the top of `mail-webhook.gs`, then save the web-app URL as the secret `MAIL_WEBHOOK_URL`. `MAIL_WEBHOOK_SECRET` is already stored in GitHub; the script needs the same value.

### 3. Admin login
Add the secrets `ADMIN_EMAIL` and `ADMIN_PASSWORD` (8+ characters with a digit). The account is created automatically.

### 4. Deploy
Actions -> **Deploy API (Cloudflare Workers)** -> Run workflow. The run summary shows the API address (`https://jrlearners-api.<you>.workers.dev`). Set the repository **variable** `API_URL` to it and re-run **Deploy JR Learners to GitHub Pages**.

## Local test
`cd worker && npm install && npm test` starts the real Workers runtime with a local database and checks registration, sign-in, lock-out, orders, PayU signatures, admin routes and the e-mails.

## Notes
- Passwords: PBKDF2-SHA256 (100,000 rounds, the Workers maximum) with a per-user salt. Tokens: HMAC-SHA256, 12 hours, revoked by a password change.
- Cloudflare's free plan limits CPU time per request. If sign-in ever fails with error 1102, password hashing hit that limit; the $5 Workers plan removes it.
- Unsent mails are retried every 10 minutes by a cron trigger.
