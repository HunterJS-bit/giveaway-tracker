import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import pino from 'pino-http';
import path from 'path';
import fs from 'fs';
import loggerInstance from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { pool } from './db';

// Route imports
import { healthCheck } from './routes/health';
import authRoutes from './routes/auth';
import categoriesRoutes from './routes/categories';
import giveawaysRoutes from './routes/giveaways';
import submissionsRoutes from './routes/submissions';
import adminRoutes from './routes/admin';
import uploadRoutes from './routes/upload';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Trust proxy when behind reverse proxy (Dokploy, Cloudflare, etc.)
app.set('trust proxy', true);

// Security middleware to block reconnaissance requests
app.use((req, res, next) => {
  const path = req.path;

  // Block common reconnaissance paths
  const blockedPatterns = [
    '/internal/',
    '/.env',
    '/env',
    '/config',
    '/secrets',
    '/latest/meta-data',
    '/actuator',
    '/admin',
    '/wp-admin',
    '/phpmyadmin',
    '/.git',
    '/.svn',
  ];

  const isBlocked = blockedPatterns.some(pattern => path.startsWith(pattern));

  if (isBlocked) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
});

// Security headers with Helmet
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for now as it may break the app
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// HTTP request logging with Pino
const httpLogger = pino({
    logger: loggerInstance,
});
app.use(httpLogger);

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3001').split(',');
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// Body parsing with size limit to prevent abuse
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files for uploads
app.use('/uploads', express.static(uploadsDir));

// Rate Limiting: 100 requests per 15 minutes for general API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

app.use('/api/', apiLimiter);

// Mount routes
app.get('/api/health', healthCheck);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/giveaways', giveawaysRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/', (req, res) => {
    res.status(404).json({ msg: 'GiveAway API v1.1.0' });
});

// Centralized error-handling middleware (must be registered AFTER all routes)
app.use(errorHandler);

// Start server
const server = app.listen(port, () => {
    loggerInstance.info(`Server is running on port ${port}`);
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
    loggerInstance.info(`${signal} received — shutting down gracefully...`);

    // Stop accepting new connections
    server.close(() => {
        loggerInstance.info('HTTP server closed');
    });

    // Drain the database pool
    try {
        await pool.end();
        loggerInstance.info('Database pool drained');
    } catch (err) {
        loggerInstance.error({ err }, 'Error draining database pool');
    }

    process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
