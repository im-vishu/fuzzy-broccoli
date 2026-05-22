import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const port = 3999;
const baseUrl = `http://localhost:${port}`;
const dbPath = join(tmpdir(), `fuzzy-broccoli-smoke-${Date.now()}.json`);
const server = spawn(process.execPath, ["server.mjs"], {
  cwd: new URL("..", import.meta.url),
  env: { ...process.env, PORT: String(port), DB_PATH: dbPath },
  stdio: "ignore",
});

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${path} failed: ${response.status} ${JSON.stringify(body)}`);
  }
  return body;
}

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      await request("/api/health");
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }
  throw new Error("Server did not start");
}

try {
  await waitForServer();
  const health = await request("/api/health");
  if (!health.ok) throw new Error("Health check did not return ok");

  const catalog = await request("/api/products?search=lip&limit=2");
  if (!catalog.products.length) throw new Error("Product search returned no results");

  const unique = Date.now();
  const signup = await request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      name: "Smoke Test",
      email: `smoke-${unique}@example.com`,
      password: "password123",
    }),
  });
  if (!signup.token) throw new Error("Signup did not return a token");

  await request("/api/cart/items", {
    method: "POST",
    headers: { Authorization: `Bearer ${signup.token}` },
    body: JSON.stringify({ productId: catalog.products[0].id, quantity: 2 }),
  });

  const order = await request("/api/orders", {
    method: "POST",
    headers: { Authorization: `Bearer ${signup.token}` },
    body: JSON.stringify({ shippingAddress: { city: "Test" } }),
  });
  if (!order.order?.id) throw new Error("Checkout did not create an order");

  console.log("Server smoke test passed");
} finally {
  server.kill();
  await rm(dbPath, { force: true });
}
