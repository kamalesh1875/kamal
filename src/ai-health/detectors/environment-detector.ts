import { EnvironmentReading, AiObservation } from '../types';
import { aiStore } from '../services/ai-store';

export class EnvironmentDetector {
  /**
   * Evaluates IoT microclimate readings and water/feed trough sensor levels
   */
  public static evaluateShedEnvironment(reading: EnvironmentReading): AiObservation | null {
    let severity: AiObservation['severity'] = 'INFO';
    const factors: string[] = [
      `Temp: ${reading.temperatureCelsius}°C`,
      `Humidity: ${reading.relativeHumidityPct}%`,
      `Ammonia: ${reading.ammoniaPpm} ppm`,
      `Water Trough: ${reading.waterTroughLiters} L`
    ];

    let summary = '';

    // Ammonia accumulation
    if (reading.ammoniaPpm >= 15.0) {
      severity = 'HIGH';
      summary = `Hazardous ammonia concentration (${reading.ammoniaPpm} ppm) detected in ${reading.penName}.`;
      factors.push('Threshold: >15 ppm causes mucosal and respiratory tract epithelial damage in small ruminants', 'Ventilate shed and replace bedding immediately');
    } else if (reading.ammoniaPpm >= 10.0) {
      severity = 'MEDIUM';
      summary = `Elevated ammonia levels (${reading.ammoniaPpm} ppm) in ${reading.penName}.`;
      factors.push('Exceeds normal comfort threshold (<10 ppm)');
    } else if (reading.temperatureCelsius > 34 && reading.relativeHumidityPct > 70) {
      severity = 'HIGH';
      summary = `Severe heat-stress index in ${reading.penName} (${reading.temperatureCelsius}°C at ${reading.relativeHumidityPct}% RH).`;
      factors.push('Provide electrolyte-enriched cooling water and run shed misting fans');
    } else if (reading.waterTroughLiters < 15.0) {
      severity = 'HIGH';
      summary = `Water trough near depletion in ${reading.penName} (${reading.waterTroughLiters} L remaining).`;
      factors.push('Refill trough to avoid dehydration and rumen impaction');
    }

    if (severity === 'INFO') return null;

    const observation: AiObservation = {
      id: `obs-env-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      goatId: 'pen-aggregate',
      tagNumber: reading.penName,
      penId: reading.penId,
      timestamp: new Date().toISOString(),
      detectionMethod: 'ENVIRONMENT',
      findingSummary: summary,
      severity,
      confidence: 0.98,
      modelVersion: 'v1.2.0-iot-telemetry',
      topContributingFactors: factors,
      safetyDisclaimer: 'Possible abnormality detected. Veterinary examination recommended.'
    };

    aiStore.aiObservations.unshift(observation);
    return observation;
  }
}
