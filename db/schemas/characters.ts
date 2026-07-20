// db/schemas/characters.ts
import { pgTable, uuid, text, jsonb } from "drizzle-orm/pg-core";
import { stories } from "./stories";
import { episodes } from "./episodes";

export const characters = pgTable("characters", {
    id: uuid("id").primaryKey().defaultRandom(),
    storyId: uuid("story_id")
        .notNull()
        .references(() => stories.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    // e.g. { eyes: "green", accent: "northern" } — free-form so the Concept
    // Agent can add new trait keys without a migration.
    traits: jsonb("traits").$type<Record<string, string>>().default({}),
    arcSummary: text("arc_summary"),
    firstAppearanceEpisodeId: uuid("first_appearance_episode_id").references(
        () => episodes.id,
        { onDelete: "set null" }
    ),
});