import { getStore } from "@netlify/blobs";

const STORE_NAME = "qrbie-stats";
const COUNT_KEY = "downloads";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

function parseCount(value: string | null): number {
  if (!value) return 0;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function getStatsStore() {
  return getStore(STORE_NAME);
}

export async function readDownloadCount(): Promise<number> {
  const store = getStatsStore();
  const value = await store.get(COUNT_KEY, { type: "text" });
  return parseCount(value);
}

export async function incrementDownloadCount(): Promise<number> {
  const store = getStatsStore();
  const current = parseCount(await store.get(COUNT_KEY, { type: "text" }));
  const next = current + 1;
  await store.set(COUNT_KEY, String(next));
  return next;
}
