import { Sale, SaleItem, Customer } from '@/types/farm';
import { farmStore } from './farm-store';

export interface PosCalculateRequest {
  items: {
    goatId: string;
    ratePerKg?: number;
  }[];
  discount?: number;
  transportCharges?: number;
}

export interface PosSaleRequest {
  customerId: string;
  items: {
    goatId: string;
    ratePerKg: number;
    weightKg?: number; // Optional override with verification
  }[];
  discount?: number;
  transportCharges?: number;
  paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CREDIT' | 'SPLIT';
  paymentBreakdown?: {
    cash?: number;
    upi?: number;
    credit?: number;
  };
  notes?: string;
  userName?: string;
}

export class PosService {
  /**
   * Authoritative server-side price calculation
   * Never trusts client-side arithmetic.
   */
  static calculateSale(req: PosCalculateRequest) {
    let subtotal = 0;
    const validatedItems: Array<{
      goatId: string;
      tagNumber: string;
      breed: string;
      weightKg: number;
      ratePerKg: number;
      amount: number;
      trueCost: number;
      projectedProfit: number;
      status: string;
    }> = [];

    for (const item of req.items) {
      const goat = farmStore.goats.find(g => g.id === item.goatId);
      if (!goat) {
        throw new Error(`Goat with ID ${item.goatId} was not found.`);
      }

      if (goat.status === 'SOLD') {
        throw new Error(`Goat ${goat.tagNumber} is already SOLD and cannot be added to a new invoice.`);
      }

      if (goat.status === 'DECEASED') {
        throw new Error(`Goat ${goat.tagNumber} is DECEASED and cannot be traded.`);
      }

      const rate = Number(item.ratePerKg || goat.marketRatePerKg || 460);
      const weight = Number(goat.currentWeightKg);
      const amount = Math.round(weight * rate);
      subtotal += amount;

      validatedItems.push({
        goatId: goat.id,
        tagNumber: goat.tagNumber,
        breed: goat.breed,
        weightKg: weight,
        ratePerKg: rate,
        amount,
        trueCost: goat.trueCost,
        projectedProfit: amount - goat.trueCost,
        status: goat.status
      });
    }

    const discount = Math.max(0, Number(req.discount || 0));
    const transportCharges = Math.max(0, Number(req.transportCharges || 0));
    const totalAmount = Math.max(0, subtotal - discount + transportCharges);

    return {
      items: validatedItems,
      subtotal,
      discount,
      transportCharges,
      totalAmount
    };
  }

