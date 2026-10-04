import { NextRequest, NextResponse } from 'next/server';
import { aiStore } from '@/ai-health/services/ai-store';

export async function GET() {
  try {
    return NextResponse.json({ cameras: aiStore.cameras, events: aiStore.cameraEvents.slice(0, 50) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch camera status' }, { status: 500 });
  }
}
