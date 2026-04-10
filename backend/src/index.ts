import express from 'express';
import cors from 'cors';
import { db } from './db';
import { giveaways, submissions, comments, categories, users } from './db/schema';
import { eq, desc, asc, ne, and, sql, count } from 'drizzle-orm';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import rateLimit from 'express-rate-limit';
import pino from 'pino-http';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { requireAuth, requireAdmin, AuthRequest } from './middleware/auth';

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

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '');

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

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if (existingUser.length > 0) return res.status(400).json({ error: 'Email already in use' });

        const passwordHash = await bcrypt.hash(password, 10);
        const [newUser] = await db.insert(users).values({
            id: uuidv4(),
            email,
            passwordHash,
            role: 'user'
        }).returning({ id: users.id, email: users.email, role: users.role });

        const token = jwt.sign(newUser, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ user: newUser, token });
    } catch (e) {
        req.log.error(e, 'Register error');
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [user] = await db.select().from(users).where(eq(users.email, email));
        if (!user || !user.passwordHash) return res.status(400).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
    } catch (e) {
        req.log.error(e, 'Login error');
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/google', async (req, res) => {
    try {
        const { credential } = req.body;
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) return res.status(400).json({ error: 'Invalid Google Token' });

        let [user] = await db.select().from(users).where(eq(users.email, payload.email));
        if (!user) {
            // Check if another user has this googleId just in case
            if (payload.sub) {
                [user] = await db.select().from(users).where(eq(users.googleId, payload.sub));
            }

            if (!user) {
                // Register
                [user] = await db.insert(users).values({
                    id: uuidv4(),
                    email: payload.email,
                    googleId: payload.sub,
                    role: 'user'
                }).returning();
            }
        } else if (!user.googleId && payload.sub) {
            // Update existing user with googleId if they used email previously
            await db.update(users).set({ googleId: payload.sub }).where(eq(users.id, user.id));
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
    } catch (e) {
        req.log.error(e, 'Google Auth error');
        res.status(500).json({ error: 'Server error' });
    }
});

import nodemailer from 'nodemailer';

// Generate ethereal test account for local dev if not provided
let transporter: nodemailer.Transporter;
nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return;
    }
    transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });
});

app.get('/api/auth/me', requireAuth as any, (req: AuthRequest, res) => {
    res.json({ user: req.user });
});

app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email required' });

        const [user] = await db.select().from(users).where(eq(users.email, email));
        if (!user || (!user.passwordHash && user.googleId)) {
            // Do not reveal whether user exists for security, just send 200
            // Or reveal it for better UX. Let's send 200 to prevent email enumeration.
            return res.json({ message: 'If an account with that email exists, we sent a reset link' });
        }

        // Generate stateless JWT valid for 1 hour, signed with current password hash!
        const secret = JWT_SECRET + user.passwordHash;
        const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
        const resetLink = `${frontendUrl}/reset-password?token=${token}`;

        if (!transporter) {
            return res.status(500).json({ error: 'Mail server not configured' });
        }

        const info = await transporter.sendMail({
            from: '"Balkan Giveaways" <noreply@nagradneigre.balkan>',
            to: email,
            subject: 'Resetovanje lozinke',
            text: `Kliknite na sledeći link da resetujete lozinku: ${resetLink}`,
            html: `<p>Kliknite na sledeći link da resetujete lozinku:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
        });

        // Log the preview URL so the developer can see the fake email
        req.log.info({ resetLinkPreview: nodemailer.getTestMessageUrl(info) }, 'Password reset email sent');
        res.json({ message: 'If an account with that email exists, we sent a reset link' });

    } catch (e) {
        req.log.error(e, 'Forgot password error');
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password required' });

        // Decode to find which user this is
        const decoded = jwt.decode(token) as { id: string } | null;
        if (!decoded || !decoded.id) return res.status(400).json({ error: 'Invalid token payload' });

        const [user] = await db.select().from(users).where(eq(users.id, decoded.id));
        if (!user || !user.passwordHash) return res.status(400).json({ error: 'Invalid or expired token' });

        // Verify signature using the current password hash
        const secret = JWT_SECRET + user.passwordHash;
        try {
            jwt.verify(token, secret);
        } catch (err) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        // Token is valid! Hash new password and update.
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));

        res.json({ message: 'Lozinka je uspešno promenjena' });
    } catch (e) {
        req.log.error(e, 'Reset password error');
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all categories with active giveaway count
app.get('/api/categories', async (req, res) => {
    try {
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
    } catch (error) {
        req.log.error(error, 'Error fetching categories');
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get giveaways by category slug (paginated)
app.get('/api/categories/:slug/giveaways', async (req, res) => {
    try {
        const { slug } = req.params as { slug: string };
        const limitStr = req.query.limit as string;
        const offsetStr = req.query.offset as string;
        const sort = req.query.sort as string;

        // Verify category exists
        const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        let orderClause = [desc(giveaways.isFeatured), asc(giveaways.endDate)];
        if (sort === 'newest') {
            orderClause = [desc(giveaways.isFeatured), desc(giveaways.createdAt)];
        } else if (sort === 'highestValue') {
            orderClause = [desc(giveaways.isFeatured), desc(giveaways.prizeValue)];
        }

        let query = db.select()
            .from(giveaways)
            .where(and(eq(giveaways.category, slug), eq(giveaways.status, 'active')))
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
        res.json({ category, giveaways: results });
    } catch (error) {
        req.log.error(error, 'Error fetching category giveaways');
        res.status(500).json({ error: 'Internal server error' });
    }
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
app.post('/api/giveaways', requireAdmin as any, async (req, res) => {
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

// --- Admin Submissions Management ---
app.get('/api/admin/submissions', requireAdmin as any, async (req, res) => {
    try {
        const allSubmissions = await db.select().from(submissions).where(eq(submissions.status, 'pending')).orderBy(asc(submissions.createdAt));
        res.json(allSubmissions);
    } catch (e) {
        req.log.error(e, 'Error fetching submissions');
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/admin/submissions/:id/approve', requireAdmin as any, async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await db.update(submissions).set({ status: 'approved', updatedAt: new Date() }).where(eq(submissions.id, id)).returning();
        if (!updated) return res.status(404).json({ error: 'Submission not found' });
        res.json(updated);
    } catch (e) {
        req.log.error(e, 'Error approving submission');
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/admin/submissions/:id/reject', requireAdmin as any, async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await db.update(submissions).set({ status: 'rejected', updatedAt: new Date() }).where(eq(submissions.id, id)).returning();
        if (!updated) return res.status(404).json({ error: 'Submission not found' });
        res.json(updated);
    } catch (e) {
        req.log.error(e, 'Error rejecting submission');
        res.status(500).json({ error: 'Server error' });
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
