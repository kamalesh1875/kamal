import { NextRequest, NextResponse } from 'next/server';
import { GoatService } from '@/lib/services/goat-service';
import { farmStore } from '@/lib/services/farm-store';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const goat = GoatService.getGoatById(id);

    if (!goat) {
      return NextResponse.json({ error: `Goat with ID ${id} not found` }, { status: 404 });
    }

    return NextResponse.json({ goat });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching goat profile' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const goat = farmStore.goats.find(g => g.id === id);
    if (!goat) {
      return NextResponse.json({ error: `Goat with ID ${id} not found` }, { status: 404 });
    }

    // Apply allowed updates
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
    farmStore.logAudit('UPDATE_GOAT', `Updated profile for goat ${goat.tagNumber}`, 'LIVESTOCK');

    return NextResponse.json({ success: true, goat });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating goat profile' }, { status: 500 });
  }
}
