import { UserRole } from '@/types/farm';

export interface AuthUser {
  id: string;
  farmId: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export const SEED_USERS: Record<string, AuthUser & { password: string }> = {
  'admin@mskgoat.com': {
    id: 'usr-owner-1',
    farmId: 'farm-msk-pollachi',
    name: 'Kamalesh M (Owner)',
    email: 'admin@mskgoat.com',
    role: 'OWNER',
    password: 'admin123'
  },
  'vet@mskgoat.com': {
    id: 'usr-vet-1',
    farmId: 'farm-msk-pollachi',
    name: 'Dr. S. Ramanathan BVSc (Veterinarian)',
    email: 'vet@mskgoat.com',
    role: 'VETERINARIAN',
    password: 'vet123'
  },
  'worker@mskgoat.com': {
    id: 'usr-worker-1',
    farmId: 'farm-msk-pollachi',
    name: 'Muthu (Field Worker)',
    email: 'worker@mskgoat.com',
    role: 'WORKER',
    password: 'worker123'
  },
  'cashier@mskgoat.com': {
    id: 'usr-cashier-1',
    farmId: 'farm-msk-pollachi',
    name: 'Priya (POS Cashier)',
    email: 'cashier@mskgoat.com',
    role: 'CASHIER',
    password: 'cashier123'
  },
  'manager@mskgoat.com': {
    id: 'usr-manager-1',
    farmId: 'farm-msk-pollachi',
    name: 'Suresh (Farm Operations Manager)',
    email: 'manager@mskgoat.com',
    role: 'FARM_MANAGER',
    password: 'manager123'
  },
  'accountant@mskgoat.com': {
    id: 'usr-accountant-1',
    farmId: 'farm-msk-pollachi',
    name: 'Anand (Commercial Accountant)',
    email: 'accountant@mskgoat.com',
    role: 'ACCOUNTANT',
    password: 'accountant123'
  }
};

/**
 * Production RBAC Permission Matrix
 */
export interface RolePermissions {
  canViewProfit: boolean;
  canViewFinance: boolean;
  canViewOwnerSettings: boolean;
  canAccessPos: boolean;
  canAccessCustomerCredit: boolean;
  canManageVeterinary: boolean;
  canRecordWeight: boolean;
  canIssueFeed: boolean;
  canCancelSales: boolean;
  canViewAuditLogs: boolean;
  canManageLivestock: boolean;
  allowedNavTabs: string[];
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  OWNER: {
    canViewProfit: true,
    canViewFinance: true,
    canViewOwnerSettings: true,
    canAccessPos: true,
    canAccessCustomerCredit: true,
    canManageVeterinary: true,
    canRecordWeight: true,
    canIssueFeed: true,
    canCancelSales: true,
    canViewAuditLogs: true,
    canManageLivestock: true,
    allowedNavTabs: ['dashboard', 'goats', 'weight', 'health', 'ai-health', 'pens', 'pos', 'sales', 'customers', 'inventory', 'tasks', 'finance', 'expenses', 'audit', 'settings']
  },
  ADMIN: {
    canViewProfit: true,
    canViewFinance: true,
    canViewOwnerSettings: true,
    canAccessPos: true,
    canAccessCustomerCredit: true,
    canManageVeterinary: true,
    canRecordWeight: true,
    canIssueFeed: true,
    canCancelSales: true,
    canViewAuditLogs: true,
    canManageLivestock: true,
    allowedNavTabs: ['dashboard', 'goats', 'weight', 'health', 'ai-health', 'pens', 'pos', 'sales', 'customers', 'inventory', 'tasks', 'finance', 'expenses', 'audit', 'settings']
  },
  FARM_MANAGER: {
    canViewProfit: false,
    canViewFinance: true,
    canViewOwnerSettings: false,
    canAccessPos: true,
    canAccessCustomerCredit: true,
    canManageVeterinary: true,
    canRecordWeight: true,
    canIssueFeed: true,
    canCancelSales: false,
    canViewAuditLogs: true,
    canManageLivestock: true,
    allowedNavTabs: ['dashboard', 'goats', 'weight', 'health', 'ai-health', 'pens', 'pos', 'sales', 'customers', 'inventory', 'tasks', 'expenses', 'audit']
  },
  ACCOUNTANT: {
    canViewProfit: true,
    canViewFinance: true,
    canViewOwnerSettings: false,
    canAccessPos: false,
    canAccessCustomerCredit: true,
    canManageVeterinary: false,
    canRecordWeight: false,
    canIssueFeed: false,
    canCancelSales: false,
    canViewAuditLogs: true,
    canManageLivestock: false,
    allowedNavTabs: ['dashboard', 'sales', 'customers', 'finance', 'expenses', 'audit']
  },
  VETERINARIAN: {
    canViewProfit: false,
    canViewFinance: false,
    canViewOwnerSettings: false,
    canAccessPos: false,
    canAccessCustomerCredit: false,
    canManageVeterinary: true,
    canRecordWeight: true,
    canIssueFeed: true,
    canCancelSales: false,
    canViewAuditLogs: false,
    canManageLivestock: true,
    allowedNavTabs: ['dashboard', 'goats', 'weight', 'health', 'ai-health', 'pens', 'tasks']
  },
  WORKER: {
    canViewProfit: false,
    canViewFinance: false,
    canViewOwnerSettings: false,
    canAccessPos: false,
    canAccessCustomerCredit: false,
    canManageVeterinary: false,
    canRecordWeight: true,
    canIssueFeed: true,
    canCancelSales: false,
    canViewAuditLogs: false,
    canManageLivestock: false,
    allowedNavTabs: ['dashboard', 'goats', 'weight', 'pens', 'tasks']
  },
  CASHIER: {
    canViewProfit: false,
    canViewFinance: false,
    canViewOwnerSettings: false,
    canAccessPos: true,
    canAccessCustomerCredit: true,
    canManageVeterinary: false,
    canRecordWeight: false,
    canIssueFeed: false,
    canCancelSales: false,
    canViewAuditLogs: false,
    canManageLivestock: false,
    allowedNavTabs: ['dashboard', 'pos', 'sales', 'customers']
  }
};

/**
 * Verify whether a role has permission to access a feature or perform an action
 */
export function checkPermission(role: UserRole, permission: keyof RolePermissions): boolean {
  const perm = ROLE_PERMISSIONS[role];
  if (!perm) return false;
  return Boolean(perm[permission]);
}

/**
 * Check if a tab/route identifier is allowed for a user role
 */
export function isTabAllowed(role: UserRole, tab: string): boolean {
  const perm = ROLE_PERMISSIONS[role];
  if (!perm) return false;
  // Normalize tab by removing leading slash if present
  const cleanTab = tab.replace(/^\//, '');
  if (cleanTab === '' || cleanTab === 'dashboard') return true;
  return perm.allowedNavTabs.includes(cleanTab);
}

/**
 * Destination route after login based on authenticated role
 */
export function getDefaultRouteForRole(role: UserRole): string {
  switch (role) {
    case 'CASHIER':
      return '/pos';
    case 'VETERINARIAN':
      return '/dashboard';
    case 'WORKER':
      return '/dashboard';
    case 'OWNER':
    case 'ADMIN':
    case 'FARM_MANAGER':
    case 'ACCOUNTANT':
    default:
      return '/dashboard';
  }
}

/**
 * Simple collision-safe base64 session token generator for demonstration and production
 */
export function createSessionToken(user: AuthUser): string {
  const payload = {
    ...user,
    timestamp: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

export function parseSessionToken(token: string): AuthUser | null {
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf8');
    const data = JSON.parse(raw);
    if (data.expiresAt && Date.now() > data.expiresAt) {
      return null; // Expired
    }
    return {
      id: data.id,
      farmId: data.farmId,
      name: data.name,
      email: data.email,
      role: data.role
    };
  } catch {
    return null;
  }
}

/**
 * Extract authenticated user from incoming request (cookies or Bearer header)
 */
export function getAuthUserFromRequest(req: Request | any): AuthUser | null {
  try {
    let token: string | undefined;

    // NextRequest cookies
    if (req.cookies && typeof req.cookies.get === 'function') {
      token = req.cookies.get('goatfarm_session')?.value;
    }

    // Header cookies fallback
    if (!token && req.headers) {
      const cookieHeader = typeof req.headers.get === 'function' ? req.headers.get('cookie') : req.headers.cookie;
      if (cookieHeader) {
        const match = cookieHeader.match(/goatfarm_session=([^;]+)/);
        if (match) token = match[1];
      }

      // Authorization header fallback
      if (!token) {
        const authHeader = typeof req.headers.get === 'function' ? req.headers.get('authorization') : req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7).trim();
        }
      }
    }

    if (!token) return null;
    return parseSessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Authorize API requests based on permissions
 */
export function authorizeApiRequest(
  req: Request | any,
  permission?: keyof RolePermissions
): { authorized: boolean; user: AuthUser | null; error?: string; status: number } {
  const user = getAuthUserFromRequest(req);
  if (!user) {
    return { authorized: false, user: null, error: 'Unauthorized: Session required. Please log in.', status: 401 };
  }

  if (permission && !checkPermission(user.role, permission)) {
    return {
      authorized: false,
      user,
      error: `Forbidden: Role ${user.role} lacks permission '${permission}'`,
      status: 403
    };
  }

  return { authorized: true, user, status: 200 };
}
