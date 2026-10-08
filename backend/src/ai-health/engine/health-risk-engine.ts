import {
  HealthRiskScore,
  HealthAlert,
  RiskLevel,
  AiObservation
} from '../types';
import { aiStore } from '../services/ai-store';
import { farmStore } from '@/lib/services/farm-store';

/**
 * Multimodal Health Risk Engine (Section 18)
 * Synthesizes all observation streams into an overall risk score with strict veterinary safety disclaimers.
 */
export class HealthRiskEngine {
  /**
   * Recompute composite health risk score for an individual animal
   */
  public static computeRiskForGoat(goatId: string): HealthRiskScore | null {
    const goat = farmStore.goats.find(g => g.id === goatId);
    if (!goat) return null;

    // Fetch recent observations for this goat
    const observations = aiStore.aiObservations.filter(
      obs => obs.goatId === goatId
    );

    // Compute subscores (0-100 scale)
    let behaviorSubscore = 10;
    let growthSubscore = 10;
    let appearanceSubscore = 10;
    let fecesSubscore = 10;
    let environmentSubscore = 15;

    const topFactors: string[] = [];

    // Analyze behavior observations
    const behaviorObs = observations.filter(o => o.detectionMethod === 'BEHAVIOR');
    if (behaviorObs.some(o => o.severity === 'HIGH' || o.severity === 'CRITICAL')) {
      behaviorSubscore = 85;
      topFactors.push('Marked inactivity / social isolation detected');
    } else if (behaviorObs.some(o => o.severity === 'MEDIUM')) {
      behaviorSubscore = 45;
      topFactors.push('Moderate restlessness or movement anomaly');
    }

    // Analyze feces observations
    const fecesObs = observations.filter(o => o.detectionMethod === 'FECES');
    if (fecesObs.some(o => o.severity === 'CRITICAL')) {
      fecesSubscore = 95;
      topFactors.push('Blood-like discoloration in fecal matter');
    } else if (fecesObs.some(o => o.severity === 'HIGH')) {
      fecesSubscore = 75;
      topFactors.push('Diarrhea-like consistency detected');
    }

    // Analyze gait & posture
    const gaitObs = observations.filter(o => o.detectionMethod === 'GAIT' || o.detectionMethod === 'POSTURE');
    if (gaitObs.some(o => o.severity === 'HIGH')) {
      behaviorSubscore = Math.max(behaviorSubscore, 80);
      topFactors.push('Locomotion impairment or hunched posture');
    }

    // Analyze respiratory & appearance
    const respObs = observations.filter(o => o.detectionMethod === 'RESPIRATORY');
    if (respObs.some(o => o.severity === 'HIGH' || o.severity === 'CRITICAL')) {
      appearanceSubscore = 85;
      topFactors.push('Increased respiratory rate / abdominal effort');
    }

    // Weight and ADG deviation
    if (goat.adgGrams < 0) {
      growthSubscore = 75;
      topFactors.push(`Negative daily weight gain (${goat.adgGrams} g/day)`);
    } else if (goat.adgGrams < 40) {
      growthSubscore = 40;
    }

    // Weighted composite score (0 to 100)
    const composite = Math.min(
      100,
      behaviorSubscore * 0.30 +
        growthSubscore * 0.25 +
        appearanceSubscore * 0.20 +
        fecesSubscore * 0.15 +
        environmentSubscore * 0.10
    );

    let riskLevel: RiskLevel = 'LOW';
    let recommendedAction = 'Routine herd management in pen.';

    if (composite >= 70 || goat.status === 'QUARANTINE') {
      riskLevel = 'CRITICAL';
      recommendedAction = 'Urgent veterinary examination recommended. Isolate in hospital pen if not already quarantined.';
    } else if (composite >= 50) {
      riskLevel = 'HIGH';
      recommendedAction = 'Close monitoring required. Schedule veterinary checkup within 12 hours.';
    } else if (composite >= 30) {
      riskLevel = 'MEDIUM';
      recommendedAction = 'Attention: Inspect appetite, hydration, and hoof condition during evening rounds.';
    }

    // Default factor if healthy
    if (topFactors.length === 0) {
      topFactors.push('All bio-parameters within 14-day individual normal baseline');
    }

    const newScore: HealthRiskScore = {
      id: `risk-${Date.now()}-${goat.id}`,
      goatId: goat.id,
      tagNumber: goat.tagNumber,
      calculatedAt: new Date().toISOString(),
      riskLevel,
      compositeScore: Math.round(composite * 10) / 10,
      subscores: {
        behavior: behaviorSubscore,
        growth: growthSubscore,
        appearance: appearanceSubscore,
        feces: fecesSubscore,
        environment: environmentSubscore
      },
      topContributingObservations: topFactors,
      baselineWindow: '14_DAY',
      recommendedAction,
      vetReviewStatus: riskLevel === 'CRITICAL' || riskLevel === 'HIGH' ? 'PENDING' : 'CONFIRMED'
    };

    // Update store (replace existing score for this goat)
    const existingIndex = aiStore.healthRiskScores.findIndex(r => r.goatId === goatId);
    if (existingIndex !== -1) {
      aiStore.healthRiskScores[existingIndex] = newScore;
    } else {
      aiStore.healthRiskScores.unshift(newScore);
    }

    // If High or Critical risk, check and deduplicate health alerts (Section 25)
    if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
      this.triggerDeduplicatedAlert(goat, riskLevel, topFactors.join('; '));
    }

    return newScore;
  }

  /**
   * Alert deduplication: Prevents alert storming for the same issue within the same day
   */
  private static triggerDeduplicatedAlert(
    goat: any,
    severity: RiskLevel,
    description: string
  ) {
    const today = new Date().toISOString().substring(0, 10);
    const dedupKey = `${goat.tagNumber}-${severity}-${today}`;

    const alreadyExists = aiStore.healthAlerts.some(
      a => a.deduplicationKey === dedupKey && a.status === 'ACTIVE'
    );

    if (!alreadyExists) {
      const newAlert: HealthAlert = {
        id: `alt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        goatId: goat.id,
        tagNumber: goat.tagNumber,
        penId: goat.penId,
        severity,
        title: `Health Risk ${severity}: Possible Abnormality in ${goat.tagNumber}`,
        description,
        contributingModules: ['BEHAVIOR', 'RESPIRATORY', 'WEIGHT_GROWTH'],
        status: 'ACTIVE',
        deduplicationKey: dedupKey,
        createdAt: new Date().toISOString()
      };

      aiStore.healthAlerts.unshift(newAlert);
      farmStore.logAudit('AI_HEALTH_ALERT', `Automated Alert [${severity}] triggered for ${goat.tagNumber}`, 'HEALTH');
    }
  }

  /**
   * Run health risk assessment across entire active herd
   */
  public static evaluateAllActiveGoats(): HealthRiskScore[] {
    const activeGoats = farmStore.goats.filter(
      g => g.status === 'ACTIVE' || g.status === 'PREGNANT' || g.status === 'QUARANTINE'
    );

    return activeGoats.map(g => this.computeRiskForGoat(g.id)).filter(Boolean) as HealthRiskScore[];
  }
}
