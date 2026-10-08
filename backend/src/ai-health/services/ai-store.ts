import {
  CameraFeed,
  CameraEvent,
  AiObservation,
  HealthRiskScore,
  HealthAlert,
  VetReview,
  EnvironmentReading,
  AiModelMetric
} from '../types';

class AiDataStore {
  public cameras: CameraFeed[] = [
    {
      id: 'cam-pen-alpha',
      name: 'Cam 01 — Pen Alpha (Fattening Bucks)',
      penId: 'pen-1',
      penName: 'Pen Alpha (Fattening Bucks)',
      rtspUrl: 'rtsp://192.168.1.110:554/live/ch0',
      gatewayIp: '192.168.1.110',
      fpsSampleRate: 5,
      resolution: '1080p',
      status: 'ONLINE',
      detectionEnabled: true,
      lastPing: new Date().toISOString(),
      currentTrackedGoats: 8
    },
    {
      id: 'cam-pen-beta',
      name: 'Cam 02 — Pen Beta (Kanni Does)',
      penId: 'pen-2',
      penName: 'Pen Beta (Kanni Breeding Does)',
      rtspUrl: 'rtsp://192.168.1.111:554/live/ch0',
      gatewayIp: '192.168.1.111',
      fpsSampleRate: 5,
      resolution: '1080p',
      status: 'ONLINE',
      detectionEnabled: true,
      lastPing: new Date().toISOString(),
      currentTrackedGoats: 6
    },
    {
      id: 'cam-pen-gamma',
      name: 'Cam 03 — Pen Gamma (Grower Weaners)',
      penId: 'pen-3',
      penName: 'Pen Gamma (Grower Weaners)',
      rtspUrl: 'rtsp://192.168.1.112:554/live/ch0',
      gatewayIp: '192.168.1.112',
      fpsSampleRate: 5,
      resolution: '1080p',
      status: 'ONLINE',
      detectionEnabled: true,
      lastPing: new Date().toISOString(),
      currentTrackedGoats: 9
    },
    {
      id: 'cam-pen-delta',
      name: 'Cam 04 — Pen Delta (Quarantine & Recovery)',
      penId: 'pen-4',
      penName: 'Pen Delta (Quarantine & Hospital)',
      rtspUrl: 'rtsp://192.168.1.113:554/live/ch0',
      gatewayIp: '192.168.1.113',
      fpsSampleRate: 10,
      resolution: '1080p',
      status: 'ONLINE',
      detectionEnabled: true,
      lastPing: new Date().toISOString(),
      currentTrackedGoats: 2
    }
  ];

  public cameraEvents: CameraEvent[] = [
    {
      id: 'evt-1',
      cameraId: 'cam-pen-delta',
      penId: 'pen-4',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      eventType: 'POSTURE_ALERT',
      goatId: 'goat-7',
      tagNumber: 'G-00253',
      identificationConfidence: 0.94,
      isUnknownGoat: false,
      snapshotUrl: '/snapshots/g253_posture.jpg',
      boundingBox: { x: 120, y: 80, width: 240, height: 310 }
    },
    {
      id: 'evt-2',
      cameraId: 'cam-pen-alpha',
      penId: 'pen-1',
      timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      eventType: 'FEEDING',
      goatId: 'goat-1',
      tagNumber: 'G-00247',
      identificationConfidence: 0.98,
      isUnknownGoat: false,
      snapshotUrl: '/snapshots/g247_feed.jpg',
      boundingBox: { x: 300, y: 140, width: 210, height: 260 }
    }
  ];

