// db/schemas/agent-runs.ts
import { pgTable, uuid, jsonb, timestamp } from "drizzle-orm/pg-core";
import { episodes } from "./episodes";
import { agentNameEnum, agentRunStatusEnum } from "./enums";

export const agentRuns = pgTable("agent_runs", {
    id: uuid("id").primaryKey().defaultRandom(),
    episodeId: uuid("episode_id")
        .notNull()
        .references(() => episodes.id, { onDelete: "cascade" }),
    agentName: agentNameEnum("agent_name").notNull(),
    input: jsonb("input"),
    output: jsonb("output"),
    status: agentRunStatusEnum("status").notNull().default("pending"),
    startedAt: timestamp("started_at").defaultNow().notNull(),
    finishedAt: timestamp("finished_at"),
});