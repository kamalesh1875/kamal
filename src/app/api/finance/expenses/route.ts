import { NextRequest, NextResponse } from 'next/server';
import { farmStore } from '@/lib/services/farm-store';
import { authorizeApiRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = authorizeApiRequest(req, 'canViewFinance');
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    return NextResponse.json({ expenses: farmStore.expenses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = authorizeApiRequest(req, 'canViewFinance');
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    if (!body.amount || !body.category || !body.paidTo) {
      return NextResponse.json(
        { error: 'amount, category, and paidTo are required fields.' },
        { status: 400 }
      );
    }

    const newExpense = {
      id: `exp-${Date.now()}`,
      category: body.category,
      amount: Number(body.amount),
      date: body.date || new Date().toISOString().substring(0, 10),
      penId: body.penId,
      goatId: body.goatId,
      paymentMethod: body.paymentMethod || 'CASH',
      paidTo: body.paidTo,
      description: body.description || 'Farm operational payout',
      receiptNumber: body.receiptNumber
    };

    farmStore.expenses.unshift(newExpense);
    farmStore.logAudit(
      'RECORD_EXPENSE',
      `Expense ₹${newExpense.amount} logged under ${newExpense.category} to ${newExpense.paidTo}`,
      'FINANCE',
      auth.user?.name || 'Staff User',
      auth.user?.role || 'OWNER'
    );

    return NextResponse.json({ success: true, expense: newExpense }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to record expense' }, { status: 400 });
  }
}
