// db/schemas/episodes.ts
import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { stories } from "./stories";
import { episodeStatusEnum } from "./enums";

export const episodes = pgTable("episodes", {
    id: uuid("id").primaryKey().defaultRandom(),
    storyId: uuid("story_id")
        .notNull()
        .references(() => stories.id, { onDelete: "cascade" }),
    episodeNumber: integer("episode_number").notNull(),
    title: text("title").notNull(),
    status: episodeStatusEnum("status").notNull().default("drafting"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});