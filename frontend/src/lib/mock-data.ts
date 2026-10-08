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
  ActivityAuditLog
} from '@/types/farm';

export const INITIAL_PENS: Pen[] = [
  { id: 'pen-1', name: 'Pen Alpha (Fattening Bucks)', capacity: 35, currentCount: 18, category: 'FATTENING_BUCKS', notes: 'High-energy concentrate feed zone' },
  { id: 'pen-2', name: 'Pen Beta (Weaners & Growers)', capacity: 30, currentCount: 14, category: 'WEANERS', notes: 'Creep feed + mineral booster' },
  { id: 'pen-3', name: 'Pen Gamma (Breeding Does & Kids)', capacity: 40, currentCount: 22, category: 'DOES_BREEDING', notes: 'Maternity and kidding pens' },
  { id: 'pen-4', name: 'Pen Delta (Quarantine & Health)', capacity: 15, currentCount: 3, category: 'QUARANTINE', notes: 'Separated isolation bay' },
];

export const INITIAL_GOATS: Goat[] = [
  {
    id: 'goat-1',
    tagNumber: 'G-00247',
    rfidTag: 'RFID-982-00247',
    breed: 'Kanni',
    gender: 'MALE',
    birthDate: '2026-02-10',
    ageMonths: 7,
    penId: 'pen-1',
    status: 'ACTIVE',
    initialWeightKg: 18.5,
    currentWeightKg: 34.6,
    targetWeightKg: 38.0,
    adgGrams: 293,
    lastWeighedDate: '2026-09-20',
    purchasePrice: 6500,
    purchaseDate: '2026-04-12',
    accumulatedFeedCost: 3840,
    accumulatedMedicineCost: 420,
    accumulatedLaborCost: 450,
    accumulatedOverheadCost: 250,
    trueCost: 11460,
    marketRatePerKg: 460,
    estimatedMarketValue: 15916,
    projectedProfit: 4456,
    damTag: 'G-00108',
    sireTag: 'SIRE-TITAN',
    notes: 'Premium commercial buck, stellar weight gain curve.'
  },
  {
    id: 'goat-2',
    tagNumber: 'G-00248',
    rfidTag: 'RFID-982-00248',
    breed: 'Salem Black',
    gender: 'MALE',
    birthDate: '2026-03-01',
    ageMonths: 6,
    penId: 'pen-1',
    status: 'ACTIVE',
    initialWeightKg: 16.0,
    currentWeightKg: 31.2,
    targetWeightKg: 35.0,
    adgGrams: 241,
    lastWeighedDate: '2026-09-18',
    purchasePrice: 5800,
    purchaseDate: '2026-04-20',
    accumulatedFeedCost: 3120,
    accumulatedMedicineCost: 310,
    accumulatedLaborCost: 400,
    accumulatedOverheadCost: 220,
    trueCost: 9850,
    marketRatePerKg: 450,
    estimatedMarketValue: 14040,
    projectedProfit: 4190,
    damTag: 'G-00115',
    notes: 'Glossy coat, high disease resistance.'
  },
  {
    id: 'goat-3',
    tagNumber: 'G-00249',
    rfidTag: 'RFID-982-00249',
    breed: 'Kodi Aadu',
    gender: 'FEMALE',
    birthDate: '2025-11-15',
    ageMonths: 10,
    penId: 'pen-3',
    status: 'PREGNANT',
    initialWeightKg: 19.0,
    currentWeightKg: 29.7,
    targetWeightKg: 32.0,
    adgGrams: 180,
    lastWeighedDate: '2026-09-15',
    purchasePrice: 7200,
    purchaseDate: '2026-02-05',
    accumulatedFeedCost: 4200,
    accumulatedMedicineCost: 650,
    accumulatedLaborCost: 600,
    accumulatedOverheadCost: 300,
    trueCost: 12950,
    marketRatePerKg: 480,
    estimatedMarketValue: 14256,
    projectedProfit: 1306,
    notes: 'Confirmed pregnant via sonography. Expected kidding mid-November.'
  },
  {
    id: 'goat-4',
    tagNumber: 'G-00250',
    rfidTag: 'RFID-982-00250',
    breed: 'Boer Cross',
    gender: 'MALE',
    birthDate: '2026-01-22',
    ageMonths: 8,
    penId: 'pen-1',
    status: 'ACTIVE',
    initialWeightKg: 20.0,
    currentWeightKg: 39.4,
    targetWeightKg: 40.0,
    adgGrams: 315,
    lastWeighedDate: '2026-09-22',
    purchasePrice: 8500,
    purchaseDate: '2026-03-10',
    accumulatedFeedCost: 4600,
    accumulatedMedicineCost: 480,
    accumulatedLaborCost: 550,
    accumulatedOverheadCost: 350,
    trueCost: 14480,
    marketRatePerKg: 490,
    estimatedMarketValue: 19306,
    projectedProfit: 4826,
    sireTag: 'BOER-CHAMP-1',
    notes: 'Heavy meat carcass grade. Ready for festival sale market.'
  },
  {
    id: 'goat-5',
    tagNumber: 'G-00251',
    rfidTag: 'RFID-982-00251',
    breed: 'Tellicherry',
    gender: 'FEMALE',
    birthDate: '2026-04-05',
    ageMonths: 5,
    penId: 'pen-2',
    status: 'ACTIVE',
    initialWeightKg: 12.0,
    currentWeightKg: 22.8,
    targetWeightKg: 28.0,
    adgGrams: 210,
    lastWeighedDate: '2026-09-14',
    purchasePrice: 5200,
    purchaseDate: '2026-05-15',
    accumulatedFeedCost: 2450,
    accumulatedMedicineCost: 280,
    accumulatedLaborCost: 350,
    accumulatedOverheadCost: 200,
    trueCost: 8480,
    marketRatePerKg: 470,
    estimatedMarketValue: 10716,
    projectedProfit: 2236,
    notes: 'Docile, excellent feed intake.'
  },
  {
    id: 'goat-6',
    tagNumber: 'G-00252',
    rfidTag: 'RFID-982-00252',
    breed: 'Salem Black',
    gender: 'MALE',
    birthDate: '2026-02-28',
    ageMonths: 7,
    penId: 'pen-1',
    status: 'ACTIVE',
    initialWeightKg: 17.0,
    currentWeightKg: 31.8,
    targetWeightKg: 35.0,
    adgGrams: 260,
    lastWeighedDate: '2026-09-21',
    purchasePrice: 6200,
    purchaseDate: '2026-04-18',
    accumulatedFeedCost: 3350,
    accumulatedMedicineCost: 340,
    accumulatedLaborCost: 420,
    accumulatedOverheadCost: 240,
    trueCost: 10550,
    marketRatePerKg: 450,
    estimatedMarketValue: 14310,
    projectedProfit: 3760,
    notes: 'Strong frame, ideal slaughter weight profile.'
  },
  {
    id: 'goat-7',
    tagNumber: 'G-00253',
    rfidTag: 'RFID-982-00253',
    breed: 'Sirohi',
    gender: 'MALE',
    birthDate: '2026-03-12',
    ageMonths: 6,
    penId: 'pen-4',
    status: 'QUARANTINE',
    initialWeightKg: 18.0,
    currentWeightKg: 26.4,
    targetWeightKg: 32.0,
    adgGrams: 115,
    lastWeighedDate: '2026-09-10',
    purchasePrice: 6000,
    purchaseDate: '2026-05-02',
    accumulatedFeedCost: 2900,
    accumulatedMedicineCost: 850,
    accumulatedLaborCost: 500,
    accumulatedOverheadCost: 250,
    trueCost: 10500,
    marketRatePerKg: 440,
    estimatedMarketValue: 11616,
    projectedProfit: 1116,
    notes: 'Mild respiratory symptoms observed. Receiving oxytetracycline in isolation.'
  }
];

