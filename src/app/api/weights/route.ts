import { NextRequest, NextResponse } from 'next/server';
import { GoatService } from '@/lib/services/goat-service';
import { farmStore } from '@/lib/services/farm-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const goatId = searchParams.get('goatId');

    let records = farmStore.weightRecords;
    if (goatId) {
      records = records.filter(w => w.goatId === goatId);
    }

    records.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
    return NextResponse.json({ records });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch weight records' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.goatId || body.weightKg === undefined || body.weightKg <= 0) {
      return NextResponse.json({ error: 'Valid goatId and positive weightKg are required' }, { status: 400 });
    }

    const result = GoatService.recordWeight({
      goatId: body.goatId,
      weightKg: Number(body.weightKg),
      recordedAt: body.recordedAt,
      notes: body.notes,
      workerName: body.workerName
    });

    return NextResponse.json({
      success: true,
      weightRecord: result.weightRecord,
      goat: result.goat,
      warning: result.warning
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to record weight measurement' }, { status: 400 });
  }
}
