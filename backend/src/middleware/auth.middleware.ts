import { Request, Response, NextFunction } from 'express';
import { getAuthUserFromRequest, checkPermission, RolePermissions, AuthUser, UserRole } from '@/lib/auth';

// Extend Express Request interface to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * Middleware: Require user to be authenticated
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getAuthUserFromRequest(req);
  if (!user) {
    return res.status(401).json({
      error: 'Authentication required. Please log in with valid credentials.',
      code: 'UNAUTHENTICATED'
    });
  }
  req.user = user;
  next();
}

/**
 * Middleware: Require specific permission from RolePermissions
 */
export function requirePermission(permission: keyof RolePermissions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = getAuthUserFromRequest(req);
    if (!user) {
      return res.status(401).json({
        error: 'Authentication required. Please log in with valid credentials.',
        code: 'UNAUTHENTICATED'
      });
    }

    if (!checkPermission(user.role, permission)) {
      return res.status(403).json({
        error: `Access Denied: Role '${user.role}' lacks permission '${permission}'`,
        code: 'FORBIDDEN',
        requiredPermission: permission,
        userRole: user.role
      });
    }

    req.user = user;
    next();
  };
}

/**
 * Middleware: Require one of specified roles
 */
export function requireRoles(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = getAuthUserFromRequest(req);
    if (!user) {
      return res.status(401).json({
        error: 'Authentication required. Please log in with valid credentials.',
        code: 'UNAUTHENTICATED'
      });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({
        error: `Access Denied: Role '${user.role}' is not authorized for this resource.`,
        code: 'FORBIDDEN',
        allowedRoles: roles,
        userRole: user.role
      });
    }

    req.user = user;
    next();
  };
}

/**
 * Optional Auth: Attaches user if present, but doesn't block if not
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const user = getAuthUserFromRequest(req);
  if (user) {
    req.user = user;
  }
  next();
}
