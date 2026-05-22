# 🥦 fuzzy-broccoli — A Cosmetic Dupe Finder

**fuzzy-broccoli** is a modern full-stack web app for beauty lovers to discover affordable dupe alternatives for branded cosmetic products, share reviews, and join real-time discussions. The platform features an intuitive React + TypeScript frontend and a clean, local Node.js backend—with a powerful admin panel for managing products, submissions, and an SEO-friendly blog system.

---

## 🛠 Tech Stack

- **Frontend:**  
  React ▪ TypeScript ▪ Vite ▪ Tailwind CSS ▪ React Router ▪ shadcn/ui

- **Backend:**  
  Node.js (no frameworks, just core modules) ▪ Local file storage (JSON DB)

- **Testing & Tooling:**  
  Vitest ▪ ESLint ▪ npm scripts

- **Other:**  
  Proxy for dev, Bearer token auth, RESTful API

---

## 🗂 Project Structure

```
fuzzy-broccoli/
├── client/         # Modern React + TypeScript frontend (Vite)
│   ├── src/        # Core app source code
│   └── ...         
├── server/         # Node.js backend (API & JSON DB)
│   └── data/       # Local database (db.json)
├── package.json    # Root scripts (start, build, test)
├── README.md       # You’re reading this!
└── .gitignore
```

---

## ✨ Features

- 🔎 Product search, filtering, sorting, categories, and product details
- 👤 Signup, login, logout, bearer-token sessions, and profile updates
- ❤️ User favorites
- 🛒 Cart management and checkout/order creation
- 💬 Product reviews
- 💡 Community dupe submissions
- 🛠️ Admin APIs for products, users, orders, stats, and submission moderation
- 💾 File-backed local persistence in `server/data/db.json`

---

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

---

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

---

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

---

## 🔌 API Overview

**Health & Catalog**
- `GET /api/health`
- `GET /api/categories`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/products/:id/reviews`

**Auth & Profile**
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/me`
- `PATCH /api/me`

**Favorites**
- `GET /api/me/favorites`
- `POST /api/me/favorites/:productId`
- `DELETE /api/me/favorites/:productId`

**Cart & Orders**
- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:productId`
- `DELETE /api/cart/items/:productId`
- `DELETE /api/cart`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`

**Community**
- `GET /api/dupe-submissions`
- `POST /api/dupe-submissions`
- `POST /api/reviews`

**Admin**
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `GET /api/admin/orders`
- `POST /api/admin/products`
- `PATCH /api/admin/products/:id`
- `DELETE /api/admin/products/:id`
- `PATCH /api/admin/dupe-submissions/:id`

---

## 🧪 Verification & Linting

Before pushing, please run:

```bash
npm run test:server
npm run test
npm run lint
npm run build
```

> _Note: Linting passes with occasional UI export warnings, which are safe to ignore during normal UI refactoring._

---

## 🧹 Local Data & Resetting

The following files are git-ignored and safe to delete/recreate as needed:

```
server/data/db.json
*.log
client/dist/
client/node_modules/
```

**Reset local backend data:**  
_Stop the server, delete `server/data/db.json`, & start the backend again to regenerate with seeded demo data._

---

## 📄 License

[MIT](LICENSE)

---

> Made with ❤️ for the beauty community. PRs and suggestions are welcome!