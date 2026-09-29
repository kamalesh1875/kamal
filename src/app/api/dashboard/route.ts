import { NextRequest, NextResponse } from 'next/server';
import { farmStore } from '@/lib/services/farm-store';
import { LedgerService } from '@/lib/services/ledger-service';

export async function GET() {
  try {
    const { goats, sales, expenses, inventory, tasks } = farmStore;

    // Layer 1: Commercial & Financial
    const completedSales = sales.filter(s => s.status !== 'CANCELLED');
    const totalSalesRevenue = completedSales.reduce((acc, s) => acc + s.totalAmount, 0);
    const totalCashCollected = completedSales.reduce((acc, s) => acc + s.paidAmount, 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

    const activeGoats = goats.filter(
      g => g.status === 'ACTIVE' || g.status === 'PREGNANT' || g.status === 'QUARANTINE'
    );
    const totalBiomassKg = Math.round(activeGoats.reduce((acc, g) => acc + g.currentWeightKg, 0));
    const totalLivestockAssetValue = activeGoats.reduce((acc, g) => acc + g.estimatedMarketValue, 0);
    const totalTrueCostInvested = activeGoats.reduce((acc, g) => acc + g.trueCost, 0);
    const unrealizedMargin = totalLivestockAssetValue - totalTrueCostInvested;

    const totalOutstandingCredit = farmStore.customers.reduce((acc, c) => acc + c.outstandingBalance, 0);

    // Layer 2: Biological Herd KPIs
    const avgWeightKg = activeGoats.length > 0 ? (totalBiomassKg / activeGoats.length).toFixed(1) : '0';
    const avgADG =
      activeGoats.length > 0 ? Math.round(activeGoats.reduce((acc, g) => acc + g.adgGrams, 0) / activeGoats.length) : 0;
    const soldGoatsCount = goats.filter(g => g.status === 'SOLD').length;
    const deadGoatsCount = goats.filter(g => g.status === 'DEAD').length;
    const mortalityRate = goats.length > 0 ? ((deadGoatsCount / goats.length) * 100).toFixed(1) : '0.0';

    // Layer 3: Overdue Alerts & Operations
    const overdueAlerts = LedgerService.getOverdueAlerts();
    const lowStockItems = inventory.filter(i => i.currentStock <= i.minimumStockLevel);

    return NextResponse.json({
      commercial: {
        totalSalesRevenue,
        totalCashCollected,
        totalExpenses,
        totalLivestockAssetValue,
        totalTrueCostInvested,
        unrealizedMargin,
        totalOutstandingCredit
      },
      biological: {
        activeGoatsCount: activeGoats.length,
        soldGoatsCount,
        deadGoatsCount,
        mortalityRate,
        totalBiomassKg,
        avgWeightKg,
        avgADG
      },
      alerts: {
        overdueAlerts,
        lowStockItems,
        pendingTasksCount: tasks.filter(t => t.status === 'PENDING').length
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to load dashboard metrics' }, { status: 500 });
  }
}
