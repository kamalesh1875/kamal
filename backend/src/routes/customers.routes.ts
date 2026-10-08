import { Router, Request, Response } from 'express';
import { farmStore } from '@/lib/services/farm-store';
import { LedgerService } from '@/lib/services/ledger-service';
import { Customer } from '@/types/farm';

const router = Router();

// GET /api/customers
router.get('/', (_req: Request, res: Response) => {
  try {
    const customers = farmStore.customers;
    return res.json({ customers });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch customers' });
  }
});

// POST /api/customers
router.post('/', (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.name || !body.phone) {
      return res.status(400).json({ error: 'Customer name and phone number are required' });
    }

    const id = `cust-${Date.now()}`;
    const newCustomer: Customer = {
      id,
      name: body.name.trim(),
      businessName: body.businessName?.trim() || undefined,
      phone: body.phone.trim(),
      email: body.email?.trim() || undefined,
      address: body.address?.trim() || undefined,
      creditLimit: Number(body.creditLimit || 50000),
      outstandingBalance: 0,
      totalPurchases: 0,
      status: 'ACTIVE'
    };

    farmStore.customers.push(newCustomer);
    farmStore.logAudit(
      'NEW_CUSTOMER',
      `Registered trader ${newCustomer.name} (${newCustomer.businessName || 'Trader'}) with ₹${newCustomer.creditLimit.toLocaleString('en-IN')} credit limit`,
      'POS'
    );

    return res.status(201).json({ success: true, customer: newCustomer });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to create customer' });
  }
});

// GET /api/customers/:id/ledger
router.get('/:id/ledger', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const profile = LedgerService.getCustomerFinancialProfile(id);
    return res.json(profile);
  } catch (error: any) {
    return res.status(404).json({ error: error.message || 'Failed to fetch customer ledger' });
  }
});

export default router;
