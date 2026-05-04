// Simple Solar Strive Backend Server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      arkade: 'ready',
      database: 'ready',
      maps: 'ready'
    }
  });
});

// Basic API endpoints
app.get('/api/locations', (req, res) => {
  res.json({
    locations: [
      {
        id: 1,
        businessName: "Coffee Shop",
        latitude: 37.7749,
        longitude: -122.4194,
        surfaceType: "cork_board",
        capacity: 50,
        currentCount: 10,
        availabilityStatus: "available"
      },
      {
        id: 2,
        businessName: "Community Center",
        latitude: 37.7849,
        longitude: -122.4094,
        surfaceType: "wall",
        capacity: 100,
        currentCount: 25,
        availabilityStatus: "available"
      }
    ]
  });
});

app.get('/api/jobs', (req, res) => {
  res.json({
    jobs: [
      {
        id: 1,
        type: "placement",
        locationId: 1,
        paymentAmountSats: 1000,
        status: "open"
      }
    ]
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Solar Strive API server running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⚡ ArkadeOS: Connected to ${process.env.ARKADE_SERVER_URL || 'mutinynet'}`);
  console.log(`✅ Health check: http://localhost:${port}/health`);
});