import { CameraFeed, CameraEvent } from '../types';
import { aiStore } from '../services/ai-store';
import { farmStore } from '@/lib/services/farm-store';

export interface FrameSample {
  cameraId: string;
  penId: string;
  timestamp: string;
  frameBuffer?: string; // Base64 or stream reference
}

export interface GoatDetectionResult {
  detectedTag: string | null;
  confidence: number;
  isUnknownGoat: boolean;
  boundingBox: { x: number; y: number; width: number; height: number };
  behavior: string;
}

/**
 * Camera Gateway & Stream Orchestrator
 * Supports RTSP, ONVIF, and IP Camera frame sampling with Re-ID confidence checks.
 */
export class CameraGateway {
  /**
   * List all registered farm shed cameras
   */
  public static getCameras(): CameraFeed[] {
    return aiStore.cameras;
  }

  /**
   * Sample frames periodically from an RTSP stream (e.g. 5 FPS)
   */
  public static sampleFrame(cameraId: string): FrameSample | null {
    const camera = aiStore.cameras.find(c => c.id === cameraId);
    if (!camera || camera.status === 'OFFLINE') return null;

    camera.lastPing = new Date().toISOString();

    return {
      cameraId,
      penId: camera.penId,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Animal Identification with Strict Confidence Thresholds (Section 22)
   * If confidence is below 0.70, flags as UNKNOWN GOAT to avoid corrupting records.
   */
  public static identifyGoat(
    sample: FrameSample,
    rawVisionTag: string,
    rawConfidence: number
  ): GoatDetectionResult {
    const CONFIDENCE_THRESHOLD = 0.70;

    // Search existing herd for tag
    const matchedGoat = farmStore.goats.find(
      g => g.tagNumber.toLowerCase() === rawVisionTag.toLowerCase()
    );

    if (matchedGoat && rawConfidence >= CONFIDENCE_THRESHOLD) {
      return {
        detectedTag: matchedGoat.tagNumber,
        confidence: rawConfidence,
        isUnknownGoat: false,
        boundingBox: { x: 140, y: 90, width: 220, height: 280 },
        behavior: 'STANDING'
      };
    }

    // Uncertain or unrecognized animal
    return {
      detectedTag: null,
      confidence: rawConfidence,
      isUnknownGoat: true,
      boundingBox: { x: 100, y: 100, width: 200, height: 250 },
      behavior: 'UNASSIGNED_MOVEMENT'
    };
  }

  /**
   * Ingest a camera event into the event stream and store
   */
  public static ingestEvent(event: Omit<CameraEvent, 'id' | 'timestamp'>): CameraEvent {
    const newEvent: CameraEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };

    aiStore.cameraEvents.unshift(newEvent);

    // Keep memory stream bounded to last 200 events
    if (aiStore.cameraEvents.length > 200) {
      aiStore.cameraEvents.pop();
    }

    return newEvent;
  }
}
