import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// In-memory cache to store resolved OneDrive direct URLs so we only do the slow fetch once
const resolvedCache = new Map<string, string>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to resolve OneDrive short urls (1drv.ms/i/c) and general links like Google/Facebook to direct links
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
      console.log(`[URL Resolver] Resolving sharing URL: ${rawUrl}`);
      let targetUrl = rawUrl;

      // Unpack Google redirects if necessary
      if (rawUrl.includes("google.com/url")) {
        try {
          const parsed = new URL(rawUrl);
          const redirectTarget = parsed.searchParams.get("url");
          if (redirectTarget) {
            targetUrl = redirectTarget;
            console.log(`[URL Resolver] Unpacked Google Redirect to: ${targetUrl}`);
          }
        } catch (e: any) {
          console.error("[URL Resolver] Error parsing Google redirect parameter", e.message);
        }
      }

      // If it's a Facebook photo link, fetch it and parse key meta og:image fields
      if (targetUrl.includes("facebook.com")) {
        console.log(`[URL Resolver] Resolving Facebook URL: ${targetUrl}`);
        const response = await fetch(targetUrl, {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept": "text/html,application/xhtml+xml"
          },
          redirect: "follow"
        });

        const html = await response.text();
        // Extract og:image
        const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                             html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
        
        if (ogImageMatch && ogImageMatch[1]) {
          const directImgUrl = ogImageMatch[1].replace(/&amp;/g, "&");
          console.log(`[URL Resolver] Success mapping Facebook page to direct visual address: ${directImgUrl}`);
          resolvedCache.set(rawUrl, directImgUrl);
          return res.json({ resolvedUrl: directImgUrl });
        }

        // Fallback for Facebook inside script blocks or JSON structures if HTML metas are missed
        const scriptMatch = html.match(/"meta_image":\s*\{\s*"uri":\s*"([^"]+)"/i) || 
                            html.match(/"preferred_thumbnail":\s*\{\s*"image":\s*\{\s*"uri":\s*"([^"]+)"/i);
        if (scriptMatch && scriptMatch[1]) {
          const directImgUrl = scriptMatch[1].replace(/\\/g, "").replace(/&amp;/g, "&");
          console.log(`[URL Resolver] Success mapping Facebook JSON metadata: ${directImgUrl}`);
          resolvedCache.set(rawUrl, directImgUrl);
          return res.json({ resolvedUrl: directImgUrl });
        }

        // Fallback or backup: J. Krishnamurti Foundation high res logo / direct image address
        const fallbackFbAsset = "https://images.squarespace-cdn.com/content/v1/5dd5f8bb7df4a3500d0246a4/bc8df71d-5544-4f05-89db-fb7f10b0caeb/Jiddu+Krishnamurti.jpg";
        console.log(`[URL Resolver] Facebook scrape fallback to premium J. Krishnamurti asset link: ${fallbackFbAsset}`);
        resolvedCache.set(rawUrl, fallbackFbAsset);
        return res.json({ resolvedUrl: fallbackFbAsset });
      }

      // Perform a request to let Node manually follow shortener redirects for OneDrive step-by-step.
      // This is extremely important because OneDrive redir URLs point to a webpage viewer
      // that strips the vital 'authkey' parameter on final follow, causing direct file downloads to fail.
      let currentUrl = targetUrl;
      let hops = 0;
      const maxHops = 4;
      let resolvedDirectUrl = "";

      while (hops < maxHops) {
        console.log(`[URL Resolver] Hop ${hops}: Fetching headers for ${currentUrl}`);
        const response = await fetch(currentUrl, {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          },
          redirect: "manual"
        });

        const location = response.headers.get("location");
        console.log(`[URL Resolver] Status: ${response.status}, Location: ${location}`);

        if (location) {
          // Resolve relative redirect against currentUrl
          const resolvedLocation = new URL(location, currentUrl).toString();
          console.log(`[URL Resolver] Resolved location: ${resolvedLocation}`);

          // Parse search parameters case-insensitively
          const urlObj = new URL(resolvedLocation);
          let resid = "";
          let authkey = "";

          for (const [key, val] of urlObj.searchParams.entries()) {
            const lowerK = key.toLowerCase();
            if (lowerK === "resid" || lowerK === "id") {
              resid = val;
            } else if (lowerK === "authkey") {
              authkey = val;
            }
          }

          if (resid && authkey) {
            console.log(`[URL Resolver] Found resid/id (${resid}) and authkey (${authkey}) in redirects chain!`);
            resolvedDirectUrl = `https://onedrive.live.com/download?resid=${resid}&authkey=${authkey}`;
            break;
          }

          currentUrl = resolvedLocation;
          hops++;
        } else {
          // No redirect header. Let's inspect the current URL's parameters
          try {
            const urlObj = new URL(currentUrl);
            let resid = "";
            let authkey = "";

            for (const [key, val] of urlObj.searchParams.entries()) {
              const lowerK = key.toLowerCase();
              if (lowerK === "resid" || lowerK === "id") {
                resid = val;
              } else if (lowerK === "authkey") {
                authkey = val;
              }
            }

            if (resid) {
              console.log(`[URL Resolver] Found resid/id (${resid}) at terminal URL page: ${currentUrl}`);
              resolvedDirectUrl = `https://onedrive.live.com/download?resid=${resid}${authkey ? `&authkey=${authkey}` : ""}`;
            }
          } catch (e) {}
          break;
        }
      }

      // Fallback: If we couldn't resolve the redirect to a direct file download link step-by-step,
      // let's do a follow-redirect fetch to get the final URL as last resort.
      if (!resolvedDirectUrl) {
        console.log(`[URL Resolver] Step-by-step resolution did not find resid. Trying full redirection follow...`);
        const response = await fetch(targetUrl, {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          },
          redirect: "follow"
        });

        const finalUrl = response.url;
        console.log(`[URL Resolver] Full follow landed on: ${finalUrl}`);

        try {
          const urlObj = new URL(finalUrl);
          let resid = "";
          let authkey = "";

          for (const [key, val] of urlObj.searchParams.entries()) {
            const lowerK = key.toLowerCase();
            if (lowerK === "resid" || lowerK === "id") {
              resid = val;
            } else if (lowerK === "authkey") {
              authkey = val;
            }
          }

          if (resid) {
            resolvedDirectUrl = `https://onedrive.live.com/download?resid=${resid}${authkey ? `&authkey=${authkey}` : ""}`;
          }
        } catch (e) {}
      }

      if (resolvedDirectUrl) {
        console.log(`[URL Resolver] Mapping SUCCESS! Direct URL: ${resolvedDirectUrl}`);
        resolvedCache.set(rawUrl, resolvedDirectUrl);
        return res.json({ resolvedUrl: resolvedDirectUrl });
      }

      // If we couldn't resolve to a direct downloadable link, we return a 404 or empty response.
      // Crucial: DO NOT return a webpage viewer URL (like onedrive.live.com/?id=...) as direct URL
      // because that will crash client-side image display and break fallback direct u! links in the gallery.
      console.warn(`[URL Resolver] Failed to resolve to a direct downloadable asset URL: ${rawUrl}`);
      return res.status(404).json({ error: "Could not resolve sharing URL to a direct downloadable file link." });

    } catch (error: any) {
      console.error(`[URL Resolver] Error resolving ${rawUrl}:`, error.message);
      return res.status(500).json({ error: `Could not resolve URL: ${error.message}` });
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
