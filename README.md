# 🐐 GoatFarm OS — MSK Commercial Livestock ERP + POS

> **Enterprise Livestock Management • Fast Point-of-Sale (POS) • True Cost Accounting • Biological Herd Analytics**

GoatFarm OS is a commercial-grade operating system designed for modern feedlots, goat breeding centers, and livestock trading businesses. Unlike conventional retail POS systems, GoatFarm OS treats every animal as a **living inventory asset** whose economic value dynamically evolves through daily weight gain (ADG), feed conversion, health treatments, and cumulative input costs.

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation & Launch
```bash
# 1. Clone or navigate to the project root
cd "msk goat farm"

# 2. Install dependencies
npm install

# 3. Start the Turbopack development server
npm run dev
```

Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🏛️ Core Product Architecture

```
                    🐐 GOATFARM OS
                          │
  ┌───────────────────────┼────────────────────────┐
  │                       │                        │
  ↓                       ↓                        ↓
LIVESTOCK               COMMERCE                 FINANCE
  │                       │                        │
  ├─ Living Asset Registry├─ High-Speed POS        ├─ True Cost Engine
  ├─ Weight & ADG Tracking├─ Tax Invoices          ├─ Expenses Ledger
  ├─ Health & Vaccines    ├─ Trader Credit Ledger  ├─ Gross Margins
  └─ Pen Facility Density └─ Returns & Reversals   └─ Operating P&L
                          │
  ┌───────────────────────┼────────────────────────┐
  ↓                       ↓                        ↓
INVENTORY               OPERATIONS               CONTROL
  │                       │                        │
  ├─ Feed Movements       ├─ Chore Schedule        ├─ Global Search (Ctrl+K)
  ├─ Reorder Thresholds   ├─ Worker Delegation     ├─ Role-Based Access (RBAC)
  └─ Pen Feed Allocation  └─ Pen Quarantine Alerts └─ Immutable Audit Log
```

---

## 🔑 The Core Formula: True Cost Engine

A farmer's profit is never simply `Sale Price - Purchase Price`. GoatFarm OS calculates:

$$\text{True Cost of Ownership} = \text{Purchase Price} + \text{Feed Ration} + \text{Veterinary Vaccines} + \text{Labor Allocation} + \text{Shed Overheads}$$

$$\text{Gross Margin} = \text{Sale Revenue} - \text{True Cost}$$

---

## ⚡ POS Terminal Shortcuts

On the **Goat POS Terminal** screen (`/pos`), cashiers can manage rapid transactions using dedicated keyboard hotkeys:

| Key | Action | Description |
| :--- | :--- | :--- |
| **`F2`** | **Search / Scan** | Focuses the tag search or barcode/RFID scanner input |
| **`F4`** | **Customer** | Jumps to customer/trader selection dropdown |
| **`F6`** | **Discount** | Opens prompt to apply invoice discount (₹) |
| **`F8`** | **Payment Mode** | Cycles through `CASH` $\rightarrow$ `UPI` $\rightarrow$ `CREDIT` $\rightarrow$ `SPLIT` |
| **`F10`** | **Complete Sale** | Finalizes the invoice, marks animal as SOLD, and opens print dialog |
| **`ESC`** | **Clear Cart** | Resets current sale cart items |

---

## 📋 Major Application Modules

1. **3-Layer Actionable Dashboard**
   - **Layer 1 (Commercial Health):** POS Revenue, Live Asset Valuation, Invested Cost, Customer Receivables.
   - **Layer 2 (Biological Health):** Active Animals, Total Biomass (kg), Average Weight, ADG (g/day), FCR.
   - **Layer 3 (Action Alerts):** Quarantine protocols, Low Feed Thresholds, Weigh-in Reminders.
2. **Goats Registry & Economic Profile**
   - Filterable data table with tags, breeds (Kanni, Salem Black, Kodi Aadu, Boer Cross, Tellicherry, Sirohi), sex, weights.
   - Individual Animal Profile: Growth curve, True Cost engine breakdown, medical logs, and lifecycle timeline.
3. **High-Speed POS & Billing**
   - Instant calculation (`Weight (kg) × Rate/kg`).
   - Customer credit balance warning with credit limits.
   - Split payments (e.g. Cash + UPI + Credit).
   - Printable thermal / A4 official tax invoice.
4. **Feed & Inventory Movements**
   - Concentrate pellets, dry fodder bales, and mineral supplements.
   - Automatic reorder safety alerts.
   - One-click feed issuance with per-goat cost distribution.
5. **Activity & Audit Log**
   - Transparent event recording for every intake, weigh-in, sale, payment, and prescription.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom Agricultural Luxury Design System tokens
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **State & Storage:** React Context with LocalStorage offline persistence

---

## 📜 License & Ownership
Proprietary software designed for **MSK Commercial Goat Farm**. All rights reserved.
