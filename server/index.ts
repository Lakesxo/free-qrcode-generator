import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  fetchGoogleFavicon,
  normalizeFaviconSize,
} from "./favicon.js";
import { incrementCount, readCount } from "./store.js";

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: "*",
  }),
);

app.get("/api/favicon", async (c) => {
  const domain = c.req.query("domain")?.trim() ?? "";
  const size = normalizeFaviconSize(c.req.query("sz") ?? undefined);
  const icon = await fetchGoogleFavicon(domain, size);

  if (!icon) {
    return c.json({ error: "Favicon unavailable" }, 404);
  }

  return new Response(icon.bytes, {
    status: 200,
    headers: {
      "Content-Type": icon.contentType,
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
});

app.get("/api/stats", async (c) => {
  const count = await readCount();
  return c.json({ count });
});

app.post("/api/stats/increment", async (c) => {
  const count = await incrementCount();
  return c.json({ count });
});


const port = Number(process.env.PORT ?? 8787);

serve(
  {
    fetch: app.fetch,
    port,
  },
  () => {
    console.log(`Stats API listening on http://localhost:${port}`);
  },
);
