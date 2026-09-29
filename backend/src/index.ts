import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import pino from 'pino-http';
import path from 'path';
import fs from 'fs';
import loggerInstance from './utils/logger';

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

// HTTP request logging with Pino
const httpLogger = pino({
    logger: loggerInstance,
});
app.use(httpLogger);

const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:3001'];
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
app.use(express.json());

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

app.listen(port, () => {
    loggerInstance.info(`Server is running on port ${port}`);
});
