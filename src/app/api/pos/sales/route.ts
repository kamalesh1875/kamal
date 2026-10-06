import { NextRequest, NextResponse } from 'next/server';
import { PosService } from '@/lib/services/pos-service';
import { farmStore } from '@/lib/services/farm-store';
import { authorizeApiRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');

    let sales = farmStore.sales;
    if (customerId) {
      sales = sales.filter(s => s.customerId === customerId);
    }
    if (status) {
      sales = sales.filter(s => s.status === status);
    }

    return NextResponse.json({ sales });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch sales' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // API Authorization check
    const auth = authorizeApiRequest(req, 'canAccessPos');
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();

    if (!body.customerId || !body.items || !body.paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields: customerId, items, and paymentMethod are required.' },
        { status: 400 }
      );
    }

    const sale = PosService.createSale(body);
    return NextResponse.json({ success: true, sale }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create sale transaction' }, { status: 400 });
  }
}
