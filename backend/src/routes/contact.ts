import { Router } from 'express';
import { db } from '../db';
import { contactMessages } from '../db/schema';
import { asyncHandler, ApiError } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const router = Router();

const ContactMessageSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    subject: z.string().min(3).max(200),
    message: z.string().min(10).max(5000),
});

router.post('/', asyncHandler(async (req, res) => {
    const result = ContactMessageSchema.safeParse(req.body);
    if (!result.success) {
        const issues = result.error.issues.map(i => `${i.path.join('.') || 'form'}: ${i.message}`).join('; ');
        throw new ApiError(400, `Neispravni podaci: ${issues}`);
    }
    const validated = result.data;

    const id = uuidv4();
    const now = new Date();

    const [newMessage] = await db.insert(contactMessages).values({
        id,
        name: validated.name,
        email: validated.email,
        subject: validated.subject,
        message: validated.message,
        status: 'unread',
        createdAt: now,
    }).returning();

    res.status(201).json({
        success: true,
        message: 'Poruka je uspešno poslata. Kontaktiraćemo vas uskoro.',
        data: newMessage,
    });
}));

export default router;
