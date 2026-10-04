import { NextRequest, NextResponse } from 'next/server';
import { aiStore } from '@/ai-health/services/ai-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const goatId = searchParams.get('goatId');
    const method = searchParams.get('method');

    let obs = aiStore.aiObservations;
    if (goatId) {
      obs = obs.filter(o => o.goatId === goatId);
    }
    if (method) {
      obs = obs.filter(o => o.detectionMethod === method);
    }

    return NextResponse.json({ observations: obs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch AI observations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newObs = {
      ...body,
      id: `obs-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    aiStore.aiObservations.unshift(newObs);
    return NextResponse.json({ success: true, observation: newObs }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to record AI observation' }, { status: 400 });
  }
}
