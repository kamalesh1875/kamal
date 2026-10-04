import { NextRequest, NextResponse } from 'next/server';
import { aiStore } from '@/ai-health/services/ai-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const severity = searchParams.get('severity');
    const status = searchParams.get('status');

    let alerts = aiStore.healthAlerts;
    if (severity) {
      alerts = alerts.filter(a => a.severity === severity);
    }
    if (status) {
      alerts = alerts.filter(a => a.status === status);
    }

    return NextResponse.json({ alerts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch health alerts' }, { status: 500 });
  }
}
