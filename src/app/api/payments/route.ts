import { NextRequest, NextResponse } from 'next/server';
import { LedgerService } from '@/lib/services/ledger-service';
import { getAuthUserFromRequest, checkPermission } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Session required. Please log in.' }, { status: 401 });
    }

    if (!checkPermission(user.role, 'canAccessCustomerCredit') && !checkPermission(user.role, 'canAccessPos')) {
      return NextResponse.json({ error: `Forbidden: Role ${user.role} lacks customer payment permissions.` }, { status: 403 });
    }

    const body = await req.json();

    if (!body.customerId || !body.amount || !body.paymentMethod) {
      return NextResponse.json(
        { error: 'customerId, positive amount, and paymentMethod are required.' },
        { status: 400 }
      );
    }

    const payment = LedgerService.recordPayment({
      customerId: body.customerId,
      amount: Number(body.amount),
      paymentMethod: body.paymentMethod,
      paymentDate: body.paymentDate,
      notes: body.notes,
      allocations: body.allocations,
      recordedBy: body.recordedBy
    });

    return NextResponse.json({ success: true, payment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to record payment' }, { status: 400 });
  }
}
