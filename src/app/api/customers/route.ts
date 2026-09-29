import { NextRequest, NextResponse } from 'next/server';
import { farmStore } from '@/lib/services/farm-store';
import { Customer } from '@/types/farm';

export async function GET() {
  try {
    const customers = farmStore.customers;
    return NextResponse.json({ customers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.phone) {
      return NextResponse.json({ error: 'Customer name and phone number are required' }, { status: 400 });
    }

    const id = `cust-${Date.now()}`;
    const newCustomer: Customer = {
      id,
      name: body.name.trim(),
      businessName: body.businessName?.trim() || undefined,
      phone: body.phone.trim(),
      email: body.email?.trim() || undefined,
      address: body.address?.trim() || undefined,
      creditLimit: Number(body.creditLimit || 50000),
      outstandingBalance: 0,
      totalPurchases: 0,
      status: 'ACTIVE'
    };

    farmStore.customers.push(newCustomer);
    farmStore.logAudit(
      'NEW_CUSTOMER',
      `Registered trader ${newCustomer.name} (${newCustomer.businessName || 'Trader'}) with ₹${newCustomer.creditLimit.toLocaleString('en-IN')} credit limit`,
      'POS'
    );

    return NextResponse.json({ success: true, customer: newCustomer }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create customer' }, { status: 400 });
  }
}
