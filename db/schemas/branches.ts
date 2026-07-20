import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { episodes } from "./episodes";

export const storyBranches = pgTable("story_branches", {
    id: uuid("id").primaryKey().defaultRandom(),
    episodeId: uuid("episode_id")
        .notNull()
        .references(() => episodes.id, { onDelete: "cascade" }),
    parentBranchId: uuid("parent_branch_id"),
    choice: text("choice"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
