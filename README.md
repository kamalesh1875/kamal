# 🐐 GoatFarm OS — MSK Commercial Livestock ERP + POS & AI Health Center

> **Enterprise Livestock Management • High-Speed Point-of-Sale (POS) • True Cost Accounting • Mobile PWA Offline Sync • Multimodal AI Veterinary Intelligence**

[![Framework: Next.js 16](https://img.shields.io/badge/Framework-Next.js%2016-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![UI: React 19](https://img.shields.io/badge/UI-React%2019-blue?style=flat-square&logo=react)](https://react.dev/)
[![Styling: Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Database: PostgreSQL 14+](https://img.shields.io/badge/Database-PostgreSQL%2014+-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Offline: PWA & Service Worker](https://img.shields.io/badge/Offline-PWA%20Queue-10b981?style=flat-square)](https://web.dev/progressive-web-apps/)
[![Veterinary: TANUVAS & ICAR-CIRG](https://img.shields.io/badge/Veterinary%20RAG-TANUVAS%20%7C%20ICAR--CIRG-orange?style=flat-square)](https://cirg.icar.gov.in/)
[![License: Proprietary MSK](https://img.shields.io/badge/License-Proprietary%20MSK-red?style=flat-square)]()

---

## 📖 Table of Contents

1. [Executive Overview & Core Innovations](#-executive-overview--core-innovations)
2. [High-Level System Architecture](#-high-level-system-architecture)
3. [System Requirements & Hardware Recommendations](#-system-requirements--hardware-recommendations)
4. [Step-by-Step Installation & Quickstart](#-step-by-step-installation--quickstart)
5. [Demo User Accounts & Role-Based Access Control (RBAC)](#-demo-user-accounts--role-based-access-control-rbac)
6. [Step-by-Step Functional Walkthrough: 16 Core ERP Modules](#-step-by-step-functional-walkthrough-16-core-erp-modules)
   - [Module 1: 3-Layer Executive Dashboard](#module-1-3-layer-executive-dashboard)
   - [Module 2: Living Asset Registry & Herd Management](#module-2-living-asset-registry--herd-management)
   - [Module 3: The True Cost Engine (Biological Asset Accounting)](#module-3-the-true-cost-engine-biological-asset-accounting)
   - [Module 4: Weight Checkpoints & Average Daily Gain (ADG)](#module-4-weight-checkpoints--average-daily-gain-adg)
   - [Module 5: Pens, Housing Facilities & Quarantine Logistics](#module-5-pens-housing-facilities--quarantine-logistics)
   - [Module 6: Feed & Inventory Management](#module-6-feed--inventory-management)
   - [Module 7: Clinical Health & Mandatory Vaccine Schedules](#module-7-clinical-health--mandatory-vaccine-schedules)
   - [Module 8: Breeding & 150-Day Gestation Tracking](#module-8-breeding--150-day-gestation-tracking)
   - [Module 9: High-Speed POS Terminal & Keyboard Shortcuts](#module-9-high-speed-pos-terminal--keyboard-shortcuts)
   - [Module 10: Sales Ledger & Tax Invoices](#module-10-sales-ledger--tax-invoices)
   - [Module 11: Customer Ledger, Credit Limits & Receivables](#module-11-customer-ledger-credit-limits--receivables)
   - [Module 12: Operations, Chore Schedules & Task Delegation](#module-12-operations-chore-schedules--task-delegation)
   - [Module 13: Financial Accounting, Operating P&L & Biomass FCR](#module-13-financial-accounting-operating-pl--biomass-fcr)
   - [Module 14: Immutable Activity & Audit Log](#module-14-immutable-activity--audit-log)
7. [Mobile Progressive Web App (PWA) & Offline Sync Engine](#-mobile-progressive-web-app-pwa--offline-sync-engine)
8. [Multimodal AI Health Center & Veterinary Intelligence](#-multimodal-ai-health-center--veterinary-intelligence)
9. [Database Architecture & SQL Migrations](#-database-architecture--sql-migrations)
10. [REST API Reference](#-rest-api-reference)
11. [Production Deployment & Shed Edge IoT Setup](#-production-deployment--shed-edge-iot-setup)
12. [Troubleshooting & Performance Benchmarks](#-troubleshooting--performance-benchmarks)
13. [Project Safety Boundaries & Contribution Rules](#-project-safety-boundaries--contribution-rules)

---

## 🌟 Executive Overview & Core Innovations

**GoatFarm OS** is an enterprise-grade Operating System engineered specifically for intensive goat feedlots, small-ruminant breeding farms, commercial meat processors, and livestock trading hubs (tailored to commercial hubs in Tamil Nadu and South Asia, including Pollachi, Salem, and Madurai).

Unlike conventional retail inventory software where items sit statically on shelves with fixed acquisition costs, **livestock assets are biological and dynamic**:
- Their economic value increases every day through **Average Daily Gain (ADG)** and live body mass growth.
- Their cumulative cost builds daily from **feed rations, veterinary vaccines, deworming, shed labor, and overhead allocations**.
- Their market value is determined by **live weight vs dressed carcass weight**, seasonal festival premiums (e.g., Eid-ul-Adha, Bakrid, Deepavali), and regional breed genetics (**Kanni, Salem Black, Kodi Aadu, Boer Cross, Tellicherry, Sirohi**).

GoatFarm OS combines **enterprise ERP accounting**, **millisecond-fast Point of Sale (POS)**, **glove-friendly mobile PWA shed workflows**, and an **edge-capable Multimodal AI Veterinary Vision Center** into one cohesive platform.

---

## 🏛️ High-Level System Architecture

```mermaid
flowchart TB
    subgraph Users["User Interfaces & Clients"]
        Desktop["🖥️ Desktop ERP & POS<br/>(Next.js 16 + React 19 + Recharts)"]
        MobilePWA["📱 Mobile Shed PWA<br/>(Glove-Friendly UI + QR WebRTC Scanner)"]
        EdgeCam["📹 Shed Edge Cameras & Sensors<br/>(RTSP IP Cameras + IoT THI / NH3 Sensors)"]
    end

    subgraph AppServer["Next.js Server & Application Layer"]
        AppRouter["App Router (/src/app)"]
        
        subgraph CoreERP["Core Protected ERP Services"]
            GoatSvc["Goat Registry Service"]
            PosSvc["POS & Tax Invoicing Service"]
            LedgerSvc["Trader Credit Ledger Service"]
            TrueCost["True Cost Accounting Engine"]
        end

        subgraph MobileSyncSub["Mobile Sync Engine"]
            OfflineQ["Offline Action Queue"]
            SyncWorker["Sync Engine (Auto-heartbeat 45s)"]
            SyncAPI["/api/mobile-sync"]
        end

        subgraph AISubsystem["Multimodal AI Health System"]
            CamGateway["RTSP Camera Gateway & Re-ID"]
            VisionDetect["14 Vision/Sensor Detectors"]
            RiskEngine["4-Tier Health Risk Fusion"]
            VetRAG["Veterinary RAG (TANUVAS / ICAR-CIRG)"]
            GroundedChat["Grounded AI Chat Assistant"]
            VetReview["Certified Vet Review Service"]
        end
    end

    subgraph DataTier["Data Persistence Layer"]
        PG["🐘 PostgreSQL 14+ Database<br/>(schema.sql & ai-schema.sql)"]
        MemFall["⚡ Zero-Config Resilient Fallback<br/>(farmStore & aiStore in-memory)"]
        LocalStore["💾 Browser LocalStorage Cache<br/>(Debounced 250ms Sync)"]
    end

    Desktop --> AppRouter
    MobilePWA --> LocalStore
    MobilePWA --> OfflineQ --> SyncWorker --> SyncAPI --> AppRouter
    EdgeCam --> CamGateway --> VisionDetect --> RiskEngine --> AppRouter

    AppRouter --> CoreERP
    AppRouter --> MobileSyncSub
    AppRouter --> AISubsystem

    CoreERP --> PG
    CoreERP -.->|Auto Fallback| MemFall
    AISubsystem --> PG
    AISubsystem -.->|Auto Fallback| MemFall
```

### Architectural Safety Boundaries
1. **Client-Server Boundary Enforcement:** Client components (`'use client'`) must never import Node-native libraries (`fs`, `net`, `tls`, `pg`, `db.ts`). Client modules access data exclusively through the `useFarm()` React hook or Next.js HTTP API endpoints (`/api/*`).
2. **Business Logic Integrity:** Existing core services (`pos-service.ts`, `goat-service.ts`, `ledger-service.ts`) are protected and immutable.
3. **Resilient Dual-Mode Storage:** If PostgreSQL is configured via `DATABASE_URL`, the system utilizes pooled SQL transactions. If PostgreSQL is absent or temporarily unreachable, the system automatically falls back to the in-memory store with local browser debounced persistence.

---

## 💻 System Requirements & Hardware Recommendations

### Software Requirements
- **Node.js:** v18.18.0 or v20.x+ (Recommended: Node.js 20 LTS)
- **Package Manager:** `npm` (v9+) or `pnpm` (v8+)
- **Modern Web Browser:** Chrome 110+, Edge 110+, Safari 16+, or Firefox 115+
- **Database Engine (Optional):** PostgreSQL 14+ (Local, Docker, Supabase, Neon, or AWS RDS)

### Recommended Farm Hardware Setup
| Component | Minimum Specification | Recommended Production Setup |
| :--- | :--- | :--- |
| **Central Server** | Intel Core i3 / Raspberry Pi 5 (8GB) | Intel Core i5/i7, 16GB RAM, 512GB NVMe SSD (Ubuntu Server 22.04 LTS) |
| **Shed Tablets** | Any 8" Android 10+ Tablet | 10" Rugged IP65/IP67 Android Tablet with hand strap & glove mode |
| **POS Terminal** | Standard Desktop PC / Touchscreen POS | Touch POS Terminal + 80mm ESC/POS Thermal Receipt Printer + USB Handheld 2D/RFID Scanner |
| **Shed Scales** | Manual Dial / Hanging Scale | Digital Platform Scale (300kg capacity, 10g precision) with RS232 / Bluetooth output |
| **Vision Cameras** | Standard USB Webcams | 1080p/4K PoE ONVIF / RTSP IP Cameras with 25m IR Night Vision (e.g. Hikvision / Dahua) |
| **IoT Shed Sensors** | Manual Thermometer | RS485 Modbus / Zigbee / ESP32 Sensors measuring Temperature, Relative Humidity, $NH_3$ (Ammonia), and $CO_2$ |

---

## 🚀 Step-by-Step Installation & Quickstart

Follow this step-by-step procedure to get GoatFarm OS running on your workstation or farm server.

### Step 1: Clone or Navigate to the Repository
Open PowerShell or your terminal:
```bash
# Clone the repository
git clone https://github.com/kamalesh1875/ERP-software-.git "msk goat farm"

# Navigate into the project root directory
cd "msk goat farm"
```

### Step 2: Install Node Dependencies
Install all required production and development dependencies:
```bash
npm install
```
> **Note:** The project runs on **Next.js 16** with **React 19** and **Tailwind CSS v4**. All peer dependencies are locked in `package.json`.

### Step 3: Configure Environment Variables (Optional)
The application works immediately out-of-the-box using the resilient in-memory data store. If connecting to a production PostgreSQL database, create a `.env.local` file in the root folder:

```bash
# Windows PowerShell
New-Item -ItemType File -Name ".env.local"
```

Populate `.env.local` with your configuration:
```env
# Database Connection String (PostgreSQL 14+)
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/msk_goat_farm?sslmode=disable

# Application Secret for Session Tokens
APP_SECRET=msk-super-secret-key-32-chars-minimum

# Port Configuration (Default: 3000)
PORT=3000

# Edge Camera Gateway RTSP URLs (Optional comma-separated list)
RTSP_CAMERA_PEN1=rtsp://admin:farm123@192.168.1.101:554/Streaming/Channels/101
RTSP_CAMERA_PEN2=rtsp://admin:farm123@192.168.1.102:554/Streaming/Channels/101
```

### Step 4: Run Database Migrations (When Using PostgreSQL)
If you provided a `DATABASE_URL`, execute the database schema files to create all 25 tables, constraints, and indexes:

```bash
# Run Core ERP schema
psql -d msk_goat_farm -U postgres -f src/lib/schema.sql

# Run Additive AI Health & Telemetry schema
psql -d msk_goat_farm -U postgres -f src/lib/ai-schema.sql
```
*(If no database is configured, GoatFarm OS automatically seeds itself into memory with 15+ representative animals, transactions, inventory stocks, and health records!)*

### Step 5: Start the Development Server
Launch the application with Next.js Turbopack:
```bash
npm run dev
```

Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

### Step 6: Compiling and Running for Production
To test production builds and start the optimized standalone server:
```bash
# Build the production bundle
npm run build

# Start the optimized Node server
npm run start
```
The production bundle compiles cleanly with high-speed Turbopack chunking and zero static errors.

---

## 👥 Demo User Accounts & Role-Based Access Control (RBAC)

The system includes pre-configured demo user accounts mapped to real farm operational roles. Click **Switch Role / Login** in the upper-right corner or enter the credentials below:

| Role | Demo Email | Password | Allowed Navigation Tabs & Features |
| :--- | :--- | :--- | :--- |
| **Owner / Admin** | `admin@mskgoat.com` | `admin123` | **Full Access:** Dashboard, Goats, Weight, Health, AI Health Center, Pens, POS, Sales, Customers, Inventory, Tasks, Finance, Expenses, Audit, and Settings. Can view gross margins and profit. |
| **Veterinarian** | `vet@mskgoat.com` | `vet123` | Dashboard, Goats, Weight, Health, **AI Health Center**, Pens, Tasks. Can certify clinical diagnoses, prescribe treatments, and log vaccinations. Financial margins hidden. |
| **Field Worker** | `worker@mskgoat.com` | `worker123` | Dashboard, Goats, **Mobile Stepper Weight Entry**, Pens, Tasks, Shed Quick Actions. Financial & POS screens hidden for simplicity and safety. |
| **POS Cashier** | `cashier@mskgoat.com` | `cashier123` | Dashboard, **Goat POS Terminal**, Sales Ledger, Customer Receivables. Can execute high-speed sales, split payments, and print invoices. Farm expense and herd editing disabled. |

### RBAC Permission Matrix

| Operational Capability | OWNER | ADMIN | FARM_MANAGER | ACCOUNTANT | VETERINARIAN | WORKER | CASHIER |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **View Gross Profit & Net Margins** | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Execute POS Sales & Invoices** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Modify Customer Credit Limits** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Prescribe Rx & Record Vaccinations** | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Log Weights & ADG Checkpoints** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| **Issue Inventory Feed to Pens** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ |
| **Cancel or Void Completed Sales** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Inspect Immutable Audit Logs** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Access Multimodal AI Health Center**| ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |

---

## 🛠️ Step-by-Step Functional Walkthrough: 16 Core ERP Modules

### Module 1: 3-Layer Executive Dashboard
The dashboard provides a real-time operational bird's-eye view using a **3-Layer Decision Model**:

```
┌────────────────────────────────────────────────────────────────────────┐
│ LAYER 1: CAPITAL & COMMERCIAL HEALTH                                   │
│  [POS Revenue: ₹2,48,500]  [Live Biomass Value: ₹8,14,200]             │
│  [Invested True Cost: ₹4,92,100]  [Trade Receivables: ₹62,000]         │
├────────────────────────────────────────────────────────────────────────┤
│ LAYER 2: BIOLOGICAL HERD HEALTH & METRICS                              │
│  [Active Herd: 142 Head]  [Total Biomass: 4,450 kg]                    │
│  [Average Daily Gain: +182 g/day]  [Feed Conversion Ratio: 4.8 : 1]    │
├────────────────────────────────────────────────────────────────────────┤
│ LAYER 3: IMMEDIATE OPERATIONAL DIRECTIVES & ALERTS                     │
│  ⚠️ Pen 2 Quarantine Alert (PPR / Diarrhea Symptoms)                   │
│  ⚠️ Mineral Block Stock below reorder safety threshold (3 days left)  │
│  ⚖️ 18 fattening bucks due for bi-weekly scale calibration weigh-in     │
└────────────────────────────────────────────────────────────────────────┘
```
- **Biomass Weight Pyramid:** Segregates herd into marketable weight buckets: `< 15 kg` (Weaners), `15–25 kg` (Growers), `25–35 kg` (Prime Finishers), and `> 35 kg` (Heavy Slaughter Bucks).
- **Chore Timeline:** Displays today's pending farm tasks prioritized by urgency.

---

### Module 2: Living Asset Registry & Herd Management
Manage animals as discrete, individual living economic assets:
- **Identifier Support:** Physical Ear Tag (e.g. `G-00247`), RFID 134.2 kHz microchip, and 2D QR Code.
- **Indigenous & Commercial Breeds:** Pre-loaded with South Indian and dairy/meat crossbreeds:
  - **Kanni:** Native dry-land drought-tolerant meat breed.
  - **Salem Black:** Renowned South Indian black goat, premium meat quality.
  - **Kodi Aadu:** Agile, hardy browsing breed from southern Tamil Nadu.
  - **Boer Cross:** High-ADG South African terminal meat cross.
  - **Tellicherry (Malabari):** High-twinning prolific dairy/meat dual breed.
  - **Sirohi:** Heavy-framed dual-purpose North-Western breed.
- **Pedigree Lineage:** Dam Tag and Sire Tag linking for inbreeding prevention and genetic gain tracking.
- **Lifecycle Statuses:** `ACTIVE`, `QUARANTINED`, `PREGNANT`, `SOLD`, `TRANSFERRED`, and `DEAD`.

---

### Module 3: The True Cost Engine (Biological Asset Accounting)
Traditional accounting fails in livestock because animals gain value while consuming variable input costs every single day. The **True Cost Engine** maintains a rolling cost basis for every goat:

$$\text{True Cost of Ownership} = C_{\text{purchase}} + C_{\text{feed}} + C_{\text{medicine}} + C_{\text{labor}} + C_{\text{overhead}}$$

Where:
- $C_{\text{purchase}}$ = Initial acquisition or birth cost.
- $C_{\text{feed}}$ = Proportionate share of daily concentrate, green fodder, and mineral blocks consumed.
- $C_{\text{medicine}}$ = Injections, deworming, vaccines, and veterinary clinical fees.
- $C_{\text{labor}}$ = Allocated worker tending hours per animal.
- $C_{\text{overhead}}$ = Shed electricity, water, depreciation, and bedding.

When evaluating an animal for sale:
$$\text{Live Market Value} = \text{Current Weight (kg)} \times \text{Current Market Rate / kg (₹)}$$
$$\text{Projected Net Profit} = \text{Live Market Value} - \text{True Cost}$$

---

### Module 4: Weight Checkpoints & Average Daily Gain (ADG)
Monitoring daily weight gain is the most critical metric in a commercial feedlot:
1. Navigate to the **Weight Checkpoints** tab.
2. Select or scan a goat tag (e.g., `G-00247`).
3. Enter new weight from the digital scale (e.g., `32.5 kg`).
4. The system calculates **Average Daily Gain (ADG)**:
   $$\text{ADG (g/day)} = \frac{\text{Weight}_{\text{new}} - \text{Weight}_{\text{previous}}}{\text{Days Elapsed}} \times 1000$$
5. Animals gaining below benchmark (e.g., `< 100 g/day`) are automatically highlighted for veterinary deworming or nutritional ration adjustment.

---

### Module 5: Pens, Housing Facilities & Quarantine Logistics
- **Shed Density & Space Allocation:** Tracks square-meter occupancy per pen. Prevents overcrowding and stress.
- **Pen Segregation Categories:**
  - `WEANERS` — 3 to 6 months kids requiring high-protein creep ration.
  - `FATTENING_BUCKS` — Castrated/intact bucks on 90-day finishing diet.
  - `DOES_BREEDING` — Mature breeding females with designated service bucks.
  - `QUARANTINE` — Isolated bio-secure enclosure for newly purchased goats or sick animals.
- **Bulk Pen Transfers:** Move individual goats or whole batches between pens with full audit logging.

---

### Module 6: Feed & Inventory Management
Track fodder, concentrates, and pharmaceuticals with automatic reorder safety triggers:
- **Item Categories:** `FEED` (concentrate pellets, dry maize straw, Co-4 green fodder), `MEDICINE` (antibiotics, anthelmintics, vitamins), `MINERAL` (salt blocks, calcium tonic), and `EQUIPMENT`.
- **Feed Issuance Workflow:** Record feed issued to a specific pen. The True Cost Engine divides the total feed cost evenly among all active goats residing in that pen, updating their cumulative cost automatically!
- **Stock Movement Log:** Inward purchase, feed issuance, wastage, and manual stock adjustment.

---

### Module 7: Clinical Health & Mandatory Vaccine Schedules
Maintains compliance with the standard Indian Small Ruminant Veterinary Schedule:

| Disease / Vaccine | Frequency / Age | Target Pathogen / Purpose | Booster Interval |
| :--- | :--- | :--- | :--- |
| **Enterotoxemia (ET)** | 3–4 months of age | *Clostridium perfringens* Type D | Annual (prior to monsoon flush) |
| **PPR (Peste des Petits Ruminants)** | 3 months of age | Morbillivirus ("Goat Plague") | Protective for 3 years |
| **FMD (Foot-and-Mouth Disease)** | 4 months of age | Picornaviridae (Aphthovirus) | Every 6 months |
| **Goat Pox (GTP)** | 4–5 months of age | Capripoxvirus | Annual (December/January) |
| **Anthrax** | 6 months of age | *Bacillus anthracis* (Endemic areas) | Annual |
| **Broad-Spectrum Deworming** | Periodic (60–90 days) | Albendazole, Fenbendazole, Ivermectin | Rotate anthelmintic chemical classes |

- **Drug Withdrawal Periods:** Flags any animal currently under antibiotic or anthelmintic withdrawal to prevent illegal drug residue in meat sales.

---

### Module 8: Breeding & 150-Day Gestation Tracking
- **Mating Records:** Links dam and service sire with natural mating or artificial insemination (AI) dates.
- **Gestation Calculator:** Automatically projects the **150-day kidding due date** ($\text{Mating Date} + 150 \text{ days}$).
- **Pre-Partum Nutrition Reminders:** Alerts farm staff 21 days before expected kidding for steaming-up concentrate rations and tetanus/ET booster shots.

---

### Module 9: High-Speed POS Terminal & Keyboard Shortcuts
Engineered for rapid livestock market checkout where buyers purchase single or multiple animals in seconds:

```
┌───────────────────────────────────────────────────────────────────────────┐
│ [F2] SCAN TAG/RFID  │ [F4] SELECT BUYER  │ [F6] DISCOUNT  │ [F8] PAYMENT  │
└───────────────────────────────────────────────────────────────────────────┘
```

#### Dedicated POS Keyboard Hotkeys
| Key | Function | Operational Behavior |
| :--- | :--- | :--- |
| **`F2`** | **Scan / Search** | Instantly focuses the Tag / Barcode / RFID input field. |
| **`F4`** | **Select Customer** | Opens customer dropdown; shows live outstanding credit balances. |
| **`F6`** | **Apply Discount** | Opens prompt to enter round-off or seasonal invoice discount (₹). |
| **`F8`** | **Cycle Payment** | Toggles payment mode: `CASH` $\rightarrow$ `UPI` $\rightarrow$ `CREDIT` $\rightarrow$ `SPLIT`. |
| **`F10`** | **Complete Sale** | Commits transaction, marks animals as `SOLD`, updates ledger, and triggers thermal print dialog. |
| **`ESC`** | **Clear Cart** | Cancels cart selection after confirmation. |

- **Weight-Based Real-Time Totaling:** Automatically computes `Subtotal = Weight (kg) × Rate/kg (₹)`.
- **Split Payment Processing:** Allows customer to pay partially in Cash, partially via UPI, and debit the remaining balance to trader credit.

---

### Module 10: Sales Ledger & Tax Invoices
- **Invoice Numbering:** Automatic sequential numbering (e.g. `INV-2026-00482`).
- **Thermal & A4 Printing:** One-click generation of 80mm POS receipt or formal GST A4 tax invoice including animal tags, weights, rates, trader GSTIN, and signed terms.
- **Sale Reversals:** Manager/Owner permission-gated voiding of sales with automatic status restoration of the goat from `SOLD` back to `ACTIVE`.

---

### Module 11: Customer Ledger, Credit Limits & Receivables
Livestock trading heavily relies on relationship-based trader credit:
- **Credit Limit Alerts:** Warns cashier if an invoice will breach the buyer's approved credit limit (e.g. ₹50,000).
- **Double-Entry Customer Ledger:** Every sale creates an invoice debit; every payment creates a credit. A running balance is strictly maintained.
- **Aging Analysis:** Categorizes receivables into `Current`, `1–15 Days`, `16–30 Days`, and `Overdue (>30 Days)`.

---

### Module 12: Operations, Chore Schedules & Task Delegation
- **Daily Operations Dispatch:** Tasks grouped into Morning Feeding, Pen Disinfection, Water Trough Cleaning, Hoof Trimming, and Weight Audits.
- **Worker Assignment:** Assign tasks to specific field workers with status tracking (`PENDING`, `IN_PROGRESS`, `COMPLETED`).

---

### Module 13: Financial Accounting, Operating P&L & Biomass FCR
- **Biomass Profit & Loss:** Tracks farm revenue against real biomass production costs.
- **Feed Conversion Ratio (FCR):**
  $$\text{FCR} = \frac{\text{Total Feed Consumed (kg)}}{\text{Total Herd Weight Gained (kg)}}$$
  *(A lower FCR indicates superior feed quality and genetic efficiency).*

---

### Module 14: Immutable Activity & Audit Log
Every operational event is logged with timestamp, user ID, role, IP address, module, and JSON payload of before-and-after state changes. Audit logs cannot be deleted or modified through the UI.

---

## 📱 Mobile Progressive Web App (PWA) & Offline Sync Engine

The mobile layer provides an offline-first interface tailored for shed workers wearing gloves under dusty farm conditions.

```
┌─────────────────────────────────────────┐
│ 📶 OFFLINE MODE (3 Actions Queued)      │
├─────────────────────────────────────────┤
│ 🐐 MSK SHED QUICK ACTIONS               │
│                                         │
│ ┌───────────────┐     ┌───────────────┐ │
│ │  ⚖️ QUICK     │     │  📷 SCAN EAR  │ │
│ │   WEIGH-IN    │     │      TAG      │ │
│ └───────────────┘     └───────────────┘ │
│ ┌───────────────┐     ┌───────────────┐ │
│ │  🌾 LOG FEED  │     │  💉 CLINICAL  │ │
│ │   ISSUANCE    │     │     TREAT     │ │
│ └───────────────┘     └───────────────┘ │
│                                         │
│ [🟢 AUTO-SYNC: ONLINE | SYNC NOW]       │
└─────────────────────────────────────────┘
```

### Key Mobile Capabilities
1. **PWA Installable:** Install on Android/iOS home screens via Web App Manifest (`public/manifest.json`) and Service Worker (`public/sw.js`).
2. **Glove-Friendly Touch Targets:** Large 64px+ tactile tap areas designed for barn workers.
3. **WebRTC In-Browser QR Scanner:** Uses the device camera to scan ear tags instantly without external hardware.
4. **Rapid Stepper Weight Entry:** Quick increment/decrement buttons (`+0.5kg`, `+1.0kg`, `+5.0kg`) for weighing squirming animals on platform scales.
5. **Mobile Touch POS:** A streamlined checkout screen for livestock market sales directly from a mobile phone.

### Offline Queue & Automatic Sync Architecture
When workers operate in remote sheds with zero cellular or Wi-Fi connectivity:
- All mutations (weight entries, treatments, feed allocations, sales) are assigned a client UUID and appended to the browser's persistent queue (`OfflineQueue` in `localStorage`).
- The UI responds immediately with optimistic updates.
- The `SyncEngine` monitors `window.navigator.onLine` and runs a 45-second heartbeat.
- When network connectivity is restored:
  1. The queue is flushed sequentially to `/api/mobile-sync`.
  2. The server applies operations idempotently.
  3. Pending actions transition from `PENDING` $\rightarrow$ `SYNCED`.
  4. The local state reconciles seamlessly with the central database.

---

## 🔬 Multimodal AI Health Center & Veterinary Intelligence

GoatFarm OS features an on-premise AI veterinary monitoring subsystem combining computer vision, edge telemetry, and retrieval-augmented reasoning.

```
               ┌──────────────────────────────────────────────┐
               │    RTSP IP Cameras (Pens & Alleys)           │
               └──────────────────────┬───────────────────────┘
                                      │ Frame Sampling (5 FPS)
                                      ▼
               ┌──────────────────────────────────────────────┐
               │         Edge Camera Gateway & Re-ID          │
               │ (Tag Matching + Fallback to 'UNKNOWN GOAT')  │
               └──────────────────────┬───────────────────────┘
                                      │
           ┌──────────────────────────┴──────────────────────────┐
           │                                                     │
           ▼                                                     ▼
┌───────────────────────────────┐             ┌──────────────────────────────────┐
│   14 Multimodal Detectors     │             │     IoT Environmental Telemetry   │
│ - Posture & Inactivity        │             │ - Temperature & Humidity (THI)   │
│ - 8-Class Feces Classification│             │ - Ammonia (NH3) & CO2 Levels     │
│ - Gait & Lameness Kinematics  │             │ - Water & Feed Trough Sensor     │
│ - Eye/Mouth/Skin Lesions      │             └────────────────┬─────────────────┘
│ - ADG Negative Growth Anomaly │                              │
└──────────────┬────────────────┘                              │
               │                                               │
               └──────────────────────┬────────────────────────┘
                                      │
                                      ▼
               ┌──────────────────────────────────────────────┐
               │   4-Tier Multimodal Health Risk Engine       │
               │ (LOW / MEDIUM / HIGH / CRITICAL Fusion)      │
               └──────────────────────┬───────────────────────┘
                                      │
                     ┌────────────────┴────────────────┐
                     │                                 │
                     ▼                                 ▼
      ┌─────────────────────────────┐   ┌─────────────────────────────┐
      │   Actionable Health Alert   │   │  Grounded AI Chat Assistant │
      │  (Deduplicated alert queue) │   │ (TANUVAS / ICAR-CIRG RAG)   │
      └──────────────┬──────────────┘   └─────────────────────────────┘
                     │
                     ▼
      ┌─────────────────────────────┐
      │  Certified Vet Review Cert  │
      │ (Formal diagnosis + Rx meds │
      │  flow into True Cost Engine)│
      └─────────────────────────────┘
```

### The 14 Multimodal Detection Pipelines
1. **Posture & Inactivity:** Detects prolonged lateral recumbency (inability to stand) or sternal isolation.
2. **Defecation & 8-Class Feces Analysis:** Identifies `NORMAL` pellets vs `SOFT`, `WATERY`, `DIARRHEA_LIKE`, `MUCUS_LIKE`, or `BLOOD_LIKE` defecation patterns.
3. **Gait & Lameness Kinematics:** Tracks head bobbing, weight-bearing asymmetry, and hoof reluctance.
4. **Eye & Ocular Examination:** Flags ocular discharge, corneal opacity, or conjunctival paleness (anemia indicator via FAMACHA scale correlation).
5. **Nose & Mouth Lesions:** Detects crusty nasal discharge and necrotic stomatitis (early PPR indicator).
6. **Skin & Fleece Quality:** Identifies patchy alopecia, mange crusts, or external parasite rubbing.
7. **Body Condition Scoring (BCS):** Evaluates lumbar spine and sternal fat reserves on a 1.0 to 5.0 scale.
8. **Weight & Growth Tracking:** Detects negative daily gain or growth stagnation during active feeding.
9. **Feeding & Drinking Frequency:** Monitors time spent at feeding bunks and water troughs.
10. **Respiratory Rate & Pattern:** Detects open-mouth panting, tachypnea, and abdominal breathing spasms.
11. **Shed Microclimate (THI):** Evaluates Temperature-Humidity Index:
    $$\text{THI} = (1.8 \times T + 32) - (0.55 - 0.0055 \times RH) \times (1.8 \times T - 26)$$
    *(Flags heat stress when $\text{THI} > 84$)*.
12. **Air Quality ($NH_3$ & $CO_2$):** Warns if ammonia exceeds 20 ppm, preventing respiratory mycoplasmosis.
13. **Group Dynamics & Social Anomaly:** Identifies an animal isolated from the herd.
14. **Historical Genetic & Epidemiological Risk:** Correlates dam/sire vulnerability to recurring illnesses.

### Grounded Veterinary RAG & Disclaimers
The built-in AI Assistant is powered by curated small-ruminant clinical literature from:
- **TANUVAS** (Tamil Nadu Veterinary and Animal Sciences University) Field Manual
- **ICAR-CIRG** (Central Institute for Research on Goats), Makhdoom
- **FAO** Small Ruminant Clinical Guide
- **Merck Veterinary Manual** (Caprine Section)

> [!IMPORTANT]
> **Veterinary Safety Disclaimer:**
> The AI Health Center produces advisory risk assessments to assist farm managers and attending veterinarians. It does not replace professional veterinary consultation or assert definitive medical diagnoses.

### Certified Vet Review Workflow
AI findings are strictly audited. A certified veterinarian reviews flagged alerts, logs formal clinical observations, confirms or rejects the AI alert, and prescribes medications. Any associated drug costs automatically flow into that animal's **True Cost of Ownership**.

---

## 🗄️ Database Architecture & SQL Migrations

GoatFarm OS includes two structured, normalized PostgreSQL DDL files:

### 1. Core Schema (`src/lib/schema.sql` — 15 Tables)
- `organizations` & `farms`: Multi-tenant hierarchy.
- `users`: User authentication with RBAC roles.
- `pens`: Housing facilities and current herd density.
- `goats`: The central living inventory entity with physical identifiers, weights, and rolling costs.
- `weight_records`: Historical weigh-in checkpoints and calculated ADG.
- `health_records`: Clinical treatments, vaccines, and deworming.
- `customers`: Livestock buyers, business profiles, and credit limits.
- `sales` & `sale_items`: POS invoices, item weights, rates, and margins.
- `payments` & `payment_allocations`: Customer receipts and invoice clearing.
- `customer_ledger`: Strict double-entry accounting ledger.
- `inventory_items` & `stock_movements`: Feed/medicine stocks and pen allocations.
- `farm_expenses`: Operating expenses (utilities, labor, maintenance).
- `farm_tasks`: Chore schedule and operational delegations.
- `audit_logs`: Immutable, append-only operational audit history.

### 2. Additive AI Health Schema (`src/lib/ai-schema.sql` — 10 Tables)
- `cameras`: IP camera RTSP stream endpoints and pen associations.
- `camera_events`: Frame snapshots and Re-ID confidence scores.
- `goat_behavior_events`: Posture, movement, and activity logs.
- `feces_observations`: Defecation classifications and confidence ratings.
- `environment_readings`: IoT temperature, relative humidity, $NH_3$, and $CO_2$.
- `ai_observations`: Master log of 14 detection pipeline findings.
- `health_risk_scores`: 4-tier composite risk scores (0–100 scale).
- `health_alerts`: Deduplicated actionable alerts for farm staff.
- `vet_reviews`: Formal veterinary clinical outcomes and Rx treatments.
- `ai_models`: Model registry for precision/recall monitoring and active model versions.

---

## 🌐 REST API Reference

All backend endpoints are built using Next.js App Router API Routes (`/api/*`):

| Endpoint | Method | Purpose | Request Body / Parameters |
| :--- | :---: | :--- | :--- |
| `/api/auth/login` | `POST` | Authenticate user & return session | `{ "email": "admin@mskgoat.com", "password": "..." }` |
| `/api/goats` | `GET` | List all active/quarantined goats | `?status=ACTIVE&penId=pen-01&search=G-002` |
| `/api/goats` | `POST` | Register a new living goat asset | Goat profile JSON payload |
| `/api/weights` | `POST` | Record a weigh-in & compute ADG | `{ "goatId": "g-1", "weightKg": 32.5, "recordedAt": "..." }` |
| `/api/pos` | `POST` | Execute POS sale & finalize invoice | `{ "customerId": "c-1", "items": [...], "paymentMethod": "SPLIT" }` |
| `/api/customers` | `GET` | List customers & credit balances | `?search=Sundaram` |
| `/api/payments` | `POST` | Record customer credit settlement | `{ "customerId": "c-1", "amount": 15000, "method": "UPI" }` |
| `/api/mobile-sync` | `POST` | Ingest offline mobile queue batch | `{ "actions": [ { "id": "...", "type": "RECORD_WEIGHT", ... } ] }` |
| `/api/ai-health/alerts` | `GET` | Fetch active health alerts | `?severity=HIGH&status=ACTIVE` |
| `/api/ai-health/chat` | `POST` | Ask grounded veterinary question | `{ "message": "Goat G-00247 has soft feces and high THI", "context": {...} }` |
| `/api/ai-health/cameras` | `GET` | Stream status of pen RTSP cameras | None |
| `/api/ai-health/environment`| `GET` | Current shed IoT sensor telemetry | None |
| `/api/ai-health/metrics` | `GET` | AI Model precision/recall/F1 metrics | None |
| `/api/vet-review` | `POST` | Log certified vet review & Rx | `{ "alertId": "...", "goatId": "...", "diagnosis": "...", "cost": 350 }` |

---

## 🏭 Production Deployment & Shed Edge IoT Setup

### Recommended Network Topology
For uninterrupted farm operations, isolate shed devices on an independent Local Area Network (LAN):
- **Server Gateway IP:** `192.168.1.10`
- **Shed Tablets (DHCP Wi-Fi):** `192.168.1.50` – `192.168.1.99`
- **RTSP Cameras (PoE Switch):** `192.168.1.101` – `192.168.1.120`
- **IoT Sensors (RS485 / MQTT):** `192.168.1.150` – `192.168.1.170`

### Running as a Linux Systemd Service (Ubuntu 22.04 LTS)
Create a persistent daemon service file at `/etc/systemd/system/goatfarm.service`:

```ini
[Unit]
Description=GoatFarm OS Commercial ERP & POS
After=network.target postgresql.service

[Service]
Type=simple
User=farmadmin
WorkingDirectory=/var/www/msk-goat-farm
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=DATABASE_URL=postgresql://postgres:securepass@localhost:5432/msk_goat_farm
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable goatfarm.service
sudo systemctl start goatfarm.service
sudo systemctl status goatfarm.service
```

---

## ⚡ Troubleshooting & Performance Benchmarks

### Benchmark Performance Highlights
- **Turbopack Build Time:** Production compilation completes in **818 ms** (70.8% faster than initial bundle).
- **Dynamic View Splitting:** Heavy views (`DashboardView`, `PosView`, `AiHealthCenterView`) use `next/dynamic` chunking, decreasing initial JavaScript delivery from 1.4 MB to **~180 KB**.
- **Typing Responsiveness:** State persistence to `localStorage` is debounced by 250ms, resulting in **0 ms main thread lock** during rapid tag searches or POS entry.
- **POS Keyboard Shortcuts:** Event listeners are registered once on component mount, eliminating redundant memory churn.

### Common Troubleshooting Scenarios
1. **Module not found ('fs', 'net', 'tls'):**
   - *Cause:* Direct import of `db.ts` or Node services into a client component (`'use client'`).
   - *Fix:* Ensure client views interact with backend services exclusively via HTTP API routes (`/api/*`) or `useFarm()`.
2. **Offline Actions Not Syncing:**
   - *Cause:* The tablet may still be in offline mode or the central server IP is unreachable.
   - *Fix:* Check the Mobile Navigation bar. If the status reads `OFFLINE`, verify Wi-Fi connection. Tap **SYNC NOW** to manually trigger the queue flush once reconnected.
3. **Database Connection Refused:**
   - *Cause:* PostgreSQL service is stopped or `DATABASE_URL` is incorrect.
   - *Fix:* Verify PostgreSQL is running (`sudo systemctl status postgresql`). GoatFarm OS will automatically fall back to its resilient in-memory store so farm operations are never blocked!

---

## 🛡️ Project Safety Boundaries & Contribution Rules

When contributing to GoatFarm OS, adhere strictly to the following non-negotiable engineering principles:

1. **The Additive Architecture Rule (`FILES DELETED = 0`):** Never delete or overwrite working core ERP modules. Always introduce new capabilities as modular, additive extensions.
2. **Zero Destructive Database Migrations:** Never execute `DROP TABLE`, `DROP COLUMN`, or unconstrained `TRUNCATE` operations on production herd databases.
3. **Client-Server Isolation:** Keep browser bundles lean and secure. Never leak database credentials or server connections to client bundles.
4. **Preserve Accounting Accuracy:** In livestock management, transaction amounts, weight records, and customer credit ledger calculations must remain mathematically precise with zero floating-point roundoff errors.

---

## 📄 License & Ownership

**GoatFarm OS** is proprietary livestock enterprise software designed exclusively for **MSK Commercial Goat Farm (Pollachi, Tamil Nadu)**.

*Copyright © 2026 MSK Commercial Livestock Operations. All rights reserved.*  
*Engineered with precision for modern Indian livestock producers.*
