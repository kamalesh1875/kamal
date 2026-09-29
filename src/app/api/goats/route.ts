import { NextRequest, NextResponse } from 'next/server';
import { GoatService, GoatFilterParams } from '@/lib/services/goat-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const params: GoatFilterParams = {
      query: searchParams.get('query') || undefined,
      breed: searchParams.get('breed') || undefined,
      gender: searchParams.get('gender') || undefined,
      status: searchParams.get('status') || undefined,
      penId: searchParams.get('penId') || undefined,
      minWeight: searchParams.has('minWeight') ? parseFloat(searchParams.get('minWeight')!) : undefined,
      maxWeight: searchParams.has('maxWeight') ? parseFloat(searchParams.get('maxWeight')!) : undefined,
      minAge: searchParams.has('minAge') ? parseInt(searchParams.get('minAge')!, 10) : undefined,
      maxAge: searchParams.has('maxAge') ? parseInt(searchParams.get('maxAge')!, 10) : undefined,
      sortBy: (searchParams.get('sortBy') as any) || undefined,
      sortOrder: (searchParams.get('sortOrder') as any) || undefined,
      page: searchParams.has('page') ? parseInt(searchParams.get('page')!, 10) : 1,
      limit: searchParams.has('limit') ? parseInt(searchParams.get('limit')!, 10) : 100
    };

    const result = GoatService.listGoats(params);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch goats' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.tagNumber || !body.breed || !body.penId || body.currentWeightKg === undefined) {
      return NextResponse.json(
        { error: 'Missing mandatory fields: tagNumber, breed, penId, and currentWeightKg are required.' },
        { status: 400 }
      );
    }

    const newGoat = GoatService.registerGoat(body);
    return NextResponse.json({ success: true, goat: newGoat }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to register goat' }, { status: 400 });
  }
}
