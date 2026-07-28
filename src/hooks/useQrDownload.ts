import { useCallback } from "react";
import { downloadDataUrl } from "../lib/qr";
import { useStats } from "./useStats";

export function useQrDownload() {
  const { trackDownload } = useStats();

  return useCallback(
    (dataUrl: string) => {
      downloadDataUrl(dataUrl);
      void trackDownload();
    },
    [trackDownload],
  );
}
