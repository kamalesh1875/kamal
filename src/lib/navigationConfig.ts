import {
  LayoutDashboard,
  ShieldAlert,
  Scale,
  Activity,
  Grid,
  ShoppingBag,
  Receipt,
  Users,
  Wheat,
  CheckSquare,
  BadgeIndianRupee,
  FileSpreadsheet,
  History,
  Sparkles,
  Settings
} from 'lucide-react';
import { UserRole } from '@/types/farm';
import { ROLE_PERMISSIONS } from '@/lib/auth';

export interface NavItem {
  id: string;
  label: string;
  route: string;
  icon: any;
  isHighlight?: boolean;
  badgeKey?: 'lowStock' | 'overdueVaccines' | 'pendingTasks';
  badgeVariant?: 'danger' | 'warning';
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const ALL_NAV_SECTIONS: NavSection[] = [
  {
    title: 'CORE',
    items: [
      { id: 'dashboard', label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard }
    ]
  },
  {
    title: 'LIVESTOCK',
    items: [
      { id: 'goats', label: 'Goats Registry', route: '/goats', icon: ShieldAlert },
      { id: 'weight', label: 'Weight & ADG', route: '/weight', icon: Scale },
      { id: 'health', label: 'Health & Vaccines', route: '/health', icon: Activity, badgeKey: 'overdueVaccines', badgeVariant: 'danger' },
      { id: 'ai-health', label: 'AI Health Center', route: '/ai-health', icon: Sparkles, isHighlight: true },
      { id: 'pens', label: 'Pen Management', route: '/pens', icon: Grid }
    ]
  },
  {
    title: 'COMMERCE',
    items: [
      { id: 'pos', label: 'Goat POS Terminal', route: '/pos', icon: ShoppingBag, isHighlight: true },
      { id: 'sales', label: 'Sales & Invoices', route: '/sales', icon: Receipt },
      { id: 'customers', label: 'Customers & Credit', route: '/customers', icon: Users }
    ]
  },
  {
    title: 'OPERATIONS',
    items: [
      { id: 'inventory', label: 'Feed & Inventory', route: '/inventory', icon: Wheat, badgeKey: 'lowStock', badgeVariant: 'warning' },
      { id: 'tasks', label: 'Farm Tasks', route: '/tasks', icon: CheckSquare, badgeKey: 'pendingTasks', badgeVariant: 'danger' }
    ]
  },
  {
    title: 'FINANCE & AUDIT',
    items: [
      { id: 'finance', label: 'True Cost & P&L', route: '/finance', icon: BadgeIndianRupee },
      { id: 'expenses', label: 'Farm Expenses', route: '/expenses', icon: FileSpreadsheet },
      { id: 'audit', label: 'Activity & Audit Log', route: '/audit', icon: History }
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { id: 'settings', label: 'Farm & Settings', route: '/settings', icon: Settings }
    ]
  }
];

/**
 * Filter sections and items strictly based on role permissions
 */
export function getNavSectionsForRole(role: UserRole): NavSection[] {
  const allowed = ROLE_PERMISSIONS[role]?.allowedNavTabs || ['dashboard'];
  return ALL_NAV_SECTIONS
    .map(section => ({
      ...section,
      items: section.items.filter(item => allowed.includes(item.id))
    }))
    .filter(section => section.items.length > 0);
}

/**
 * Tab definitions for Mobile Bottom Navigation based on role
 */
export function getMobileBottomNavItems(role: UserRole): { id: string; label: string; route: string; icon: any; isPos?: boolean }[] {
  const allowed = ROLE_PERMISSIONS[role]?.allowedNavTabs || ['dashboard'];
  
  if (role === 'CASHIER') {
    return [
      { id: 'dashboard', label: 'Home', route: '/dashboard', icon: LayoutDashboard },
      { id: 'pos', label: 'POS Terminal', route: '/pos', icon: ShoppingBag, isPos: true },
      { id: 'sales', label: 'Sales', route: '/sales', icon: Receipt },
      { id: 'customers', label: 'Customers', route: '/customers', icon: Users }
    ];
  }

  if (role === 'WORKER') {
    return [
      { id: 'dashboard', label: 'Home', route: '/dashboard', icon: LayoutDashboard },
      { id: 'goats', label: 'Goats', route: '/goats', icon: ShieldAlert },
      { id: 'weight', label: 'Weight', route: '/weight', icon: Scale },
      { id: 'tasks', label: 'Tasks', route: '/tasks', icon: CheckSquare }
    ];
  }

  if (role === 'VETERINARIAN') {
    return [
      { id: 'dashboard', label: 'Home', route: '/dashboard', icon: LayoutDashboard },
      { id: 'goats', label: 'Goats', route: '/goats', icon: ShieldAlert },
      { id: 'health', label: 'Health', route: '/health', icon: Activity },
      { id: 'ai-health', label: 'AI Health', route: '/ai-health', icon: Sparkles }
    ];
  }

  // Owner / Admin / Farm Manager
  const defaultItems = [
    { id: 'dashboard', label: 'Home', route: '/dashboard', icon: LayoutDashboard },
    { id: 'goats', label: 'Goats', route: '/goats', icon: ShieldAlert },
    { id: 'pos', label: 'POS', route: '/pos', icon: ShoppingBag, isPos: true },
    { id: 'tasks', label: 'Tasks', route: '/tasks', icon: CheckSquare }
  ];

  return defaultItems.filter(item => allowed.includes(item.id));
}
