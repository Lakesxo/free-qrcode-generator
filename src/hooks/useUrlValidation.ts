import { useMemo } from "react";

export type UrlValidation =
  | { valid: false; normalized: string; error: string | null }
  | { valid: true; normalized: string; error: null };

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function useUrlValidation(input: string): UrlValidation {
  return useMemo(() => {
    const normalized = normalizeUrl(input);

    if (!normalized) {
      return { valid: false, normalized: "", error: null };
    }

    if (!isValidHttpUrl(normalized)) {
      return {
        valid: false,
        normalized,
        error: "Enter a valid URL — like example.com or https://yoursite.com",
      };
    }

    return { valid: true, normalized, error: null };
  }, [input]);
}
