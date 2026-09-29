import { NextRequest, NextResponse } from 'next/server';
import { PosService } from '@/lib/services/pos-service';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const reason = body.reason?.trim();
    if (!reason) {
      return NextResponse.json(
        { error: 'A valid reason is required to cancel or void a commercial sales invoice.' },
        { status: 400 }
      );
    }

    const cancelledSale = PosService.cancelSale(id, reason, body.cancelledBy || 'Owner');

    return NextResponse.json({
      success: true,
      message: `Sale ${cancelledSale.invoiceNumber} has been marked as CANCELLED. Livestock assets reverted to herd.`,
      sale: cancelledSale
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error cancelling sale' }, { status: 400 });
  }
}
