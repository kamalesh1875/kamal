import { Router, Request, Response } from 'express';
import { farmStore } from '@/lib/services/farm-store';
import { requirePermission } from '@/middleware/auth.middleware';

const router = Router();

// GET /api/audit - Requires audit logs view permission
router.get('/', requirePermission('canViewAuditLogs'), (req: Request, res: Response) => {
  try {
    const moduleFilter = req.query.module as string | undefined;

    let logs = farmStore.auditLogs;
    if (moduleFilter && moduleFilter !== 'ALL') {
      logs = logs.filter(l => l.module === moduleFilter);
    }

    return res.json({ logs });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch audit trail' });
  }
});

export default router;
