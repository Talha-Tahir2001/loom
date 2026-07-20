// db/schemas/enums.ts
import { pgEnum } from "drizzle-orm/pg-core";

export const episodeStatusEnum = pgEnum("episode_status", [
    "drafting",
    "writing",
    "reviewing",
    "complete",
    "flagged",
]);

export const agentNameEnum = pgEnum("agent_name", [
    "concept",
    "plotter",
    "dialogue",
    "continuity",
    "showrunner",
]);

export const continuityFlagTypeEnum = pgEnum("continuity_flag_type", [
    "contradiction",
    "drift",
    "unresolved",
]);

export const agentRunStatusEnum = pgEnum("agent_run_status", [
    "pending",
    "running",
    "success",
    "error",
]);