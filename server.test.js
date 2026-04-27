import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createAppServer } from "../server.js";

async function withServer(run) {
  const server = createAppServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    await run(baseUrl);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
}

describe("Server API", () => {
  it("chat endpoint rejects empty input", async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: "" })
      });

      const payload = await response.json();
      assert.equal(response.status, 400);
      assert.equal(payload.error, "Please enter a question before submitting.");
    });
  });

  it("chat endpoint returns answer for valid question", async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: "How do I vote?" })
      });

      const payload = await response.json();
      assert.equal(response.status, 200);
      assert.equal(payload.title, "How voting usually works");
    });
  });

  it("chat endpoint rate limits repeated requests", async () => {
    await withServer(async (baseUrl) => {
      let finalResponse = null;

      for (let index = 0; index < 13; index += 1) {
        finalResponse = await fetch(`${baseUrl}/api/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: "What is EVM?" })
        });
      }

      assert.equal(finalResponse?.status, 429);
    });
  });

  it("serves CSP that allows Google fonts while staying restrictive", async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/health`);
      const csp = response.headers.get("content-security-policy") || "";

      assert.match(csp, /fonts\.googleapis\.com/);
      assert.match(csp, /fonts\.gstatic\.com/);
      assert.match(csp, /default-src 'self'/);
    });
  });
});
