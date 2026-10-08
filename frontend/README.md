# MSK Goat Farm Frontend 🐐

Next.js 16 + React 19 + Tailwind CSS frontend interface with PWA offline support, commercial POS, herd biological management, and AI health monitoring dashboards.

---

## 🛠 Tech Stack
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Icons:** Lucide React
- **Charts:** Recharts
- **Styling:** Tailwind CSS v4

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## ☁️ Deployment Instructions

### Deploy to Vercel (Recommended)
1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository (`kamal`).
4. In the Project Configuration:
   - **Root Directory:** Click "Edit" and choose `frontend`.
   - **Framework Preset:** Next.js (automatically detected).
5. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g. `https://msk-goat-backend.onrender.com`).
6. Click **Deploy**. Done! 🎉

### Deploy to Netlify
1. Connect your GitHub repository.
2. Set:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/.next`
3. Add `NEXT_PUBLIC_API_URL` under Site configuration > Environment variables.
