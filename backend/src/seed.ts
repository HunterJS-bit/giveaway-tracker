import { db } from './db';
import { giveaways, categories } from './db/schema';
import fs from 'fs';
import path from 'path';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import logger from './utils/logger';

const DEFAULT_CATEGORIES = [
    { slug: 'Tech', name: 'Tehnologija', description: 'Giveaways sa tech uređajima i gadgetima.', icon: '💻', color: '#3498db' },
    { slug: 'Beauty', name: 'Lepota', description: 'Kozmetika, parfemi i beauty proizvodi.', icon: '💄', color: '#8e44ad' },
    { slug: 'Cars', name: 'Automobili', description: 'Automobilski dodaci, testovi i nagradne igre.', icon: '🚗', color: '#1abc9c' },
    { slug: 'Travel', name: 'Putovanja', description: 'Osvoji putovanje, hotel ili avionske karte.', icon: '✈️', color: '#f1c40f' },
    { slug: 'Food', name: 'Hrana i Piće', description: 'Restorani, dostava i food giveaways.', icon: '🍕', color: '#e67e22' },
    { slug: 'Gaming', name: 'Gaming', description: 'Igrice, konzole i gaming oprema.', icon: '🎮', color: '#e74c3c' },
    { slug: 'Fashion', name: 'Moda', description: 'Garderoba, obuća i modni dodaci.', icon: '👗', color: '#a0ce4e' },
    { slug: 'Home', name: 'Dom i Bašta', description: 'Nameštaj, dekor i kućanski aparati.', icon: '🏠', color: '#34495e' },
];

async function main() {
    logger.info('Seeding categories...');
    for (const cat of DEFAULT_CATEGORIES) {
        const [existing] = await db.select().from(categories).where(eq(categories.slug, cat.slug));
        if (!existing) {
            await db.insert(categories).values({ id: uuidv4(), ...cat });
            logger.info(`Created category: ${cat.name}`);
        } else {
            logger.debug(`Skipped existing category: ${cat.name}`);
        }
    }

    logger.info('Seeding giveaways...');
    const dataPath = process.env.SEED_DATA_PATH || path.join(__dirname, '../../assets/data/giveaways.json');

    if (!fs.existsSync(dataPath)) {
        logger.error(`File not found: ${dataPath}`);
        process.exit(1);
    }

    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(fileContent);
    const items = data.giveaways || [];

    for (const item of items) {
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
            logger.info(`Created giveaway: ${item.title}`);
        } else {
            logger.debug(`Skipped existing giveaway: ${item.title}`);
        }
    }

    logger.info('Seeding finished.');
    process.exit(0);
}

main().catch((e) => {
    logger.error(e);
    process.exit(1);
});
