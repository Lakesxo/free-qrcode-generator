import QRCode from "qrcode";

export const QR_SIZE = 512;

export type QrGenerateResult =
  | { ok: true; dataUrl: string }
  | { ok: false; error: string };

export async function generateQrDataUrl(value: string): Promise<QrGenerateResult> {
  try {
    const dataUrl = await QRCode.toDataURL(value, {
      width: QR_SIZE,
      margin: 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#1e1633",
        light: "#ffffff",
      },
    });
    return { ok: true, dataUrl };
  } catch {
    return { ok: false, error: "Could not generate QR code. Check the URL and try again." };
  }
}

export function downloadDataUrl(dataUrl: string, filename = "qrcode.png") {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
