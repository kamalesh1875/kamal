# MSK GOAT FARM ERP — PROJECT ANALYSIS & ARCHITECTURE MAP

**Generated:** 2026-10-04  
**Project:** MSK Commercial Goat Farm ERP / POS & Livestock Management Software  
**Status:** PROTECTED CORE MAINTAINED + ADDITIVE MOBILE & AI EXTENSIONS ACTIVE

---

## 1. PROJECT METADATA

- **Project Type:** Commercial Livestock ERP, Point-of-Sale (POS), Health Intelligence & Operations System
- **Frontend Framework:** Next.js 16.3.6 (App Router + Turbopack bundler)
- **UI & Runtime Library:** React 19.2.8, React DOM 19.2.8
- **Styling Architecture:** Tailwind CSS v4 (`@tailwindcss/postcss` 4.x), Vanilla PostCSS
- **Component Icons:** Lucide React v1.48.0
- **Data Visualization:** Recharts v3.10.1 (SVG-based reactive graphs)
- **Backend Architecture:** Next.js Server App Router API Routes (`/api/*`)
- **Database Engine:** PostgreSQL 14+ via `pg` connection pool with in-memory resilient fallback
- **State Management:** React Context (`FarmContext`) with debounced local persistence + Reactive Singleton (`aiStore`)
- **Mobile Support:** Responsive PWA (Service Worker, Web App Manifest, WebRTC QR Scanner, Offline Queue)
- **AI Health Architecture:** 14 Multimodal Vision/Sensor Detectors + Veterinary RAG + Grounded LLM Chat
- **Hosting / Target:** On-premise farm server / Edge Gateway / Cloud deployable (Node.js runtime)

---

## 2. EXISTING PROTECTED CORE ERP MODULES

The core system consists of 16 mission-critical modules that must remain 100% operational:

1. **Authentication & RBAC (`src/lib/auth.ts`, `LoginModal.tsx`):**
   - Roles: `OWNER`, `MANAGER`, `VET`, `CASHIER`, `WORKER`.
   - View permission mapping and session persistence.
2. **Executive Commercial Dashboard (`DashboardView.tsx`):**
   - Layer 1: Capital Health (Revenue, Inputs, Gross Margin, Receivables).
   - Layer 2: Biological Herd KPIs (Total biomass, average weight, FCR).
   - Layer 3: Actionable Alerts & Pen Directives.
   - Biomass Weight Pyramid & Chore Schedules.
3. **Goat Registry & Profiles (`GoatsView.tsx`, `goat-service.ts`):**
   - Tag number, RFID, breed, sex, dam/sire lineage, birth weight.
   - True Cost Engine: purchase price + feed cost + medicine cost + labor cost.
4. **Weight Management (`WeightView.tsx`):**
   - Periodic weight logging, Average Daily Gain (ADG, g/day), target off-take weight curve.
5. **Feed Management (`FeedView.tsx`):**
   - Dry fodder, green fodder, concentrate intake, per-animal daily feed cost allocation.
6. **Pens & Housing Logistics (`PensView.tsx`):**
   - Pen capacity, stocking density, transfer logging, segregation by stage (bucks, does, kids).
7. **Clinical Health Records (`HealthView.tsx`):**
   - Veterinary checkups, symptoms, diagnoses, antibiotic protocols, withdrawal periods.
8. **Vaccination Schedules (`VaccinationView.tsx`):**
   - Mandatory small-ruminant schedule: Enterotoxemia (ET), PPR, FMD, Goat Pox, Anthrax.
9. **Breeding & Reproduction (`BreedingView.tsx`):**
   - Service sire, dam mating logs, 150-day gestation calculator, kidding rates.
10. **Point of Sale (POS) Engine (`PosView.tsx`, `pos-service.ts`):**
    - Live weight vs dressed carcass weight pricing, transport charges, rate/kg.
    - Split payments: Cash, UPI, Bank Transfer, Customer Credit.
    - Automated invoice generation (`INV-YYYY-XXXXX`).
11. **Sales & Invoice History (`SalesView.tsx`):**
    - Audit of completed, pending, and cancelled sales with credit adjustments.
12. **Customer Ledger & Receivables (`CustomersView.tsx`, `ledger-service.ts`):**
    - Buyer balance tracking, receipt allocation, aging analysis.
