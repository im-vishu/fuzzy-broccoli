import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientDir = resolve(__dirname, "../client");
const dataDir = resolve(__dirname, "data");
const dbPath = process.env.DB_PATH || resolve(dataDir, "db.json");
const port = Number(process.env.PORT || 3001);

const jsonHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

let dbCache;
let catalogCache;

async function loadCatalog() {
  if (catalogCache) return catalogCache;

  const source = await readFile(resolve(clientDir, "src/data/products.ts"), "utf8");
  const executable = source
    .replace(/export interface Product \{[\s\S]*?\n\}/, "")
    .replace("export const products: Product[] =", "const products =")
    .replace("export const categories =", "const categories =");

  catalogCache = Function(`${executable}; return { products, categories };`)();
  return catalogCache;
}

function now() {
  return new Date().toISOString();
}

function today() {
  return now().slice(0, 10);
}

function id(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${randomBytes(4).toString("hex")}`;
}

function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const hash = createHash("sha256").update(`${salt}:${password}`).digest("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, expected] = String(stored).split(":");
  if (!salt || !expected) return false;
  const actual = hashPassword(password, salt).split(":")[1];
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

function createToken() {
  return randomBytes(32).toString("hex");
}

function publicUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

async function defaultDb() {
  const { products, categories } = await loadCatalog();
  const admin = {
    id: "user_admin",
    name: "Admin",
    email: "admin@fuzzy-broccoli.com",
    passwordHash: hashPassword("admin123"),
    role: "admin",
    favorites: [],
    createdAt: now(),
    updatedAt: now(),
  };

  return {
    products,
    categories,
    users: [admin],
    sessions: [],
    carts: [],
    orders: [],
    submissions: [
      {
        id: "sub_1",
        userId: null,
        user: "Sarah M.",
        originalBrand: "MAC",
        originalProduct: "Ruby Woo",
        originalPrice: 22,
        dupeBrand: "Revlon",
        dupeProduct: "Fire & Ice",
        dupePrice: 8.99,
        category: "Lips",
        reason: "Almost identical shade and matte finish.",
        status: "pending",
        image: "",
        date: "2026-04-10",
        createdAt: "2026-04-10T00:00:00.000Z",
        updatedAt: "2026-04-10T00:00:00.000Z",
      },
    ],
    reviews: [],
  };
}

async function loadDb() {
  if (dbCache) return dbCache;
  await mkdir(dataDir, { recursive: true });

  try {
    dbCache = JSON.parse(await readFile(dbPath, "utf8"));
  } catch {
    dbCache = await defaultDb();
    await saveDb();
  }

  return dbCache;
}

async function saveDb() {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dbPath, `${JSON.stringify(dbCache, null, 2)}\n`);
}

function sendJson(res, status, body) {
  res.writeHead(status, jsonHeaders);
  res.end(JSON.stringify(body));
}

function sendError(res, status, message, details) {
  sendJson(res, status, { error: message, ...(details ? { details } : {}) });
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Invalid JSON body");
    error.status = 400;
    throw error;
  }
}

function requireFields(body, fields) {
  const missing = fields.filter((field) => body[field] === undefined || body[field] === null || body[field] === "");
  if (missing.length) {
    const error = new Error(`Missing required field${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`);
    error.status = 400;
    throw error;
  }
}

function getBearerToken(req) {
  const authorization = req.headers.authorization || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1];
}

function getUserByToken(db, req) {
  const token = getBearerToken(req);
  if (!token) return null;

  const session = db.sessions.find((item) => item.token === token && new Date(item.expiresAt) > new Date());
  if (!session) return null;
  return db.users.find((user) => user.id === session.userId) || null;
}

function requireUser(db, req) {
  const user = getUserByToken(db, req);
  if (!user) {
    const error = new Error("Authentication required");
    error.status = 401;
    throw error;
  }
  return user;
}

function requireAdmin(db, req) {
  const user = requireUser(db, req);
  if (user.role !== "admin") {
    const error = new Error("Admin access required");
    error.status = 403;
    throw error;
  }
  return user;
}

function getProduct(db, productId) {
  return db.products.find((product) => product.id === productId);
}

function enrichCart(db, cart) {
  const items = cart.items
    .map((item) => ({ ...item, product: getProduct(db, item.productId) }))
    .filter((item) => item.product)
    .map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      product: item.product,
      lineTotal: Number((item.product.price * item.quantity).toFixed(2)),
    }));

  const subtotal = Number(items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  return { ...cart, items, subtotal, tax, shipping: 0, total };
}

function userCart(db, userId) {
  let cart = db.carts.find((item) => item.userId === userId);
  if (!cart) {
    cart = { id: id("cart"), userId, items: [], createdAt: now(), updatedAt: now() };
    db.carts.push(cart);
  }
  return cart;
}

function filterProducts(products, searchParams) {
  const search = searchParams.get("search")?.trim().toLowerCase();
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const minPrice = Number(searchParams.get("minPrice") || 0);
  const maxPrice = Number(searchParams.get("maxPrice") || Number.POSITIVE_INFINITY);
  const sort = searchParams.get("sort") || "featured";
  const page = Math.max(Number(searchParams.get("page") || 1), 1);
  const limit = Math.min(Math.max(Number(searchParams.get("limit") || 100), 1), 100);

  const filtered = products.filter((product) => {
    const matchesSearch =
      !search ||
      [product.name, product.brand, product.originalProduct, product.originalBrand, product.category, ...(product.tags || [])]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search));
    const matchesCategory = !category || category === "All" || product.category === category;
    const matchesBrand = !brand || brand === "all" || product.brand === brand;
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  filtered.sort((a, b) => {
    if (sort === "price-asc" || sort === "price") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "savings") return (b.savings || 0) - (a.savings || 0);
    if (sort === "newest") return String(b.createdAt || b.id).localeCompare(String(a.createdAt || a.id));
    return Number(a.id) - Number(b.id);
  });

  const total = filtered.length;
  const start = (page - 1) * limit;
  return {
    products: filtered.slice(start, start + limit),
    meta: { total, page, limit, pageCount: Math.ceil(total / limit) || 1 },
  };
}

function pathMatch(pathname, pattern) {
  const pathParts = pathname.split("/").filter(Boolean);
  const patternParts = pattern.split("/").filter(Boolean);
  if (pathParts.length !== patternParts.length) return null;

  const params = {};
  for (let index = 0; index < patternParts.length; index += 1) {
    const patternPart = patternParts[index];
    const pathPart = pathParts[index];
    if (patternPart.startsWith(":")) {
      params[patternPart.slice(1)] = decodeURIComponent(pathPart);
    } else if (patternPart !== pathPart) {
      return null;
    }
  }
  return params;
}

const routes = [];

function route(method, pattern, handler, status = 200) {
  routes.push({ method, pattern, handler, status });
}

route("GET", "/api/health", async ({ db }) => ({
  ok: true,
  service: "fuzzy-broccoli-api",
  counts: {
    products: db.products.length,
    users: db.users.length,
    submissions: db.submissions.length,
    orders: db.orders.length,
  },
}));

route("GET", "/api/categories", async ({ db }) => ({ categories: db.categories }));

route("GET", "/api/products", async ({ db, url }) => filterProducts(db.products, url.searchParams));

route("GET", "/api/products/:id", async ({ db, params }) => {
  const product = getProduct(db, params.id);
  if (!product) throw Object.assign(new Error("Product not found"), { status: 404 });
  return { product };
});

route("POST", "/api/auth/signup", async ({ db, body }) => {
  requireFields(body, ["name", "email", "password"]);
  const email = String(body.email).trim().toLowerCase();

  if (db.users.some((user) => user.email === email)) {
    throw Object.assign(new Error("Email is already registered"), { status: 409 });
  }

  const user = {
    id: id("user"),
    name: String(body.name).trim(),
    email,
    passwordHash: hashPassword(body.password),
    role: "user",
    favorites: [],
    createdAt: now(),
    updatedAt: now(),
  };
  const token = createToken();
  db.users.push(user);
  db.sessions.push({ id: id("session"), userId: user.id, token, createdAt: now(), expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString() });
  await saveDb();

  return { user: publicUser(user), token };
}, 201);

route("POST", "/api/auth/login", async ({ db, body }) => {
  requireFields(body, ["email", "password"]);
  const email = String(body.email).trim().toLowerCase();
  const user = db.users.find((item) => item.email === email);

  if (!user || !verifyPassword(body.password, user.passwordHash)) {
    throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  }

  const token = createToken();
  db.sessions.push({ id: id("session"), userId: user.id, token, createdAt: now(), expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString() });
  await saveDb();

  return { user: publicUser(user), token };
});

route("POST", "/api/auth/logout", async ({ db, req }) => {
  const token = getBearerToken(req);
  db.sessions = db.sessions.filter((session) => session.token !== token);
  await saveDb();
  return { ok: true };
});

route("GET", "/api/me", async ({ db, req }) => ({ user: publicUser(requireUser(db, req)) }));

route("PATCH", "/api/me", async ({ db, req, body }) => {
  const user = requireUser(db, req);
  if (body.name) user.name = String(body.name).trim();
  if (body.email) user.email = String(body.email).trim().toLowerCase();
  user.updatedAt = now();
  await saveDb();
  return { user: publicUser(user) };
});

route("GET", "/api/me/favorites", async ({ db, req }) => {
  const user = requireUser(db, req);
  return { products: user.favorites.map((productId) => getProduct(db, productId)).filter(Boolean) };
});

route("POST", "/api/me/favorites/:productId", async ({ db, req, params }) => {
  const user = requireUser(db, req);
  if (!getProduct(db, params.productId)) throw Object.assign(new Error("Product not found"), { status: 404 });
  if (!user.favorites.includes(params.productId)) user.favorites.push(params.productId);
  user.updatedAt = now();
  await saveDb();
  return { favorites: user.favorites };
});

route("DELETE", "/api/me/favorites/:productId", async ({ db, req, params }) => {
  const user = requireUser(db, req);
  user.favorites = user.favorites.filter((productId) => productId !== params.productId);
  user.updatedAt = now();
  await saveDb();
  return { favorites: user.favorites };
});

route("GET", "/api/cart", async ({ db, req }) => {
  const user = requireUser(db, req);
  return { cart: enrichCart(db, userCart(db, user.id)) };
});

route("POST", "/api/cart/items", async ({ db, req, body }) => {
  const user = requireUser(db, req);
  requireFields(body, ["productId"]);
  const quantity = Math.max(Number(body.quantity || 1), 1);
  if (!getProduct(db, String(body.productId))) throw Object.assign(new Error("Product not found"), { status: 404 });

  const cart = userCart(db, user.id);
  const item = cart.items.find((cartItem) => cartItem.productId === String(body.productId));
  if (item) item.quantity += quantity;
  else cart.items.push({ productId: String(body.productId), quantity });
  cart.updatedAt = now();
  await saveDb();

  return { cart: enrichCart(db, cart) };
});

route("PATCH", "/api/cart/items/:productId", async ({ db, req, params, body }) => {
  const user = requireUser(db, req);
  requireFields(body, ["quantity"]);
  const cart = userCart(db, user.id);
  const quantity = Number(body.quantity);
  cart.items = quantity <= 0
    ? cart.items.filter((item) => item.productId !== params.productId)
    : cart.items.map((item) => item.productId === params.productId ? { ...item, quantity } : item);
  cart.updatedAt = now();
  await saveDb();

  return { cart: enrichCart(db, cart) };
});

route("DELETE", "/api/cart/items/:productId", async ({ db, req, params }) => {
  const user = requireUser(db, req);
  const cart = userCart(db, user.id);
  cart.items = cart.items.filter((item) => item.productId !== params.productId);
  cart.updatedAt = now();
  await saveDb();
  return { cart: enrichCart(db, cart) };
});

route("DELETE", "/api/cart", async ({ db, req }) => {
  const user = requireUser(db, req);
  const cart = userCart(db, user.id);
  cart.items = [];
  cart.updatedAt = now();
  await saveDb();
  return { cart: enrichCart(db, cart) };
});

route("POST", "/api/orders", async ({ db, req, body }) => {
  const user = requireUser(db, req);
  const cart = enrichCart(db, userCart(db, user.id));
  if (!cart.items.length) throw Object.assign(new Error("Cart is empty"), { status: 400 });

  const order = {
    id: id("order"),
    userId: user.id,
    items: cart.items.map(({ productId, quantity, lineTotal }) => ({ productId, quantity, lineTotal })),
    subtotal: cart.subtotal,
    tax: cart.tax,
    shipping: cart.shipping,
    total: cart.total,
    status: "processing",
    shippingAddress: body.shippingAddress || null,
    createdAt: now(),
    updatedAt: now(),
  };
  db.orders.unshift(order);
  userCart(db, user.id).items = [];
  await saveDb();
  return { order };
}, 201);

route("GET", "/api/orders", async ({ db, req }) => {
  const user = requireUser(db, req);
  const orders = db.orders.filter((order) => order.userId === user.id);
  return { orders };
});

route("GET", "/api/orders/:id", async ({ db, req, params }) => {
  const user = requireUser(db, req);
  const order = db.orders.find((item) => item.id === params.id && (item.userId === user.id || user.role === "admin"));
  if (!order) throw Object.assign(new Error("Order not found"), { status: 404 });
  return { order };
});

route("GET", "/api/dupe-submissions", async ({ db }) => ({ submissions: db.submissions }));

route("POST", "/api/dupe-submissions", async ({ db, req, body }) => {
  requireFields(body, ["originalBrand", "originalProduct", "dupeBrand", "dupeProduct", "reason"]);
  const user = getUserByToken(db, req);
  const submission = {
    id: id("sub"),
    userId: user?.id || null,
    user: body.user || user?.name || "Community member",
    originalBrand: body.originalBrand,
    originalProduct: body.originalProduct,
    originalPrice: Number(body.originalPrice || 0),
    dupeBrand: body.dupeBrand,
    dupeProduct: body.dupeProduct,
    dupePrice: Number(body.dupePrice || 0),
    category: body.category || "Other",
    reason: body.reason,
    image: body.image || "",
    status: "pending",
    date: today(),
    createdAt: now(),
    updatedAt: now(),
  };
  db.submissions.unshift(submission);
  await saveDb();
  return { submission };
}, 201);

route("POST", "/api/reviews", async ({ db, req, body }) => {
  const user = requireUser(db, req);
  requireFields(body, ["productId", "rating", "comment"]);
  if (!getProduct(db, String(body.productId))) throw Object.assign(new Error("Product not found"), { status: 404 });

  const review = {
    id: id("review"),
    userId: user.id,
    productId: String(body.productId),
    rating: Math.max(1, Math.min(5, Number(body.rating))),
    comment: String(body.comment),
    createdAt: now(),
    updatedAt: now(),
  };
  db.reviews.unshift(review);
  await saveDb();
  return { review };
}, 201);

route("GET", "/api/products/:id/reviews", async ({ db, params }) => ({
  reviews: db.reviews.filter((review) => review.productId === params.id),
}));

route("GET", "/api/admin/stats", async ({ db, req }) => {
  requireAdmin(db, req);
  return {
    productCount: db.products.length,
    userCount: db.users.length,
    orderCount: db.orders.length,
    pendingSubmissionCount: db.submissions.filter((item) => item.status === "pending").length,
    revenue: Number(db.orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)),
  };
});

route("GET", "/api/admin/users", async ({ db, req }) => {
  requireAdmin(db, req);
  return { users: db.users.map(publicUser) };
});

route("GET", "/api/admin/orders", async ({ db, req }) => {
  requireAdmin(db, req);
  return { orders: db.orders };
});

route("POST", "/api/admin/products", async ({ db, req, body }) => {
  requireAdmin(db, req);
  requireFields(body, ["name", "brand", "price", "category", "image", "description"]);
  const product = {
    id: id("product"),
    images: body.images?.length ? body.images : [body.image],
    tags: body.tags || [],
    rating: Number(body.rating || 0),
    reviews: Number(body.reviews || 0),
    ...body,
    price: Number(body.price),
    originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
    savings: body.originalPrice ? Number((Number(body.originalPrice) - Number(body.price)).toFixed(2)) : body.savings,
    createdAt: now(),
    updatedAt: now(),
  };
  db.products.unshift(product);
  if (!db.categories.includes(product.category)) db.categories.push(product.category);
  await saveDb();
  return { product };
}, 201);

route("PATCH", "/api/admin/products/:id", async ({ db, req, params, body }) => {
  requireAdmin(db, req);
  const product = getProduct(db, params.id);
  if (!product) throw Object.assign(new Error("Product not found"), { status: 404 });
  Object.assign(product, body, { updatedAt: now() });
  if (body.price !== undefined) product.price = Number(body.price);
  if (body.originalPrice !== undefined) product.originalPrice = Number(body.originalPrice);
  if (product.originalPrice) product.savings = Number((product.originalPrice - product.price).toFixed(2));
  if (product.category && !db.categories.includes(product.category)) db.categories.push(product.category);
  await saveDb();
  return { product };
});

route("DELETE", "/api/admin/products/:id", async ({ db, req, params }) => {
  requireAdmin(db, req);
  const before = db.products.length;
  db.products = db.products.filter((product) => product.id !== params.id);
  if (db.products.length === before) throw Object.assign(new Error("Product not found"), { status: 404 });
  await saveDb();
  return { ok: true };
});

route("PATCH", "/api/admin/dupe-submissions/:id", async ({ db, req, params, body }) => {
  requireAdmin(db, req);
  const submission = db.submissions.find((item) => item.id === params.id);
  if (!submission) throw Object.assign(new Error("Submission not found"), { status: 404 });
  if (body.status) submission.status = body.status;
  if (body.notes !== undefined) submission.notes = body.notes;
  submission.updatedAt = now();
  await saveDb();
  return { submission };
});

async function handleRequest(req, res) {
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const db = await loadDb();
  const routeMatch = routes.find((candidate) => candidate.method === req.method && pathMatch(url.pathname, candidate.pattern));

  if (!routeMatch) {
    sendError(res, 404, "Route not found");
    return;
  }

  const params = pathMatch(url.pathname, routeMatch.pattern);

  try {
    const body = ["POST", "PUT", "PATCH"].includes(req.method || "") ? await readJson(req) : {};
    const result = await routeMatch.handler({ db, req, url, params, body });
    sendJson(res, routeMatch.status || 200, result);
  } catch (error) {
    sendError(res, error.status || 500, error.message || "Server error");
  }
}

createServer(handleRequest).listen(port, () => {
  console.log(`Fuzzy-Broccoli API listening on http://localhost:${port}`);
});
