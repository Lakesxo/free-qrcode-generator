const FAVICON_SIZE = 128;
const LOAD_TIMEOUT_MS = 3000;

const imageCache = new Map<string, HTMLImageElement | null>();

export function getHostnameFromUrl(value: string): string | null {
  try {
    return new URL(value).hostname || null;
  } catch {
    return null;
  }
}

/** Same-origin proxy → Google Favicon service (needed for untainted canvas export). */
export function getFaviconRequestUrl(hostname: string): string {
  const apiBase = import.meta.env.VITE_API_BASE ?? "";
  const params = new URLSearchParams({
    domain: hostname,
    sz: String(FAVICON_SIZE),
  });
  return `${apiBase}/api/favicon?${params.toString()}`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";

    const timer = window.setTimeout(() => {
      image.src = "";
      reject(new Error("Favicon load timed out"));
    }, LOAD_TIMEOUT_MS);

    image.onload = () => {
      window.clearTimeout(timer);
      resolve(image);
    };
    image.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error("Favicon failed to load"));
    };

    image.src = src;
  });
}

export async function loadFaviconForUrl(pageUrl: string): Promise<HTMLImageElement | null> {
  const hostname = getHostnameFromUrl(pageUrl);
  if (!hostname) return null;

  if (imageCache.has(hostname)) {
    return imageCache.get(hostname) ?? null;
  }

  try {
    const image = await loadImage(getFaviconRequestUrl(hostname));
    imageCache.set(hostname, image);
    return image;
  } catch {
    imageCache.set(hostname, null);
    return null;
  }
}
