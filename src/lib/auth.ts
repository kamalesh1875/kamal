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
    allowedNavTabs: ['dashboard', 'goats', 'weight', 'health', 'ai-health', 'pens', 'pos', 'sales', 'customers', 'inventory', 'tasks', 'finance', 'expenses', 'audit']
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
    allowedNavTabs: ['dashboard', 'goats', 'weight', 'health', 'ai-health', 'pens', 'pos', 'sales', 'customers', 'inventory', 'tasks', 'finance', 'expenses', 'audit']
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
