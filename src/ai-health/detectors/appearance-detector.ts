import { DetectionMethod, AiObservation } from '../types';
import { aiStore } from '../services/ai-store';

export interface AppearanceAnomalyInput {
  goatId: string;
  tagNumber: string;
  penId: string;
  targetRegion: 'EYE' | 'NOSE_MOUTH' | 'SKIN_HAIR' | 'BODY_CONDITION';
  symptomType: string;
  severityScore: 'MILD' | 'MODERATE' | 'SEVERE';
  confidence: number;
  estimatedBCS?: number; // 1.0 to 5.0
  imageCropUrl?: string;
}

export class AppearanceDetector {
  /**
   * Visual inspection for ocular, nasal, dermatological anomalies, and body condition scoring
   */
  public static inspectAppearance(input: AppearanceAnomalyInput): AiObservation {
    const { goatId, tagNumber, penId, targetRegion, symptomType, severityScore, confidence, estimatedBCS, imageCropUrl } = input;

    let severity: AiObservation['severity'] = 'LOW';
    let summary = '';
    const factors: string[] = [`Region: ${targetRegion}`, `Visual finding: ${symptomType}`, `Severity: ${severityScore}`];

    if (targetRegion === 'EYE') {
      severity = severityScore === 'SEVERE' ? 'HIGH' : severityScore === 'MODERATE' ? 'MEDIUM' : 'LOW';
      summary = `Ocular abnormality detected in ${tagNumber}: ${symptomType}.`;
      factors.push('Inspect for infectious keratoconjunctivitis (pink eye) or dust irritation');
    } else if (targetRegion === 'NOSE_MOUTH') {
      severity = severityScore === 'SEVERE' ? 'CRITICAL' : 'HIGH';
      summary = `Oronasal discharge observed in ${tagNumber}: ${symptomType}.`;
      factors.push('Possible Contagious Ecthyma (Orf) or respiratory tract infection');
    } else if (targetRegion === 'SKIN_HAIR') {
      severity = severityScore === 'SEVERE' ? 'MEDIUM' : 'LOW';
      summary = `Dermatological lesion or hair loss noted on ${tagNumber}: ${symptomType}.`;
      factors.push('Check for external parasites (mites/lice) or fungal ringworm');
    } else if (targetRegion === 'BODY_CONDITION') {
      const bcs = estimatedBCS || 3.0;
      severity = bcs < 2.0 ? 'HIGH' : bcs < 2.5 ? 'MEDIUM' : 'INFO';
      summary = `Body Condition Score estimated at BCS ${bcs.toFixed(1)}/5 for ${tagNumber}.`;
      factors.push(bcs < 2.5 ? 'Under-conditioned animal — Rations adjustment needed' : 'Optimal flesh coverage');
    }

    const methodMap: Record<string, DetectionMethod> = {
      EYE: 'EYE',
      NOSE_MOUTH: 'NOSE_MOUTH',
      SKIN_HAIR: 'SKIN_HAIR',
      BODY_CONDITION: 'BODY_CONDITION'
    };

    const observation: AiObservation = {
      id: `obs-app-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      goatId,
      tagNumber,
      penId,
      timestamp: new Date().toISOString(),
      detectionMethod: methodMap[targetRegion] || 'BODY_CONDITION',
      findingSummary: summary,
      severity,
      confidence,
      modelVersion: 'v3.5.0-appearance-multi',
      topContributingFactors: factors,
      evidenceSnapshotUrl: imageCropUrl,
      safetyDisclaimer: 'Possible abnormality detected. Veterinary examination recommended.'
    };

    aiStore.aiObservations.unshift(observation);
    return observation;
  }
}
