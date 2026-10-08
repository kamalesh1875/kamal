import {
  Goat,
  Pen,
  Customer,
  Sale,
  InventoryItem,
  FarmExpense,
  FarmTask,
  WeightRecord,
  HealthRecord,
  ActivityAuditLog,
  UserRole
} from '@/types/farm';
import {
  INITIAL_GOATS,
  INITIAL_PENS,
  INITIAL_CUSTOMERS,
  INITIAL_SALES,
  INITIAL_INVENTORY,
  INITIAL_EXPENSES,
  INITIAL_TASKS,
  INITIAL_WEIGHT_RECORDS,
  INITIAL_HEALTH_RECORDS,
  INITIAL_AUDIT_LOGS
} from '@/lib/mock-data';
import { isDatabaseConnected, query } from '@/lib/db';

export interface CustomerLedgerEntry {
  id: string;
  customerId: string;
  date: string;
  type: 'INVOICE' | 'PAYMENT' | 'RETURN' | 'ADJUSTMENT';
  refNumber: string;
  debit: number;
  credit: number;
  runningBalance: number;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  receiptNumber: string;
  customerId: string;
  date: string;
  amount: number;
  paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER';
  allocations: { saleId: string; invoiceNumber: string; amount: number }[];
  notes?: string;
  recordedBy: string;
}

/**
 * Server-side Singleton Store
 * Backed by live memory + synced with PostgreSQL when configured.
 */
class FarmDataStore {
  public goats: Goat[] = [...INITIAL_GOATS];
  public pens: Pen[] = [...INITIAL_PENS];
  public customers: Customer[] = [...INITIAL_CUSTOMERS];
  public sales: Sale[] = [...INITIAL_SALES];
  public inventory: InventoryItem[] = [...INITIAL_INVENTORY];
  public expenses: FarmExpense[] = [...INITIAL_EXPENSES];
  public tasks: FarmTask[] = [...INITIAL_TASKS];
  public weightRecords: WeightRecord[] = [...INITIAL_WEIGHT_RECORDS];
  public healthRecords: HealthRecord[] = [...INITIAL_HEALTH_RECORDS];
  public auditLogs: ActivityAuditLog[] = [...INITIAL_AUDIT_LOGS];
  public payments: PaymentRecord[] = [
    {
      id: 'pay-1',
      receiptNumber: 'RCP-2026-0001',
      customerId: 'cust-1',
      date: '2026-09-22',
      amount: 15000,
      paymentMethod: 'CASH',
      allocations: [{ saleId: 'sale-2', invoiceNumber: 'INV-00482', amount: 15000 }],
      notes: 'Initial deposit at pickup',
      recordedBy: 'Priya (Cashier)'
    }
  ];
  public customerLedgers: CustomerLedgerEntry[] = [
    {
      id: 'led-1',
      customerId: 'cust-1',
      date: '2026-09-22',
      type: 'INVOICE',
      refNumber: 'INV-00482',
      debit: 35000,
      credit: 0,
      runningBalance: 35000,
      notes: 'Commercial sale of 2 goats'
    },
    {
      id: 'led-2',
      customerId: 'cust-1',
      date: '2026-09-22',
      type: 'PAYMENT',
      refNumber: 'RCP-2026-0001',
      debit: 0,
      credit: 15000,
      runningBalance: 20000,
      notes: 'Cash payment allocation'
    }
  ];

  constructor() {
    this.recomputeAllGoats();
  }

  public recomputeGoat(goatId: string) {
    const goat = this.goats.find(g => g.id === goatId);
    if (!goat) return;

    // Sum true costs
    goat.trueCost =
      Number(goat.purchasePrice || 0) +
      Number(goat.accumulatedFeedCost || 0) +
      Number(goat.accumulatedMedicineCost || 0) +
      Number(goat.accumulatedLaborCost || 0) +
      Number(goat.accumulatedOverheadCost || 0);

    const rate = Number(goat.marketRatePerKg || 460);
    goat.estimatedMarketValue = Math.round(Number(goat.currentWeightKg || 0) * rate);
    goat.projectedProfit = goat.estimatedMarketValue - goat.trueCost;
  }

  public recomputeAllGoats() {
    this.goats.forEach(g => this.recomputeGoat(g.id));
  }

  public logAudit(action: string, details: string, module: ActivityAuditLog['module'], user = 'Kamalesh M', role: UserRole = 'OWNER') {
    const newLog: ActivityAuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user,
      role,
      action,
      details,
      module
    };
    this.auditLogs.unshift(newLog);

    // If PostgreSQL is connected, write to audit table asynchronously
    if (isDatabaseConnected()) {
      query(
        `INSERT INTO audit_logs (id, farm_id, user_name, role, action, details, module)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [newLog.id, 'farm-msk-pollachi', user, role, action, details, module]
      ).catch(e => console.error('[Audit DB Log Error]', e.message));
    }
  }
}

// Global server singleton across API calls
declare global {
  var __farmStore: FarmDataStore | undefined;
}

export const farmStore = globalThis.__farmStore || new FarmDataStore();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__farmStore = farmStore;
}
