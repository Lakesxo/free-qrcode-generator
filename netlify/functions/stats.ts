import type { Handler } from "@netlify/functions";
import { connectLambda } from "@netlify/blobs";
import { corsHeaders, readDownloadCount } from "./lib/stats-store";

export const handler: Handler = async (event) => {
  connectLambda(event);

  try {
    const count = await readDownloadCount();
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ count }),
    };
  } catch (error) {
    console.error("Failed to read download count", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to read stats" }),
    };
  }
};
