// Taken from https://github.com/loftwah/astroflare

import type { APIContext } from "astro";
import { turso } from "../turso";

// Define the expected structure of Cloudflare environment bindings
interface CloudflareEnv {
  gifLandR2: R2Bucket; // Use the R2Bucket type if available or 'any'
}

// Define the expected structure for Astro.locals when using Cloudflare adapter
interface CloudflareLocals {
  runtime?: {
    env: CloudflareEnv;
  };
}

export const prerender = false; // Ensure this route is dynamically rendered

export async function GET({ params, locals, request }: APIContext<CloudflareLocals>) {
  const key = params.key; // Astro gives us the path directly
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  const reviewSecret = import.meta.env.REVIEW_SECRET ?? process.env.REVIEW_SECRET;
  const isReview = reviewSecret && secret === reviewSecret;

  const result = await turso().execute(
    `SELECT * FROM favourites WHERE ${isReview ? "" : "published = true AND "}URL = '${key}'`,
  );

  if (!result.rows.length) {
    console.error(
      `[Astro R2 Route] No published favourite found with URL: ${key}`,
    );
    return new Response("Not authorised", { status: 401 });
  }

  // Ensure we have a path and the R2 binding via Astro.locals
  // @ts-ignore - runtime might not be strictly typed depending on setup
  const storageBucket = locals?.runtime?.env?.gifLandR2;

  if (!key || !storageBucket) {
    console.error(
      "[Astro R2 Route] Invalid request: Missing path or gifLandR2 binding in locals.runtime.env",
    );
    return new Response("Not Found or Server Error", { status: 404 });
  }

  console.log(`[Astro R2 Route] Attempting to get: ${key}`);

  try {
    // Get the file from R2 using the binding from Astro.locals
    const file = await storageBucket.get(key);

    if (!file) {
      console.log(`[Astro R2 Route] File not found in R2: ${key}`);
      return new Response(`File not found: ${key}`, { status: 404 });
    }

    console.log(`[Astro R2 Route] File found: ${key}, Size: ${file.size}`);

    // Determine Content-Type
    const contentType = file.httpMetadata?.contentType || getContentType(key);
    console.log(`[Astro R2 Route] Serving with Content-Type: ${contentType}`);

    // Prepare headers
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Length", file.size.toString());
    if (file.httpEtag) {
      headers.set("ETag", file.httpEtag);
    }
    headers.set("Cache-Control", "public, max-age=31536000"); // Cache for 1 year

    // Add custom metadata if present
    if (file.customMetadata) {
      Object.entries(file.customMetadata).forEach(([key, value]) => {
        headers.set(`X-Custom-${key}`, value as string);
      });
    }

    // Return the response with the file body and headers
    // IMPORTANT: R2 object body is a ReadableStream
    return new Response(file.body, {
      headers: headers,
    });
  } catch (error) {
    console.error(
      `[Astro R2 Route] Error fetching file from R2: ${key}`,
      error,
    );
    return new Response(
      `Error fetching file: ${error instanceof Error ? error.message : String(error)}`,
      { status: 500 },
    );
  }
}

// Simple content type detection
function getContentType(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() || "";
  const types: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    pdf: "application/pdf",
    json: "application/json",
    js: "application/javascript",
    css: "text/css",
    html: "text/html",
    txt: "text/plain",
  };
  return types[ext] || "application/octet-stream";
}
