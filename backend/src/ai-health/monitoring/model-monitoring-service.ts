import { AiModelMetric } from '../types';
import { aiStore } from '../services/ai-store';

export interface TrainingSampleRecord {
  id: string;
  goatId: string;
  tagNumber: string;
  task: string;
  imageUrl?: string;
  predictedLabel: string;
  vetVerifiedLabel: string;
  wasAiCorrect: boolean;
  datasetSplit: 'TRAIN' | 'VAL' | 'TEST';
  createdAt: string;
}

export class ModelMonitoringService {
  private static trainingSamples: TrainingSampleRecord[] = [
    {
      id: 'samp-1',
      goatId: 'goat-7',
      tagNumber: 'G-00253',
      task: 'Respiratory Anomaly Detection',
      predictedLabel: 'INCREASED_EFFORT_PASTEURELLOSIS',
      vetVerifiedLabel: 'CONFIRMED_BRONCHOPNEUMONIA',
      wasAiCorrect: true,
      datasetSplit: 'TRAIN',
      createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
    },
    {
      id: 'samp-2',
      goatId: 'goat-1',
      tagNumber: 'G-00247',
      task: 'Feces Visual Category Classifier',
      predictedLabel: 'NORMAL_PELLETS',
      vetVerifiedLabel: 'NORMAL_PELLETS',
      wasAiCorrect: true,
      datasetSplit: 'VAL',
      createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
    }
  ];

  public static getMetrics(): AiModelMetric[] {
    return aiStore.modelMetrics;
  }

  /**
   * Log human/vet feedback to form continuous learning feedback loop (Section 47)
   */
  public static logFeedback(
    goatId: string,
    tagNumber: string,
    task: string,
    predictedLabel: string,
    vetVerifiedLabel: string,
    wasAiCorrect: boolean
  ): TrainingSampleRecord {
    const sample: TrainingSampleRecord = {
      id: `ts-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      goatId,
      tagNumber,
      task,
      predictedLabel,
      vetVerifiedLabel,
      wasAiCorrect,
      datasetSplit: Math.random() > 0.2 ? 'TRAIN' : 'VAL',
      createdAt: new Date().toISOString()
    };

    this.trainingSamples.unshift(sample);

    // Update model metric counts
    const model = aiStore.modelMetrics.find(m => m.task.toLowerCase().includes(task.toLowerCase()));
    if (model) {
      if (wasAiCorrect) {
        // Increment true positive
      } else {
        model.falsePositivesCount += 1;
      }
      model.lastEvaluated = new Date().toISOString().substring(0, 10);
    }

    return sample;
  }

  public static getTrainingSamples(): TrainingSampleRecord[] {
    return this.trainingSamples;
  }
}
