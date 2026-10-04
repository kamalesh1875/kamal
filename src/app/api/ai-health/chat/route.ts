import { NextRequest, NextResponse } from 'next/server';
import { AiChatService } from '@/ai-health/services/ai-chat-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query || body.message;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query string is required' }, { status: 400 });
    }

    const response = await AiChatService.processQuery(query);
    return NextResponse.json({ success: true, response });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Chat service failed' }, { status: 500 });
  }
}
