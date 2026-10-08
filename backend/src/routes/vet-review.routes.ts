import { Router, Request, Response } from 'express';
import { VetReviewService } from '@/ai-health/vet-review/vet-review-service';
import { requirePermission } from '@/middleware/auth.middleware';

const router = Router();

// GET /api/vet-review - Requires veterinary management permission
router.get('/', requirePermission('canManageVeterinary'), (req: Request, res: Response) => {
  try {
    const goatId = req.query.goatId as string | undefined;

    let reviews = VetReviewService.getAllReviews();
    if (goatId) {
      reviews = reviews.filter(r => r.goatId === goatId);
    }

    return res.json({ reviews });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch vet reviews' });
  }
});

// POST /api/vet-review - Requires veterinary management permission
router.post('/', requirePermission('canManageVeterinary'), (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.goatId || !body.reviewStatus || !body.clinicalObservation) {
      return res.status(400).json({
        error: 'Missing required fields: goatId, reviewStatus, and clinicalObservation are required.'
      });
    }

    const review = VetReviewService.recordReview({
      ...body,
      vetName: req.user?.name || body.vetName || 'Certified Veterinarian'
    });
    return res.status(201).json({ success: true, review });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to save vet review' });
  }
});

export default router;
