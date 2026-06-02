import type { Handler } from "@netlify/functions";
import { readDownloadCount } from "./lib/stats-store";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

export const handler: Handler = async () => {
  try {
    const count = await readDownloadCount();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ count }),
    };
  } catch (error) {
    console.error("Failed to read download count", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to read stats" }),
    };
  }
};
