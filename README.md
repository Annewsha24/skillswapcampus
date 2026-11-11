# SkillSwap

Peer-to-peer skill exchange for students. Post what you can teach and what you want to learn; mutual matches are highlighted automatically, and you can send a swap request in one click.

Built with React + Vite. Demo data lives in the browser (`localStorage`), so no backend or secrets are needed.

## Run locally

```bash
npm install
npm run dev
```

## Security considerations (OWASP-aligned)

| Risk | What this project does |
|---|---|
| A03 Injection / XSS | All text is rendered by React (no `dangerouslySetInnerHTML`) and also stripped of control characters and `<`, `>` and backticks on input (`src/security.js`). |
| A04 Insecure design | Posting is rate-limited (3 per minute) and every field has a length cap, which limits spam. |
| A08 Integrity failures | Data read back from `localStorage` is shape-checked, so tampered storage falls back to safe defaults. |
| A05 Misconfiguration | `vercel.json` sets a strict Content-Security-Policy (`script-src 'self'`), `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy and Permissions-Policy. |
| Secrets | None in the repo. `.env*` is git-ignored. |

**Production hardening (next steps):** real authentication, server-side validation and rate limiting, and a shared database. The client-side checks here are a first line of defence, not a replacement.

## Deploy

### 1. Push to GitHub

Create a new **public**, empty repository named `skillswap-campus` on GitHub (no README), then in this folder run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/skillswap-campus.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to vercel.com and log in with GitHub.
2. Click **Add New > Project** and select the `skillswap-campus` repository.
3. Vite is detected automatically (build `npm run build`, output `dist`). Click **Deploy**.
4. Copy the live URL when it finishes.

### 3. Submit

Add your name, the GitHub repo link and the live Vercel link to the tracking sheet.
