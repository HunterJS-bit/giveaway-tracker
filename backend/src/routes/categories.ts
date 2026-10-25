import { Router } from 'express';
import { db } from '../db';
import { giveaways, categories } from '../db/schema';
import { eq, desc, asc, and, count } from 'drizzle-orm';
import { asyncHandler, ApiError } from '../middleware/errorHandler';

const router = Router();

// Get all categories with active giveaway count
router.get('/', asyncHandler(async (req, res) => {
    const allCategories = await db.select().from(categories).orderBy(asc(categories.name));

    const withCounts = await Promise.all(
        allCategories.map(async (cat) => {
            const [result] = await db
                .select({ count: count() })
                .from(giveaways)
                .where(and(eq(giveaways.category, cat.slug), eq(giveaways.status, 'active')));
            return { ...cat, giveawayCount: result?.count ?? 0 };
        })
    );

    res.json(withCounts);
}));

// Get giveaways by category slug (paginated)
router.get('/:slug/giveaways', asyncHandler(async (req, res) => {
    const { slug } = req.params as { slug: string };
    const limitStr = req.query.limit as string;
    const offsetStr = req.query.offset as string;
    const sort = req.query.sort as string;

    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    if (!category) {
        throw new ApiError(404, 'Category not found');
    }

    let orderClause = [desc(giveaways.isFeatured), asc(giveaways.endDate)];
    if (sort === 'newest') {
        orderClause = [desc(giveaways.isFeatured), desc(giveaways.createdAt)];
    } else if (sort === 'highestValue') {
        orderClause = [desc(giveaways.isFeatured), desc(giveaways.prizeValue)];
    }

    const combinedWhere = and(eq(giveaways.category, slug), eq(giveaways.status, 'active'));

    const [countResult] = await db.select({ count: count() }).from(giveaways).where(combinedWhere);
    const totalCount = countResult?.count ?? 0;

    let query = db.select()
        .from(giveaways)
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

    const results = await query;
    res.json({ category, giveaways: results, totalCount });
}));

export default router;
