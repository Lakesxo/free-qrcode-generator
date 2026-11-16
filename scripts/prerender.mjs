import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadEnv } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = new URL("../dist/", import.meta.url);
const env = loadEnv("production", root, "VITE_");
const siteUrl = (process.env.VITE_SITE_URL || env.VITE_SITE_URL || "").replace(/\/+$/, "");

if (!siteUrl) {
  throw new Error("VITE_SITE_URL is not set. Add it to .env or the build environment.");
}

const { render, structuredData } = await import(
  pathToFileURL(fileURLToPath(new URL("../dist-ssr/entry-server.js", import.meta.url))).href
);

const indexUrl = new URL("index.html", dist);
const template = await readFile(indexUrl, "utf8");

if (!template.includes('<div id="root"></div>')) {
  throw new Error('dist/index.html has no empty <div id="root"></div> to prerender into.');
}

const jsonLd = JSON.stringify(structuredData(siteUrl)).replace(/</g, "\\u003c");
const html = template
  .replace('<div id="root"></div>', `<div id="root">${render()}</div>`)
  .replace(
    "</head>",
    `  <script type="application/ld+json">${jsonLd}</script>\n  </head>`,
  );

await writeFile(indexUrl, html);

await writeFile(
  new URL("robots.txt", dist),
  `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);

const today = new Date().toISOString().slice(0, 10);
await writeFile(
  new URL("sitemap.xml", dist),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
  </url>
</urlset>
`,
);

console.log(`Prerendered dist/index.html, robots.txt and sitemap.xml for ${siteUrl}`);
