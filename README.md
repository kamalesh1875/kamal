# 🐐 MSK Goat Farm OS — Monorepo Architecture

Enterprise Livestock Enterprise Resource Planning (ERP), Point of Sale (POS), and AI Multimodal Herd Health System.

This project is organized into two completely decoupled folders for simple, independent deployment:
- **`frontend/`**: Next.js 16 + React 19 + Tailwind CSS frontend interface (ready for **Vercel** / **Netlify**).
- **`backend/`**: Express.js REST API with PostgreSQL connection pooling, CORS, and mobile sync engine (ready for **Render** / **Railway** / **Docker** / **VPS**).

---

## 📁 Project Structure

```text
msk-goat-farm/
├── frontend/                     # Next.js UI Application
│   ├── src/
│   │   ├── app/                 # Next.js App Router (Pages & Views)
│   │   ├── components/          # Reusable UI & Layout Components
│   │   ├── context/             # FarmContext & State Management
│   │   ├── mobile/              # PWA & Offline-First Sync Hooks
│   │   ├── ai-health/           # Visual AI Health Center Components
│   │   └── lib/                 # Client Auth & Navigation Config
│   ├── public/                  # Static Assets, Icons, Manifest
│   ├── next.config.ts           # Automatic Backend API Proxy Rewrites
│   ├── package.json             # Frontend Dependencies
│   └── .env.example             # Frontend Environment Configuration
│
├── backend/                      # Standalone Express REST API
│   ├── src/
│   │   ├── routes/              # Express API Route Handlers (/api/*)
│   │   ├── services/            # Farm Store, Goat, POS & Ledger Services
│   │   ├── ai-health/           # Multimodal AI Health Detectors & RAG
│   │   ├── lib/                 # PostgreSQL Pool (db.ts) & Server Auth
│   │   └── server.ts            # Express Entrypoint (Port 5000)
│   ├── Dockerfile               # Production Docker Container Spec
│   ├── package.json             # Backend Dependencies
│   └── .env.example             # Backend Environment Configuration
│
├── package.json                 # Root Workspace Scripts (Concurrently)
└── README.md                    # Documentation & Deployment Guide
```

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
Run from the root directory:
```bash
# Install root orchestrator
npm install

# Install both frontend and backend dependencies
npm run install:all
```

### 2. Configure Environment Files
In `frontend/`:
```bash
cp frontend/.env.example frontend/.env.local
```
*(Default: `NEXT_PUBLIC_API_URL=http://localhost:5000`)*

In `backend/`:
```bash
cp backend/.env.example backend/.env
```
*(Default: `PORT=5000`, `FRONTEND_URL=http://localhost:3000`)*

### 3. Run Both Servers Concurrently
```bash
npm run dev
```
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **Backend Health Check:** [http://localhost:5000/health](http://localhost:5000/health)

*(You can also run them separately with `npm run dev:frontend` or `npm run dev:backend`)*

---

## ☁️ Easy Cloud Deployment Guide

### A. Deploy Frontend to Vercel (1-Click)
1. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Connect your GitHub repository (`kamal`).
3. Under **Configure Project**:
   - Set **Root Directory** to: `frontend`
   - Framework Preset: **Next.js**
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g. `https://msk-goat-backend.onrender.com`)
5. Click **Deploy**!

> **How it works:** Next.js automatically rewrites any client `/api/*` call to your Express backend, eliminating CORS errors and domain mismatches!

---

### B. Deploy Backend to Render (Free / Web Service)
1. Go to [Render.com](https://render.com) and click **"New Web Service"**.
2. Connect your GitHub repository (`kamal`).
3. Configure settings:
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g. `https://msk-goat-farm.vercel.app`)
   - `DATABASE_URL`: Your hosted PostgreSQL connection string (e.g., from Neon, Supabase, or Render Postgres)
5. Click **Create Web Service**!

---

### C. Deploy Backend to Railway
1. Click **New Project > Deploy from GitHub Repo**.
2. Select your repository and choose root path: `/backend`.
3. Add a PostgreSQL database service in Railway and link `DATABASE_URL`.
4. Railway will automatically build and expose your API.

---

## 🔐 Default Demo Accounts & Role Permissions

| Email | Role | Default Landing | Key Permissions |
| :--- | :--- | :--- | :--- |
| `admin@mskgoat.com` | `OWNER` | `/dashboard` | Full Access (POS, Profit, Livestock, Settings) |
| `manager@mskgoat.com` | `FARM_MANAGER`| `/dashboard` | Operations, Livestock, Tasks, Feeds |
| `vet@mskgoat.com` | `VETERINARIAN` | `/dashboard` | AI Health Center, Clinical Diagnosis, Quarantine |
| `cashier@mskgoat.com` | `CASHIER` | `/pos` | Terminal Checkout, Customer Sales, Receipts |
| `accountant@mskgoat.com`| `ACCOUNTANT` | `/dashboard` | Customer Ledger, Outstanding Debt, P&L Payouts |
| `worker@mskgoat.com` | `WORKER` | `/dashboard` | Mobile Offline Weight Scale, Task Logging |

*Default password for all demo accounts is their role name followed by `123` (e.g. `admin123`, `vet123`, `cashier123`).*