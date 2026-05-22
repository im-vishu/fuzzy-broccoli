# 🥦 Fuzzy-Broccoli

Fuzzy-Broccoli is a beauty dupe discovery app with a React frontend and a local Node.js backend. Users can browse affordable alternatives, search by category or brand, save favorites, manage a cart, place orders, submit dupe suggestions, and use admin APIs to manage products and submissions.

## ✨ Features

- 🔎 Product search, filtering, sorting, categories, and product details
- 👤 Signup, login, logout, bearer-token sessions, and profile updates
- ❤️ User favorites
- 🛒 Cart management and checkout/order creation
- 💬 Product reviews
- 💡 Community dupe submissions
- 🛠️ Admin APIs for products, users, orders, stats, and submission moderation
- 💾 File-backed local persistence in `server/data/db.json`

## 🧱 Project Structure

```text
fuzzy-broccoli/
├── client/          # Vite + React + TypeScript frontend
├── server/          # Node.js backend API
├── package.json     # Root scripts that delegate to client/server
├── README.md
└── .gitignore
```

## 🚀 Getting Started

Install frontend dependencies:

```bash
cd client
npm install
```

Return to the project root:

```bash
cd ..
```

Start the backend:

```bash
npm run dev:server
```

Start the frontend in a second terminal:

```bash
npm run dev:client
```

Open the app:

- 🌐 Frontend: `http://localhost:8080`
- 🧪 Backend health check: `http://localhost:3001/api/health`

## 📜 Scripts

Run these from the project root:

```bash
npm run dev:client    # Start frontend on port 8080
npm run dev:server    # Start backend on port 3001
npm run build         # Build the frontend
npm run lint          # Lint the frontend
npm run test          # Run frontend tests
npm run test:server   # Run backend smoke test
```

## 🖥️ Frontend

The frontend lives in `client/` and uses:

- ⚛️ React
- ⚡ Vite
- 🧭 React Router
- 🎨 Tailwind CSS
- 🧩 shadcn-style UI components
- 🧪 Vitest

The Vite dev server proxies `/api` requests to `http://localhost:3001`, so frontend code can call backend routes through `/api/...`.

## 🗄️ Backend

The backend lives in `server/` and uses built-in Node.js modules only. It creates `server/data/db.json` automatically when started.

Seeded admin account:

```text
Email: admin@fuzzy-broccoli.com
Password: admin123
```

Authenticated routes use:

```http
Authorization: Bearer <token>
```

## 🔌 API Overview

Health and catalog:

- `GET /api/health`
- `GET /api/categories`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/products/:id/reviews`

Auth and profile:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/me`
- `PATCH /api/me`

Favorites:

- `GET /api/me/favorites`
- `POST /api/me/favorites/:productId`
- `DELETE /api/me/favorites/:productId`

Cart and orders:

- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:productId`
- `DELETE /api/cart/items/:productId`
- `DELETE /api/cart`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`

Community:

- `GET /api/dupe-submissions`
- `POST /api/dupe-submissions`
- `POST /api/reviews`

Admin:

- `GET /api/admin/stats`
- `GET /api/admin/users`
- `GET /api/admin/orders`
- `POST /api/admin/products`
- `PATCH /api/admin/products/:id`
- `DELETE /api/admin/products/:id`
- `PATCH /api/admin/dupe-submissions/:id`

## 🧪 Verification

Use these before pushing changes:

```bash
npm run test:server
npm run test
npm run lint
npm run build
```

Lint currently passes with warnings from shared UI files exporting helper values alongside components.

## 🧹 Local Data

Runtime files are intentionally ignored by Git:

- `server/data/db.json`
- `*.log`
- `client/dist/`
- `client/node_modules/`

To reset local backend data, stop the server and delete:

```text
server/data/db.json
```

The next server start will recreate it with seeded catalog/admin data.
