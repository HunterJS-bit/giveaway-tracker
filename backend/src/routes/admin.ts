import { Router } from 'express';
import { db } from '../db';
import { submissions } from '../db/schema';
import { eq, asc } from 'drizzle-orm';
import { requireAdmin } from '../middleware/auth';
import { asyncHandler, ApiError } from '../middleware/errorHandler';

const router = Router();

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
