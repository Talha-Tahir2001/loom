// db/schemas/continuity-flags.ts
import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { episodes } from "./episodes";
import { characters } from "./characters";
import { scenes } from "./scenes";
import { continuityFlagTypeEnum } from "./enums";

export const continuityFlags = pgTable("continuity_flags", {
    id: uuid("id").primaryKey().defaultRandom(),
    episodeId: uuid("episode_id")
        .notNull()
        .references(() => episodes.id, { onDelete: "cascade" }),
    sceneId: uuid("scene_id")
        .notNull()
        .references(() => scenes.id, { onDelete: "cascade" }),
    // Nullable — not every flag pins to a specific character (e.g. a world
    // rule contradiction isn't about any one person).
    characterId: uuid("character_id").references(() => characters.id, {
        onDelete: "set null",
    }),
    flagType: continuityFlagTypeEnum("flag_type").notNull(),
    description: text("description").notNull(),
    resolved: boolean("resolved").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});