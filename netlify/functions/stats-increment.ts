import type { Handler } from "@netlify/functions";
import { incrementDownloadCount } from "./lib/stats-store";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const count = await incrementDownloadCount();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ count }),
    };
  } catch (error) {
    console.error("Failed to increment download count", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to update stats" }),
    };
  }
};