  public aiObservations: AiObservation[] = [
    {
      id: 'obs-1',
      goatId: 'goat-7',
      tagNumber: 'G-00253',
      penId: 'pen-4',
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      detectionMethod: 'RESPIRATORY',
      findingSummary: 'Increased respiratory rate and shallow breathing effort noted over 18 min observation window.',
      severity: 'HIGH',
      confidence: 0.88,
      modelVersion: 'v3.2.0-resp-eff',
      topContributingFactors: ['Respiratory frequency 42 bpm vs baseline 24 bpm', 'Head-down posture', 'Abdominal effort'],
      safetyDisclaimer: 'Possible abnormality detected. Veterinary examination recommended.'
    },
    {
      id: 'obs-2',
      goatId: 'goat-7',
      tagNumber: 'G-00253',
      penId: 'pen-4',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      detectionMethod: 'BEHAVIOR',
      findingSummary: 'Prolonged sternal lying and reduced social interaction in quarantine isolation area.',
      severity: 'MEDIUM',
      confidence: 0.91,
      modelVersion: 'v2.8.4-pose-trk',
      topContributingFactors: ['Lying duration 78% of 2-hr window vs normal 42%', 'Isolated from pen companion'],
      safetyDisclaimer: 'Possible abnormality detected. Veterinary examination recommended.'
    },
    {
      id: 'obs-3',
      goatId: 'goat-5',
      tagNumber: 'G-00251',
      penId: 'pen-1',
      timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      detectionMethod: 'GAIT',
      findingSummary: 'Mild stride asymmetry on left hind limb during trough approach movement.',
      severity: 'LOW',
      confidence: 0.79,
      modelVersion: 'v4.1.0-lameness-kinematics',
      topContributingFactors: ['Reduced stance duration on LH leg (34% vs 50% normal)', 'Slight head nod'],
      safetyDisclaimer: 'Possible abnormality detected. Veterinary examination recommended.'
    },
    {
      id: 'obs-4',
      goatId: 'goat-1',
      tagNumber: 'G-00247',
      penId: 'pen-1',
      timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      detectionMethod: 'FECES',
      findingSummary: 'Discrete pellet morphology consistent with normal rumen digestion.',
      severity: 'INFO',
      confidence: 0.96,
      modelVersion: 'v2.1.0-feces-seg',
      topContributingFactors: ['Firmness: Normal pellets', 'Color: Dark uniform olive', 'Zero mucus detected'],
      safetyDisclaimer: 'Possible abnormality detected. Veterinary examination recommended.'
    }
  ];

  public healthRiskScores: HealthRiskScore[] = [
    {
      id: 'risk-1',
      goatId: 'goat-7',
      tagNumber: 'G-00253',
      calculatedAt: new Date().toISOString(),
      riskLevel: 'HIGH',
      compositeScore: 78.5,
      subscores: {
        behavior: 82.0,
        growth: 65.0,
        appearance: 74.0,
        feces: 50.0,
        environment: 25.0
      },
      topContributingObservations: [
        'Respiratory effort elevated (42 bpm vs 24 bpm baseline)',
        'Inactivity + sternal recumbency',
        'Daily feed intake dropped by 35% compared to 14-day normal'
      ],
      baselineWindow: '14_DAY',
      recommendedAction: 'Dr. Ramanathan clinical review scheduled for antibiotic day 3 protocol.',
      vetReviewStatus: 'CONFIRMED'
    },
    {
      id: 'risk-2',
      goatId: 'goat-5',
      tagNumber: 'G-00251',
      calculatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      riskLevel: 'MEDIUM',
      compositeScore: 42.0,
      subscores: {
        behavior: 40.0,
        growth: 20.0,
        appearance: 35.0,
        feces: 15.0,
        environment: 20.0
      },
      topContributingObservations: [
        'Left hind limb stride shortening detected by gait kinematics',
        'Slightly reduced speed during morning feed release'
      ],
      baselineWindow: '14_DAY',
      recommendedAction: 'Inspect hoof for stone trapping or interdigital dermatitis during evening check.',
      vetReviewStatus: 'PENDING'
    },
    {
      id: 'risk-3',
      goatId: 'goat-1',
      tagNumber: 'G-00247',
      calculatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      riskLevel: 'LOW',
      compositeScore: 12.0,
      subscores: {
        behavior: 10.0,
        growth: 8.0,
        appearance: 12.0,
        feces: 10.0,
        environment: 20.0
      },
      topContributingObservations: ['All biological indices within 7-day personal baseline (ADG +166g/d)'],
      baselineWindow: '14_DAY',
      recommendedAction: 'Continue standard fattening ration in Pen Alpha.',
      vetReviewStatus: 'CONFIRMED'
    }
  ];

  public healthAlerts: HealthAlert[] = [
    {
      id: 'alt-1',
      goatId: 'goat-7',
      tagNumber: 'G-00253',
      penId: 'pen-4',
      severity: 'HIGH',
      title: 'Elevated Respiratory Rate & Sternal Lying',
      description: 'Vision AI flagged shallow respiratory frequency and prolonged recumbency in Pen Delta.',
      contributingModules: ['RESPIRATORY', 'BEHAVIOR', 'FEEDING_DRINKING'],
      status: 'ACTIVE',
      deduplicationKey: 'g253-respiratory-20261004',
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
    },
    {
      id: 'alt-2',
      goatId: 'goat-5',
      tagNumber: 'G-00251',
      penId: 'pen-1',
      severity: 'MEDIUM',
      title: 'Possible Left Hind Gait Asymmetry',
      description: 'Kinematic tracker observed asymmetric stance duration on left rear limb.',
      contributingModules: ['GAIT', 'POSTURE'],
      status: 'ACTIVE',
      deduplicationKey: 'g251-gait-20261004',
      createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
    }
  ];

