import { useCallback } from "react";
import { downloadDataUrl } from "../lib/qr";
import { useStats } from "./useStats";

export function useQrDownload() {
  const { trackDownload } = useStats();

  return useCallback(
    async (dataUrl: string) => {
      if (await downloadDataUrl(dataUrl)) void trackDownload();
    },
    [trackDownload],
  );
}
