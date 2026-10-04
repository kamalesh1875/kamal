'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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

export interface OverdueAlert {
  customerId: string;
  customerName: string;
  businessName?: string;
  phone: string;
  totalOverdue: number;
  daysOverdue: number;
  oldestInvoiceNumber: string;
  severity: 'TODAY' | 'OVERDUE' | 'CRITICAL';
}

interface FarmContextType {
  // Current user role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // Data Collections
  goats: Goat[];
  pens: Pen[];
  customers: Customer[];
  sales: Sale[];
  inventory: InventoryItem[];
  expenses: FarmExpense[];
  tasks: FarmTask[];
  weightRecords: WeightRecord[];
  healthRecords: HealthRecord[];
  auditLogs: ActivityAuditLog[];
  overdueAlerts: OverdueAlert[];

  // Selected goat for deep-dive economic profile
  selectedGoatId: string | null;
  setSelectedGoatId: (id: string | null) => void;

  // Active module view
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Command palette state
  isCommandMenuOpen: boolean;
  setIsCommandMenuOpen: (open: boolean) => void;

  // Mobile Field Worker state
  isMobileWorkerOpen: boolean;
  setIsMobileWorkerOpen: (open: boolean) => void;

  // Quick Action Modal states
  quickActionModal: 'ADD_GOAT' | 'POS_SALE' | 'RECORD_WEIGHT' | 'RECORD_EXPENSE' | 'ISSUE_FEED' | 'ADD_CUSTOMER' | 'RECORD_PAYMENT' | null;
  setQuickActionModal: (action: 'ADD_GOAT' | 'POS_SALE' | 'RECORD_WEIGHT' | 'RECORD_EXPENSE' | 'ISSUE_FEED' | 'ADD_CUSTOMER' | 'RECORD_PAYMENT' | null) => void;

