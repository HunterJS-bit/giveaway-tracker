import { Router } from 'express';
import { db } from '../db';
import { giveaways, comments } from '../db/schema';
import { eq, desc, asc, ne, and, sql, count } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { requireAdmin, AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';

const router = Router();

// Stricter limiter for comments (anti-spam)
const postLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: { error: 'Post limit reached. Please try again after an hour.' }
});

const CommentSchema = z.object({
    userName: z.string().min(2).max(50),
    content: z.string().min(1).max(1000),
});

// Get all giveaways with optional pagination and filters
router.get('/', async (req, res) => {
    try {
        const limitStr = req.query.limit as string;
        const offsetStr = req.query.offset as string;
        const sort = req.query.sort as string;
        const categoryFilter = req.query.category as string;
        const search = req.query.search as string;

        let orderClause = [desc(giveaways.isFeatured), asc(giveaways.endDate)];

        if (sort === 'newest') {
            orderClause = [desc(giveaways.isFeatured), desc(giveaways.createdAt)];
        } else if (sort === 'highestValue') {
            orderClause = [desc(giveaways.isFeatured), desc(giveaways.prizeValue)];
        }

        let whereConditions = [];
        if (categoryFilter && categoryFilter !== 'All') {
            whereConditions.push(eq(giveaways.category, categoryFilter));
        }
        if (search) {
            whereConditions.push(sql`(${giveaways.title} ILIKE ${`%${search}%`} OR ${giveaways.brand} ILIKE ${`%${search}%`})`);
        }
        whereConditions.push(eq(giveaways.status, 'active'));

        const combinedWhere = whereConditions.length > 0 ? and(...whereConditions) : undefined;

        const [countResult] = await db.select({ count: count() }).from(giveaways).where(combinedWhere);
        const totalCount = countResult?.count ?? 0;

        let query = db.select().from(giveaways)
            .where(combinedWhere)
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
        res.json({ data: allGiveaways, totalCount });
    } catch (error) {
        req.log?.error(error, 'Error fetching giveaways');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a single giveaway by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params as { id: string };
        const [giveaway] = await db.select().from(giveaways).where(eq(giveaways.id, id));

        if (!giveaway) {
            return res.status(404).json({ error: 'Giveaway not found' });
        }
        res.json(giveaway);
    } catch (error) {
        req.log?.error(error, 'Error fetching giveaway');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get similar giveaways related to exactly one giveaway by category
router.get('/:id/similar', async (req, res) => {
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
        req.log?.error(error, 'Error fetching similar giveaways');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new giveaway (Admin or Internal)
router.post('/', requireAdmin as any, async (req, res) => {
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
        req.log?.error(error, 'Error creating giveaway');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get comments for a giveaway
router.get('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params as { id: string };
        const giveawayComments = await db.select()
            .from(comments)
            .where(eq(comments.giveawayId, id))
            .orderBy(desc(comments.createdAt));
        res.json(giveawayComments);
    } catch (error) {
        req.log?.error(error, 'Error fetching comments');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Post a comment to a giveaway
router.post('/:id/comments', postLimiter, async (req, res) => {
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
        req.log?.error(error, 'Error posting comment');
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
