import { Router } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { requireAuth, AuthRequest } from '../middleware/auth';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '');

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

router.post('/register', async (req, res) => {
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
        req.log?.error(e, 'Register error');
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [user] = await db.select().from(users).where(eq(users.email, email));
        if (!user || !user.passwordHash) return res.status(400).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
    } catch (e) {
        req.log?.error(e, 'Login error');
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/google', async (req, res) => {
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
            if (payload.sub) {
                [user] = await db.select().from(users).where(eq(users.googleId, payload.sub));
            }

            if (!user) {
                [user] = await db.insert(users).values({
                    id: uuidv4(),
                    email: payload.email,
                    googleId: payload.sub,
                    role: 'user'
                }).returning();
            }
        } else if (!user.googleId && payload.sub) {
            await db.update(users).set({ googleId: payload.sub }).where(eq(users.id, user.id));
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
    } catch (e) {
        req.log?.error(e, 'Google Auth error');
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/me', requireAuth as any, (req: AuthRequest, res) => {
    res.json({ user: req.user });
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email required' });

        const [user] = await db.select().from(users).where(eq(users.email, email));
        if (!user || (!user.passwordHash && user.googleId)) {
            return res.json({ message: 'If an account with that email exists, we sent a reset link' });
        }

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

        req.log?.info({ resetLinkPreview: nodemailer.getTestMessageUrl(info) }, 'Password reset email sent');
        res.json({ message: 'If an account with that email exists, we sent a reset link' });

    } catch (e) {
        req.log?.error(e, 'Forgot password error');
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password required' });

        const decoded = jwt.decode(token) as { id: string } | null;
        if (!decoded || !decoded.id) return res.status(400).json({ error: 'Invalid token payload' });

        const [user] = await db.select().from(users).where(eq(users.id, decoded.id));
        if (!user || !user.passwordHash) return res.status(400).json({ error: 'Invalid or expired token' });

        const secret = JWT_SECRET + user.passwordHash;
        try {
            jwt.verify(token, secret);
        } catch (err) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));

        res.json({ message: 'Lozinka je uspešno promenjena' });
    } catch (e) {
        req.log?.error(e, 'Reset password error');
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
