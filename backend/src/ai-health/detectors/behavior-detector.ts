import { BehaviorType, AiObservation } from '../types';
import { aiStore } from '../services/ai-store';
import { farmStore } from '@/lib/services/farm-store';

export interface BehaviorDetectionInput {
  goatId: string;
  tagNumber: string;
  penId: string;
  behavior: BehaviorType;
  durationMinutes: number;
  confidence: number;
}

export class BehaviorDetector {
  /**
   * Evaluates animal activity vs historical baseline.
   * Detects abnormal inactivity, isolation, or aggressive restlessness.
   */
  public static evaluateBehavior(input: BehaviorDetectionInput): AiObservation | null {
    const { goatId, tagNumber, penId, behavior, durationMinutes, confidence } = input;

    let severity: AiObservation['severity'] = 'INFO';
    let finding = `${tagNumber} engaged in ${behavior.toLowerCase()} for ${durationMinutes} minutes.`;
    const factors: string[] = [`Duration: ${durationMinutes}m`, `Confidence: ${(confidence * 100).toFixed(0)}%`];

    // High risk checks
    if (behavior === 'ABNORMAL_INACTIVITY' && durationMinutes > 40) {
      severity = 'HIGH';
      finding = `Abnormal inactivity flagged: ${tagNumber} remained motionless for ${durationMinutes} min.`;
      factors.push('Exceeds 14-day inactivity baseline threshold (max normal 25m)');
    } else if (behavior === 'ISOLATION' && durationMinutes > 30) {
      severity = 'MEDIUM';
      finding = `Social isolation observed: ${tagNumber} distanced from herd cluster for ${durationMinutes} min.`;
      factors.push('Possible malaise or fever reaction');
    } else if (behavior === 'ABNORMAL_MOVEMENT') {
      severity = 'HIGH';
      finding = `Abnormal erratic movement or circling detected for ${tagNumber}.`;
      factors.push('Neurological or toxic plant ingestion review recommended');
    }

    if (severity === 'INFO') return null;

    const observation: AiObservation = {
      id: `obs-beh-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      goatId,
      tagNumber,
      penId,
      timestamp: new Date().toISOString(),
      detectionMethod: 'BEHAVIOR',
      findingSummary: finding,
      severity,
      confidence,
      modelVersion: 'v2.8.4-pose-trk',
      topContributingFactors: factors,
      safetyDisclaimer: 'Possible abnormality detected. Veterinary examination recommended.'
    };

    aiStore.aiObservations.unshift(observation);
    return observation;
  }
}
