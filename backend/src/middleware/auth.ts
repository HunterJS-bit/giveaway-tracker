import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    // First, run requireAuth. We can't easily chain middleware linearly in Express inside a middleware function manually unless we call it.
    requireAuth(req, res, () => {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Admin access required' });
        }
        next();
    });
}
