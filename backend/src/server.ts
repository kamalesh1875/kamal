import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { runMigrations, isDatabaseConnected } from '@/lib/db';

// Route imports
import authRoutes from './routes/auth.routes';
import goatsRoutes from './routes/goats.routes';
import weightsRoutes from './routes/weights.routes';
import posRoutes from './routes/pos.routes';
import paymentsRoutes from './routes/payments.routes';
import customersRoutes from './routes/customers.routes';
import dashboardRoutes from './routes/dashboard.routes';
import financeRoutes from './routes/finance.routes';
import auditRoutes from './routes/audit.routes';
import mobileSyncRoutes from './routes/mobile-sync.routes';
import vetReviewRoutes from './routes/vet-review.routes';
import aiHealthRoutes from './routes/ai-health.routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(s => s.trim())
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // In development, allow localhost variations
      if (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root & Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'MSK Goat Farm Backend API',
    uptime: process.uptime(),
    databaseConnected: isDatabaseConnected(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'MSK Goat Farm Backend API',
    uptime: process.uptime(),
    databaseConnected: isDatabaseConnected(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/goats', goatsRoutes);
app.use('/api/weights', weightsRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/mobile-sync', mobileSyncRoutes);
app.use('/api/vet-review', vetReviewRoutes);
app.use('/api/ai-health', aiHealthRoutes);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Backend Server Error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 [MSK Goat Farm API] Running on port ${PORT}`);
  console.log(`🌐 Health check available at: http://localhost:${PORT}/health`);

  // Run database migrations if PostgreSQL is configured
  try {
    await runMigrations();
  } catch (error: any) {
    console.warn('[DB Migration Warning]', error.message);
  }
});

export default app;
