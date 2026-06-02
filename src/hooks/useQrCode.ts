import { useEffect, useState } from "react";
import { generateQrDataUrl, isQrGenerateFailure } from "../lib/qr";

type QrState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; dataUrl: string }
  | { status: "error"; message: string };

type GenerationCache = {
  key: string;
  state: Exclude<QrState, { status: "idle" }>;
};

export function useQrCode(url: string | null, enabled: boolean): QrState {
  const [generation, setGeneration] = useState<GenerationCache | null>(null);
  const requestKey = enabled && url ? url : "";

  useEffect(() => {
    if (!requestKey) return;

    let cancelled = false;

    const timer = window.setTimeout(async () => {
      setGeneration({ key: requestKey, state: { status: "loading" } });

      const result = await generateQrDataUrl(requestKey);
      if (cancelled) return;

      if (isQrGenerateFailure(result)) {
        setGeneration({
          key: requestKey,
          state: { status: "error", message: result.error },
        });
        return;
      }

      setGeneration({
        key: requestKey,
        state: { status: "ready", dataUrl: result.dataUrl },
      });
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [requestKey]);

  if (!requestKey) {
    return { status: "idle" };
  }

  if (!generation || generation.key !== requestKey) {
    return { status: "loading" };
  }

  return generation.state;
}
