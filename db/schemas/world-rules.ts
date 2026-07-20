// db/schemas/world-rules.ts
import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { stories } from "./stories";
import { episodes } from "./episodes";

export const worldRules = pgTable("world_rules", {
    id: uuid("id").primaryKey().defaultRandom(),
    storyId: uuid("story_id")
        .notNull()
        .references(() => stories.id, { onDelete: "cascade" }),
    ruleText: text("rule_text").notNull(),
    category: text("category").notNull(), // e.g. "Magic system", "Geography"
    establishedEpisodeId: uuid("established_episode_id").references(
        () => episodes.id,
        { onDelete: "set null" }
    ),
});