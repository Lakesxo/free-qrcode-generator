const DEFAULT_SIZE = 128;
const ALLOWED_SIZES = new Set([16, 32, 64, 128, 256]);

/** Hostnames only. Blocks URLs / SSRF-ish input. */
export function isSafeHostname(value: string): boolean {
  if (!value || value.length > 253) return false;
  if (value.includes("/") || value.includes(":") || value.includes(" ")) return false;
  if (!/^[a-z0-9.-]+$/i.test(value)) return false;
  if (!value.includes(".")) return false;
  return true;
}

export function normalizeFaviconSize(raw: string | undefined): number {
  const parsed = Number.parseInt(raw ?? "", 10);
  if (ALLOWED_SIZES.has(parsed)) return parsed;
  return DEFAULT_SIZE;
}

export function googleFaviconUpstream(hostname: string, size: number): string {
  const params = new URLSearchParams({
    domain: hostname,
    sz: String(size),
  });
  return `https://www.google.com/s2/favicons?${params.toString()}`;
}

export async function fetchGoogleFavicon(
  hostname: string,
  size: number,
): Promise<{ bytes: ArrayBuffer; contentType: string } | null> {
  if (!isSafeHostname(hostname)) return null;

  try {
    const response = await fetch(googleFaviconUpstream(hostname, size), {
      redirect: "follow",
      headers: {
        Accept: "image/*",
      },
    });

    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") ?? "image/png";
    if (!contentType.startsWith("image/")) return null;

    const bytes = await response.arrayBuffer();
    if (bytes.byteLength === 0 || bytes.byteLength > 500_000) return null;

    return { bytes, contentType };
  } catch {
    return null;
  }
}
