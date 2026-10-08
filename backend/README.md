# MSK Goat Farm Backend API 🚀

Dedicated Express.js REST API server with PostgreSQL connection pooling, role-based access control (RBAC), and offline-first mobile sync engine.

---

## 🛠 Tech Stack
- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (with automated fallback to memory store)
- **Auth:** Session cookie + JWT/Bearer token authorization
- **Dev Tooling:** `tsx` for real-time hot-reloading

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file based on `.env.example`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/msk_goat_farm
```

### 3. Start Development Server
```bash
npm run dev
```
The server will start on [http://localhost:5000](http://localhost:5000).

Health check:
```bash
curl http://localhost:5000/health
```

### 4. Build for Production
```bash
npm run build
npm start
```

---

## ☁️ Deployment Instructions

### Deploy to Render.com (Web Service)
1. Push repository to GitHub.
2. In Render Dashboard, click **New > Web Service**.
3. Connect your GitHub repository.
4. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Add Environment Variables:
   - `DATABASE_URL`: (Your PostgreSQL connection string)
   - `FRONTEND_URL`: (Your frontend URL, e.g., `https://msk-goat-farm.vercel.app`)
   - `NODE_ENV`: `production`

### Deploy to Railway.app
1. Click **New Project > Deploy from GitHub repo**.
2. Under Settings:
   - **Root Directory:** `/backend`
3. Add a PostgreSQL database service in Railway and link `DATABASE_URL`.
4. Railway will automatically build and expose the port!

### Deploy via Docker
```bash
docker build -t msk-goat-backend .
docker run -p 5000:5000 -e DATABASE_URL="your-db-url" msk-goat-backend
```
