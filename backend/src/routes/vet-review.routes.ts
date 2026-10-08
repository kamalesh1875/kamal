import { Router, Request, Response } from 'express';
import { VetReviewService } from '@/ai-health/vet-review/vet-review-service';
import { authorizeApiRequest } from '@/lib/auth';

const router = Router();

// GET /api/vet-review
router.get('/', (req: Request, res: Response) => {
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

// POST /api/vet-review
router.post('/', (req: Request, res: Response) => {
  try {
    const auth = authorizeApiRequest(req, 'canManageVeterinary');
    if (!auth.authorized) {
      return res.status(auth.status).json({ error: auth.error });
    }

    const body = req.body;

    if (!body.goatId || !body.vetName || !body.reviewStatus || !body.clinicalObservation) {
      return res.status(400).json({
        error: 'Missing required fields: goatId, vetName, reviewStatus, and clinicalObservation are required.'
      });
    }

    const review = VetReviewService.recordReview(body);
    return res.status(201).json({ success: true, review });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to save vet review' });
  }
});

export default router;
