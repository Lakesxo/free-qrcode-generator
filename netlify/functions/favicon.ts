import type { Handler } from "@netlify/functions";

const DEFAULT_SIZE = 128;
const ALLOWED_SIZES = new Set([16, 32, 64, 128, 256]);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
};

function isSafeHostname(value: string): boolean {
  if (!value || value.length > 253) return false;
  if (value.includes("/") || value.includes(":") || value.includes(" ")) return false;
  if (!/^[a-z0-9.-]+$/i.test(value)) return false;
  if (!value.includes(".")) return false;
  return true;
}

function normalizeSize(raw: string | undefined): number {
  const parsed = Number.parseInt(raw ?? "", 10);
  if (ALLOWED_SIZES.has(parsed)) return parsed;
  return DEFAULT_SIZE;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const domain = event.queryStringParameters?.domain?.trim() ?? "";
  const size = normalizeSize(event.queryStringParameters?.sz);

  if (!isSafeHostname(domain)) {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid domain" }),
    };
  }

  try {
    const upstream = new URL("https://www.google.com/s2/favicons");
    upstream.searchParams.set("domain", domain);
    upstream.searchParams.set("sz", String(size));

    const response = await fetch(upstream, {
      redirect: "follow",
      headers: { Accept: "image/*" },
    });

    if (!response.ok) {
      return {
        statusCode: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Favicon unavailable" }),
      };
    }

    const contentType = response.headers.get("content-type") ?? "image/png";
    if (!contentType.startsWith("image/")) {
      return {
        statusCode: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Favicon unavailable" }),
      };
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.byteLength === 0 || bytes.byteLength > 500_000) {
      return {
        statusCode: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Favicon unavailable" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
      body: bytes.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error("Favicon proxy failed", error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Favicon proxy failed" }),
    };
  }
};