  // Mutation Handlers
  addGoat: (newGoat: Omit<Goat, 'id' | 'accumulatedFeedCost' | 'accumulatedMedicineCost' | 'accumulatedLaborCost' | 'accumulatedOverheadCost' | 'trueCost' | 'estimatedMarketValue' | 'projectedProfit'>) => Goat;
  updateGoat: (id: string, updates: Partial<Goat>) => void;
  recordWeight: (goatId: string, weightKg: number, notes?: string) => { warning?: string };
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => void;
  createSale: (saleData: Omit<Sale, 'id' | 'invoiceNumber'>) => Sale;
  cancelSale: (saleId: string, reason: string) => void;
  recordPayment: (customerId: string, amount: number, paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER', notes?: string, allocations?: any[]) => void;
  addExpense: (expense: Omit<FarmExpense, 'id'>) => void;
  issueFeed: (itemId: string, quantityKg: number, penId: string, notes?: string) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'outstandingBalance' | 'totalPurchases'>) => Customer;
  toggleTaskStatus: (taskId: string) => void;
  resetAllToDefault: () => void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('OWNER');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedGoatId, setSelectedGoatId] = useState<string | null>('goat-1');
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [isMobileWorkerOpen, setIsMobileWorkerOpen] = useState(false);
  const [quickActionModal, setQuickActionModal] = useState<'ADD_GOAT' | 'POS_SALE' | 'RECORD_WEIGHT' | 'RECORD_EXPENSE' | 'ISSUE_FEED' | 'ADD_CUSTOMER' | 'RECORD_PAYMENT' | null>(null);

  // States with LocalStorage Hydration & Server Fallback
  const [goats, setGoats] = useState<Goat[]>(INITIAL_GOATS);
  const [pens, setPens] = useState<Pen[]>(INITIAL_PENS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [expenses, setExpenses] = useState<FarmExpense[]>(INITIAL_EXPENSES);
  const [tasks, setTasks] = useState<FarmTask[]>(INITIAL_TASKS);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(INITIAL_WEIGHT_RECORDS);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(INITIAL_HEALTH_RECORDS);
  const [auditLogs, setAuditLogs] = useState<ActivityAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [overdueAlerts, setOverdueAlerts] = useState<OverdueAlert[]>([
    {
      customerId: 'cust-1',
      customerName: 'Kumar',
      businessName: 'Kumar Goat Traders & Livestock',
      phone: '+91 98421 78910',
      totalOverdue: 20000,
      daysOverdue: 7,
      oldestInvoiceNumber: 'INV-00482',
      severity: 'OVERDUE'
    }
  ]);

  // Load from local storage or server on mount
  useEffect(() => {
    try {
      const savedGoats = localStorage.getItem('msk_goats');
      if (savedGoats) setGoats(JSON.parse(savedGoats));
      const savedSales = localStorage.getItem('msk_sales');
      if (savedSales) setSales(JSON.parse(savedSales));
      const savedInventory = localStorage.getItem('msk_inventory');
      if (savedInventory) setInventory(JSON.parse(savedInventory));
      const savedCustomers = localStorage.getItem('msk_customers');
      if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
      const savedExpenses = localStorage.getItem('msk_expenses');
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
      const savedWeights = localStorage.getItem('msk_weights');
      if (savedWeights) setWeightRecords(JSON.parse(savedWeights));
      const savedHealth = localStorage.getItem('msk_health');
      if (savedHealth) setHealthRecords(JSON.parse(savedHealth));
      const savedAudit = localStorage.getItem('msk_audit');
      if (savedAudit) setAuditLogs(JSON.parse(savedAudit));

      // Attempt background sync with live backend
      fetch('/api/dashboard')
        .then(res => res.json())
        .then(data => {
          if (data.alerts?.overdueAlerts) {
            setOverdueAlerts(data.alerts.overdueAlerts);
          }
        })
        .catch(() => {});
    } catch (e) {
      console.error('Failed to load local storage state', e);
    }
  }, []);

  // Debounced save changes to prevent UI lag on frequent mutations
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('msk_goats', JSON.stringify(goats));
        localStorage.setItem('msk_sales', JSON.stringify(sales));
        localStorage.setItem('msk_inventory', JSON.stringify(inventory));
        localStorage.setItem('msk_customers', JSON.stringify(customers));
        localStorage.setItem('msk_expenses', JSON.stringify(expenses));
        localStorage.setItem('msk_weights', JSON.stringify(weightRecords));
        localStorage.setItem('msk_health', JSON.stringify(healthRecords));
        localStorage.setItem('msk_audit', JSON.stringify(auditLogs));
      } catch (e) {
        console.error('Failed to save to local storage', e);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [goats, sales, inventory, customers, expenses, weightRecords, healthRecords, auditLogs]);

  // Log Audit Helper
  const logAudit = (action: string, details: string, module: ActivityAuditLog['module']) => {
    const roleName = currentRole === 'OWNER' ? 'Admin (Kamalesh)' : currentRole === 'VETERINARIAN' ? 'Dr. Ramanathan (Vet)' : currentRole === 'CASHIER' ? 'Priya (Cashier)' : 'Muthu (Worker)';
    const newLog: ActivityAuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: roleName,
      role: currentRole,
      action,
      details,
      module
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Add Goat Handler
  const addGoat = (data: Omit<Goat, 'id' | 'accumulatedFeedCost' | 'accumulatedMedicineCost' | 'accumulatedLaborCost' | 'accumulatedOverheadCost' | 'trueCost' | 'estimatedMarketValue' | 'projectedProfit'>): Goat => {
    const trueCost = Number(data.purchasePrice || 0);
    const estimatedMarketValue = Math.round(Number(data.currentWeightKg) * (data.marketRatePerKg || 460));
    const projectedProfit = estimatedMarketValue - trueCost;

    const newGoat: Goat = {
      ...data,
      id: `goat-${Date.now()}`,
      accumulatedFeedCost: 0,
      accumulatedMedicineCost: 0,
      accumulatedLaborCost: 0,
      accumulatedOverheadCost: 0,
      trueCost,
      estimatedMarketValue,
      projectedProfit
    };

    setGoats(prev => [newGoat, ...prev]);
    // update pen count
    setPens(prev => prev.map(p => p.id === newGoat.penId ? { ...p, currentCount: p.currentCount + 1 } : p));
    // log weight
    const initialWeightRecord: WeightRecord = {
      id: `w-${Date.now()}`,
      goatId: newGoat.id,
      weightKg: newGoat.currentWeightKg,
      recordedAt: newGoat.purchaseDate || new Date().toISOString().substring(0, 10),
      adgGrams: 0,
      notes: 'Initial intake weight record'
    };
    setWeightRecords(prev => [...prev, initialWeightRecord]);

    logAudit('CREATE_GOAT', `Registered ${newGoat.breed} (${newGoat.tagNumber}, ${newGoat.currentWeightKg}kg) in ${newGoat.penId}`, 'LIVESTOCK');

    // Sync to backend API
    fetch('/api/goats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(() => {});

    return newGoat;
  };

  const updateGoat = (id: string, updates: Partial<Goat>) => {
    setGoats(prev => prev.map(g => {
      if (g.id !== id) return g;
      const updated = { ...g, ...updates };
      updated.trueCost =
        Number(updated.purchasePrice || 0) +
        Number(updated.accumulatedFeedCost || 0) +
        Number(updated.accumulatedMedicineCost || 0) +
        Number(updated.accumulatedLaborCost || 0) +
        Number(updated.accumulatedOverheadCost || 0);
      updated.estimatedMarketValue = Math.round(Number(updated.currentWeightKg || 0) * (updated.marketRatePerKg || 460));
      updated.projectedProfit = updated.estimatedMarketValue - updated.trueCost;
      return updated;
    }));
  };

  // Record Weight Handler with ADG calculation and weight decrease observation
  const recordWeight = (goatId: string, weightKg: number, notes?: string): { warning?: string } => {
    const goat = goats.find(g => g.id === goatId);
    if (!goat) return {};

    const previousWeights = weightRecords.filter(w => w.goatId === goatId).sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
    const lastRecord = previousWeights[0];
    
    let adg = goat.adgGrams;
    const today = new Date().toISOString().substring(0, 10);
    let warning: string | undefined = undefined;

    if (lastRecord) {
      const daysDiff = Math.max(1, Math.round((new Date(today).getTime() - new Date(lastRecord.recordedAt).getTime()) / (1000 * 60 * 60 * 24)));
      const weightDiffGrams = (weightKg - lastRecord.weightKg) * 1000;
      adg = Math.round(weightDiffGrams / daysDiff);

      if (weightKg < lastRecord.weightKg) {
        const dropKg = (lastRecord.weightKg - weightKg).toFixed(1);
        warning = `Observation: Scale reading is ${dropKg}kg lower than previous measurement (${lastRecord.weightKg}kg). (Review scale, hydration, and nutrition. Does not automatically indicate illness).`;
      }
    }

    const newRecord: WeightRecord = {
      id: `w-${Date.now()}`,
      goatId,
      weightKg,
      recordedAt: today,
      adgGrams: adg,
      notes: notes || (warning ? warning : 'Periodic scale weigh-in')
    };

    setWeightRecords(prev => [...prev, newRecord]);
    updateGoat(goatId, {
      currentWeightKg: weightKg,
      lastWeighedDate: today,
      adgGrams: adg
    });

    logAudit('UPDATE_WEIGHT', `Goat ${goat.tagNumber} weighed ${weightKg}kg (ADG: ${adg > 0 ? '+' : ''}${adg}g/day). ${warning ? '[Drop observed]' : ''}`, 'LIVESTOCK');

    // Sync to backend API
    fetch('/api/weights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goatId, weightKg, notes })
    }).catch(() => {});

    return { warning };
  };

  // Add Health Record
  const addHealthRecord = (record: Omit<HealthRecord, 'id'>) => {
    const newRecord: HealthRecord = {
      ...record,
      id: `h-${Date.now()}`
    };
    setHealthRecords(prev => [newRecord, ...prev]);

    // Accumulate veterinary cost onto the individual goat's True Cost Engine
    const targetGoat = goats.find(g => g.id === record.goatId);
    if (targetGoat && record.cost > 0) {
      updateGoat(record.goatId, {
        accumulatedMedicineCost: targetGoat.accumulatedMedicineCost + record.cost
      });
    }

    logAudit('HEALTH_VACCINATION', `${record.recordType}: ${record.title} administered to goat ${targetGoat?.tagNumber || record.goatId} (₹${record.cost})`, 'HEALTH');
  };

  // Create POS Sale
  const createSale = (saleData: Omit<Sale, 'id' | 'invoiceNumber'>): Sale => {
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(sales.length + 1043).padStart(5, '0')}`;
    const newSale: Sale = {
      ...saleData,
      id: `sale-${Date.now()}`,
      invoiceNumber
    };

    setSales(prev => [newSale, ...prev]);

    // Mark sold goats as SOLD
    newSale.items.forEach(item => {
      updateGoat(item.goatId, { status: 'SOLD' });
    });

    // If payment involves credit, update customer outstanding balance
    const creditAmount = newSale.paymentBreakdown?.credit || (newSale.paymentStatus === 'CREDIT' ? newSale.totalAmount : (newSale.totalAmount - newSale.paidAmount));
    if (newSale.customerId) {
      setCustomers(prev => prev.map(c => {
        if (c.id === newSale.customerId) {
          return {
            ...c,
            outstandingBalance: c.outstandingBalance + (creditAmount > 0 ? creditAmount : 0),
            totalPurchases: c.totalPurchases + newSale.totalAmount
          };
        }
        return c;
      }));
    }

    logAudit('POS_SALE', `Invoice ${invoiceNumber} created for ${newSale.customerName} (₹${newSale.totalAmount.toLocaleString('en-IN')}) - ${newSale.items.length} goats`, 'POS');

    // Sync to backend API
    fetch('/api/pos/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: newSale.customerId,
        items: newSale.items.map(i => ({ goatId: i.goatId, ratePerKg: i.ratePerKg })),
        discount: newSale.discount,
        transportCharges: newSale.transportCharges,
        paymentMethod: newSale.paymentMethod,
        paymentBreakdown: newSale.paymentBreakdown,
        notes: newSale.notes
      })
    }).catch(() => {});

    return newSale;
  };

  // Cancel / Void Sale (Never delete completed financial transactions)
  const cancelSale = (saleId: string, reason: string) => {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;

    setSales(prev => prev.map(s => {
      if (s.id !== saleId) return s;
      return {
        ...s,
        status: 'CANCELLED',
        notes: `${s.notes || ''} [CANCELLED: ${reason}]`
      };
    }));

    // Revert sold goats to ACTIVE
    sale.items.forEach(item => {
      updateGoat(item.goatId, { status: 'ACTIVE' });
    });

    // Revert customer outstanding balance
    if (sale.customerId) {
      const creditToRevert = sale.totalAmount - sale.paidAmount;
      setCustomers(prev => prev.map(c => {
        if (c.id === sale.customerId) {
          return {
            ...c,
            outstandingBalance: Math.max(0, c.outstandingBalance - creditToRevert),
            totalPurchases: Math.max(0, c.totalPurchases - sale.totalAmount)
          };
        }
        return c;
      }));
    }

    logAudit('CANCEL_SALE', `Invoice ${sale.invoiceNumber} CANCELLED. Reason: ${reason}. Goats returned to active herd.`, 'POS');

    // Sync to backend API
    fetch(`/api/pos/sales/${saleId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    }).catch(() => {});
  };

  // Record Customer Payment & Allocation
  const recordPayment = (
    customerId: string,
    amount: number,
    paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER',
    notes?: string,
    allocations?: any[]
  ) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          outstandingBalance: Math.max(0, c.outstandingBalance - amount)
        };
      }
      return c;
    }));

    logAudit('RECORD_PAYMENT', `Payment of ₹${amount.toLocaleString('en-IN')} received from ${customer.name} via ${paymentMethod}`, 'FINANCE');

    // Sync to backend API
    fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, amount, paymentMethod, notes, allocations })
    }).catch(() => {});
  };

  // Add Expense
  const addExpense = (expense: Omit<FarmExpense, 'id'>) => {
    const newExpense: FarmExpense = {
      ...expense,
      id: `exp-${Date.now()}`
    };
    setExpenses(prev => [newExpense, ...prev]);
    logAudit('RECORD_EXPENSE', `Expense ₹${expense.amount} under ${expense.category} (${expense.paidTo})`, 'FINANCE');
  };

  // Issue Feed (Inventory Movement)
  const issueFeed = (itemId: string, quantityKg: number, penId: string, notes?: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const updatedStock = Math.max(0, item.currentStock - quantityKg);
        return {
          ...item,
          currentStock: updatedStock,
          totalStockValue: updatedStock * item.costPerUnit,
          lastUpdated: new Date().toISOString().substring(0, 10)
        };
      }
      return item;
    }));

    // Find pen goats to distribute cost
    const targetItem = inventory.find(i => i.id === itemId);
    const penGoats = goats.filter(g => g.penId === penId && g.status === 'ACTIVE');
    if (targetItem && penGoats.length > 0) {
      const feedCost = quantityKg * targetItem.costPerUnit;
      const costPerGoat = Math.round(feedCost / penGoats.length);
      penGoats.forEach(g => {
        updateGoat(g.id, {
          accumulatedFeedCost: g.accumulatedFeedCost + costPerGoat
        });
      });
    }

    logAudit('FEED_MOVEMENT', `Issued ${quantityKg}kg of ${targetItem?.name || 'feed'} to ${penId}`, 'INVENTORY');
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'outstandingBalance' | 'totalPurchases'>): Customer => {
    const newCustomer: Customer = {
      ...customer,
      id: `cust-${Date.now()}`,
      outstandingBalance: 0,
      totalPurchases: 0
    };
    setCustomers(prev => [...prev, newCustomer]);
    logAudit('NEW_CUSTOMER', `Created customer profile: ${newCustomer.name} (${newCustomer.businessName})`, 'POS');

    fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer)
    }).catch(() => {});

    return newCustomer;
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const resetAllToDefault = () => {
    localStorage.clear();
    setGoats(INITIAL_GOATS);
    setPens(INITIAL_PENS);
    setCustomers(INITIAL_CUSTOMERS);
    setSales(INITIAL_SALES);
    setInventory(INITIAL_INVENTORY);
    setExpenses(INITIAL_EXPENSES);
    setTasks(INITIAL_TASKS);
    setWeightRecords(INITIAL_WEIGHT_RECORDS);
    setHealthRecords(INITIAL_HEALTH_RECORDS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    logAudit('SYSTEM_RESET', 'All demo data reset to default factory state', 'LIVESTOCK');
  };

  return (
    <FarmContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        goats,
        pens,
        customers,
        sales,
        inventory,
        expenses,
        tasks,
        weightRecords,
        healthRecords,
        auditLogs,
        overdueAlerts,
        selectedGoatId,
        setSelectedGoatId,
        activeTab,
        setActiveTab,
        isCommandMenuOpen,
        setIsCommandMenuOpen,
        isMobileWorkerOpen,
        setIsMobileWorkerOpen,
        quickActionModal,
        setQuickActionModal,
        addGoat,
        updateGoat,
        recordWeight,
        addHealthRecord,
        createSale,
        cancelSale,
        recordPayment,
        addExpense,
        issueFeed,
        addCustomer,
        toggleTaskStatus,
        resetAllToDefault
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};
