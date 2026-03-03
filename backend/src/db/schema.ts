import { pgTable, text, timestamp, boolean, doublePrecision, integer, index } from 'drizzle-orm/pg-core';

export const giveaways = pgTable('giveaways', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    brand: text('brand').notNull(),
    brandLogoUrl: text('brand_logo_url').notNull(),
    imageUrl: text('image_url').notNull(),
    description: text('description').notNull(),
    prize: text('prize').notNull(),
    prizeValue: doublePrecision('prize_value').notNull(),
    currency: text('currency').notNull(),
    country: text('country').notNull(),
    category: text('category').notNull(),
    entryUrl: text('entry_url').notNull(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    isFeatured: boolean('is_featured').default(false).notNull(),
    isVerified: boolean('is_verified').default(false).notNull(),
    entryCount: integer('entry_count').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        endDateIdx: index('end_date_idx').on(table.endDate),
        isFeaturedIdx: index('is_featured_idx').on(table.isFeatured),
        countryIdx: index('country_idx').on(table.country),
    };
});
