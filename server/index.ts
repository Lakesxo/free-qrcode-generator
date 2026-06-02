import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { incrementCount, readCount } from "./store.js";

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: "*",
  }),
);

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
