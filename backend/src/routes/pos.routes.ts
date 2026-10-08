import { Router, Request, Response } from 'express';
import { PosService } from '@/lib/services/pos-service';
import { farmStore } from '@/lib/services/farm-store';
import { authorizeApiRequest } from '@/lib/auth';

const router = Router();

// POST /api/pos/calculate
router.post('/calculate', (req: Request, res: Response) => {
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

// GET /api/pos/sales
router.get('/sales', (req: Request, res: Response) => {
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

// POST /api/pos/sales
router.post('/sales', (req: Request, res: Response) => {
  try {
    const auth = authorizeApiRequest(req, 'canAccessPos');
    if (!auth.authorized) {
      return res.status(auth.status).json({ error: auth.error });
    }

    const body = req.body;

    if (!body.customerId || !body.items || !body.paymentMethod) {
      return res.status(400).json({
        error: 'Missing required fields: customerId, items, and paymentMethod are required.'
      });
    }

    const sale = PosService.createSale(body);
    return res.status(201).json({ success: true, sale });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to create sale transaction' });
  }
});

// POST /api/pos/sales/:id/cancel
router.post('/sales/:id/cancel', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const reason = body.reason?.trim();
    if (!reason) {
      return res.status(400).json({
        error: 'A valid reason is required to cancel or void a commercial sales invoice.'
      });
    }

    const cancelledSale = PosService.cancelSale(id, reason, body.cancelledBy || 'Owner');

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
