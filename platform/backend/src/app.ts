// Solar Strive Backend API Server
// Express.js API with ArkadeOS integration for Bitcoin payments

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/auth';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import { authRoutes } from './routes/auth';
import { locationRoutes } from './routes/locations';
import { jobRoutes } from './routes/jobs';
import { paymentRoutes } from './routes/payments';
import { campaignRoutes } from './routes/campaigns';
import { prospectingRoutes } from './routes/prospecting';

// Load environment variables
dotenv.config();

class SolarStriveAPI {
  public app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3001');

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "*.mapbox.com"],
          styleSrc: ["'self'", "'unsafe-inline'", "*.mapbox.com"],
          imgSrc: ["'self'", "data:", "*.mapbox.com"],
          connectSrc: ["'self'", "*.arkade.sh", "*.mutinynet.com", "*.mapbox.com"],
        },
      },
    }));

    // CORS configuration for Solar Strive frontend
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      optionsSuccessStatus: 200
    }));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Rate limiting
    this.app.use(rateLimitMiddleware);

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  private initializeRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        services: {
          arkade: 'connected', // Will implement health checks
          database: 'connected',
          maps: 'connected'
        }
      });
    });

    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/locations', authMiddleware, locationRoutes);
    this.app.use('/api/jobs', authMiddleware, jobRoutes);
    this.app.use('/api/payments', authMiddleware, paymentRoutes);
    this.app.use('/api/campaigns', authMiddleware, campaignRoutes);
    this.app.use('/api/prospecting', authMiddleware, prospectingRoutes);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Endpoint not found',
        path: req.originalUrl,
        method: req.method
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Solar Strive API server running on port ${this.port}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⚡ ArkadeOS URL: ${process.env.ARKADE_SERVER_URL || 'https://mutinynet.arkade.sh'}`);
      console.log(`🗺️  Map Service: ${process.env.MAPBOX_ACCESS_TOKEN ? 'Mapbox' : 'OpenStreetMap'}`);
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}

// Create and start server
const server = new SolarStriveAPI();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully');
  process.exit(0);
});

// Start the server
if (require.main === module) {
  server.start();
}

export default server;