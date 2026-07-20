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

export const scenes = pgTable(
    "scenes",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        episodeId: uuid("episode_id")
            .notNull()
            .references(() => episodes.id, { onDelete: "cascade" }),
        sceneNumber: integer("scene_number").notNull(),
        content: text("content").notNull().default(""),
        agentAuthor: agentNameEnum("agent_author").notNull(),
        isStreaming: boolean("is_streaming").notNull().default(false),
        nextChoices: jsonb("next_choices").$type<string[]>(),
    },
    (table) => ({
        // Defense in depth against a double-fired generate request (e.g. a
        // fast double-click before the button's disabled state re-renders)
        // inserting two scenes with the same number. The client-side guard in
        // useSceneStream should prevent this in practice, but this makes it
        // impossible at the database level too.
        uniqueEpisodeScene: unique().on(table.episodeId, table.sceneNumber),
    })
);