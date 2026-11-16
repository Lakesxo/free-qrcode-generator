import { createCanvas, registerFont } from "canvas";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const root = fileURLToPath(new URL("..", import.meta.url));
const fontsDir = path.join(root, "scripts", "fonts");
const outFile = path.join(root, "public", "og.png");

registerFont(path.join(fontsDir, "ShantellSans-Bold.ttf"), {
  family: "Shantell Sans",
  weight: "700",
  style: "normal",
});
registerFont(path.join(fontsDir, "ShantellSans-Italic.ttf"), {
  family: "Shantell Sans",
  weight: "700",
  style: "italic",
});
registerFont(path.join(fontsDir, "Outfit-Regular.ttf"), {
  family: "Outfit",
  weight: "400",
  style: "normal",
});

const SCALE = 2;
const OUT_W = 1200;
const OUT_H = 630;
const W = OUT_W * SCALE;
const H = OUT_H * SCALE;

const BG = "#f3f2ef";
const BG_DEEP = "#ebe9e4";
const INK = "#141414";
const MUTED = "#6a6864";
const ACCENT = "#1f6b5c";
const ACCENT_SOFT = "#e6f1ee";
const SURFACE = "#ffffff";
const BORDER = "#ddd9d2";
const QR_DARK = "#1e1633";

function s(n) {
  return n * SCALE;
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/** Crisp Qrbie mark matching public/favicon.svg */
function drawMark(ctx, x, y, size) {
  const r = size * 0.25;
  const gap = size * (6 / 32);
  const tile = size * (8 / 32);
  const small = size * (3.5 / 32);
  const smallGap = size * (0.5 / 32);

  ctx.fillStyle = INK;
  roundRect(ctx, x, y, size, size, r);
  ctx.fill();

  const cells = [
    [gap, gap, tile, tile, ACCENT],
    [gap * 2 + tile, gap, tile, tile, "#f3f2ef"],
    [gap, gap * 2 + tile, tile, tile, "#f3f2ef"],
  ];
  for (const [cx, cy, cw, ch, color] of cells) {
    ctx.fillStyle = color;
    roundRect(ctx, x + cx, y + cy, cw, ch, size * (1.5 / 32));
    ctx.fill();
  }

  const ox = gap * 2 + tile;
  const oy = gap * 2 + tile;
  const dots = [
    [0, 0, ACCENT],
    [small + smallGap, 0, "#f3f2ef"],
    [0, small + smallGap, "#f3f2ef"],
    [small + smallGap, small + smallGap, ACCENT],
  ];
  for (const [dx, dy, color] of dots) {
    ctx.fillStyle = color;
    roundRect(ctx, x + ox + dx, y + oy + dy, small, small, size * (0.75 / 32));
    ctx.fill();
  }
}

function paintBackground(ctx) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // Soft paper washes
  const washes = [
    [s(160), s(80), s(12), s(420), "rgba(31, 107, 92, 0.18)", "rgba(31, 107, 92, 0)"],
    [s(1040), s(140), s(20), s(380), "rgba(210, 198, 170, 0.45)", "rgba(210, 198, 170, 0)"],
    [s(620), s(700), s(30), s(360), "rgba(235, 233, 228, 0.95)", "rgba(235, 233, 228, 0)"],
  ];
  for (const [cx, cy, r0, r1, c0, c1] of washes) {
    const g = ctx.createRadialGradient(cx, cy, r0, cx, cy, r1);
    g.addColorStop(0, c0);
    g.addColorStop(1, c1);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  // Topography-like contour fields
  ctx.save();
  ctx.lineWidth = s(1.1);
  for (let i = 0; i < 9; i++) {
    ctx.strokeStyle = `rgba(31, 107, 92, ${0.085 - i * 0.006})`;
    ctx.beginPath();
    ctx.ellipse(
      s(1020),
      s(300),
      s(140 + i * 28),
      s(168 + i * 32),
      -0.42,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
  }
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = `rgba(20, 20, 20, ${0.035 - i * 0.004})`;
    ctx.beginPath();
    ctx.ellipse(
      s(220),
      s(560),
      s(90 + i * 36),
      s(60 + i * 24),
      0.2,
      Math.PI * 1.05,
      Math.PI * 1.95,
    );
    ctx.stroke();
  }
  ctx.restore();

  // Film grain
  const image = ctx.getImageData(0, 0, W, H);
  const data = image.data;
  for (let i = 0; i < data.length; i += 16) {
    const n = ((Math.random() * 14) | 0) - 6;
    data[i] = Math.max(0, Math.min(255, data[i] + n));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n));
  }
  ctx.putImageData(image, 0, 0);

  // Soft vignette
  const vig = ctx.createRadialGradient(W / 2, H / 2, s(200), W / 2, H / 2, s(740));
  vig.addColorStop(0, "rgba(20, 20, 20, 0)");
  vig.addColorStop(1, "rgba(20, 20, 20, 0.07)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);
}

async function buildQrImage(size) {
  const canvas = createCanvas(size, size);
  await QRCode.toCanvas(canvas, "https://qrbie.app", {
    width: size,
    margin: 2,
    errorCorrectionLevel: "H",
    color: { dark: QR_DARK, light: "#ffffff" },
  });

  const ctx = canvas.getContext("2d");
  const plate = size * 0.2;
  const plateX = (size - plate) / 2;
  const plateY = (size - plate) / 2;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, plateX, plateY, plate, plate, plate * 0.22);
  ctx.fill();
  drawMark(ctx, plateX + plate * 0.15, plateY + plate * 0.15, plate * 0.7);
  return canvas;
}

