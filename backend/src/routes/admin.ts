import { Router } from 'express';
import { db } from '../db';
import { submissions, giveaways, categories } from '../db/schema';
import { eq, asc, or, sql } from 'drizzle-orm';
import { requireAdmin } from '../middleware/auth';
import { asyncHandler, ApiError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const router = Router();

// --- Admin Giveaway Creation ---
// All fields are optional: the admin form can be submitted with partial data
// and missing/blank values fall back to sensible defaults.
const blankToUndefined = (val: unknown) => {
    // HTML form inputs submit empty strings when left blank — treat as missing
    if (typeof val === 'string' && val.trim() === '') return undefined;
    return val;
};

const optionalText = (max: number, fallback = '') =>
    z.preprocess(blankToUndefined, z.string().max(max).optional().default(fallback));

const optionalUrl = (fallback = '') =>
    z.preprocess(blankToUndefined, z.string().url().optional().default(fallback));

const optionalDate = z.preprocess(blankToUndefined, z.coerce.date().optional());

const CreateGiveawaySchema = z.object({
    title: optionalText(200),
    brand: optionalText(100),
    brandLogoUrl: optionalUrl(),
    imageUrl: optionalUrl(),
    description: optionalText(2000),
    prize: optionalText(200),
    prizeValue: z.preprocess(blankToUndefined, z.coerce.number().nonnegative().optional().default(0)),
    currency: optionalText(10, 'RSD'),
    country: optionalText(10, 'RS'),
    category: optionalText(50),
    entryUrl: optionalUrl(),
    startDate: optionalDate,
    endDate: optionalDate,
    isFeatured: z.boolean().default(false),
    isVerified: z.boolean().default(false),
});

// Default giveaway length when no end date is provided
const DEFAULT_GIVEAWAY_DAYS = 7;

// Giveaways are linked to categories by their slug (e.g. "Tech"), because
// filtering, counts and category pages all compare against the slug. Accept a
// slug or a display name from the admin form and always store the slug.
const resolveCategorySlug = async (input: string): Promise<string> => {
    const value = input.trim();
    if (!value) return '';

    const [match] = await db
        .select({ slug: categories.slug })
        .from(categories)
        .where(or(
            sql`lower(${categories.slug}) = lower(${value})`,
            sql`lower(${categories.name}) = lower(${value})`,
        ));

    // Unknown category: keep the value as-is so nothing is silently dropped.
    return match?.slug ?? value;
};

router.post('/giveaways', requireAdmin as any, asyncHandler(async (req, res) => {
    const result = CreateGiveawaySchema.safeParse(req.body);
    if (!result.success) {
        const issues = result.error.issues.map(i => `${i.path.join('.') || 'form'}: ${i.message}`).join('; ');
        throw new ApiError(400, `Neispravni podaci: ${issues}`);
    }
    const validated = result.data;

    const now = new Date();
    const startDate = validated.startDate ?? now;
    const endDate = validated.endDate ?? new Date(startDate.getTime() + DEFAULT_GIVEAWAY_DAYS * 24 * 60 * 60 * 1000);

    // Fall back to the prize name, then a generic title, when no title is given
    const title = validated.title || validated.prize || 'Nagradna igra';

    // Store the canonical category slug so the giveaway shows up in filters,
    // category pages and category counts.
    const category = await resolveCategorySlug(validated.category);

    const id = uuidv4();

    const [newGiveaway] = await db.insert(giveaways).values({
        id,
        title,
        brand: validated.brand,
        brandLogoUrl: validated.brandLogoUrl,
        imageUrl: validated.imageUrl,
        description: validated.description,
        prize: validated.prize,
        prizeValue: validated.prizeValue,
        currency: validated.currency,
        country: validated.country,
        category,
        entryUrl: validated.entryUrl,
        startDate,
        endDate,
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
