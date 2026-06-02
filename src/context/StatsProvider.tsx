import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchDownloadCount, recordDownload } from "../lib/stats";
import { StatsContext } from "./stats-context";

export function StatsProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetchDownloadCount().then(setCount);
  }, []);

  const trackDownload = useCallback(async () => {
    const nextCount = await recordDownload();
    if (nextCount !== null) {
      setCount(nextCount);
    }
  }, []);

  const value = useMemo(
    () => ({
      count,
      trackDownload,
    }),
    [count, trackDownload],
  );

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
}
