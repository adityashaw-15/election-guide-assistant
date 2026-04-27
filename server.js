import { createServer as createHttpServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { answerElectionQuestion, getFaqPreview } from "./src/services/faqService.js";
import { sanitizePlainText } from "./src/utils/sanitize.js";
import { createRateLimiter } from "./src/utils/rateLimiter.js";
import { validateQuestionInput } from "./src/utils/validation.js";
import { guideSteps, timelineStages, fakeNewsTips } from "./src/data/electionData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");
const srcDir = path.join(__dirname, "src");

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".ico", "image/x-icon"]
]);

function jsonResponse(res, statusCode, body) {
  const payload = JSON.stringify(body);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload)
  });
  res.end(payload);
}

function applySecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "img-src 'self' data:",
      "style-src 'self' https://fonts.googleapis.com",
      "script-src 'self' https://www.googletagmanager.com https://www.gstatic.com",
      "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://firestore.googleapis.com https://www.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'"
    ].join("; ")
  );
}

async function serveStatic(req, res) {
  const requestUrl = new URL(req.url || "/", "http://localhost");
  const pathname = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
  const baseDirectory = pathname.startsWith("/src/") ? __dirname : publicDir;
  const normalizedPath = path.normalize(path.join(baseDirectory, pathname));

  if (!normalizedPath.startsWith(publicDir) && !normalizedPath.startsWith(srcDir)) {
    jsonResponse(res, 403, { error: "Forbidden" });
    return;
  }

  try {
    const fileBuffer = await readFile(normalizedPath);
    const extension = path.extname(normalizedPath);
    res.writeHead(200, {
      "Content-Type": contentTypes.get(extension) || "application/octet-stream",
      "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=3600"
    });
    res.end(fileBuffer);
  } catch {
    jsonResponse(res, 404, { error: "Not found" });
  }
}

async function readJsonBody(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 8_000) {
      throw new Error("Payload too large");
    }
  }

  try {
    return JSON.parse(raw || "{}");
  } catch {
    throw new Error("Invalid JSON");
  }
}

async function handleApi(req, res, rateLimiter) {
  const requestUrl = new URL(req.url || "/", "http://localhost");

  if (requestUrl.pathname === "/api/health" && req.method === "GET") {
    jsonResponse(res, 200, { ok: true });
    return;
  }

  if (requestUrl.pathname === "/api/bootstrap" && req.method === "GET") {
    jsonResponse(res, 200, {
      guideSteps,
      timelineStages,
      fakeNewsTips,
      faqs: getFaqPreview()
    });
    return;
  }

  if (requestUrl.pathname === "/api/ask" && req.method === "POST") {
    const ipKey = req.socket.remoteAddress || "unknown";
    const limitResult = rateLimiter.check(ipKey);
    res.setHeader("X-RateLimit-Limit", String(limitResult.limit));
    res.setHeader("X-RateLimit-Remaining", String(limitResult.remaining));

    if (!limitResult.allowed) {
      jsonResponse(res, 429, {
        error: "Too many requests. Please pause for a minute and try again."
      });
      return;
    }

    try {
      const payload = await readJsonBody(req);
      const sanitizedQuestion = sanitizePlainText(payload.question);
      const validation = validateQuestionInput(sanitizedQuestion);

      if (!validation.valid) {
        jsonResponse(res, 400, { error: validation.message });
        return;
      }

      const answer = answerElectionQuestion(sanitizedQuestion);
      jsonResponse(res, 200, answer);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      const statusCode = message === "Payload too large" ? 413 : 400;
      jsonResponse(res, statusCode, { error: message });
    }
    return;
  }

  jsonResponse(res, 404, { error: "API route not found" });
}

export function createAppServer() {
  const rateLimiter = createRateLimiter({ windowMs: 60_000, maxRequests: 12 });

  return createHttpServer(async (req, res) => {
    applySecurityHeaders(res);

    if (!req.url) {
      jsonResponse(res, 400, { error: "Invalid request" });
      return;
    }

    if (req.url.startsWith("/api/")) {
      await handleApi(req, res, rateLimiter);
      return;
    }

    await serveStatic(req, res);
  });
}

if (process.argv[1] === __filename) {
  const port = Number(process.env.PORT || 4173);
  const server = createAppServer();
  server.listen(port, () => {
    console.log(`Election Assistant running at http://127.0.0.1:${port}`);
  });
}
