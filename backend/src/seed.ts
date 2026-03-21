import { db } from './db';
import { giveaways } from './db/schema';
import fs from 'fs';
import path from 'path';
import { eq } from 'drizzle-orm';
import { Pool } from 'pg';

async function main() {
    console.log('Seeding database from giveaways.json...');

    const dataPath = process.env.SEED_DATA_PATH || path.join(__dirname, '../../assets/data/giveaways.json');

    if (!fs.existsSync(dataPath)) {
        console.error(`File not found: ${dataPath}`);
        process.exit(1);
    }

    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(fileContent);
    const items = data.giveaways || [];

    for (const item of items) {
        // Check if giveaway already exists
        const [existing] = await db.select().from(giveaways).where(eq(giveaways.id, item.id));

        if (!existing) {
            await db.insert(giveaways).values({
                id: item.id,
                title: item.title,
                brand: item.brand,
                brandLogoUrl: item.brandLogoUrl,
                imageUrl: item.imageUrl,
                description: item.description,
                prize: item.prize,
                prizeValue: Number(item.prizeValue),
                currency: item.currency,
                country: item.country,
                category: item.category,
                entryUrl: item.entryUrl,
                startDate: new Date(item.startDate),
                endDate: new Date(item.endDate),
                isFeatured: item.isFeatured ?? false,
                isVerified: item.isVerified ?? false,
                status: item.status ?? 'active',
                entryCount: item.entryCount ?? 0,
            });
            console.log(`Created giveaway: ${item.title}`);
        } else {
            console.log(`Skipped existing giveaway: ${item.title}`);
        }
    }

    console.log('Seeding finished.');
    process.exit(0);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
