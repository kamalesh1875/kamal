export type DetectionMethod =
  | 'BEHAVIOR'
  | 'FECES'
  | 'GAIT'
  | 'POSTURE'
  | 'EYE'
  | 'NOSE_MOUTH'
  | 'SKIN_HAIR'
  | 'BODY_CONDITION'
  | 'WEIGHT_GROWTH'
  | 'FEEDING_DRINKING'
  | 'RESPIRATORY'
  | 'ENVIRONMENT'
  | 'GROUP_ANOMALY'
  | 'HISTORICAL_RISK';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type FecesVisualCategory =
  | 'NORMAL'
  | 'SOFT'
  | 'WATERY'
  | 'DIARRHEA_LIKE'
  | 'UNUSUAL_APPEARANCE'
  | 'MUCUS_LIKE'
  | 'BLOOD_LIKE'
  | 'UNKNOWN';

export type BehaviorType =
  | 'WALKING'
  | 'STANDING'
  | 'LYING'
  | 'RESTING'
  | 'EATING'
  | 'DRINKING'
  | 'GROOMING'
  | 'SCRATCHING'
  | 'ISOLATION'
  | 'AGGRESSION'
  | 'ABNORMAL_INACTIVITY'
  | 'ABNORMAL_MOVEMENT';

export interface CameraFeed {
  id: string;
  name: string;
  penId: string;
  penName: string;
  rtspUrl: string;
  gatewayIp: string;
  fpsSampleRate: number;
  resolution: string;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  detectionEnabled: boolean;
  lastPing: string;
  currentTrackedGoats: number;
}

export interface CameraEvent {
  id: string;
  cameraId: string;
  penId: string;
  timestamp: string;
  eventType: 'MOTION' | 'DEFECATION' | 'FEEDING' | 'DRINKING' | 'GAIT_TRACK' | 'POSTURE_ALERT' | 'ZONE_ENTRY';
  goatId?: string | null;
  tagNumber?: string | null;
  identificationConfidence: number; // 0.0 to 1.0
  isUnknownGoat: boolean;
  snapshotUrl?: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
}

export interface AiObservation {
  id: string;
  goatId: string;
  tagNumber: string;
  penId: string;
  timestamp: string;
  detectionMethod: DetectionMethod;
  findingSummary: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number; // 0.00 to 1.00
  modelVersion: string;
  topContributingFactors: string[];
  evidenceSnapshotUrl?: string;
  safetyDisclaimer: string;
}

export interface HealthRiskScore {
  id: string;
  goatId: string;
  tagNumber: string;
  calculatedAt: string;
  riskLevel: RiskLevel;
  compositeScore: number; // 0 to 100
  subscores: {
    behavior: number;
    growth: number;
    appearance: number;
    feces: number;
    environment: number;
  };
  topContributingObservations: string[];
  baselineWindow: '7_DAY' | '14_DAY' | '30_DAY';
  recommendedAction: string;
  vetReviewStatus: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'NEEDS_INVESTIGATION';
}

export interface HealthAlert {
  id: string;
  goatId: string;
  tagNumber: string;
  penId: string;
  severity: RiskLevel;
  title: string;
  description: string;
  contributingModules: DetectionMethod[];
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED';
  deduplicationKey: string;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface VetReview {
  id: string;
  alertId?: string;
  goatId: string;
  tagNumber: string;
  vetName: string;
  reviewTimestamp: string;
  reviewStatus: 'CONFIRMED' | 'REJECTED' | 'NEEDS_INVESTIGATION';
  clinicalObservation: string;
  formalDiagnosis?: string;
  prescribedTreatment?: string;
  medicineAdministered?: string;
  dosage?: string;
  followupDate?: string;
  treatmentOutcome?: 'RECOVERED' | 'IMPROVING' | 'UNCHANGED' | 'DETERIORATED' | 'CULLED';
}

export interface EnvironmentReading {
  id: string;
  penId: string;
  penName: string;
  timestamp: string;
  temperatureCelsius: number;
  relativeHumidityPct: number;
  ammoniaPpm: number;
  co2Ppm: number;
  airQualityIndex: number;
  waterTroughLiters: number;
  feedTroughKg: number;
  heatStressIndex: 'COMFORT' | 'MILD_ALERT' | 'MODERATE_STRESS' | 'SEVERE_DANGER';
}

export interface GoatBaseline {
  goatId: string;
  tagNumber: string;
  windowDays: 7 | 14 | 30;
  normalActivityHours: number; // e.g. 7.2 hrs active
  normalFeedIntakeKg: number; // e.g. 1.8 kg
  normalWaterIntakeL: number; // e.g. 4.0 L
  normalRestingPosturePct: number; // e.g. 45%
  normalADG: number; // e.g. 120 g/day
  normalFecesConsistency: FecesVisualCategory;
}

export interface AiModelMetric {
  modelVersion: string;
  task: string;
  precision: number;
  recall: number;
  f1Score: number;
  sensitivity: number;
  specificity: number;
  falsePositivesCount: number;
  falseNegativesCount: number;
  lastEvaluated: string;
  status: 'PRODUCTION' | 'STAGING' | 'ARCHIVED';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  groundingSources?: {
    type: 'DATABASE' | 'VETERINARY_LITERATURE';
    reference: string;
  }[];
}
