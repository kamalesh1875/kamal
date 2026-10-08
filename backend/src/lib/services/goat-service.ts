import { Goat, WeightRecord, HealthRecord, GoatStatus } from '@/types/farm';
import { farmStore } from './farm-store';

export interface GoatFilterParams {
  query?: string;
  breed?: string;
  gender?: string;
  status?: string;
  penId?: string;
  minWeight?: number;
  maxWeight?: number;
  minAge?: number;
  maxAge?: number;
  sortBy?: 'tagNumber' | 'currentWeightKg' | 'adgGrams' | 'trueCost' | 'estimatedMarketValue' | 'purchaseDate';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class GoatService {
  /**
   * Search and filter goats with multi-attribute combinable filtering
   */
  static listGoats(params: GoatFilterParams = {}) {
    let result = [...farmStore.goats];

    // Filter query: Tag, Breed, RFID, Sire, Dam
    if (params.query?.trim()) {
      const q = params.query.toLowerCase().trim();
      result = result.filter(
        g =>
          g.tagNumber.toLowerCase().includes(q) ||
          g.breed.toLowerCase().includes(q) ||
          (g.rfidTag && g.rfidTag.toLowerCase().includes(q)) ||
          (g.notes && g.notes.toLowerCase().includes(q))
      );
    }

    if (params.breed && params.breed !== 'ALL') {
      result = result.filter(g => g.breed.toLowerCase() === params.breed?.toLowerCase());
    }

    if (params.gender && params.gender !== 'ALL') {
      result = result.filter(g => g.gender === params.gender);
    }

    if (params.status && params.status !== 'ALL') {
      result = result.filter(g => g.status === params.status);
    }

    if (params.penId && params.penId !== 'ALL') {
      result = result.filter(g => g.penId === params.penId);
    }

    if (params.minWeight !== undefined && !isNaN(params.minWeight)) {
      result = result.filter(g => g.currentWeightKg >= params.minWeight!);
    }

    if (params.maxWeight !== undefined && !isNaN(params.maxWeight)) {
      result = result.filter(g => g.currentWeightKg <= params.maxWeight!);
    }

    if (params.minAge !== undefined && !isNaN(params.minAge)) {
      result = result.filter(g => g.ageMonths >= params.minAge!);
    }

    if (params.maxAge !== undefined && !isNaN(params.maxAge)) {
      result = result.filter(g => g.ageMonths <= params.maxAge!);
    }

    // Sorting
    if (params.sortBy) {
      const field = params.sortBy;
      const order = params.sortOrder === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        const valA = (a as any)[field];
        const valB = (b as any)[field];
        if (typeof valA === 'string') {
          return valA.localeCompare(valB) * order;
        }
        return ((valA || 0) - (valB || 0)) * order;
      });
    }

    // Pagination
    const total = result.length;
    const page = Math.max(1, params.page || 1);
    const limit = params.limit || 50;
    const startIndex = (page - 1) * limit;
    const paginated = result.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static getGoatById(id: string): (Goat & {
    weights: WeightRecord[];
    healthRecords: HealthRecord[];
    penName?: string;
  }) | null {
    const goat = farmStore.goats.find(g => g.id === id);
    if (!goat) return null;

    const weights = farmStore.weightRecords
      .filter(w => w.goatId === id)
      .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());

    const health = farmStore.healthRecords
      .filter(h => h.goatId === id)
      .sort((a, b) => new Date(b.administeredAt).getTime() - new Date(a.administeredAt).getTime());

    const pen = farmStore.pens.find(p => p.id === goat.penId);

