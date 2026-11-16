/** Integration: `/?url=${encodeURIComponent(targetUrl)}` */
export function getDeepLinkUrlParam(): string | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("url");
  if (!value) return null;

  try {
    const decoded = decodeURIComponent(value).trim();
    return decoded || null;
  } catch {
    const trimmed = value.trim();
    return trimmed || null;
  }
}
