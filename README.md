# Qrbie

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-1f6b5c.svg)](https://qrbie.netlify.app/)

**Qrbie** (QR + freebie) is a free, browser-first QR code generator. Paste a URL (or deep-link with `?url=`), preview a scannable code with the site favicon, and download a PNG. No account. No upload of your link to generate the QR.

**Live demo:** [https://qrbie.netlify.app/](https://qrbie.netlify.app/)

---

## Features

- **URL → PNG**: Generate a 512×512 QR code in the browser
- **Live preview**: Updates as you type (debounced)
- **Smart URL handling**: Adds `https://` when the protocol is missing
- **Deep linking**: Open `/?url=...` from another app to prefill and show a download modal
- **Download counter**: Tracks PNG downloads (local API in development, Netlify Functions + Blobs in production)
- **Privacy-friendly generation**: QR rendering stays on the client; only download counts hit the stats API
- **Accessible motion**: GSAP animations respect `prefers-reduced-motion`

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

1. **Vite**: the React app  
2. **Local stats API**: `http://localhost:8787` (proxied as `/api` by Vite)

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
| Example | `https://qrbie.netlify.app/?url=https%3A%2F%2Fexample.com%2Fpath` |

### Behavior

| Input | Result |
|-------|--------|
| Valid `url` | Hero input prefilled, QR generated immediately, modal with preview + **Download PNG** |
| Invalid `url` | No modal; raw value prefilled so the user can fix it |
| Missing `url` | Normal homepage |

### Example (JavaScript)

```js
const target = "https://example.com/invite/abc";
const qrbie = "https://qrbie.netlify.app/";
window.location.href = `${qrbie}?url=${encodeURIComponent(target)}`;
```

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

Contributions are welcome: bug fixes, docs, accessibility, and focused features.

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
- Match existing patterns: TypeScript, CSS next to components, GSAP via `useGSAP` with a scope.
- Keep the current premium visual direction unless the PR is intentionally about redesign or accessibility.
- Don’t commit secrets, local `data/stats.json`, or `dist/`.

### 3. Check before opening a PR

Run:

```bash
npm run lint
npm run build
```

Both must pass.

Then manually smoke-test the flows your change could affect (at minimum the core path if you touched QR, UI, deep link, or stats):

- [ ] Paste a valid URL → preview updates (favicon branding when the favicon API is up)
- [ ] Download PNG works
- [ ] Invalid URL shows an inline error (no crash)
- [ ] Deep link `/?url=https%3A%2F%2Fexample.com` opens the modal when valid
- [ ] Counter updates after download when the stats API is running (`npm run dev`)

### 4. Open a pull request (required proof)

PRs should be small enough to review. In the PR description, include:

1. **Summary:** what changed and why (link the issue if there is one).
2. **Test plan:** paste the checklist above and mark what you ran. Note anything you skipped and why.
3. **Proof**
   - **UI changes:** before/after screenshots, or a short screen recording (desktop and/or mobile as relevant).
   - **QR / download / deep-link behavior:** screenshot of the preview or modal, and confirm download still produces a scannable PNG.
   - **API / stats / favicon proxy:** note the exact requests you hit (e.g. `GET /api/stats`, `GET /api/favicon?domain=…`) and the result.
   - **Docs-only:** no screenshots required; say which sections you updated.
4. **Risk / notes:** anything reviewers should watch for (breaking deep-link contract, Netlify-only behavior, etc.).

PRs missing a test plan or proof for behavioral/UI changes may be asked to update before review.

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
