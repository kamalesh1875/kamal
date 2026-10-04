import { NextRequest, NextResponse } from 'next/server';
import { aiStore } from '@/ai-health/services/ai-store';
import { ModelMonitoringService } from '@/ai-health/monitoring/model-monitoring-service';

export async function GET() {
  try {
    return NextResponse.json({
      modelMetrics: aiStore.modelMetrics,
      samplesCount: ModelMonitoringService.getTrainingSamples().length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch AI model metrics' }, { status: 500 });
  }
}
