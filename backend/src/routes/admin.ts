import { Router } from 'express';
import { db } from '../db';
import { submissions } from '../db/schema';
import { eq, asc } from 'drizzle-orm';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// --- Admin Submissions Management ---
router.get('/submissions', requireAdmin as any, async (req, res) => {
    try {
        const allSubmissions = await db.select().from(submissions).where(eq(submissions.status, 'pending')).orderBy(asc(submissions.createdAt));
        res.json(allSubmissions);
    } catch (e) {
        req.log?.error(e, 'Error fetching submissions');
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/submissions/:id/approve', requireAdmin as any, async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await db.update(submissions).set({ status: 'approved', updatedAt: new Date() }).where(eq(submissions.id, id)).returning();
        if (!updated) return res.status(404).json({ error: 'Submission not found' });
        res.json(updated);
    } catch (e) {
        req.log?.error(e, 'Error approving submission');
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/submissions/:id/reject', requireAdmin as any, async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await db.update(submissions).set({ status: 'rejected', updatedAt: new Date() }).where(eq(submissions.id, id)).returning();
        if (!updated) return res.status(404).json({ error: 'Submission not found' });
        res.json(updated);
    } catch (e) {
        req.log?.error(e, 'Error rejecting submission');
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
