import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import QRCode from "qrcode";
import { loadEnv } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const env = loadEnv("production", root, "VITE_");
const siteUrl = (process.env.VITE_SITE_URL || env.VITE_SITE_URL || "").replace(/\/+$/, "");
if (!siteUrl) throw new Error("VITE_SITE_URL is not set.");

const chrome =
  process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const logo = (await readFile(join(root, "public/favicon.svg"), "utf8")).replace(/\s*\n\s*/g, "");
const qr = await QRCode.toString(`${siteUrl}/`, {
  type: "svg",
  margin: 2,
  errorCorrectionLevel: "H",
  color: { dark: "#1e1633", light: "#ffffff" },
});
const check =
  '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#1f6b5c"/><path d="M6 10.4l2.6 2.6L14 7.6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const template = await readFile(join(root, "scripts/og/og.html"), "utf8");
const html = template
  .replaceAll("%LOGO%", logo)
  .replaceAll("%CHECK%", check)
  .replace("%QR%", qr)
  .replace("%HOST%", new URL(siteUrl).host);

const dir = await mkdtemp(join(tmpdir(), "qrbie-og-"));
const page = join(dir, "og.html");
await writeFile(page, html);

const out = process.env.OG_OUT || join(root, "public/og.png");
execFileSync(chrome, [
  "--headless=new",
  "--hide-scrollbars",
  "--force-device-scale-factor=1",
  "--window-size=1200,630",
  "--virtual-time-budget=15000",
  `--screenshot=${out}`,
  pathToFileURL(page).href,
], { stdio: "ignore" });

console.log(`Wrote public/og.png with a QR code for ${siteUrl}/`);
