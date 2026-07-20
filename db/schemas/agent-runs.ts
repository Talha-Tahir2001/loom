// db/schemas/agent-runs.ts
import { pgTable, uuid, jsonb, timestamp, text, integer } from "drizzle-orm/pg-core";
import { episodes } from "./episodes";
import { agentNameEnum, agentRunStatusEnum } from "./enums";

export const agentRuns = pgTable("agent_runs", {
    id: uuid("id").primaryKey().defaultRandom(),
    episodeId: uuid("episode_id")
        .notNull()
        .references(() => episodes.id, { onDelete: "cascade" }),
    branchId: uuid("branch_id"),
    sceneId: uuid("scene_id"),
    agentName: agentNameEnum("agent_name").notNull(),
    input: jsonb("input"),
    output: jsonb("output"),
    status: agentRunStatusEnum("status").notNull().default("pending"),
    summary: text("summary"),
    error: text("error"),
    totalTokens: integer("total_tokens"),
    startedAt: timestamp("started_at").defaultNow().notNull(),
    finishedAt: timestamp("finished_at"),
});
