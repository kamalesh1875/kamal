import { NextRequest, NextResponse } from 'next/server';
import { aiStore } from '@/ai-health/services/ai-store';

export async function GET() {
  try {
    return NextResponse.json({ readings: aiStore.environmentReadings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch environment readings' }, { status: 500 });
  }
}