  public environmentReadings: EnvironmentReading[] = [
    {
      id: 'env-1',
      penId: 'pen-1',
      penName: 'Pen Alpha (Fattening Bucks)',
      timestamp: new Date().toISOString(),
      temperatureCelsius: 28.4,
      relativeHumidityPct: 62.0,
      ammoniaPpm: 8.2,
      co2Ppm: 460,
      airQualityIndex: 42,
      waterTroughLiters: 92.0,
      feedTroughKg: 34.5,
      heatStressIndex: 'COMFORT'
    },
    {
      id: 'env-2',
      penId: 'pen-2',
      penName: 'Pen Beta (Kanni Does)',
      timestamp: new Date().toISOString(),
      temperatureCelsius: 28.6,
      relativeHumidityPct: 64.0,
      ammoniaPpm: 9.1,
      co2Ppm: 480,
      airQualityIndex: 45,
      waterTroughLiters: 78.0,
      feedTroughKg: 28.0,
      heatStressIndex: 'COMFORT'
    },
    {
      id: 'env-3',
      penId: 'pen-3',
      penName: 'Pen Gamma (Weaners)',
      timestamp: new Date().toISOString(),
      temperatureCelsius: 29.1,
      relativeHumidityPct: 66.0,
      ammoniaPpm: 11.5,
      co2Ppm: 520,
      airQualityIndex: 52,
      waterTroughLiters: 65.0,
      feedTroughKg: 22.0,
      heatStressIndex: 'MILD_ALERT'
    },
    {
      id: 'env-4',
      penId: 'pen-4',
      penName: 'Pen Delta (Quarantine)',
      timestamp: new Date().toISOString(),
      temperatureCelsius: 27.8,
      relativeHumidityPct: 58.0,
      ammoniaPpm: 5.4,
      co2Ppm: 420,
      airQualityIndex: 35,
      waterTroughLiters: 48.0,
      feedTroughKg: 15.0,
      heatStressIndex: 'COMFORT'
    }
  ];

  public vetReviews: VetReview[] = [
    {
      id: 'vr-1',
      alertId: 'alt-1',
      goatId: 'goat-7',
      tagNumber: 'G-00253',
      vetName: 'Dr. S. Ramanathan BVSc',
      reviewTimestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      reviewStatus: 'CONFIRMED',
      clinicalObservation: 'Confirmed bilateral bronchial rales upon stethoscope auscultation. Temperature 103.8°F.',
      formalDiagnosis: 'Early Enzootic Bronchopneumonia (Pasteurella suspect)',
      prescribedTreatment: 'Oxytetracycline LA 200mg/ml, 1ml/10kg IM Day 3 + Meloxicam anti-inflammatory.',
      medicineAdministered: 'Oxytetracycline LA',
      dosage: '3.0 ml IM',
      followupDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString().substring(0, 10),
      treatmentOutcome: 'IMPROVING'
    }
  ];

  public modelMetrics: AiModelMetric[] = [
    {
      modelVersion: 'v4.1.0-lameness-kinematics',
      task: 'Gait & Lameness Pose Estimation',
      precision: 0.924,
      recall: 0.895,
      f1Score: 0.909,
      sensitivity: 0.895,
      specificity: 0.961,
      falsePositivesCount: 12,
      falseNegativesCount: 8,
      lastEvaluated: '2026-09-28',
      status: 'PRODUCTION'
    },
    {
      modelVersion: 'v2.1.0-feces-seg',
      task: 'Feces Visual Category Classifier',
      precision: 0.948,
      recall: 0.932,
      f1Score: 0.940,
      sensitivity: 0.932,
      specificity: 0.978,
      falsePositivesCount: 6,
      falseNegativesCount: 5,
      lastEvaluated: '2026-09-25',
      status: 'PRODUCTION'
    },
    {
      modelVersion: 'v3.2.0-resp-eff',
      task: 'Respiratory Rhythm & Cough Detector',
      precision: 0.887,
      recall: 0.865,
      f1Score: 0.876,
      sensitivity: 0.865,
      specificity: 0.942,
      falsePositivesCount: 15,
      falseNegativesCount: 11,
      lastEvaluated: '2026-10-01',
      status: 'PRODUCTION'
    }
  ];
}

declare global {
  var __aiStore: AiDataStore | undefined;
}

export const aiStore = globalThis.__aiStore || new AiDataStore();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__aiStore = aiStore;
}