    return {
      ...goat,
      weights,
      healthRecords: health,
      penName: pen?.name
    };
  }

  /**
   * Register a new goat with initial intake weights and cost foundation
   */
  static registerGoat(data: {
    tagNumber: string;
    rfidTag?: string;
    breed: string;
    gender: 'MALE' | 'FEMALE';
    birthDate?: string;
    ageMonths?: number;
    penId: string;
    status?: GoatStatus;
    currentWeightKg: number;
    targetWeightKg?: number;
    purchasePrice: number;
    purchaseDate?: string;
    marketRatePerKg?: number;
    damTag?: string;
    sireTag?: string;
    notes?: string;
    userName?: string;
  }): Goat {
    // Collision check
    const existing = farmStore.goats.find(g => g.tagNumber.toLowerCase() === data.tagNumber.toLowerCase());
    if (existing) {
      throw new Error(`Goat with Tag Number ${data.tagNumber} is already registered.`);
    }

    const id = `goat-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const purchaseDate = data.purchaseDate || new Date().toISOString().substring(0, 10);
    const weightKg = Number(data.currentWeightKg);
    const rate = Number(data.marketRatePerKg || 460);
    const purchasePrice = Number(data.purchasePrice || 0);

    const newGoat: Goat = {
      id,
      tagNumber: data.tagNumber.trim(),
      rfidTag: data.rfidTag?.trim() || undefined,
      breed: data.breed,
      gender: data.gender,
      birthDate: data.birthDate || '2026-01-01',
      ageMonths: Number(data.ageMonths || 6),
      penId: data.penId,
      status: data.status || 'ACTIVE',
      initialWeightKg: weightKg,
      currentWeightKg: weightKg,
      targetWeightKg: Number(data.targetWeightKg || 35.0),
      adgGrams: 0,
      lastWeighedDate: purchaseDate,
      purchasePrice,
      purchaseDate,
      accumulatedFeedCost: 0,
      accumulatedMedicineCost: 0,
      accumulatedLaborCost: 0,
      accumulatedOverheadCost: 0,
      trueCost: purchasePrice,
      marketRatePerKg: rate,
      estimatedMarketValue: Math.round(weightKg * rate),
      projectedProfit: Math.round(weightKg * rate) - purchasePrice,
      damTag: data.damTag,
      sireTag: data.sireTag,
      notes: data.notes
    };

    farmStore.goats.unshift(newGoat);

    // Record initial weight entry
    const initialWeightRecord: WeightRecord = {
      id: `w-${Date.now()}`,
      goatId: id,
      weightKg,
      recordedAt: purchaseDate,
      adgGrams: 0,
      notes: 'Arrival & initial intake weight verification'
    };
    farmStore.weightRecords.push(initialWeightRecord);

    // Update pen count
    const pen = farmStore.pens.find(p => p.id === data.penId);
    if (pen) {
      pen.currentCount += 1;
    }

    farmStore.logAudit(
      'CREATE_GOAT',
      `Registered ${newGoat.breed} (${newGoat.tagNumber}) at ${weightKg}kg in ${pen?.name || data.penId} for ₹${purchasePrice}`,
      'LIVESTOCK',
      data.userName || 'Admin'
    );

    return newGoat;
  }

  /**
   * Record weight with mathematically accurate ADG calculation
   * ADG = (Current Weight - Previous Weight) / Days * 1000 g/day
   */
  static recordWeight(data: {
    goatId: string;
    weightKg: number;
    recordedAt?: string;
    notes?: string;
    measurementMethod?: string;
    workerName?: string;
  }): { weightRecord: WeightRecord; goat: Goat; warning?: string } {
    const goat = farmStore.goats.find(g => g.id === data.goatId);
    if (!goat) {
      throw new Error(`Goat with ID ${data.goatId} not found.`);
    }

    if (goat.status === 'SOLD') {
      throw new Error(`Cannot record weight for Goat ${goat.tagNumber} because it has already been SOLD.`);
    }
    if (goat.status === 'DECEASED') {
      throw new Error(`Cannot record weight for Goat ${goat.tagNumber} because status is DECEASED.`);
    }

    const recordedAt = data.recordedAt || new Date().toISOString().substring(0, 10);
    const newWeight = Number(data.weightKg);

    // Find previous weight records
    const previousRecords = farmStore.weightRecords
      .filter(w => w.goatId === data.goatId)
      .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());

    const lastRecord = previousRecords[previousRecords.length - 1];

    let adgGrams = 0;
    let warning: string | undefined = undefined;

    if (lastRecord) {
      const msDiff = new Date(recordedAt).getTime() - new Date(lastRecord.recordedAt).getTime();
      const daysDiff = Math.max(1, Math.round(msDiff / (1000 * 60 * 60 * 24)));
      const weightDiffGrams = (newWeight - lastRecord.weightKg) * 1000;

      adgGrams = Math.round(weightDiffGrams / daysDiff);

      // Check for unexpected weight drop
      if (newWeight < lastRecord.weightKg) {
        const dropKg = (lastRecord.weightKg - newWeight).toFixed(1);
        warning = `Observation: Weight decreased by ${dropKg} kg from ${lastRecord.weightKg}kg to ${newWeight}kg over ${daysDiff} days. Check scale calibration, hydration or feed intake. (Note: A weight decrease does not automatically indicate illness; clinical review recommended).`;
      }
    }

    const recordId = `w-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newRecord: WeightRecord = {
      id: recordId,
      goatId: data.goatId,
      weightKg: newWeight,
      recordedAt,
      adgGrams,
      notes: data.notes || (warning ? warning : 'Periodic weight measurement')
    };

    farmStore.weightRecords.push(newRecord);

    // Update goat current weight & valuation
    goat.currentWeightKg = newWeight;
    goat.lastWeighedDate = recordedAt;
    goat.adgGrams = adgGrams;
    farmStore.recomputeGoat(data.goatId);

    farmStore.logAudit(
      'UPDATE_WEIGHT',
      `Scale reading for ${goat.tagNumber}: ${newWeight} kg (ADG: ${adgGrams > 0 ? '+' : ''}${adgGrams} g/day). ${warning ? ' [Weight warning logged]' : ''}`,
      'LIVESTOCK',
      data.workerName || 'Worker'
    );

    return { weightRecord: newRecord, goat, warning };
  }
}
