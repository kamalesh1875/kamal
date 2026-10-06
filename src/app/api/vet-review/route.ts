import { NextRequest, NextResponse } from 'next/server';
import { VetReviewService } from '@/ai-health/vet-review/vet-review-service';
import { authorizeApiRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const goatId = searchParams.get('goatId');

    let reviews = VetReviewService.getAllReviews();
    if (goatId) {
      reviews = reviews.filter(r => r.goatId === goatId);
    }

    return NextResponse.json({ reviews });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch vet reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = authorizeApiRequest(req, 'canManageVeterinary');
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();

    if (!body.goatId || !body.vetName || !body.reviewStatus || !body.clinicalObservation) {
      return NextResponse.json(
        { error: 'Missing required fields: goatId, vetName, reviewStatus, and clinicalObservation are required.' },
        { status: 400 }
      );
    }

    const review = VetReviewService.recordReview(body);
    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save vet review' }, { status: 400 });
  }
}
