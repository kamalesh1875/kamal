import { Customer, Sale } from '@/types/farm';
import { farmStore, CustomerLedgerEntry, PaymentRecord } from './farm-store';

export interface RecordPaymentRequest {
  customerId: string;
  amount: number;
  paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER';
  paymentDate?: string;
  notes?: string;
  allocations?: {
    saleId: string;
    amount: number;
  }[];
  recordedBy?: string;
}

export class LedgerService {
  /**
   * Get complete customer financial profile with ledger, unpaid invoices and overdue status
   */
  static getCustomerFinancialProfile(customerId: string) {
    const customer = farmStore.customers.find(c => c.id === customerId);
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found.`);
    }

    // Customer Invoices
    const sales = farmStore.sales.filter(s => s.customerId === customerId && s.status !== 'CANCELLED');

    const unpaidSales = sales.filter(s => s.totalAmount > s.paidAmount).map(s => {
      const balance = s.totalAmount - s.paidAmount;
      const invoiceDate = new Date(s.date);
      // Default 15 days payment terms
      const dueDate = new Date(invoiceDate.getTime() + 15 * 24 * 60 * 60 * 1000);
      const today = new Date();
      const diffTime = today.getTime() - dueDate.getTime();
      const daysOverdue = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

      return {
        ...s,
        balance,
        dueDate: dueDate.toISOString().substring(0, 10),
        daysOverdue,
        isOverdue: daysOverdue > 0
      };
    });

    // Ledger entries
    const ledger = farmStore.customerLedgers
      .filter(l => l.customerId === customerId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Payments
    const payments = farmStore.payments.filter(p => p.customerId === customerId);

    const availableCredit = Math.max(0, customer.creditLimit - customer.outstandingBalance);

    return {
      customer,
      availableCredit,
      unpaidInvoices: unpaidSales,
      ledger,
      payments,
      totalOverdueAmount: unpaidSales.filter(s => s.isOverdue).reduce((acc, s) => acc + s.balance, 0)
    };
  }

  /**
   * Record customer payment with multi-invoice allocation
   * A single payment can be distributed across multiple unpaid invoices.
   */
  static recordPayment(req: RecordPaymentRequest): PaymentRecord {
    const customer = farmStore.customers.find(c => c.id === req.customerId);
    if (!customer) {
      throw new Error(`Customer with ID ${req.customerId} not found.`);
    }

    const amount = Number(req.amount);
    if (amount <= 0) {
      throw new Error('Payment amount must be greater than zero.');
    }

    const today = req.paymentDate || new Date().toISOString().substring(0, 10);
    const receiptNumber = `RCP-${new Date().getFullYear()}-${String(farmStore.payments.length + 501).padStart(5, '0')}`;

    // Auto-allocate if not explicitly specified
    let allocations: Array<{ saleId: string; invoiceNumber: string; amount: number }> = [];

    if (req.allocations && req.allocations.length > 0) {
      // Validate allocation sum does not exceed payment
      const allocSum = req.allocations.reduce((sum, a) => sum + a.amount, 0);
      if (allocSum > amount) {
        throw new Error(`Allocated sum (₹${allocSum}) cannot exceed received payment amount (₹${amount}).`);
      }

      for (const alloc of req.allocations) {
        const sale = farmStore.sales.find(s => s.id === alloc.saleId);
        if (sale) {
          sale.paidAmount += alloc.amount;
          if (sale.paidAmount >= sale.totalAmount) {
            sale.paymentStatus = 'PAID';
          } else {
            sale.paymentStatus = 'PARTIAL';
          }
          allocations.push({
            saleId: sale.id,
            invoiceNumber: sale.invoiceNumber,
            amount: alloc.amount
          });
        }
      }
    } else {
      // Automatic FIFO allocation: oldest unpaid invoices first
      let remainingToAllocate = amount;
      const unpaidSales = farmStore.sales
        .filter(s => s.customerId === req.customerId && s.totalAmount > s.paidAmount && s.status !== 'CANCELLED')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      for (const sale of unpaidSales) {
        if (remainingToAllocate <= 0) break;
        const needed = sale.totalAmount - sale.paidAmount;
        const take = Math.min(needed, remainingToAllocate);

        sale.paidAmount += take;
        remainingToAllocate -= take;
        if (sale.paidAmount >= sale.totalAmount) {
          sale.paymentStatus = 'PAID';
        } else {
          sale.paymentStatus = 'PARTIAL';
        }

        allocations.push({
          saleId: sale.id,
          invoiceNumber: sale.invoiceNumber,
          amount: take
        });
      }
    }

    // Deduct from customer outstanding
    customer.outstandingBalance = Math.max(0, customer.outstandingBalance - amount);

    const prevBalance = farmStore.customerLedgers.filter(l => l.customerId === customer.id).pop()?.runningBalance || customer.outstandingBalance + amount;

    // Create payment record
    const payment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      receiptNumber,
      customerId: customer.id,
      date: today,
      amount,
      paymentMethod: req.paymentMethod,
      allocations,
      notes: req.notes || `Trader payment for ${customer.name}`,
      recordedBy: req.recordedBy || 'Cashier'
    };
    farmStore.payments.push(payment);

    // Create ledger entry
    farmStore.customerLedgers.push({
      id: `led-${Date.now()}-pay`,
      customerId: customer.id,
      date: today,
      type: 'PAYMENT',
      refNumber: receiptNumber,
      debit: 0,
      credit: amount,
      runningBalance: Math.max(0, prevBalance - amount),
      notes: `Payment via ${req.paymentMethod} (Allocated to ${allocations.map(a => a.invoiceNumber).join(', ') || 'Account'})`
    });

    farmStore.logAudit(
      'RECORD_PAYMENT',
      `Payment receipt ${receiptNumber} recorded for ${customer.name}: ₹${amount.toLocaleString('en-IN')} via ${req.paymentMethod}. Allocated to ${allocations.length} invoices.`,
      'FINANCE',
      req.recordedBy || 'Cashier'
    );

    return payment;
  }

  /**
   * Get all overdue receivables for dashboard notifications & alerts
   */
  static getOverdueAlerts() {
    const alerts: Array<{
      customerId: string;
      customerName: string;
      businessName?: string;
      phone: string;
      totalOverdue: number;
      daysOverdue: number;
      oldestInvoiceNumber: string;
      severity: 'TODAY' | 'OVERDUE' | 'CRITICAL';
    }> = [];

    const today = new Date();

    for (const customer of farmStore.customers) {
      if (customer.outstandingBalance <= 0) continue;

      const unpaidSales = farmStore.sales.filter(
        s => s.customerId === customer.id && s.totalAmount > s.paidAmount && s.status !== 'CANCELLED'
      );

      let maxDaysOverdue = 0;
      let oldestInvoice = '';

      for (const s of unpaidSales) {
        const invoiceDate = new Date(s.date);
        const dueDate = new Date(invoiceDate.getTime() + 15 * 24 * 60 * 60 * 1000);
        const diffDays = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > maxDaysOverdue) {
          maxDaysOverdue = diffDays;
          oldestInvoice = s.invoiceNumber;
        }
      }

      if (maxDaysOverdue > 0) {
        alerts.push({
          customerId: customer.id,
          customerName: customer.name,
          businessName: customer.businessName,
          phone: customer.phone,
          totalOverdue: customer.outstandingBalance,
          daysOverdue: maxDaysOverdue,
          oldestInvoiceNumber: oldestInvoice || 'INV-00482',
          severity: maxDaysOverdue > 14 ? 'CRITICAL' : maxDaysOverdue > 0 ? 'OVERDUE' : 'TODAY'
        });
      }
    }

    return alerts.sort((a, b) => b.daysOverdue - a.daysOverdue);
  }
}
