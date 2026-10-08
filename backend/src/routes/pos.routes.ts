import { Router, Request, Response } from 'express';
import { PosService } from '@/lib/services/pos-service';
import { farmStore } from '@/lib/services/farm-store';
import { requireAuth, requirePermission } from '@/middleware/auth.middleware';

const router = Router();

// POST /api/pos/calculate - Requires POS access
router.post('/calculate', requirePermission('canAccessPos'), (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.items || !Array.isArray(body.items)) {
      return res.status(400).json({ error: 'Array of items required' });
    }

    const calculation = PosService.calculateSale({
      items: body.items,
      discount: body.discount,
      transportCharges: body.transportCharges
    });

    return res.json(calculation);
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Error calculating sale totals' });
  }
});

// GET /api/pos/sales - Authenticated staff
router.get('/sales', requireAuth, (req: Request, res: Response) => {
  try {
    const customerId = req.query.customerId as string | undefined;
    const status = req.query.status as string | undefined;

    let sales = farmStore.sales;
    if (customerId) {
      sales = sales.filter(s => s.customerId === customerId);
    }
    if (status) {
      sales = sales.filter(s => s.status === status);
    }

    return res.json({ sales });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch sales' });
  }
});

// POST /api/pos/sales - Requires POS access (Owner, Manager, Cashier)
router.post('/sales', requirePermission('canAccessPos'), (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.customerId || !body.items || !body.paymentMethod) {
      return res.status(400).json({
        error: 'Missing required fields: customerId, items, and paymentMethod are required.'
      });
    }

    const sale = PosService.createSale(body);
    farmStore.logAudit(
      'CREATE_SALE',
      `Issued POS Invoice ${sale.invoiceNumber} for ₹${sale.totalAmount}`,
      'POS',
      req.user?.name,
      req.user?.role
    );

    return res.status(201).json({ success: true, sale });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to create sale transaction' });
  }
});

// POST /api/pos/sales/:id/cancel - Requires Cancel Sales permission (Owner/Admin only)
router.post('/sales/:id/cancel', requirePermission('canCancelSales'), (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const reason = body.reason?.trim();
    if (!reason) {
      return res.status(400).json({
        error: 'A valid reason is required to cancel or void a commercial sales invoice.'
      });
    }

    const cancelledBy = req.user?.name || body.cancelledBy || 'Owner';
    const cancelledSale = PosService.cancelSale(id, reason, cancelledBy);

    farmStore.logAudit(
      'CANCEL_SALE',
      `Voided Invoice ${cancelledSale.invoiceNumber}. Reason: ${reason}`,
      'POS',
      req.user?.name,
      req.user?.role
    );

    return res.json({
      success: true,
      message: `Sale ${cancelledSale.invoiceNumber} has been marked as CANCELLED. Livestock assets reverted to herd.`,
      sale: cancelledSale
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Error cancelling sale' });
  }
});

export default router;
