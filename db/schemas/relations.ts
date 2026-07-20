// db/schemas/relations.ts
import { relations } from "drizzle-orm/_relations";
import { stories } from "./stories";
import { episodes } from "./episodes";
import { characters } from "./characters";
import { worldRules } from "./world-rules";
import { scenes } from "./scenes";
import { continuityFlags } from "./continuity-flags";
import { agentRuns } from "./agent-runs";

export const storiesRelations = relations(stories, ({ many }) => ({
    episodes: many(episodes),
    characters: many(characters),
    worldRules: many(worldRules),
}));

export const episodesRelations = relations(episodes, ({ one, many }) => ({
    story: one(stories, { fields: [episodes.storyId], references: [stories.id] }),
    scenes: many(scenes),
    continuityFlags: many(continuityFlags),
    agentRuns: many(agentRuns),
}));

export const charactersRelations = relations(characters, ({ one, many }) => ({
    story: one(stories, { fields: [characters.storyId], references: [stories.id] }),
    firstAppearanceEpisode: one(episodes, {
        fields: [characters.firstAppearanceEpisodeId],
        references: [episodes.id],
    }),
    continuityFlags: many(continuityFlags),
}));

export const worldRulesRelations = relations(worldRules, ({ one }) => ({
    story: one(stories, { fields: [worldRules.storyId], references: [stories.id] }),
    establishedEpisode: one(episodes, {
        fields: [worldRules.establishedEpisodeId],
        references: [episodes.id],
    }),
}));

export const scenesRelations = relations(scenes, ({ one, many }) => ({
    episode: one(episodes, { fields: [scenes.episodeId], references: [episodes.id] }),
    continuityFlags: many(continuityFlags),
}));

export const continuityFlagsRelations = relations(continuityFlags, ({ one }) => ({
    episode: one(episodes, { fields: [continuityFlags.episodeId], references: [episodes.id] }),
    scene: one(scenes, { fields: [continuityFlags.sceneId], references: [scenes.id] }),
    character: one(characters, {
        fields: [continuityFlags.characterId],
        references: [characters.id],
    }),
}));

export const agentRunsRelations = relations(agentRuns, ({ one }) => ({
    episode: one(episodes, { fields: [agentRuns.episodeId], references: [episodes.id] }),
}));