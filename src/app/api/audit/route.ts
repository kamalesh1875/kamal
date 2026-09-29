import { NextRequest, NextResponse } from 'next/server';
import { farmStore } from '@/lib/services/farm-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const moduleFilter = searchParams.get('module');

    let logs = farmStore.auditLogs;
    if (moduleFilter && moduleFilter !== 'ALL') {
      logs = logs.filter(l => l.module === moduleFilter);
    }

    return NextResponse.json({ logs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch audit trail' }, { status: 500 });
  }
}
