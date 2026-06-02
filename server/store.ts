import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const STATS_FILE = path.join(DATA_DIR, "stats.json");

type StatsFile = {
  count: number;
};

async function readStatsFile(): Promise<StatsFile> {
  try {
    const raw = await readFile(STATS_FILE, "utf8");
    const parsed = JSON.parse(raw) as StatsFile;
    if (typeof parsed.count === "number" && parsed.count >= 0) {
      return parsed;
    }
  } catch {
    // fall through to default
  }

  return { count: 0 };
}

async function writeStatsFile(stats: StatsFile) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(STATS_FILE, JSON.stringify(stats, null, 2), "utf8");
}

export async function readCount(): Promise<number> {
  const stats = await readStatsFile();
  return stats.count;
}

export async function incrementCount(): Promise<number> {
  const stats = await readStatsFile();
  stats.count += 1;
  await writeStatsFile(stats);
  return stats.count;
}