export const INITIAL_WEIGHT_RECORDS: WeightRecord[] = [
  { id: 'w-1', goatId: 'goat-1', weightKg: 18.5, recordedAt: '2026-04-12', adgGrams: 0, notes: 'Arrival intake weight' },
  { id: 'w-2', goatId: 'goat-1', weightKg: 22.8, recordedAt: '2026-05-25', adgGrams: 100, notes: 'Post-deworming check' },
  { id: 'w-3', goatId: 'goat-1', weightKg: 27.2, recordedAt: '2026-07-10', adgGrams: 95, notes: 'Mid-growth' },
  { id: 'w-4', goatId: 'goat-1', weightKg: 31.4, recordedAt: '2026-08-20', adgGrams: 102, notes: 'Concentrate increase' },
  { id: 'w-5', goatId: 'goat-1', weightKg: 34.6, recordedAt: '2026-09-20', adgGrams: 103, notes: 'Current market weight' },
  
  { id: 'w-6', goatId: 'goat-2', weightKg: 16.0, recordedAt: '2026-04-20', adgGrams: 0, notes: 'Arrival' },
  { id: 'w-7', goatId: 'goat-2', weightKg: 21.0, recordedAt: '2026-06-05', adgGrams: 108, notes: 'Routine check' },
  { id: 'w-8', goatId: 'goat-2', weightKg: 26.5, recordedAt: '2026-07-28', adgGrams: 103, notes: 'Healthy growth' },
  { id: 'w-9', goatId: 'goat-2', weightKg: 31.2, recordedAt: '2026-09-18', adgGrams: 90, notes: 'Pre-sale weigh-in' },
];

