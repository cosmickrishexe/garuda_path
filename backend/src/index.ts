import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import fleetRoutes from './routes/fleet.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import optimizeRoutes from './routes/optimize.routes.js';
import incidentRoutes from './routes/incident.routes.js';
import aiRoutes from './routes/ai.routes.js';
import { isSupabaseConnected } from './config/db.js';
import { geminiClient } from './config/gemini.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(cors({
  origin: '*', // Open for hackathon dev environment; restrict in prod
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Garuda Path Mobility Engine',
    supabase_connected: isSupabaseConnected,
    gemini_ai_configured: geminiClient !== null,
    operating_city: 'Mangalore, Karnataka'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/fleet', fleetRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/optimize', optimizeRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/ai', aiRoutes);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: 'The requested API route does not exist'
    }
  });
});

// Centralized Error Handling Middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server exception:', err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred on the server'
    }
  });
});

app.listen(PORT, () => {
  console.log(`
  🦅 ==========================================================
  🦅 GARUDA PATH — SMART MOBILITY LOGISTICS ENGINE ACTIVE
  🦅 Running at: http://localhost:${PORT}
  🦅 Environment: ${process.env.NODE_ENV || 'development'}
  🦅 Supabase Status: ${isSupabaseConnected ? 'Connected (Cloud)' : 'Active Local Store'}
  🦅 Gemini AI: ${geminiClient ? 'Connected' : 'Simulated Fallback'}
  🦅 City Grid: Mangalore (Hampankatta, Panambur, Kadri, Surathkal)
  🦅 ==========================================================
  `);
});

export default app;
