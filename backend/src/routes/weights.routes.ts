import { Router, Request, Response } from 'express';
import { GoatService } from '@/lib/services/goat-service';
import { farmStore } from '@/lib/services/farm-store';
import { requireAuth, requirePermission } from '@/middleware/auth.middleware';

const router = Router();

// GET /api/weights - Authenticated staff
router.get('/', requireAuth, (req: Request, res: Response) => {
  try {
    const goatId = req.query.goatId as string | undefined;

    let records = farmStore.weightRecords;
    if (goatId) {
      records = records.filter(w => w.goatId === goatId);
    }

    records.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
    return res.json({ records });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch weight records' });
  }
});

// POST /api/weights - Requires weight recording permission (Owner, Manager, Vet, Worker)
router.post('/', requirePermission('canRecordWeight'), (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.goatId || body.weightKg === undefined || body.weightKg <= 0) {
      return res.status(400).json({ error: 'Valid goatId and positive weightKg are required' });
    }

    const workerName = req.user?.name || body.workerName || 'Staff Member';

    const result = GoatService.recordWeight({
      goatId: body.goatId,
      weightKg: Number(body.weightKg),
      recordedAt: body.recordedAt,
      notes: body.notes,
      workerName
    });

    farmStore.logAudit(
      'RECORD_WEIGHT',
      `Logged weight ${body.weightKg}kg for goat ${result.goat?.tagNumber || body.goatId}`,
      'LIVESTOCK',
      req.user?.name,
      req.user?.role
    );

    return res.json({
      success: true,
      weightRecord: result.weightRecord,
      goat: result.goat,
      warning: result.warning
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to record weight measurement' });
  }
});

export default router;
