import { Router, Request, Response } from 'express';
import { LedgerService } from '@/lib/services/ledger-service';
import { farmStore } from '@/lib/services/farm-store';
import { checkPermission } from '@/lib/auth';
import { requireAuth } from '@/middleware/auth.middleware';

const router = Router();

// GET /api/payments - Authenticated staff
router.get('/', requireAuth, (req: Request, res: Response) => {
  try {
    const customerId = req.query.customerId as string | undefined;
    let payments = farmStore.payments;
    if (customerId) {
      payments = payments.filter(p => p.customerId === customerId);
    }
    return res.json({ payments });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch payments' });
  }
});

// POST /api/payments - Requires customer credit or POS access
router.post('/', requireAuth, (req: Request, res: Response) => {
  try {
    const user = req.user!;
    if (!checkPermission(user.role, 'canAccessCustomerCredit') && !checkPermission(user.role, 'canAccessPos')) {
      return res.status(403).json({ error: `Forbidden: Role ${user.role} lacks customer payment permissions.` });
    }

    const body = req.body;

    if (!body.customerId || !body.amount || !body.paymentMethod) {
      return res.status(400).json({ error: 'customerId, positive amount, and paymentMethod are required.' });
    }

    const payment = LedgerService.recordPayment({
      customerId: body.customerId,
      amount: Number(body.amount),
      paymentMethod: body.paymentMethod,
      paymentDate: body.paymentDate,
      notes: body.notes,
      allocations: body.allocations,
      recordedBy: user.name || body.recordedBy
    });

    farmStore.logAudit(
      'RECORD_PAYMENT',
      `Recorded payment of ₹${body.amount} via ${body.paymentMethod} for customer ${body.customerId}`,
      'FINANCE',
      user.name,
      user.role
    );

    return res.status(201).json({ success: true, payment });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to record payment' });
  }
});

export default router;
