import { FecesVisualCategory, AiObservation } from '../types';
import { aiStore } from '../services/ai-store';

export interface FecesClassificationInput {
  goatId?: string | null;
  tagNumber?: string | null;
  penId: string;
  category: FecesVisualCategory;
  confidence: number;
  imageQualityScore: number; // 0.0 to 1.0 (lighting, focus, resolution)
  cropUrl?: string;
}

export class FecesDetector {
  /**
   * Evaluates defecation events through visual classification pipeline (Section 23)
   */
  public static processFecesEvent(input: FecesClassificationInput): AiObservation | null {
    const { goatId, tagNumber, penId, category, confidence, imageQualityScore, cropUrl } = input;

    // Quality gate: Reject blurred or low-light images
    if (imageQualityScore < 0.60) {
      return null;
    }

    let severity: AiObservation['severity'] = 'INFO';
    const factors: string[] = [
      `Morphology: ${category}`,
      `Classification Confidence: ${(confidence * 100).toFixed(0)}%`,
      `Frame Quality: ${(imageQualityScore * 100).toFixed(0)}%`
    ];

    switch (category) {
      case 'BLOOD_LIKE':
        severity = 'CRITICAL';
        factors.push('Visual crimson discoloration detected — Urgent Coccidiosis / Enterotoxemia investigation');
        break;
      case 'MUCUS_LIKE':
      case 'DIARRHEA_LIKE':
        severity = 'HIGH';
        factors.push('Liquid consistency without pellet form — Dehydration and electrolyte risk');
        break;
      case 'WATERY':
      case 'SOFT':
        severity = 'MEDIUM';
        factors.push('Soft unformed fecal matter — Review concentrate-to-roughage ratio');
        break;
      case 'UNUSUAL_APPEARANCE':
        severity = 'LOW';
        factors.push('Atypical color or shape deviation from standard dark olive pellet');
        break;
      case 'NORMAL':
      default:
        severity = 'INFO';
        break;
    }

    if (severity === 'INFO') return null;

    const targetTag = tagNumber || (goatId ? `Goat (${goatId})` : `Pen ${penId} Unidentified`);
    const observation: AiObservation = {
      id: `obs-fec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      goatId: goatId || 'unknown',
      tagNumber: targetTag,
      penId,
      timestamp: new Date().toISOString(),
      detectionMethod: 'FECES',
      findingSummary: `Abnormal fecal consistency (${category}) identified in ${targetTag}.`,
      severity,
      confidence,
      modelVersion: 'v2.1.0-feces-seg',
      topContributingFactors: factors,
      evidenceSnapshotUrl: cropUrl,
      safetyDisclaimer: 'Possible abnormality detected. Veterinary examination recommended.'
    };

    aiStore.aiObservations.unshift(observation);
    return observation;
  }
}
