import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import dotenv from 'dotenv';
import loggerInstance from '../utils/logger';

dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,                    // Maximum number of connections in the pool
    idleTimeoutMillis: 30000,   // Close idle connections after 30s
    connectionTimeoutMillis: 5000, // Fail fast if DB is unreachable
});

// Log pool errors instead of crashing
pool.on('error', (err) => {
    loggerInstance.error({ err }, 'Unexpected PostgreSQL pool error');
});

export const db = drizzle(pool, { schema });
