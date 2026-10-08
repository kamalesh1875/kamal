import { Router, Request, Response } from 'express';
import { farmStore } from '@/lib/services/farm-store';
import { GoatService } from '@/lib/services/goat-service';
import { PosService } from '@/lib/services/pos-service';

const router = Router();

// POST /api/mobile-sync
router.post('/', (req: Request, res: Response) => {
  try {
    const action = req.body;

    if (!action || !action.local_id || !action.entity_type || !action.operation_type) {
      return res.status(400).json({
        error: 'Invalid offline action payload. Missing local_id, entity_type or operation_type.'
      });
    }

    const { local_id, entity_type, operation_type, entity_id, payload, created_at, updated_by } = action;

    let server_id = entity_id;

    switch (entity_type) {
      case 'WEIGHT': {
        const { goatId, weightKg, notes, workerName } = payload;
        const result = GoatService.recordWeight({
          goatId: goatId || entity_id,
          weightKg: Number(weightKg),
          recordedAt: payload.recordedAt || (created_at ? created_at.substring(0, 10) : new Date().toISOString().substring(0, 10)),
          notes: notes || 'Synced from mobile worker offline queue',
          workerName: workerName || updated_by || 'Field Worker'
        });
        server_id = result.weightRecord.id;
        break;
      }

      case 'HEALTH': {
        const { goatId, recordType, title, medicineName, dosage, cost, administeredAt, vetName, notes } = payload;
        const newRecord = {
          id: `h-sync-${Date.now()}`,
          goatId: goatId || entity_id,
          recordType: recordType || 'CHECKUP',
          title: title || 'Mobile Health Observation',
          medicineName,
          dosage,
          cost: Number(cost || 0),
          administeredAt: administeredAt || (created_at ? created_at.substring(0, 10) : new Date().toISOString().substring(0, 10)),
          vetName: vetName || updated_by || 'Worker Observation',
          notes
        };
        farmStore.healthRecords.unshift(newRecord);

        // Update goat's medicine cost
        const targetGoat = farmStore.goats.find(g => g.id === newRecord.goatId);
        if (targetGoat && newRecord.cost > 0) {
          targetGoat.accumulatedMedicineCost += newRecord.cost;
          farmStore.recomputeGoat(targetGoat.id);
        }

        farmStore.logAudit(
          'MOBILE_SYNC_HEALTH',
          `Synced health record for goat ${targetGoat?.tagNumber || newRecord.goatId}: ${newRecord.title}`,
          'HEALTH'
        );
        server_id = newRecord.id;
        break;
      }

      case 'TASK': {
        const task = farmStore.tasks.find(t => t.id === entity_id);
        if (task) {
          task.status = payload.status || (task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED');
          farmStore.logAudit('MOBILE_SYNC_TASK', `Task "${task.title}" updated to ${task.status}`, 'LIVESTOCK');
        }
        break;
      }

      case 'FEED': {
        const { itemId, quantityKg, penId } = payload;
        const item = farmStore.inventory.find(i => i.id === itemId);
        if (item) {
          const qty = Number(quantityKg || 0);
          item.currentStock = Math.max(0, item.currentStock - qty);
          item.totalStockValue = item.currentStock * item.costPerUnit;

          const penGoats = farmStore.goats.filter(g => g.penId === penId && g.status === 'ACTIVE');
          if (penGoats.length > 0) {
            const costPerGoat = Math.round((qty * item.costPerUnit) / penGoats.length);
            penGoats.forEach(g => {
              g.accumulatedFeedCost += costPerGoat;
              farmStore.recomputeGoat(g.id);
            });
          }
          farmStore.logAudit('MOBILE_SYNC_FEED', `Issued ${qty}kg of ${item.name} to ${penId} via mobile sync`, 'INVENTORY');
        }
        break;
      }

      case 'POS_SALE': {
        const sale = PosService.createSale(payload);
        server_id = sale.id;
        farmStore.logAudit('MOBILE_SYNC_SALE', `POS invoice ${sale.invoiceNumber} synced from mobile terminal`, 'POS');
        break;
      }

      case 'GOAT': {
        if (operation_type === 'CREATE') {
          const created = GoatService.registerGoat(payload);
          server_id = created.id;
        } else if (operation_type === 'UPDATE') {
          const target = farmStore.goats.find(g => g.id === entity_id);
          if (target) {
            Object.assign(target, payload);
            farmStore.recomputeGoat(target.id);
            server_id = target.id;
          } else {
            return res.status(404).json({ error: `Goat ${entity_id} not found` });
          }
        }
        break;
      }

      default:
        farmStore.logAudit('MOBILE_SYNC', `Synced offline event: ${entity_type} (${entity_id})`, 'LIVESTOCK');
        break;
    }

    return res.json({
      success: true,
      local_id,
      server_id,
      synced_at: new Date().toISOString()
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Mobile sync processing failed' });
  }
});

export default router;
