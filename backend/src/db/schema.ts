import { pgTable, text, timestamp, boolean, doublePrecision, integer, index, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash'),
    googleId: text('google_id').unique(),
    role: text('role').default('user').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
    return {
        emailIdx: uniqueIndex('user_email_idx').on(table.email),
        googleIdIdx: uniqueIndex('user_google_id_idx').on(table.googleId),
    };
});

export const categories = pgTable('categories', {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    icon: text('icon').notNull(),
    color: text('color').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
    return {
        slugIdx: uniqueIndex('category_slug_idx').on(table.slug),
    };
});

export const submissions = pgTable('submissions', {
    id: text('id').primaryKey(),
    url: text('url').notNull(),
    status: text('status').default('pending').notNull(), // pending, approved, rejected
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

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
    status: text('status').default('active').notNull(), // active, expired, verified
    entryCount: integer('entry_count').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
    return {
        endDateIdx: index('end_date_idx').on(table.endDate),
        isFeaturedIdx: index('is_featured_idx').on(table.isFeatured),
        countryIdx: index('country_idx').on(table.country),
        categoryStatusIdx: index('category_status_idx').on(table.category, table.status),
        statusIsFeaturedIdx: index('status_is_featured_idx').on(table.status, table.isFeatured),
    };
});

export const comments = pgTable('comments', {
    id: text('id').primaryKey(),
    giveawayId: text('giveaway_id').references(() => giveaways.id).notNull(),
    userName: text('user_name').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
    return {
        giveawayIdIdx: index('comment_giveaway_id_idx').on(table.giveawayId),
    };
});
