import { Router, Request, Response } from 'express';
import { SEED_USERS, createSessionToken, parseSessionToken, AuthUser } from '@/lib/auth';
import { farmStore } from '@/lib/services/farm-store';

const router = Router();

// POST /api/auth (Login / Logout action)
router.post('/', (req: Request, res: Response) => {
  try {
    const { action, email, password } = req.body || {};

    if (action === 'logout') {
      res.clearCookie('goatfarm_session', { path: '/' });
      return res.json({ success: true, message: 'Logged out successfully' });
    }

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = SEED_USERS[email.toLowerCase().trim()];
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
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

    res.cookie('goatfarm_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return res.json({
      success: true,
      user: authUser,
      token
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Authentication error' });
  }
});

// GET /api/auth (Check current session)
router.get('/', (req: Request, res: Response) => {
  try {
    const token =
      req.cookies?.goatfarm_session ||
      (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);

    if (!token) {
      return res.json({ user: null });
    }

    const user = parseSessionToken(token);
    return res.json({ user });
  } catch {
    return res.json({ user: null });
  }
});

// DELETE /api/auth (Logout)
router.delete('/', (_req: Request, res: Response) => {
  res.clearCookie('goatfarm_session', { path: '/' });
  return res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
