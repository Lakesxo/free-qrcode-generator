# Free QR

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-4ecdc4.svg)](https://freeqr-code.netlify.app/)

A free, browser-first QR code generator. Paste a URL (or deep-link with `?url=`), preview a scannable code, and download a PNG — no account, no upload of your link to generate the QR.

**Live demo:** [https://freeqr-code.netlify.app/](https://freeqr-code.netlify.app/)

---

## Features

- **URL → PNG** — Generate a 512×512 QR code in the browser
- **Live preview** — Updates as you type (debounced)
- **Smart URL handling** — Adds `https://` when the protocol is missing
- **Deep linking** — Open `/?url=...` from another app to prefill and show a download modal
- **Download counter** — Tracks PNG downloads (local API in development, Netlify Functions + Blobs in production)
- **Privacy-friendly generation** — QR rendering stays on the client; only download counts hit the stats API
- **Accessible motion** — GSAP animations respect `prefers-reduced-motion`

---

## Tech stack

| Layer | Tools |
|-------|--------|
| UI | React 19, TypeScript, Vite |
| QR | [`qrcode`](https://www.npmjs.com/package/qrcode) |
| Animation | GSAP + `@gsap/react`, ScrollTrigger |
| Local stats API | Hono + JSON file store |
| Production stats | Netlify Functions + Netlify Blobs |

---

## Quick start

**Requirements:** Node.js 18+ (20+ recommended), npm.

```bash
git clone https://github.com/Lakesxo/free-qrcode-generator.git
cd free-qrcode-generator
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

`npm run dev` starts:

1. **Vite** — the React app  
2. **Local stats API** — `http://localhost:8787` (proxied as `/api` by Vite)

### Try a deep link locally

```text
http://localhost:5173/?url=https%3A%2F%2Fexample.com
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite + local Hono stats API (recommended for day-to-day work) |
| `npm run dev:web` | Vite only |
| `npm run dev:api` | Local stats API only |
| `npm run dev:netlify` | Netlify Dev (Vite + Functions as in production) |
| `npm run build` | Typecheck + production build → `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |
| `npm run start:api` | Run the local stats API (same as production-style Node server) |

---

## Deep linking (integrations)

Your product can send users here with a target URL already set.

### Contract

| Item | Value |
|------|--------|
| Query param | `url` (canonical) |
| Encoding | `encodeURIComponent(targetUrl)` |
| Example | `https://freeqr-code.netlify.app/?url=https%3A%2F%2Fexample.com%2Fpath` |

### Behavior

| Input | Result |
|-------|--------|
| Valid `url` | Hero input prefilled, QR generated immediately, modal with preview + **Download PNG** |
| Invalid `url` | No modal; raw value prefilled so the user can fix it |
| Missing `url` | Normal homepage |

### Example (JavaScript)

```js
const target = "https://example.com/invite/abc";
const freeQr = "https://freeqr-code.netlify.app/";
window.location.href = `${freeQr}?url=${encodeURIComponent(target)}`;
```

---

## Download stats

The header counter increments when someone downloads a PNG (not when a preview is generated).

### Local development

- API: `GET /api/stats`, `POST /api/stats/increment`
- Storage: `data/stats.json` (created on first use; gitignored)
- Vite proxies `/api` → `http://localhost:8787`

### Production (Netlify)

- Same paths via redirects in `netlify.toml`
- Handlers: `netlify/functions/stats.ts`, `netlify/functions/stats-increment.ts`
- Storage: Netlify Blobs (`free-qrcode-stats` / `downloads`)
- Functions call `connectLambda(event)` so Blobs get the correct runtime context

If the stats API is unavailable, the app still generates and downloads QR codes; the counter may stay at `0`.

Optional: set `VITE_API_BASE` at build time if the API lives on another origin.

---

## Deploy to Netlify

This repo is set up for Netlify via `netlify.toml`:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Functions:** `netlify/functions`
- **Redirects:** `/api/stats` and `/api/stats/increment` → Functions; SPA fallback for the app

### Steps

1. Push to GitHub (or connect this repository).
2. Create a new Netlify site from the repo.
3. Confirm build settings match `netlify.toml` (usually auto-detected).
4. Deploy.
5. Verify:
   - Site loads
   - `https://your-site.netlify.app/api/stats` returns `{"count":…}`
   - Downloading a PNG increments the counter

---

## Project structure

```text
├── netlify/
│   └── functions/          # Production stats API (Blobs)
├── server/                 # Local Hono stats API
├── src/
│   ├── components/         # UI (Hero, QrPreview, DeepLinkQrModal, …)
│   ├── context/            # Stats provider
│   ├── hooks/              # useQrCode, useUrlValidation, useQrDownload, …
│   ├── lib/                # qr.ts, deepLink.ts, stats.ts
│   └── styles/             # Design tokens
├── data/                   # Local stats file (gitignored contents)
├── netlify.toml
└── package.json
```

---

## Contributing

Contributions are welcome — bug fixes, docs, accessibility, and focused features.

### 1. Fork and branch

```bash
git clone https://github.com/<your-username>/free-qrcode-generator.git
cd free-qrcode-generator
git checkout -b feat/your-change
npm install
npm run dev
```

### 2. Make a focused change

- Prefer one concern per PR (feature, fix, or docs).
- Match existing patterns: TypeScript, CSS modules/files next to components, GSAP via `useGSAP` with a scope.
- Keep the playful UI direction unless you’re intentionally improving accessibility or clarity.
- Don’t commit secrets, local `data/stats.json`, or `dist/`.

### 3. Check before opening a PR

```bash
npm run lint
npm run build
```

Manually verify:

- [ ] Paste a URL → preview updates  
- [ ] Download PNG works  
- [ ] Invalid URL shows an error (no crash)  
- [ ] Deep link: `/?url=https%3A%2F%2Fexample.com` opens the modal when valid  
- [ ] Counter updates after download when the stats API is running  

### 4. Open a pull request

- Describe **what** changed and **why**.
- Link related issues.
- Include screenshots or a short clip for UI changes.
- Keep the PR reviewable (small > huge).

### Ideas for contribution

Open an issue first for larger ideas. Good starting points:

- Accessibility and keyboard polish  
- Tests for URL validation / deep-link parsing  
- SVG export, colors, or error-correction options  
- Docs and examples for more host platforms  

---

## Privacy

- **QR generation** runs in the browser; the target URL is not sent to a server to create the code.
- **Download counting** only records that a download happened (a number). It does not store the URL you encoded.

---

## Author

Built by [Ridwan Ajanaku](https://olakunle.dev).

---

## License

This project is licensed under the [MIT License](./LICENSE).
