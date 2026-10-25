import { Request, Response } from 'express';
import { pool } from '../db';

export const healthCheck = async (req: Request, res: Response) => {
    try {
        const start = Date.now();
        await pool.query('SELECT 1');
        const dbLatencyMs = Date.now() - start;

        res.json({
            status: 'ok',
            uptime: process.uptime(),
            db: { connected: true, latencyMs: dbLatencyMs },
        });
    } catch (err) {
        res.status(503).json({
            status: 'degraded',
            uptime: process.uptime(),
            db: { connected: false },
        });
    }
};
