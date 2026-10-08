import { Router, Request, Response } from 'express';
import { farmStore } from '@/lib/services/farm-store';
import { authorizeApiRequest } from '@/lib/auth';

const router = Router();

// GET /api/finance/expenses
router.get('/expenses', (req: Request, res: Response) => {
  try {
    const auth = authorizeApiRequest(req, 'canViewFinance');
    if (!auth.authorized) {
      return res.status(auth.status).json({ error: auth.error });
    }

    return res.json({ expenses: farmStore.expenses });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch expenses' });
  }
});

// POST /api/finance/expenses
router.post('/expenses', (req: Request, res: Response) => {
  try {
    const auth = authorizeApiRequest(req, 'canViewFinance');
    if (!auth.authorized) {
      return res.status(auth.status).json({ error: auth.error });
    }

    const body = req.body;
    if (!body.amount || !body.category || !body.paidTo) {
      return res.status(400).json({ error: 'amount, category, and paidTo are required fields.' });
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

    return res.status(201).json({ success: true, expense: newExpense });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to record expense' });
  }
});

export default router;
