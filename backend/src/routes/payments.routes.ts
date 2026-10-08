import { Router, Request, Response } from 'express';
import { LedgerService } from '@/lib/services/ledger-service';
import { getAuthUserFromRequest, checkPermission } from '@/lib/auth';

const router = Router();

// POST /api/payments
router.post('/', (req: Request, res: Response) => {
  try {
    const user = getAuthUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: Session required. Please log in.' });
    }

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
      recordedBy: body.recordedBy
    });

    return res.status(201).json({ success: true, payment });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to record payment' });
  }
});

export default router;
