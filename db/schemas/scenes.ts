// // db/schemas/scenes.ts
// import { pgTable, uuid, integer, text, boolean } from "drizzle-orm/pg-core";
// import { episodes } from "./episodes";
// import { agentNameEnum } from "./enums";

// export const scenes = pgTable("scenes", {
//     id: uuid("id").primaryKey().defaultRandom(),
//     episodeId: uuid("episode_id")
//         .notNull()
//         .references(() => episodes.id, { onDelete: "cascade" }),
//     sceneNumber: integer("scene_number").notNull(),
//     content: text("content").notNull().default(""),
//     agentAuthor: agentNameEnum("agent_author").notNull(),
//     isStreaming: boolean("is_streaming").notNull().default(false),
// }, (table) => {
//     uniqueEpisodeScene: unique().on(table.episodeId, table.sceneNumber),
// });

// db/schemas/scenes.ts
import { pgTable, uuid, integer, text, boolean, unique, jsonb } from "drizzle-orm/pg-core";
import { episodes } from "./episodes";
import { agentNameEnum } from "./enums";
import { storyBranches } from "./branches";

export const scenes = pgTable(
    "scenes",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        episodeId: uuid("episode_id")
            .notNull()
            .references(() => episodes.id, { onDelete: "cascade" }),
        branchId: uuid("branch_id").references(() => storyBranches.id, { onDelete: "cascade" }),
        parentSceneId: uuid("parent_scene_id"),
        sceneNumber: integer("scene_number").notNull(),
        content: text("content").notNull().default(""),
        agentAuthor: agentNameEnum("agent_author").notNull(),
        isStreaming: boolean("is_streaming").notNull().default(false),
        nextChoices: jsonb("next_choices").$type<string[]>(),
    },
    (table) => ({
        uniqueBranchScene: unique().on(table.branchId, table.sceneNumber),
    })
);