export const INITIAL_HEALTH_RECORDS: HealthRecord[] = [
  {
    id: 'h-1',
    goatId: 'goat-1',
    recordType: 'VACCINATION',
    title: 'PPR Vaccination',
    medicineName: 'Raksha PPR',
    dosage: '1 ml s/c',
    cost: 150,
    administeredAt: '2026-05-02',
    vetName: 'Dr. S. Ramanathan BVSc',
    nextDueDate: '2027-05-02',
    notes: 'Clear immunity, no adverse reaction'
  },
  {
    id: 'h-2',
    goatId: 'goat-1',
    recordType: 'VACCINATION',
    title: 'Enterotoxemia (ET) Vaccine',
    medicineName: 'EnteroVac Duo',
    dosage: '2 ml s/c',
    cost: 120,
    administeredAt: '2026-06-15',
    vetName: 'Dr. S. Ramanathan BVSc',
    nextDueDate: '2026-12-15',
    notes: 'Booster recommended in 6 months'
  },
  {
    id: 'h-3',
    goatId: 'goat-1',
    recordType: 'DEWORMING',
    title: 'Broad Spectrum Deworming',
    medicineName: 'Albendazole 2.5% Oral',
    dosage: '15 ml oral',
    cost: 150,
    administeredAt: '2026-07-01',
    vetName: 'Dr. S. Ramanathan BVSc',
    nextDueDate: '2026-10-01',
    notes: 'Target internal parasites and flukes'
  },
  {
    id: 'h-4',
    goatId: 'goat-7',
    recordType: 'TREATMENT',
    title: 'Respiratory Antibiotic Protocol',
    medicineName: 'Oxytetracycline LA',
    dosage: '3 ml i/m',
    cost: 450,
    administeredAt: '2026-09-22',
    vetName: 'Dr. S. Ramanathan BVSc',
    nextDueDate: '2026-09-26',
    notes: 'Day 2 of 4 antibiotic cycle in Pen 4'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Kumar',
    businessName: 'Kumar Goat Traders & Livestock',
    phone: '+91 98421 78910',
    email: 'kumar.livestock@gmail.com',
    address: 'Santhai Bazaar, Pollachi, TN',
    creditLimit: 100000,
    outstandingBalance: 62500,
    totalPurchases: 345000,
    status: 'ACTIVE'
  },
  {
    id: 'cust-2',
    name: 'Selvam',
    businessName: 'Selvam Fresh Mutton Stall',
    phone: '+91 97500 23411',
    address: 'Near Clock Tower, Dindigul, TN',
    creditLimit: 50000,
    outstandingBalance: 0,
    totalPurchases: 182000,
    status: 'ACTIVE'
  },
  {
    id: 'cust-3',
    name: 'Anbu',
    businessName: 'Anbu Organic Farming & Breeding',
    phone: '+91 94432 55678',
    address: 'Madurai Road, Virudhunagar, TN',
    creditLimit: 75000,
    outstandingBalance: 14200,
    totalPurchases: 125000,
    status: 'ACTIVE'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Commercial Concentrate Pellets (18% Protein)',
    category: 'FEED',
    unit: 'kg',
    currentStock: 850,
    minimumStockLevel: 300,
    costPerUnit: 30, // ₹30/kg
    totalStockValue: 25500,
    supplier: 'Suguna Agro Feeds Ltd',
    lastUpdated: '2026-09-24'
  },
  {
    id: 'inv-2',
    name: 'Dry Fodder (Co-FS 29 / Napier Grass Bales)',
    category: 'FEED',
    unit: 'kg',
    currentStock: 240, // BELOW MINIMUM ALERT!
    minimumStockLevel: 500,
    costPerUnit: 8, // ₹8/kg
    totalStockValue: 1920,
    supplier: 'Local Farm Cooperative',
    lastUpdated: '2026-09-23'
  },
  {
    id: 'inv-3',
    name: 'Chelated Mineral Mixture for Small Ruminants',
    category: 'MINERAL',
    unit: 'kg',
    currentStock: 65,
    minimumStockLevel: 25,
    costPerUnit: 140,
    totalStockValue: 9100,
    supplier: 'Virbac Animal Health',
    lastUpdated: '2026-09-18'
  },
  {
    id: 'inv-4',
    name: 'Raksha PPR Vaccine Vials (50 doses)',
    category: 'MEDICINE',
    unit: 'vial',
    currentStock: 4,
    minimumStockLevel: 2,
    costPerUnit: 480,
    totalStockValue: 1920,
    supplier: 'Indian Immunologicals',
    lastUpdated: '2026-09-10'
  },
  {
    id: 'inv-5',
    name: 'Albendazole 2.5% Suspension (1 Litre)',
    category: 'MEDICINE',
    unit: 'liter',
    currentStock: 5,
    minimumStockLevel: 2,
    costPerUnit: 380,
    totalStockValue: 1900,
    supplier: 'Intas Pharmaceuticals',
    lastUpdated: '2026-09-15'
  }
];

