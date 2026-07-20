// db/schemas/stories.ts
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

// No local `users` table on purpose — Clerk is the source of truth for
// identity. We just store the Clerk user id as a plain text column and
// filter by it. If you later need to join against richer user profile
// data, add a `users` table synced via a Clerk webhook at that point.
export const stories = pgTable("stories", {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkUserId: text("clerk_user_id").notNull(),
    title: text("title").notNull(),
    premise: text("premise"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});