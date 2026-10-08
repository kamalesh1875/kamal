import { AiObservation } from '../types';
import { aiStore } from '../services/ai-store';

export interface KeypointTrackingData {
  head: { y: number; confidence: number };
  spine: { curvatureRatio: number; confidence: number };
  shoulder: { symmetry: number };
  hip: { symmetry: number };
  frontLegs: { strideAsymmetry: number };
  rearLegs: { strideAsymmetry: number };
  durationTrackedSeconds: number;
}

export interface GaitPostureInput {
  goatId: string;
  tagNumber: string;
  penId: string;
  keypoints: KeypointTrackingData;
  isHunched: boolean;
  isHeadDown: boolean;
  isLimping: boolean;
  confidence: number;
}

export class GaitPostureDetector {
  /**
   * Kinematic Pose Estimation Pipeline (Section 24)
   * Tracks head-bobbing, spine curvature (hunched), and limb stride asymmetry over multi-frame sequences.
   */
  public static analyzeKinematics(input: GaitPostureInput): AiObservation | null {
    const { goatId, tagNumber, penId, keypoints, isHunched, isHeadDown, isLimping, confidence } = input;

    let severity: AiObservation['severity'] = 'INFO';
    const factors: string[] = [
      `Tracked Duration: ${keypoints.durationTrackedSeconds}s`,
      `Rear Stride Asymmetry: ${(keypoints.rearLegs.strideAsymmetry * 100).toFixed(0)}%`
    ];

    let summary = '';

    if (isLimping) {
      severity = 'HIGH';
      summary = `Locomotion impairment detected: ${tagNumber} shows limping gait pattern and reduced limb weight bearing.`;
      factors.push('Rear limb stance duration reduced by >30%', 'Uneven stride interval');
    } else if (isHunched && isHeadDown) {
      severity = 'HIGH';
      summary = `Postural distress flagged: ${tagNumber} maintains hunched spine with lowered head carriage.`;
      factors.push('Spine curvature exceeds neutral baseline', 'Common symptom of visceral/abdominal discomfort or acidosis');
    } else if (keypoints.rearLegs.strideAsymmetry > 0.25 || keypoints.frontLegs.strideAsymmetry > 0.25) {
      severity = 'MEDIUM';
      summary = `Mild stride asymmetry detected in ${tagNumber}.`;
      factors.push('Possible early foot rot or interdigital foreign body');
    } else if (isHeadDown) {
      severity = 'LOW';
      summary = `Depressed head posture observed in ${tagNumber}.`;
      factors.push('Head carriage below wither line during resting phase');
    }

    if (severity === 'INFO') return null;

    const observation: AiObservation = {
      id: `obs-gait-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      goatId,
      tagNumber,
      penId,
      timestamp: new Date().toISOString(),
      detectionMethod: isLimping ? 'GAIT' : 'POSTURE',
      findingSummary: summary,
      severity,
      confidence,
      modelVersion: 'v4.1.0-lameness-kinematics',
      topContributingFactors: factors,
      safetyDisclaimer: 'Possible abnormality detected. Veterinary examination recommended.'
    };

    aiStore.aiObservations.unshift(observation);
    return observation;
  }
}
