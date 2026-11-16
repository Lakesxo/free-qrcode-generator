import QRCode from "qrcode";
import { loadFaviconForUrl } from "./favicon";

export const QR_SIZE = 512;

const PLATE_RATIO = 0.2;
const ICON_RATIO = 0.7;
const PLATE_RADIUS_RATIO = 0.22;

export type QrGenerateResult =
  | { ok: true; dataUrl: string }
  | { ok: false; error: string };

export function isQrGenerateFailure(
  result: QrGenerateResult,
): result is Extract<QrGenerateResult, { ok: false }> {
  return result.ok === false;
}

const qrOptions = {
  width: QR_SIZE,
  margin: 2,
  errorCorrectionLevel: "H" as const,
  color: {
    dark: "#1e1633",
    light: "#ffffff",
  },
};

async function generatePlainQrDataUrl(value: string): Promise<string> {
  return QRCode.toDataURL(value, qrOptions);
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function compositeFavicon(
  qrDataUrl: string,
  favicon: HTMLImageElement,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = QR_SIZE;
    canvas.height = QR_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas unavailable"));
      return;
    }

    const qrImage = new Image();
    qrImage.onload = () => {
      try {
        ctx.drawImage(qrImage, 0, 0, QR_SIZE, QR_SIZE);

        const plateSize = QR_SIZE * PLATE_RATIO;
        const plateX = (QR_SIZE - plateSize) / 2;
        const plateY = (QR_SIZE - plateSize) / 2;
        const radius = plateSize * PLATE_RADIUS_RATIO;

        ctx.fillStyle = "#ffffff";
        drawRoundedRect(ctx, plateX, plateY, plateSize, plateSize, radius);
        ctx.fill();

        const iconSize = plateSize * ICON_RATIO;
        const iconX = (QR_SIZE - iconSize) / 2;
        const iconY = (QR_SIZE - iconSize) / 2;
        ctx.drawImage(favicon, iconX, iconY, iconSize, iconSize);

        resolve(canvas.toDataURL("image/png"));
      } catch (error) {
        reject(error);
      }
    };
    qrImage.onerror = () => reject(new Error("Failed to load QR image"));
    qrImage.src = qrDataUrl;
  });
}

export async function generateQrDataUrl(value: string): Promise<QrGenerateResult> {
  try {
    const plainDataUrl = await generatePlainQrDataUrl(value);
    const favicon = await loadFaviconForUrl(value);

    if (!favicon) {
      return { ok: true, dataUrl: plainDataUrl };
    }

    try {
      const brandedDataUrl = await compositeFavicon(plainDataUrl, favicon);
      return { ok: true, dataUrl: brandedDataUrl };
    } catch {
      return { ok: true, dataUrl: plainDataUrl };
    }
  } catch {
    return {
      ok: false,
      error: "Could not generate QR code. Check the URL and try again.",
    };
  }
}

export function downloadDataUrl(dataUrl: string, filename = "qrbie.png") {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
