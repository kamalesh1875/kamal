import { Router, Request, Response } from 'express';
import { aiStore } from '@/ai-health/services/ai-store';
import { AiChatService } from '@/ai-health/services/ai-chat-service';
import { ModelMonitoringService } from '@/ai-health/monitoring/model-monitoring-service';
import { requireAuth } from '@/middleware/auth.middleware';

const router = Router();

// GET /api/ai-health/alerts - Authenticated staff
router.get('/alerts', requireAuth, (req: Request, res: Response) => {
  try {
    const severity = req.query.severity as string | undefined;
    const status = req.query.status as string | undefined;

    let alerts = aiStore.healthAlerts;
    if (severity) {
      alerts = alerts.filter(a => a.severity === severity);
    }
    if (status) {
      alerts = alerts.filter(a => a.status === status);
    }

    return res.json({ alerts });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch health alerts' });
  }
});

// GET /api/ai-health/cameras - Authenticated staff
router.get('/cameras', requireAuth, (_req: Request, res: Response) => {
  try {
    return res.json({ cameras: aiStore.cameras, events: aiStore.cameraEvents.slice(0, 50) });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch camera status' });
  }
});

// POST /api/ai-health/chat - Authenticated staff
router.post('/chat', requireAuth, async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const query = body.query || body.message;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query string is required' });
    }

    const response = await AiChatService.processQuery(query);
    return res.json({ success: true, response });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Chat service failed' });
  }
});

// GET /api/ai-health/environment - Authenticated staff
router.get('/environment', requireAuth, (_req: Request, res: Response) => {
  try {
    return res.json({ readings: aiStore.environmentReadings });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch environment readings' });
  }
});

// GET /api/ai-health/metrics - Authenticated staff
router.get('/metrics', requireAuth, (_req: Request, res: Response) => {
  try {
    return res.json({
      modelMetrics: aiStore.modelMetrics,
      samplesCount: ModelMonitoringService.getTrainingSamples().length
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch AI model metrics' });
  }
});

// GET /api/ai-health/observations - Authenticated staff
router.get('/observations', requireAuth, (req: Request, res: Response) => {
  try {
    const goatId = req.query.goatId as string | undefined;
    const method = req.query.method as string | undefined;

    let obs = aiStore.aiObservations;
    if (goatId) {
      obs = obs.filter(o => o.goatId === goatId);
    }
    if (method) {
      obs = obs.filter(o => o.detectionMethod === method);
    }

    return res.json({ observations: obs });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch AI observations' });
  }
});

// POST /api/ai-health/observations - Authenticated staff
router.post('/observations', requireAuth, (req: Request, res: Response) => {
  try {
    const body = req.body;
    const newObs = {
      ...body,
      id: `obs-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    aiStore.aiObservations.unshift(newObs);
    return res.status(201).json({ success: true, observation: newObs });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to record AI observation' });
  }
});

export default router;
