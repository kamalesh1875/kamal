import { NextRequest, NextResponse } from 'next/server';
import { PosService } from '@/lib/services/pos-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.items || !Array.isArray(body.items)) {
      return NextResponse.json({ error: 'Array of items required' }, { status: 400 });
    }

    const calculation = PosService.calculateSale({
      items: body.items,
      discount: body.discount,
      transportCharges: body.transportCharges
    });

    return NextResponse.json(calculation);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error calculating sale totals' }, { status: 400 });
  }
}
