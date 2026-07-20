import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { and, eq, ilike } from "drizzle-orm";
import { db } from "@/db";
import { characters, worldRules, continuityFlags } from "@/db/schemas";

// IMPORTANT: storyId/episodeId/sceneId are bound via closure below, NOT
// exposed as tool arguments. Long opaque UUIDs are exactly the kind of
// value LLMs unreliably reproduce across a multi-agent delegation chain —
// asking the model to copy one out of prompt text and pass it back
// correctly is fragile. Binding them here removes that failure mode
// entirely: the model never sees or handles these IDs at all.

export function createBibleReadTools(storyId: string) {
    const getCharactersTool = tool(
        async () => {
            const rows = await db.select().from(characters).where(eq(characters.storyId, storyId));
            return JSON.stringify(rows);
        },
        {
            name: "get_characters",
            description:
                "Fetch every character currently recorded in this story's bible, including established traits and arc summary.",
            schema: z.object({}),
        }
    );

    const getWorldRulesTool = tool(
        async () => {
            const rows = await db.select().from(worldRules).where(eq(worldRules.storyId, storyId));
            return JSON.stringify(rows);
        },
        {
            name: "get_world_rules",
            description: "Fetch every established world rule for this story.",
            schema: z.object({}),
        }
    );

    return { getCharactersTool, getWorldRulesTool };
}

export function createBibleWriteTools(storyId: string) {
    const upsertCharacterTool = tool(
        async ({
            name,
            traits,
            arcSummary,
        }: {
            name: string;
            traits?: Record<string, string>;
            arcSummary?: string;
        }) => {
            const existing = await db
                .select()
                .from(characters)
                .where(and(eq(characters.storyId, storyId), eq(characters.name, name)));

            if (existing.length > 0) {
                await db
                    .update(characters)
                    .set({
                        traits: { ...(existing[0].traits ?? {}), ...(traits ?? {}) },
                        arcSummary: arcSummary ?? existing[0].arcSummary,
                    })
                    .where(eq(characters.id, existing[0].id));
                return `Updated character ${name}`;
            }

            await db.insert(characters).values({ storyId, name, traits: traits ?? {}, arcSummary });
            return `Created character ${name}`;
        },
        {
            name: "upsert_character",
            description:
                "Record a new character in this story's bible, or merge new trait information into an existing one by name. Call this whenever a scene introduces a named character or reveals a new trait about one — this is the only way the story bible grows, so use it proactively.",
            schema: z.object({
                name: z.string(),
                traits: z.record(z.string(), z.string()).optional(),
                arcSummary: z.string().optional(),
            }),
        }
    );

    const addWorldRuleTool = tool(
        async ({ ruleText, category }: { ruleText: string; category: string }) => {
            await db.insert(worldRules).values({ storyId, ruleText, category });
            return "World rule recorded.";
        },
        {
            name: "add_world_rule",
            description:
                "Record a new world rule (magic system, geography, social structure, etc.) established in this story, so future episodes stay consistent with it. Call this whenever a scene establishes something new about how the world works.",
            schema: z.object({
                ruleText: z.string(),
                category: z.string(),
            }),
        }
    );

    return { upsertCharacterTool, addWorldRuleTool };
}

export function createContinuityFlagTool(storyId: string, episodeId: string, sceneId: string) {
    const flagContinuityIssueTool = tool(
        async ({
            characterName,
            flagType,
            description,
        }: {
            characterName?: string;
            flagType: "contradiction" | "drift" | "unresolved";
            description: string;
        }) => {
            // Resolved by name, not by ID — same reasoning as above. If no match
            // is found the flag is still recorded, just without a character link.
            let characterId: string | null = null;
            if (characterName) {
                const [match] = await db
                    .select()
                    .from(characters)
                    .where(and(eq(characters.storyId, storyId), ilike(characters.name, characterName)));
                characterId = match?.id ?? null;
            }

            const [row] = await db
                .insert(continuityFlags)
                .values({ episodeId, sceneId, characterId, flagType, description })
                .returning();

            return `Flag recorded: ${row.id}`;
        },
        {
            name: "flag_continuity_issue",
            description:
                "Record a continuity contradiction, character drift, or unresolved thread found while reviewing this scene. Refer to characters by name, never by ID.",
            schema: z.object({
                characterName: z
                    .string()
                    .optional()
                    .describe("The character's name as written in the story bible, if this issue relates to one"),
                flagType: z.enum(["contradiction", "drift", "unresolved"]),
                description: z.string(),
            }),
        }
    );

    return { flagContinuityIssueTool };
}