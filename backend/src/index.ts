import express from 'express';
import cors from 'cors';
import { db } from './db';
import { giveaways, submissions } from './db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Get all giveaways with optional pagination
app.get('/api/giveaways', async (req, res) => {
    try {
        const limitStr = req.query.limit as string;
        const offsetStr = req.query.offset as string;

        let query = db.select().from(giveaways)
            .$dynamic()
            .orderBy(desc(giveaways.isFeatured), asc(giveaways.endDate));

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
        console.error('Error fetching giveaways:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a single giveaway by ID
app.get('/api/giveaways/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [giveaway] = await db.select().from(giveaways).where(eq(giveaways.id, id));

        if (!giveaway) {
            return res.status(404).json({ error: 'Giveaway not found' });
        }
        res.json(giveaway);
    } catch (error) {
        console.error('Error fetching giveaway:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new giveaway
app.post('/api/giveaways', async (req, res) => {
    try {
        const data = req.body;

        // Basic validation could be inserted here
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
            entryCount: data.entryCount ?? 0,
        }).returning();

        res.status(201).json(newGiveaway);
    } catch (error) {
        console.error('Error creating giveaway:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new submission
app.post('/api/submissions', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url || typeof url !== 'string') {
            return res.status(400).json({ error: 'URL is required' });
        }

        const [newSubmission] = await db.insert(submissions).values({
            id: uuidv4(),
            url: url,
            status: 'pending',
        }).returning();

        res.status(201).json(newSubmission);
    } catch (error) {
        console.error('Error creating submission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
