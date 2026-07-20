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
    branchId: string | null;
    parentSceneId: string | null;
}

export interface StoryBranch {
    id: string;
    episodeId: string;
    parentBranchId: string | null;
    choice: string | null;
    createdAt: string;
}

export interface AgentRun {
    id: string;
    episodeId: string;
    branchId: string | null;
    sceneId: string | null;
    agentName: AgentName;
    status: "pending" | "running" | "success" | "error";
    summary: string | null;
    error: string | null;
    totalTokens: number | null;
    startedAt: string;
    finishedAt: string | null;
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
