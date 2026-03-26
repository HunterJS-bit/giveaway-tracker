import express from 'express';
import cors from 'cors';
import { db } from './db';
import { giveaways, submissions, comments } from './db/schema';
import { eq, desc, asc, ne, and } from 'drizzle-orm';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import rateLimit from 'express-rate-limit';
import pino from 'pino-http';
import { z } from 'zod';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Logging with Pino
const logger = pino({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
});
app.use(logger);

app.use(cors());
app.use(express.json());

// Rate Limiting: 100 requests per 15 minutes for general API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

// Stricter limiter for submissions and comments (anti-spam)
const postLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: { error: 'Post limit reached. Please try again after an hour.' }
});

app.use('/api/', apiLimiter);

// Zod Schemas
const CommentSchema = z.object({
    userName: z.string().min(2).max(50),
    content: z.string().min(1).max(1000),
});

const SubmissionSchema = z.object({
    url: z.string().url(),
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

// Get all giveaways with optional pagination
app.get('/api/giveaways', async (req, res) => {
    try {
        const limitStr = req.query.limit as string;
        const offsetStr = req.query.offset as string;
        const sort = req.query.sort as string;

        let orderClause = [desc(giveaways.isFeatured), asc(giveaways.endDate)];

        if (sort === 'newest') {
            orderClause = [desc(giveaways.isFeatured), desc(giveaways.createdAt)];
        } else if (sort === 'highestValue') {
            orderClause = [desc(giveaways.isFeatured), desc(giveaways.prizeValue)];
        }

        let query = db.select().from(giveaways)
            .$dynamic()
            .orderBy(...orderClause as any);

        if (limitStr) {
            const limit = parseInt(limitStr, 10);
            if (!isNaN(limit)) query = query.limit(limit);
        }
        if (offsetStr) {
            const offset = parseInt(offsetStr, 10);
            if (!isNaN(offset)) query = query.offset(offset);
        }

        const allGiveaways = await query;
        res.json(allGiveaways);
    } catch (error) {
        req.log.error(error, 'Error fetching giveaways');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a single giveaway by ID
app.get('/api/giveaways/:id', async (req, res) => {
    try {
        const { id } = req.params as { id: string };
        const [giveaway] = await db.select().from(giveaways).where(eq(giveaways.id, id));

        if (!giveaway) {
            return res.status(404).json({ error: 'Giveaway not found' });
        }
        res.json(giveaway);
    } catch (error) {
        req.log.error(error, 'Error fetching giveaway');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get similar giveaways related to exactly one giveaway by category
app.get('/api/giveaways/:id/similar', async (req, res) => {
    try {
        const { id } = req.params as { id: string };
        const [giveaway] = await db.select({ category: giveaways.category })
            .from(giveaways)
            .where(eq(giveaways.id, id));

        if (!giveaway) {
            return res.status(404).json({ error: 'Giveaway not found' });
        }

        const similarGiveaways = await db.select()
            .from(giveaways)
            .where(and(
                eq(giveaways.category, giveaway.category),
                ne(giveaways.id, id),
                eq(giveaways.status, 'active')
            ))
            .orderBy(desc(giveaways.createdAt))
            .limit(3);

        res.json(similarGiveaways);
    } catch (error) {
        req.log.error(error, 'Error fetching similar giveaways');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new giveaway (Admin or Internal)
app.post('/api/giveaways', async (req, res) => {
    try {
        const data = req.body;
        const [newGiveaway] = await db.insert(giveaways).values({
            id: uuidv4(),
            title: data.title,
            brand: data.brand,
            brandLogoUrl: data.brandLogoUrl,
            imageUrl: data.imageUrl,
            description: data.description,
            prize: data.prize,
            prizeValue: Number(data.prizeValue),
            currency: data.currency,
            country: data.country,
            category: data.category,
            entryUrl: data.entryUrl,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            isFeatured: data.isFeatured ?? false,
            isVerified: data.isVerified ?? false,
            status: data.status ?? 'active',
            entryCount: data.entryCount ?? 0,
        }).returning();

        res.status(201).json(newGiveaway);
    } catch (error) {
        req.log.error(error, 'Error creating giveaway');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new submission
app.post('/api/submissions', postLimiter, async (req, res) => {
    try {
        const result = SubmissionSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.issues });
        }

        const [newSubmission] = await db.insert(submissions).values({
            id: uuidv4(),
            url: result.data.url,
            status: 'pending',
        }).returning();

        res.status(201).json(newSubmission);
    } catch (error) {
        req.log.error(error, 'Error creating submission');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get comments for a giveaway
app.get('/api/giveaways/:id/comments', async (req, res) => {
    try {
        const { id } = req.params as { id: string };
        const giveawayComments = await db.select()
            .from(comments)
            .where(eq(comments.giveawayId, id))
            .orderBy(desc(comments.createdAt));
        res.json(giveawayComments);
    } catch (error) {
        req.log.error(error, 'Error fetching comments');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Post a comment to a giveaway
app.post('/api/giveaways/:id/comments', postLimiter, async (req, res) => {
    try {
        const { id } = req.params as { id: string };
        const result = CommentSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ error: result.error.issues });
        }

        const [newComment] = await db.insert(comments).values({
            id: uuidv4(),
            giveawayId: id,
            userName: result.data.userName,
            content: result.data.content,
        }).returning();

        res.status(201).json(newComment);
    } catch (error) {
        req.log.error(error, 'Error posting comment');
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
