import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// In-memory cache to store resolved OneDrive direct URLs so we only do the slow fetch once
const resolvedCache = new Map<string, string>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to resolve OneDrive short urls (1drv.ms/i/c) to direct downloadable links
  app.get("/api/resolve-onedrive", async (req, res) => {
    const rawUrl = req.query.url as string;
    if (!rawUrl) {
      return res.status(400).json({ error: "Missing 'url' parameter" });
    }

    // Return from cache if we already resolved it
    if (resolvedCache.has(rawUrl)) {
      return res.json({ resolvedUrl: resolvedCache.get(rawUrl) });
    }

    try {
      console.log(`[OneDrive Resolver] Resolving sharing URL: ${rawUrl}`);

      // Perform a request to let Node follow the shortener redirects
      const response = await fetch(rawUrl, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        redirect: "follow"
      });

      const finalUrl = response.url;
      console.log(`[OneDrive Resolver] Redirected to final URL: ${finalUrl}`);

      // Example redirected URL from personal OneDrive:
      // https://onedrive.live.com/redir?resid=4DAE11835575D5C1!108&authkey=!An...&page=photo
      // We parse the URL search parameters to get resid and authkey
      const urlObj = new URL(finalUrl);
      let resid = urlObj.searchParams.get("resid") || urlObj.searchParams.get("id");
      const authkey = urlObj.searchParams.get("authkey");

      if (resid && authkey) {
        const isVideo = rawUrl.toLowerCase().includes("/v/") || finalUrl.toLowerCase().includes("page=video");
        let directUrl = "";

        if (isVideo) {
          // Embed format is perfect for iframes and streaming video players
          directUrl = `https://onedrive.live.com/embed?resid=${resid}&authkey=${authkey}`;
        } else {
          // Download format is perfect for normal high-res images in <img> tags
          directUrl = `https://onedrive.live.com/download?resid=${resid}&authkey=${authkey}`;
        }

        console.log(`[OneDrive Resolver] Success mapping to direct URL: ${directUrl}`);
        resolvedCache.set(rawUrl, directUrl);
        return res.json({ resolvedUrl: directUrl });
      }

      // Fallback: If we couldn't parse resid or authkey, return the final URL
      console.log(`[OneDrive Resolver] Fallback returning redirected URL: ${finalUrl}`);
      resolvedCache.set(rawUrl, finalUrl);
      return res.json({ resolvedUrl: finalUrl });

    } catch (error: any) {
      console.error(`[OneDrive Resolver] Error resolving ${rawUrl}:`, error.message);
      return res.status(500).json({ error: `Could not resolve OneDrive URL: ${error.message}` });
    }
  });

  // Robots.txt for search engines & AI crawlers
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send(`User-agent: *
Allow: /

Sitemap: https://www.thestream.co.in/sitemap.xml`);
  });

  // Sitemap.xml for search engines & AI crawlers
  app.get("/sitemap.xml", (req, res) => {
    res.type("application/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.thestream.co.in/</loc>
    <lastmod>2026-06-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite static middleware for development, static dist for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
