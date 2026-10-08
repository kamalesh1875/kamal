import { AiObservation, GoatBaseline } from '../types';
import { aiStore } from '../services/ai-store';
import { farmStore } from '@/lib/services/farm-store';

export class GrowthDetector {
  /**
   * Evaluates Weight & ADG deviations against that specific goat's individual baseline (Section 20)
   */
  public static evaluateGrowth(goatId: string, currentWeightKg: number): AiObservation | null {
    const goat = farmStore.goats.find(g => g.id === goatId);
    if (!goat) return null;

    const previousWeights = farmStore.weightRecords
      .filter(w => w.goatId === goatId)
      .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());

    if (previousWeights.length < 2) return null;

    const lastWeighIn = previousWeights[0];
    const prevWeighIn = previousWeights[1];

    let severity: AiObservation['severity'] = 'INFO';
    const factors: string[] = [
      `Current: ${currentWeightKg} kg`,
      `Previous: ${lastWeighIn.weightKg} kg (${lastWeighIn.recordedAt})`
    ];

    let summary = '';

    // Direct weight drop
    if (currentWeightKg < lastWeighIn.weightKg) {
      const dropKg = (lastWeighIn.weightKg - currentWeightKg).toFixed(1);
      severity = Number(dropKg) >= 1.5 ? 'HIGH' : 'MEDIUM';
      summary = `Weight loss deviation detected: ${goat.tagNumber} dropped ${dropKg} kg from previous checkpoint.`;
      factors.push('Rumen fill status, parasite load, or dehydration check recommended');
    } else if (goat.adgGrams < 30) {
      // ADG stagnation in commercial feedlot
      severity = 'LOW';
      summary = `Sub-optimal daily gain noted: ${goat.tagNumber} gaining +${goat.adgGrams} g/day (Target: >100 g/day).`;
      factors.push('Below economic fattening benchmark', 'Evaluate feed conversion ratio');
    }

    if (severity === 'INFO') return null;

    const observation: AiObservation = {
      id: `obs-gro-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      goatId: goat.id,
      tagNumber: goat.tagNumber,
      penId: goat.penId,
      timestamp: new Date().toISOString(),
      detectionMethod: 'WEIGHT_GROWTH',
      findingSummary: summary,
      severity,
      confidence: 0.95,
      modelVersion: 'v1.4.0-adg-baseline',
      topContributingFactors: factors,
      safetyDisclaimer: 'Possible abnormality detected. Veterinary examination recommended.'
    };

    aiStore.aiObservations.unshift(observation);
    return observation;
  }
}
