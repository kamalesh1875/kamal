import { Router, Request, Response } from 'express';
import { GoatService, GoatFilterParams } from '@/lib/services/goat-service';
import { farmStore } from '@/lib/services/farm-store';
import { requireAuth, requirePermission } from '@/middleware/auth.middleware';

const router = Router();

// GET /api/goats - Authenticated staff
router.get('/', requireAuth, (req: Request, res: Response) => {
  try {
    const q = req.query;
    const params: GoatFilterParams = {
      query: (q.query as string) || undefined,
      breed: (q.breed as string) || undefined,
      gender: (q.gender as string) || undefined,
      status: (q.status as string) || undefined,
      penId: (q.penId as string) || undefined,
      minWeight: q.minWeight !== undefined ? parseFloat(q.minWeight as string) : undefined,
      maxWeight: q.maxWeight !== undefined ? parseFloat(q.maxWeight as string) : undefined,
      minAge: q.minAge !== undefined ? parseInt(q.minAge as string, 10) : undefined,
      maxAge: q.maxAge !== undefined ? parseInt(q.maxAge as string, 10) : undefined,
      sortBy: (q.sortBy as any) || undefined,
      sortOrder: (q.sortOrder as any) || undefined,
      page: q.page !== undefined ? parseInt(q.page as string, 10) : 1,
      limit: q.limit !== undefined ? parseInt(q.limit as string, 10) : 100
    };

    const result = GoatService.listGoats(params);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch goats' });
  }
});

// POST /api/goats - Requires livestock management permission
router.post('/', requirePermission('canManageLivestock'), (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.tagNumber || !body.breed || !body.penId || body.currentWeightKg === undefined) {
      return res.status(400).json({
        error: 'Missing mandatory fields: tagNumber, breed, penId, and currentWeightKg are required.'
      });
    }

    const newGoat = GoatService.registerGoat(body);
    farmStore.logAudit(
      'CREATE_GOAT',
      `Registered new ${newGoat.breed} goat ${newGoat.tagNumber}`,
      'LIVESTOCK',
      req.user?.name,
      req.user?.role
    );
    return res.status(201).json({ success: true, goat: newGoat });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to register goat' });
  }
});

// GET /api/goats/:id - Authenticated staff
router.get('/:id', requireAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const goat = GoatService.getGoatById(id);

    if (!goat) {
      return res.status(404).json({ error: `Goat with ID ${id} not found` });
    }

    return res.json({ goat });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error fetching goat profile' });
  }
});

// PATCH /api/goats/:id - Requires livestock management permission
router.patch('/:id', requirePermission('canManageLivestock'), (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const goat = farmStore.goats.find(g => g.id === id);
    if (!goat) {
      return res.status(404).json({ error: `Goat with ID ${id} not found` });
    }

    const allowedFields = [
      'penId',
      'status',
      'targetWeightKg',
      'marketRatePerKg',
      'notes',
      'damTag',
      'sireTag',
      'color',
      'markings',
      'batch'
    ];

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        (goat as any)[key] = body[key];
      }
    }

    farmStore.recomputeGoat(id);
    farmStore.logAudit(
      'UPDATE_GOAT',
      `Updated profile for goat ${goat.tagNumber}`,
      'LIVESTOCK',
      req.user?.name,
      req.user?.role
    );

    return res.json({ success: true, goat });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error updating goat profile' });
  }
});

// DELETE /api/goats/:id - Requires owner/admin settings permission
router.delete('/:id', requirePermission('canViewOwnerSettings'), (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const index = farmStore.goats.findIndex(g => g.id === id);
    if (index === -1) {
      return res.status(404).json({ error: `Goat with ID ${id} not found` });
    }

    const [removed] = farmStore.goats.splice(index, 1);
    farmStore.logAudit(
      'DELETE_GOAT',
      `Deleted goat profile ${removed.tagNumber} (${removed.id})`,
      'LIVESTOCK',
      req.user?.name,
      req.user?.role
    );

    return res.json({ success: true, message: `Goat ${removed.tagNumber} removed successfully` });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error deleting goat' });
  }
});

export default router;
