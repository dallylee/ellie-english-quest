const GEMINI_LIVE_ENDPOINT =
  "https://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent";
const GEMINI_MODEL = "models/gemini-3.1-flash-live-preview";

const ALLOWED_ORIGINS = new Set([
  "https://ellie-english-quest.vercel.app",
  "https://ellie-english-quest-dallylees-projects.vercel.app",
  "https://ellie-english-quest-git-main-dallylees-projects.vercel.app",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
]);

let lastUpstreamError = null;
let lastUpstreamStatus = null;

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  return /^https:\/\/ellie-english-quest-[a-z0-9-]+-dallylees-projects\.vercel\.app$/i.test(origin);
}

function sanitizeError(value) {
  return String(value || "")
    .replace(/AIza[0-9A-Za-z_-]{20,}/g, "[REDACTED_GOOGLE_KEY]")
    .replace(/([?&]key=)[^&\s"')]+/gi, "$1[REDACTED]")
    .replace(/sk-[A-Za-z0-9_-]{20,}/g, "[REDACTED_API_KEY]")
    .slice(0, 600);
}

function jsonResponse(body, { status = 200, origin = null } = {}) {
  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  if (origin && isAllowedOrigin(origin)) {
    headers.set("access-control-allow-origin", origin);
    headers.set("vary", "Origin");
  }
  headers.set("access-control-allow-methods", "GET,HEAD,OPTIONS");
  headers.set("access-control-allow-headers", "content-type");
  return new Response(JSON.stringify(body), { status, headers });
}

function healthResponse(request, env) {
  const origin = request.headers.get("origin");
  return jsonResponse(
    {
      workerReachable: true,
      webSocketRouteAvailable: true,
      geminiKeyConfigured: Boolean(env.GEMINI_API_KEY),
      allowedOrigin: origin ? isAllowedOrigin(origin) : null,
      geminiModel: GEMINI_MODEL,
      upstreamHost: "generativelanguage.googleapis.com",
      lastUpstreamStatus,
      lastUpstreamError
    },
    { origin }
  );
}

function safeClose(socket, code = 1000, reason = "done") {
  try {
    if (socket && socket.readyState !== WebSocket.CLOSED) {
      socket.close(code, reason.slice(0, 120));
    }
  } catch {
    // Best-effort close only.
  }
}

function safeSend(socket, data) {
  try {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(data);
      return true;
    }
  } catch {
    // Caller will close the pair.
  }
  return false;
}

function sendClientError(clientSocket, message, status = 1011) {
  safeSend(clientSocket, JSON.stringify({ error: sanitizeError(message) }));
  safeClose(clientSocket, status, "gemini-proxy-error");
}

async function connectGemini(env) {
  if (!env.GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured on the Worker.");
  }

  const url = `${GEMINI_LIVE_ENDPOINT}?key=${encodeURIComponent(env.GEMINI_API_KEY)}`;
  const response = await fetch(url, {
    headers: {
      Upgrade: "websocket"
    }
  });

  if (!response.webSocket) {
    lastUpstreamStatus = response.status;
    const body = sanitizeError(await response.text().catch(() => ""));
    throw new Error(`Gemini WebSocket upgrade failed: HTTP ${response.status}. ${body}`);
  }

  lastUpstreamStatus = 101;
  lastUpstreamError = null;
  response.webSocket.binaryType = "arraybuffer";
  response.webSocket.accept({ allowHalfOpen: true });
  return response.webSocket;
}

async function proxyToGemini(clientSocket, env) {
  let geminiSocket = null;
  let geminiReady = false;
  const queuedMessages = [];

  clientSocket.addEventListener("message", (event) => {
    if (geminiReady && geminiSocket?.readyState === WebSocket.OPEN) {
      safeSend(geminiSocket, event.data);
      return;
    }

    if (queuedMessages.length >= 8) {
      sendClientError(clientSocket, "Gemini proxy message queue overflow.", 1013);
      return;
    }
    queuedMessages.push(event.data);
  });

  clientSocket.addEventListener("close", (event) => {
    safeClose(geminiSocket, event.code || 1000, event.reason || "client-closed");
  });

  clientSocket.addEventListener("error", () => {
    safeClose(geminiSocket, 1011, "client-error");
  });

  try {
    geminiSocket = await connectGemini(env);
    geminiReady = true;
    for (const message of queuedMessages.splice(0)) {
      if (!safeSend(geminiSocket, message)) break;
    }
  } catch (error) {
    const safeMessage = sanitizeError(error?.message || "Gemini upstream connection failed.");
    lastUpstreamError = safeMessage;
    sendClientError(clientSocket, safeMessage);
    return;
  }

  geminiSocket.addEventListener("message", (event) => {
    if (!safeSend(clientSocket, event.data)) {
      safeClose(geminiSocket, 1011, "client-send-failed");
    }
  });

  geminiSocket.addEventListener("close", (event) => {
    safeClose(clientSocket, event.code || 1000, sanitizeError(event.reason || "gemini-closed"));
  });

  geminiSocket.addEventListener("error", () => {
    lastUpstreamError = "Gemini upstream WebSocket error.";
    sendClientError(clientSocket, lastUpstreamError);
  });
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("origin");
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return jsonResponse({ ok: true }, { origin });
    }

    if (url.pathname === "/health") {
      if (request.method === "HEAD") return new Response(null, { status: 204 });
      return healthResponse(request, env);
    }

    if (request.headers.get("upgrade") !== "websocket") {
      return jsonResponse(
        {
          error: "Upgrade Required",
          workerReachable: true,
          webSocketRouteAvailable: true,
          health: "/health"
        },
        { status: 426, origin }
      );
    }

    if (!isAllowedOrigin(origin)) {
      return jsonResponse({ error: "Origin not allowed." }, { status: 403, origin });
    }

    const [client, server] = Object.values(new WebSocketPair());
    server.accept({ allowHalfOpen: true });
    ctx.waitUntil(proxyToGemini(server, env));
    return new Response(null, { status: 101, webSocket: client });
  }
};
