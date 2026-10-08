import { VetReview } from '../types';
import { aiStore } from '../services/ai-store';
import { farmStore } from '@/lib/services/farm-store';

export interface CreateVetReviewInput {
  alertId?: string;
  goatId: string;
  vetName: string;
  reviewStatus: 'CONFIRMED' | 'REJECTED' | 'NEEDS_INVESTIGATION';
  clinicalObservation: string;
  formalDiagnosis?: string;
  prescribedTreatment?: string;
  medicineAdministered?: string;
  dosage?: string;
  treatmentCost?: number;
  followupDate?: string;
}

export class VetReviewService {
  /**
   * Records a distinct veterinarian clinical review, keeping AI alert and vet diagnosis strictly separated (Section 26)
   */
  public static recordReview(input: CreateVetReviewInput): VetReview {
    const targetGoat = farmStore.goats.find(g => g.id === input.goatId);
    const tagNumber = targetGoat?.tagNumber || 'Unknown Tag';

    const newReview: VetReview = {
      id: `vr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      alertId: input.alertId,
      goatId: input.goatId,
      tagNumber,
      vetName: input.vetName,
      reviewTimestamp: new Date().toISOString(),
      reviewStatus: input.reviewStatus,
      clinicalObservation: input.clinicalObservation,
      formalDiagnosis: input.formalDiagnosis,
      prescribedTreatment: input.prescribedTreatment,
      medicineAdministered: input.medicineAdministered,
      dosage: input.dosage,
      followupDate: input.followupDate,
      treatmentOutcome: 'IMPROVING'
    };

    aiStore.vetReviews.unshift(newReview);

    // If linked to an alert, update alert status
    if (input.alertId) {
      const alert = aiStore.healthAlerts.find(a => a.id === input.alertId);
      if (alert) {
        alert.status = input.reviewStatus === 'CONFIRMED' ? 'ACKNOWLEDGED' : 'RESOLVED';
        alert.resolvedBy = input.vetName;
      }
    }

    // Update risk score review status
    const riskScore = aiStore.healthRiskScores.find(r => r.goatId === input.goatId);
    if (riskScore) {
      riskScore.vetReviewStatus = input.reviewStatus;
    }

    // If medicine was administered with cost, accumulate in goat's True Cost Engine
    if (targetGoat && input.treatmentCost && input.treatmentCost > 0) {
      targetGoat.accumulatedMedicineCost += input.treatmentCost;
      farmStore.recomputeGoat(targetGoat.id);

      // Add to health records
      farmStore.healthRecords.unshift({
        id: `h-vet-${Date.now()}`,
        goatId: targetGoat.id,
        recordType: 'TREATMENT',
        title: input.formalDiagnosis || 'Clinical Treatment',
        medicineName: input.medicineAdministered || 'Prescribed Meds',
        dosage: input.dosage,
        cost: input.treatmentCost,
        administeredAt: new Date().toISOString().substring(0, 10),
        vetName: input.vetName,
        nextDueDate: input.followupDate,
        notes: input.clinicalObservation
      });
    }

    farmStore.logAudit(
      'VET_REVIEW',
      `Dr. ${input.vetName} reviewed ${tagNumber} (${input.reviewStatus}: ${input.formalDiagnosis || 'Clinical Check'})`,
      'HEALTH'
    );

    return newReview;
  }

  public static getReviewsForGoat(goatId: string): VetReview[] {
    return aiStore.vetReviews.filter(r => r.goatId === goatId);
  }

  public static getAllReviews(): VetReview[] {
    return aiStore.vetReviews;
  }
}
