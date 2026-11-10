import { Router } from 'express';
import { db } from '../db';
import { submissions, giveaways } from '../db/schema';
import { eq, asc } from 'drizzle-orm';
import { requireAdmin } from '../middleware/auth';
import { asyncHandler, ApiError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const router = Router();

// --- Admin Giveaway Creation ---
const CreateGiveawaySchema = z.object({
    title: z.string().min(3).max(200),
    brand: z.string().min(1).max(100),
    brandLogoUrl: z.string().url(),
    imageUrl: z.string().url(),
    description: z.string().min(10).max(2000),
    prize: z.string().min(1).max(200),
    prizeValue: z.number().positive(),
    currency: z.string().default('RSD'),
    country: z.string().default('RS'),
    category: z.string().min(1).max(50),
    entryUrl: z.string().url(),
    startDate: z.string().transform((val) => new Date(val)),
    endDate: z.string().transform((val) => new Date(val)),
    isFeatured: z.boolean().default(false),
    isVerified: z.boolean().default(false),
});

router.post('/giveaways', requireAdmin as any, asyncHandler(async (req, res) => {
    const validated = CreateGiveawaySchema.parse(req.body);
    
    const id = uuidv4();
    const now = new Date();
    
    const [newGiveaway] = await db.insert(giveaways).values({
        id,
        title: validated.title,
        brand: validated.brand,
        brandLogoUrl: validated.brandLogoUrl,
        imageUrl: validated.imageUrl,
        description: validated.description,
        prize: validated.prize,
        prizeValue: validated.prizeValue,
        currency: validated.currency,
        country: validated.country,
        category: validated.category,
        entryUrl: validated.entryUrl,
        startDate: validated.startDate,
        endDate: validated.endDate,
        isFeatured: validated.isFeatured,
        isVerified: validated.isVerified,
        status: 'active',
        entryCount: 0,
        createdAt: now,
        updatedAt: now,
    }).returning();
    
    res.status(201).json(newGiveaway);
}));

// --- Admin Submissions Management ---
router.get('/submissions', requireAdmin as any, asyncHandler(async (req, res) => {
    const allSubmissions = await db.select().from(submissions).where(eq(submissions.status, 'pending')).orderBy(asc(submissions.createdAt));
    res.json(allSubmissions);
}));

router.post('/submissions/:id/approve', requireAdmin as any, asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const [updated] = await db.update(submissions).set({ status: 'approved', updatedAt: new Date() }).where(eq(submissions.id, id)).returning();
    if (!updated) throw new ApiError(404, 'Submission not found');
    res.json(updated);
}));

router.post('/submissions/:id/reject', requireAdmin as any, asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const [updated] = await db.update(submissions).set({ status: 'rejected', updatedAt: new Date() }).where(eq(submissions.id, id)).returning();
    if (!updated) throw new ApiError(404, 'Submission not found');
    res.json(updated);
}));

export default router;