export const INITIAL_SALES: Sale[] = [
  {
    id: 'sale-1',
    invoiceNumber: 'INV-00481',
    customerId: 'cust-2',
    customerName: 'Selvam Fresh Mutton Stall',
    date: '2026-09-15',
    items: [
      {
        id: 'si-1',
        goatId: 'goat-old-1',
        tagNumber: 'G-00239',
        breed: 'Salem Black',
        weightKg: 33.5,
        ratePerKg: 450,
        amount: 15075,
        trueCostAtSale: 10800,
        profitOnGoat: 4275
      }
    ],
    subtotal: 15075,
    discount: 75,
    transportCharges: 0,
    totalAmount: 15000,
    paidAmount: 15000,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    status: 'COMPLETED',
    notes: 'Paid via PhonePe / UPI transfer.'
  },
  {
    id: 'sale-2',
    invoiceNumber: 'INV-00482',
    customerId: 'cust-1',
    customerName: 'Kumar Goat Traders & Livestock',
    date: '2026-09-22',
    items: [
      {
        id: 'si-2',
        goatId: 'goat-old-2',
        tagNumber: 'G-00240',
        breed: 'Kanni',
        weightKg: 35.0,
        ratePerKg: 460,
        amount: 16100,
        trueCostAtSale: 11200,
        profitOnGoat: 4900
      },
      {
        id: 'si-3',
        goatId: 'goat-old-3',
        tagNumber: 'G-00241',
        breed: 'Boer Cross',
        weightKg: 38.2,
        ratePerKg: 480,
        amount: 18336,
        trueCostAtSale: 13500,
        profitOnGoat: 4836
      }
    ],
    subtotal: 34436,
    discount: 436,
    transportCharges: 1000,
    totalAmount: 35000,
    paidAmount: 15000,
    paymentMethod: 'SPLIT',
    paymentBreakdown: {
      cash: 15000,
      credit: 20000
    },
    paymentStatus: 'PARTIAL',
    status: 'COMPLETED',
    notes: '₹15,000 cash paid at pickup; balance ₹20,000 added to trader ledger.'
  }
];

