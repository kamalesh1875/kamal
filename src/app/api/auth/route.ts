import { NextRequest, NextResponse } from 'next/server';
import { SEED_USERS, createSessionToken, parseSessionToken, AuthUser } from '@/lib/auth';
import { farmStore } from '@/lib/services/farm-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password } = body;

    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
      response.cookies.delete('goatfarm_session');
      return response;
    }

    // Login action
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = SEED_USERS[email.toLowerCase().trim()];
    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials. Use provided test accounts.' }, { status: 401 });
    }

    const authUser: AuthUser = {
      id: user.id,
      farmId: user.farmId,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = createSessionToken(authUser);

    farmStore.logAudit(
      'AUTH_LOGIN',
      `User ${user.name} logged in with role ${user.role}`,
      'AUTH',
      user.name,
      user.role
    );

    const response = NextResponse.json({
      success: true,
      user: authUser,
      token
    });

    response.cookies.set('goatfarm_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Authentication error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('goatfarm_session')?.value || req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const user = parseSessionToken(token);
    return NextResponse.json({ user });
  } catch (e: any) {
    return NextResponse.json({ user: null });
  }
}