13. **Inventory & Feed Stocks (`InventoryView.tsx`):**
    - Raw materials, mineral blocks, medicines, reorder threshold triggers.
14. **Farm Tasks & Chore Operations (`TasksView.tsx`):**
    - Pen disinfection, deworming, hoof trimming, feeding routines.
15. **Financial Accounting (`FinanceView.tsx`):**
    - Profit & Loss, true cost of biomass production, feed-to-meat conversion ratio.
16. **Audit & Traceability Log (`AuditView.tsx`):**
    - Immutable operational audit log of every system transaction.

---

## 3. NEW ADDITIVE EXTENSIONS

### A. Mobile Layer & Progressive Web App (PWA)
- **Manifest & Service Worker:** `public/manifest.json`, `public/sw.js`, `public/icon.svg`.
- **Navigation:** `MobileNavigation.tsx` (Home, Goats, POS, Tasks, More drawer).
- **Fast Worker Workflows:**
  - Rapid Stepper Weight Entry (`MobileWeightEntry.tsx`).
  - WebRTC Ear-Tag QR Scanner (`MobileQrScanner.tsx`).
  - Mobile Touch POS (`MobilePosView.tsx`).
  - Biometric Clinical Profile (`MobileGoatHealthProfile.tsx`).
  - Shed Worker Glove-Friendly Action Grid (`WorkerQuickActions.tsx`).
- **Offline Sync Engine:**
  - Idempotent queue schema (`local_id`, `server_id`, `operation_type`, `payload`, `sync_status`).
  - Network state detection and auto-sync (`offline-queue.ts`, `sync-engine.ts`, `useMobileSync.ts`).
  - Server sync endpoint (`/api/mobile-sync`).

### B. Multimodal AI Health Center
- **Vision & Telemetry Pipeline:**
  - RTSP Camera Gateway (`camera-gateway.ts`, frame sampling, Re-ID with `UNKNOWN GOAT` fallback).
  - 14 Detection Pipelines: Posture, Feces, Gait, Appearance, Growth/ADG, Environment ($THI$, $NH_3$, $CO_2$).
  - Multimodal Health Risk Engine (`health-risk-engine.ts`, 4 risk tiers, deduplicated alerts).
  - Veterinary Safety Disclaimers (Strictly advisory, never asserting definitive medical diagnoses).
- **Veterinary RAG & Conversational Assistant:**
  - Curated literature from **TANUVAS**, **ICAR-CIRG**, and **FAO**.
  - Vector similarity retriever (`vector-retriever.ts`).
  - Grounded AI Chat Assistant (`ai-chat-service.ts`, `/api/ai-health/chat`, `GoatHealthChatModal.tsx`).
- **Clinical Review & Model Governance:**
  - Separate Vet Review certification records (`vet-review-service.ts`, `/api/vet-review`).
  - Integration with animal True Cost calculation for veterinary treatments.
  - Precision, Recall, F1 tracking (`model-monitoring-service.ts`).
  - Continuous learning dataset candidate pool.

---

## 4. ARCHITECTURAL SAFETY BOUNDARIES

```text
                    MSK GOAT FARM SYSTEM
                             │
            ┌────────────────┼────────────────┐
            │                │                │
     PROTECTED CORE     MOBILE LAYER       AI LAYER
            │                │                │
       Desktop ERP       Mobile PWA      Health Center
       Desktop POS     Offline Queue     RTSP Cameras
       Core Engine     Worker Actions    Multimodal AI
            │                │                │
            └────────────────┼────────────────┘
                             │
                      SHARED API & DB
                             │
            ┌────────────────┴────────────────┐
            │                                 │
     Next.js API Routes                 PostgreSQL /
     (/api/goats, /api/pos,             In-Memory Fallback
      /api/ai-health, etc.)             (Zero destructive DDL)
```

- **Boundary Rule 1:** Server modules (`db.ts`, `pg`, `fs`, `net`, `tls`) must NEVER be imported directly into client components (`'use client'`). All client interactions must go through `useFarm()` or Next.js API routes (`/api/*`).
- **Boundary Rule 2:** Existing business logic in `pos-service.ts`, `goat-service.ts`, and `ledger-service.ts` must remain identical and unmodified.
- **Boundary Rule 3:** No table drops or destructive migrations allowed (`FILES DELETED = 0`, zero schema rollbacks).
