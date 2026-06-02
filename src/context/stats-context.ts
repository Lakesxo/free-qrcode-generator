import { createContext } from "react";

export type StatsContextValue = {
  count: number | null;
  trackDownload: () => Promise<void>;
};

export const StatsContext = createContext<StatsContextValue | null>(null);
