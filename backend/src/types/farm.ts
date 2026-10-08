export type GoatStatus = 'ACTIVE' | 'SOLD' | 'QUARANTINE' | 'QUARANTINED' | 'DECEASED' | 'DEAD' | 'TRANSFERRED' | 'PREGNANT';
export type Gender = 'MALE' | 'FEMALE';
export type UserRole = 'OWNER' | 'ADMIN' | 'FARM_MANAGER' | 'ACCOUNTANT' | 'VETERINARIAN' | 'WORKER' | 'CASHIER';

export interface Pen {
  id: string;
  name: string;
  capacity: number;
  currentCount: number;
  category: 'WEANERS' | 'FATTENING_BUCKS' | 'DOES_BREEDING' | 'QUARANTINE' | 'GENERAL';
  notes?: string;
}

export interface WeightRecord {
  id: string;
  goatId: string;
  weightKg: number;
  recordedAt: string;
  adgGrams?: number; // Average Daily Gain compared to previous record
  notes?: string;
}

export interface HealthRecord {
  id: string;
  goatId: string;
  recordType: 'VACCINATION' | 'DEWORMING' | 'TREATMENT' | 'CHECKUP';
  title: string;
  medicineName?: string;
  dosage?: string;
  cost: number;
  administeredAt: string;
  vetName: string;
  nextDueDate?: string;
  notes?: string;
}

export interface CostItem {
  id: string;
  goatId: string;
  category: 'PURCHASE' | 'FEED' | 'MEDICINE' | 'VACCINE' | 'LABOR' | 'TRANSPORT' | 'OVERHEAD';
  amount: number;
  date: string;
  description: string;
}

export interface Goat {
  id: string;
  tagNumber: string; // e.g. G-00247
  rfidTag?: string;
  breed: string; // e.g. Kanni, Salem Black, Kodi Aadu, Boer Cross
  gender: Gender;
  birthDate: string; // YYYY-MM-DD
  ageMonths: number;
  penId: string;
  status: GoatStatus;
  
  // Weights
  initialWeightKg: number;
  currentWeightKg: number;
  targetWeightKg: number;
  adgGrams: number; // Current Average Daily Gain (grams/day)
  lastWeighedDate: string;

  // Economics & True Cost Engine
  purchasePrice: number;
  purchaseDate: string;
  accumulatedFeedCost: number;
  accumulatedMedicineCost: number;
  accumulatedLaborCost: number;
  accumulatedOverheadCost: number;
  trueCost: number; // Sum of all costs
  marketRatePerKg: number;
  estimatedMarketValue: number; // currentWeightKg * marketRatePerKg
  projectedProfit: number; // estimatedMarketValue - trueCost

  // Pedigree
  damTag?: string; // Mother
  sireTag?: string; // Father
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  businessName?: string;
  address?: string;
  creditLimit: number;
  outstandingBalance: number;
  totalPurchases: number;
  status: 'ACTIVE' | 'BLOCKED';
}

export interface SaleItem {
  id: string;
  goatId: string;
  tagNumber: string;
  breed: string;
  weightKg: number;
  ratePerKg: number;
  amount: number;
  trueCostAtSale: number;
  profitOnGoat: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string; // e.g. INV-00482
  customerId: string;
  customerName: string;
  date: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  transportCharges: number;
  totalAmount: number;
  paidAmount: number;
  paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CREDIT' | 'SPLIT';
  paymentBreakdown?: {
    cash?: number;
    upi?: number;
    credit?: number;
  };
  paymentStatus: 'PAID' | 'PARTIAL' | 'CREDIT';
  status: 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'FEED' | 'MEDICINE' | 'EQUIPMENT' | 'MINERAL';
  unit: 'kg' | 'vial' | 'liter' | 'bag' | 'unit';
  currentStock: number;
  minimumStockLevel: number; // Reorder alert threshold
  costPerUnit: number;
  totalStockValue: number;
  supplier?: string;
  lastUpdated: string;
}

export interface StockMovement {
  id: string;
  inventoryItemId: string;
  itemName: string;
  movementType: 'INWARD_PURCHASE' | 'FEED_ISSUED' | 'WASTAGE' | 'ADJUSTMENT';
  quantity: number;
  unit: string;
  costTotal: number;
  allocatedToPenId?: string;
  date: string;
  notes?: string;
}

export interface FarmExpense {
  id: string;
  category: 'FEED' | 'VETERINARY' | 'LABOR' | 'UTILITIES' | 'MAINTENANCE' | 'TRANSPORT' | 'OTHER';
  amount: number;
  date: string;
  penId?: string;
  goatId?: string;
  paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER';
  paidTo: string;
  description: string;
  receiptNumber?: string;
}

export interface FarmTask {
  id: string;
  title: string;
  penId?: string;
  assignedWorker: string;
  dueTime: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface ActivityAuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  details: string;
  module: 'LIVESTOCK' | 'POS' | 'FINANCE' | 'INVENTORY' | 'HEALTH' | 'AUTH' | 'SETTINGS';
}
