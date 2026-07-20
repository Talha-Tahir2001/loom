// lib/types.ts
// Core domain types for Loom. Mirrors the Postgres schema
// (stories, episodes, scenes, characters, world_rules, continuity_flags, agent_runs).

export interface Story {
    id: string;
    clerkUserId: string;
    title: string;
    premise: string | null;
    createdAt: string;
    updatedAt: string;
}

export type AgentName = "concept" | "plotter" | "dialogue" | "continuity" | "showrunner";

export type AgentStatus = "idle" | "thinking" | "writing" | "reviewing" | "done" | "error";

export interface AgentSeat {
    name: AgentName;
    label: string; // display name, e.g. "Continuity Checker"
    status: AgentStatus;
    lastActivity?: string; // short human-readable summary, e.g. "Cross-referencing Ep. 2"
}

export type EpisodeStatus = "drafting" | "writing" | "reviewing" | "complete" | "flagged";

export interface Episode {
    id: string;
    storyId: string;
    episodeNumber: number;
    title: string;
    status: EpisodeStatus;
    createdAt: string;
}

export interface Scene {
    id: string;
    episodeId: string;
    sceneNumber: number;
    content: string; // accumulated streamed text
    agentAuthor: AgentName;
    isStreaming?: boolean;
    nextChoices: string[] | null; // no .notNull() in schema
}

export interface Character {
    id: string;
    storyId: string;
    name: string;
    traits: Record<string, string>;
    arcSummary: string | null;
    firstAppearanceEpisodeId: string | null;
}

export interface WorldRule {
    id: string;
    storyId: string;
    ruleText: string;
    category: string;
    establishedEpisodeId: string | null;
}

export interface ContinuityFlag {
    id: string;
    episodeId: string;
    sceneId: string;
    characterId: string | null;
    flagType: "contradiction" | "drift" | "unresolved";
    description: string;
    resolved: boolean;
    createdAt: string;
}