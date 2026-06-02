const API_BASE = import.meta.env.VITE_API_BASE ?? "";

type StatsResponse = {
  count: number;
};

async function parseStatsResponse(response: Response): Promise<number | null> {
  if (!response.ok) return null;

  try {
    const data = (await response.json()) as StatsResponse;
    return typeof data.count === "number" ? data.count : null;
  } catch {
    return null;
  }
}

export async function fetchDownloadCount(): Promise<number | null> {
  try {
    const response = await fetch(`${API_BASE}/api/stats`);
    return parseStatsResponse(response);
  } catch {
    return null;
  }
}

export async function recordDownload(): Promise<number | null> {
  try {
    const response = await fetch(`${API_BASE}/api/stats/increment`, {
      method: "POST",
    });
    return parseStatsResponse(response);
  } catch {
    return null;
  }
}
