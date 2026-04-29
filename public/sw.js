const CACHE_NAME = "eli-english-quest-v3";
const APP_CACHE_PREFIX = "eli-english-quest-";
const HTML_FALLBACK = "/index.html";
const CORE_ASSETS = [
  "/manifest.webmanifest",
  "/assets/images/eli.png",
  "/assets/images/eli_.icon"
];

async function networkFirstHtml(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request, { cache: "no-store" });
    if (response.ok) await cache.put(HTML_FALLBACK, response.clone());
    return response;
  } catch {
    return await cache.match(HTML_FALLBACK) || Response.error();
  }
}

async function networkFirstAsset(request) {
  let response;

  try {
    response = await fetch(request, { cache: "no-store" });
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw new Error(`Unable to fetch ${request.url}`);
  }

  if (response.status === 404 || response.status === 410) {
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) client.navigate?.(client.url);
    });

    if (request.destination === "script") {
      return new Response("window.location.reload();", {
        headers: {
          "Content-Type": "application/javascript",
          "Cache-Control": "no-store"
        }
      });
    }
  }

  return response;
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll([...CORE_ASSETS, HTML_FALLBACK]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(APP_CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  const acceptsHtml = event.request.headers.get("accept")?.includes("text/html");
  if (event.request.mode === "navigate" || acceptsHtml) {
    event.respondWith(networkFirstHtml(event.request));
    return;
  }

  if (["script", "style", "worker"].includes(event.request.destination)) {
    event.respondWith(networkFirstAsset(event.request));
    return;
  }

  event.respondWith(cacheFirst(event.request));
});