export const INITIAL_EXPENSES: FarmExpense[] = [
  {
    id: 'exp-1',
    category: 'FEED',
    amount: 15000,
    date: '2026-09-20',
    paymentMethod: 'BANK_TRANSFER',
    paidTo: 'Suguna Agro Feeds Ltd',
    description: 'Bulk purchase: 500kg Concentrate pellets',
    receiptNumber: 'RCP-8921'
  },
  {
    id: 'exp-2',
    category: 'VETERINARY',
    amount: 2200,
    date: '2026-09-18',
    paymentMethod: 'UPI',
    paidTo: 'Dr. S. Ramanathan BVSc',
    description: 'Monthly herd health audit & preventative vaccination run',
    receiptNumber: 'VET-2026-9'
  },
  {
    id: 'exp-3',
    category: 'LABOR',
    amount: 12000,
    date: '2026-09-15',
    paymentMethod: 'CASH',
    paidTo: 'Farm Workers (Muthu & Murugan)',
    description: 'Fortnightly pen maintenance & feeding labor wages'
  },
  {
    id: 'exp-4',
    category: 'UTILITIES',
    amount: 3400,
    date: '2026-09-10',
    paymentMethod: 'UPI',
    paidTo: 'TANGEDCO (Electricity Board)',
    description: 'Borewell pump electricity & shed ventilation power'
  }
];

export const INITIAL_TASKS: FarmTask[] = [
  { id: 'tsk-1', title: 'Feed Morning Concentrate to Pen Alpha & Beta', penId: 'pen-1', assignedWorker: 'Muthu', dueTime: '08:00 AM', priority: 'HIGH', status: 'COMPLETED' },
  { id: 'tsk-2', title: 'Administer Day 3 Oxytetracycline to G-00253 in Pen Delta', penId: 'pen-4', assignedWorker: 'Dr. Ramanathan / Murugan', dueTime: '11:00 AM', priority: 'CRITICAL', status: 'IN_PROGRESS' },
  { id: 'tsk-3', title: 'Weigh Group C Weaners (14 goats in Pen Beta)', penId: 'pen-2', assignedWorker: 'Muthu', dueTime: '03:30 PM', priority: 'HIGH', status: 'PENDING' },
  { id: 'tsk-4', title: 'Disinfect and clean water drinkers across all 4 pens', penId: 'pen-3', assignedWorker: 'Murugan', dueTime: '05:00 PM', priority: 'MEDIUM', status: 'PENDING' },
];

export const INITIAL_AUDIT_LOGS: ActivityAuditLog[] = [
  { id: 'log-1', timestamp: '2026-09-25 18:40', user: 'Admin (Kamalesh)', role: 'OWNER', action: 'CREATE_GOAT', details: 'Registered Kanni buck G-00247 (Weight: 34.6kg, Pen: Alpha)', module: 'LIVESTOCK' },
  { id: 'log-2', timestamp: '2026-09-25 17:15', user: 'Manager (Suresh)', role: 'FARM_MANAGER', action: 'UPDATE_WEIGHT', details: 'G-00248 weighed 31.2kg (+241g/day ADG)', module: 'LIVESTOCK' },
  { id: 'log-3', timestamp: '2026-09-25 16:30', user: 'Cashier (Priya)', role: 'CASHIER', action: 'POS_SALE', details: 'Completed INV-00482 for Kumar Traders (₹35,000, 2 goats)', module: 'POS' },
  { id: 'log-4', timestamp: '2026-09-25 14:10', user: 'Vet (Dr. Ramanathan)', role: 'VETERINARIAN', action: 'HEALTH_TREATMENT', details: 'Admitted G-00253 into Pen Delta quarantine bay with respiratory protocol', module: 'HEALTH' },
  { id: 'log-5', timestamp: '2026-09-25 11:20', user: 'Admin (Kamalesh)', role: 'OWNER', action: 'EXPENSE_RECORD', details: 'Recorded Feed expense ₹15,000 to Suguna Agro Feeds Ltd', module: 'FINANCE' },
];