function drawTrackedText(ctx, text, x, y, tracking = 0) {
  if (!tracking) {
    ctx.fillText(text, x, y);
    return;
  }
  let cursor = x;
  for (const ch of text) {
    ctx.fillText(ch, cursor, y);
    cursor += ctx.measureText(ch).width + tracking;
  }
}

const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

paintBackground(ctx);

// ── Left column ──────────────────────────────────────────────
const leftX = s(64);
const markSize = s(48);
drawMark(ctx, leftX, s(56), markSize);

ctx.fillStyle = INK;
ctx.font = `700 ${s(40)}px "Shantell Sans"`;
ctx.textBaseline = "middle";
ctx.fillText("Qrbie", leftX + markSize + s(14), s(56) + markSize / 2);

ctx.fillStyle = MUTED;
ctx.font = `500 ${s(12)}px Outfit`;
ctx.textBaseline = "alphabetic";
drawTrackedText(ctx, "FREE FOREVER · NO SIGN-UP", leftX, s(168), s(1.8));

ctx.fillStyle = INK;
ctx.font = `700 ${s(72)}px "Shantell Sans"`;
ctx.fillText("Paste a link.", leftX, s(268));

ctx.fillStyle = ACCENT;
ctx.font = `italic 700 ${s(72)}px "Shantell Sans"`;
ctx.fillText("Get a QR.", leftX, s(348));

ctx.fillStyle = MUTED;
ctx.font = `400 ${s(22)}px Outfit`;
ctx.fillText("No watermark. Never expires.", leftX, s(418));
ctx.fillText("Crisp PNG, made in your browser.", leftX, s(450));

ctx.fillStyle = ACCENT_SOFT;
roundRect(ctx, leftX, s(492), s(158), s(34), s(999));
ctx.fill();
ctx.fillStyle = ACCENT;
ctx.font = `600 ${s(12)}px Outfit`;
ctx.textBaseline = "middle";
drawTrackedText(ctx, "BROWSER ONLY", leftX + s(20), s(509), s(1.4));

// ── Preview card (fits inside 630 with margin) ───────────────
const cardX = s(640);
const cardY = s(52);
const cardW = s(496);
const cardPad = s(18);
const cardRadius = s(26);
const metaH = s(40);
const btnH = s(46);
const btnGap = s(12);
const bottomPad = s(18);
const frameSize = cardW - cardPad * 2;
// Ensure card bottom stays inside canvas with room for shadow
const maxCardBottom = s(630 - 36);
const cardH = Math.min(
  cardPad + metaH + frameSize + btnGap + btnH + bottomPad,
  maxCardBottom - cardY,
);
const fitFrame = cardH - cardPad - metaH - btnGap - btnH - bottomPad;

ctx.save();
ctx.shadowColor = "rgba(20, 20, 20, 0.16)";
ctx.shadowBlur = s(40);
ctx.shadowOffsetY = s(18);
ctx.fillStyle = SURFACE;
roundRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
ctx.fill();
ctx.restore();

ctx.strokeStyle = BORDER;
ctx.lineWidth = s(1);
roundRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
ctx.stroke();

ctx.fillStyle = MUTED;
ctx.font = `500 ${s(11)}px Outfit`;
ctx.textBaseline = "alphabetic";
drawTrackedText(ctx, "PREVIEW", cardX + cardPad + s(2), cardY + s(30), s(1.5));
ctx.textAlign = "right";
ctx.fillText("512 × 512", cardX + cardW - cardPad - s(2), cardY + s(30));
ctx.textAlign = "left";

const frameX = cardX + cardPad;
const frameY = cardY + metaH;
ctx.fillStyle = BG_DEEP;
roundRect(ctx, frameX, frameY, frameSize, fitFrame, s(14));
ctx.fill();
ctx.strokeStyle = "rgba(0,0,0,0.05)";
ctx.lineWidth = s(1);
roundRect(ctx, frameX, frameY, frameSize, fitFrame, s(14));
ctx.stroke();

const qr = await buildQrImage(s(512));
const qrInset = s(14);
const qrBox = Math.min(frameSize, fitFrame) - qrInset * 2;
const qrX = frameX + (frameSize - qrBox) / 2;
const qrY = frameY + (fitFrame - qrBox) / 2;

ctx.save();
roundRect(ctx, qrX, qrY, qrBox, qrBox, s(8));
ctx.clip();
ctx.drawImage(qr, qrX, qrY, qrBox, qrBox);
ctx.restore();

ctx.strokeStyle = "rgba(0,0,0,0.08)";
ctx.lineWidth = s(1);
roundRect(ctx, qrX, qrY, qrBox, qrBox, s(8));
ctx.stroke();

const btnY = frameY + fitFrame + btnGap;
ctx.fillStyle = INK;
roundRect(ctx, frameX, btnY, frameSize, btnH, s(12));
ctx.fill();
ctx.fillStyle = "#ffffff";
ctx.font = `500 ${s(15)}px Outfit`;
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("Download PNG", frameX + frameSize / 2, btnY + btnH / 2);
ctx.textAlign = "left";

// Downscale 2× → crisp 1200×630
const finalCanvas = createCanvas(OUT_W, OUT_H);
const finalCtx = finalCanvas.getContext("2d");
finalCtx.imageSmoothingEnabled = true;
finalCtx.imageSmoothingQuality = "high";
finalCtx.drawImage(canvas, 0, 0, OUT_W, OUT_H);

await mkdir(path.dirname(outFile), { recursive: true });
await writeFile(outFile, finalCanvas.toBuffer("image/png"));
console.log(`Wrote ${outFile}`);
