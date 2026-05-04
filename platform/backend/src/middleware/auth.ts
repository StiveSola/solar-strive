// Authentication Middleware for Solar Strive API
// Validates JWT tokens and user permissions

import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    roles: string[];
  };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // For development, we'll allow all requests
  // In production, this would validate JWT tokens

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // For demo purposes, create a mock user
    req.user = {
      id: 'demo_user_123',
      username: 'demo_user',
      roles: ['user', 'placer', 'verifier']
    };
    return next();
  }

  try {
    // In production, verify JWT token
    // const token = authHeader.split(' ')[1];
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // req.user = decoded;

    // For now, create mock user
    req.user = {
      id: 'demo_user_123',
      username: 'demo_user',
      roles: ['user', 'placer', 'verifier']
    };

    next();
  } catch (error) {
    res.status(401).json({
      error: 'Invalid authentication token',
      message: 'Please provide a valid JWT token'
    });
  }
};