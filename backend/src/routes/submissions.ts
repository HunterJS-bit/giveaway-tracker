import { Router } from 'express';
import { db } from '../db';
import { submissions } from '../db/schema';
import { v4 as uuidv4 } from 'uuid';
import { requireAdmin, AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';

const router = Router();

// Stricter limiter for submissions (anti-spam)
const postLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: { error: 'Post limit reached. Please try again after an hour.' }
});

const SubmissionSchema = z.object({
    url: z.string().url(),
});

// Create a new submission
router.post('/', postLimiter, async (req, res) => {
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
        req.log?.error(error, 'Error creating submission');
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