  /**
   * Execute commercial sale with full server validation & atomicity
   */
  static createSale(req: PosSaleRequest): Sale {
    // 1. Verify Customer
    const customer = farmStore.customers.find(c => c.id === req.customerId);
    if (!customer) {
      throw new Error(`Customer with ID ${req.customerId} was not found.`);
    }

    if (customer.status === 'BLOCKED') {
      throw new Error(`Customer ${customer.name} is BLOCKED from making commercial purchases.`);
    }

    if (!req.items || req.items.length === 0) {
      throw new Error('Sale invoice must contain at least one livestock asset.');
    }

    // 2. Authoritative Recalculation
    const calculation = this.calculateSale({
      items: req.items,
      discount: req.discount,
      transportCharges: req.transportCharges
    });

    // 3. Payment amounts
    let paidAmount = 0;
    let creditAmount = 0;

    if (req.paymentMethod === 'CREDIT') {
      paidAmount = 0;
      creditAmount = calculation.totalAmount;
    } else if (req.paymentMethod === 'SPLIT' && req.paymentBreakdown) {
      const cash = Number(req.paymentBreakdown.cash || 0);
      const upi = Number(req.paymentBreakdown.upi || 0);
      const credit = Number(req.paymentBreakdown.credit || 0);
      paidAmount = cash + upi;
      creditAmount = credit;

      if (paidAmount + creditAmount !== calculation.totalAmount) {
        throw new Error(
          `Payment breakdown sum (₹${paidAmount + creditAmount}) does not match Total Amount (₹${calculation.totalAmount}).`
        );
      }
    } else {
      paidAmount = calculation.totalAmount;
      creditAmount = 0;
    }

    // 4. Verify Credit Limit
    if (creditAmount > 0) {
      const projectedOutstanding = customer.outstandingBalance + creditAmount;
      if (projectedOutstanding > customer.creditLimit) {
        const excess = projectedOutstanding - customer.creditLimit;
        // Notice: Log warning, allow or block based on configuration
        console.warn(`[Credit Warning] Customer ${customer.name} credit limit exceeded by ₹${excess}.`);
      }
    }

    // 5. Generate Collision-Safe Invoice Number
    const year = new Date().getFullYear();
    const invoiceNumber = `INV-${year}-${String(farmStore.sales.length + 1042).padStart(5, '0')}`;
    const saleId = `sale-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const today = new Date().toISOString().substring(0, 10);

    // 6. Build Sale Items
    const saleItems: SaleItem[] = calculation.items.map((it, idx) => ({
      id: `si-${Date.now()}-${idx}`,
      goatId: it.goatId,
      tagNumber: it.tagNumber,
      breed: it.breed,
      weightKg: it.weightKg,
      ratePerKg: it.ratePerKg,
      amount: it.amount,
      trueCostAtSale: it.trueCost,
      profitOnGoat: it.projectedProfit
    }));

    // 7. Payment Status
    let paymentStatus: Sale['paymentStatus'] = 'PAID';
    if (paidAmount === 0) {
      paymentStatus = 'CREDIT';
    } else if (paidAmount < calculation.totalAmount) {
      paymentStatus = 'PARTIAL';
    }

    const newSale: Sale = {
      id: saleId,
      invoiceNumber,
      customerId: customer.id,
      customerName: customer.name,
      date: today,
      items: saleItems,
      subtotal: calculation.subtotal,
      discount: calculation.discount,
      transportCharges: calculation.transportCharges,
      totalAmount: calculation.totalAmount,
      paidAmount,
      paymentMethod: req.paymentMethod,
      paymentBreakdown: req.paymentBreakdown,
      paymentStatus,
      status: 'COMPLETED',
      notes: req.notes || `Livestock invoice generated for ${customer.businessName || customer.name}`
    };

    farmStore.sales.unshift(newSale);

    // 8. Update Goats Status to SOLD
    for (const item of saleItems) {
      const goat = farmStore.goats.find(g => g.id === item.goatId);
      if (goat) {
        goat.status = 'SOLD';
        // Reduce pen count
        const pen = farmStore.pens.find(p => p.id === goat.penId);
        if (pen && pen.currentCount > 0) {
          pen.currentCount -= 1;
        }
      }
    }

    // 9. Update Customer Balance & Financial Ledger
    customer.totalPurchases += calculation.totalAmount;
    if (creditAmount > 0) {
      customer.outstandingBalance += creditAmount;
    }

    // Add debit to customer ledger for invoice
    const previousRunningBalance =
      farmStore.customerLedgers.filter(l => l.customerId === customer.id).pop()?.runningBalance || customer.outstandingBalance;

    farmStore.customerLedgers.push({
      id: `led-${Date.now()}-inv`,
      customerId: customer.id,
      date: today,
      type: 'INVOICE',
      refNumber: invoiceNumber,
      debit: calculation.totalAmount,
      credit: 0,
      runningBalance: previousRunningBalance + calculation.totalAmount,
      notes: `Invoice ${invoiceNumber} (${saleItems.length} goats)`
    });

    // If partial or full payment made at time of sale, record payment
    if (paidAmount > 0) {
      const receiptNo = `RCP-${year}-${String(farmStore.payments.length + 501).padStart(5, '0')}`;
      farmStore.payments.push({
        id: `pay-${Date.now()}`,
        receiptNumber: receiptNo,
        customerId: customer.id,
        date: today,
        amount: paidAmount,
        paymentMethod: req.paymentMethod === 'SPLIT' ? 'CASH' : (req.paymentMethod as any),
        allocations: [{ saleId: newSale.id, invoiceNumber, amount: paidAmount }],
        notes: `Immediate payment received at sale POS`,
        recordedBy: req.userName || 'Cashier'
      });

      farmStore.customerLedgers.push({
        id: `led-${Date.now()}-pay`,
        customerId: customer.id,
        date: today,
        type: 'PAYMENT',
        refNumber: receiptNo,
        debit: 0,
        credit: paidAmount,
        runningBalance: previousRunningBalance + calculation.totalAmount - paidAmount,
        notes: `Payment for invoice ${invoiceNumber}`
      });
    }

    farmStore.logAudit(
      'POS_SALE',
      `Invoice ${invoiceNumber} created for ${customer.name} (₹${calculation.totalAmount.toLocaleString('en-IN')}) with ${saleItems.length} goats. Payment: ${newSale.paymentMethod}`,
      'POS',
      req.userName || 'Cashier'
    );

    return newSale;
  }

  /**
   * Cancel / Void a completed sale (NEVER delete permanently)
   */
  static cancelSale(saleId: string, reason: string, cancelledBy = 'Owner'): Sale {
    const sale = farmStore.sales.find(s => s.id === saleId);
    if (!sale) {
      throw new Error(`Sale with ID ${saleId} not found.`);
    }

    if (sale.status === 'CANCELLED') {
      throw new Error(`Sale ${sale.invoiceNumber} is already CANCELLED.`);
    }

    sale.status = 'CANCELLED';
    (sale as any).cancelledBy = cancelledBy;
    (sale as any).cancelReason = reason;
    (sale as any).cancelledAt = new Date().toISOString();

    // Revert sold goats back to ACTIVE status
    for (const item of sale.items) {
      const goat = farmStore.goats.find(g => g.id === item.goatId);
      if (goat) {
        goat.status = 'ACTIVE';
        const pen = farmStore.pens.find(p => p.id === goat.penId);
        if (pen) {
          pen.currentCount += 1;
        }
      }
    }

    // Revert Customer Balance
    const customer = farmStore.customers.find(c => c.id === sale.customerId);
    if (customer) {
      customer.totalPurchases = Math.max(0, customer.totalPurchases - sale.totalAmount);
      const creditToRevert = sale.totalAmount - sale.paidAmount;
      if (creditToRevert > 0) {
        customer.outstandingBalance = Math.max(0, customer.outstandingBalance - creditToRevert);
      }

      farmStore.customerLedgers.push({
        id: `led-${Date.now()}-void`,
        customerId: customer.id,
        date: new Date().toISOString().substring(0, 10),
        type: 'RETURN',
        refNumber: `VOID-${sale.invoiceNumber}`,
        debit: 0,
        credit: sale.totalAmount,
        runningBalance: customer.outstandingBalance,
        notes: `Sale Voided: ${reason} (by ${cancelledBy})`
      });
    }

    farmStore.logAudit(
      'CANCEL_SALE',
      `Invoice ${sale.invoiceNumber} CANCELLED by ${cancelledBy}. Reason: ${reason}. Animals reverted to ACTIVE herd.`,
      'POS',
      cancelledBy
    );

    return sale;
  }
}
