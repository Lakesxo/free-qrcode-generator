import type { Handler } from "@netlify/functions";
import { connectLambda } from "@netlify/blobs";
import { corsHeaders, incrementDownloadCount } from "./lib/stats-store";

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  connectLambda(event);

  try {
    const count = await incrementDownloadCount();
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ count }),
    };
  } catch (error) {
    console.error("Failed to increment download count", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to update stats" }),
    };
  }
};
