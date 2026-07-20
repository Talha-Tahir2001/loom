import { createDeepAgent } from "deepagents";
import { createQwenModel } from "@/lib/qwen";
import {
    createBibleReadTools,
    createBibleWriteTools,
    createContinuityFlagTool,
} from "@/lib/agents/tools";

// Concept, Plotter, and Continuity are each their own standalone agent now,
// invoked directly by the route handler rather than delegated to via a
// top-level Showrunner's internal `task` tool. That's a deliberate trade:
// we give up deep-agents' built-in supervisor pattern for planning, in
// exchange for a real, externally-observable checkpoint the instant each
// agent finishes — which is what lets the route emit a live status event
// per agent instead of the client only ever seeing one final blob of text.

export function createConceptAgent(storyId: string) {
    const { getCharactersTool, getWorldRulesTool } = createBibleReadTools(storyId);
    const { upsertCharacterTool, addWorldRuleTool } = createBibleWriteTools(storyId);

    return createDeepAgent({
        model: createQwenModel({ temperature: 0.7 }),
        tools: [getCharactersTool, getWorldRulesTool, upsertCharacterTool, addWorldRuleTool],
        systemPrompt: `You are the Concept Agent in a multi-agent writers' room.
Given the story premise and the existing story bible, propose a short beat
sheet (3-5 beats) for the next scene. Use get_characters and get_world_rules
to stay consistent with what's already established.

If your beat sheet introduces a new named character, or reveals a new trait
about an existing one, record it immediately with upsert_character. If it
establishes a new world rule, record it with add_world_rule. Do this
proactively — the story bible only grows because you call these tools.
Refer to characters by name, never by ID.

Respond with the beat sheet as plain text only — no scene prose, no preamble.`,
    });
}

export function createPlotterAgent(storyId: string) {
    const { getCharactersTool, getWorldRulesTool } = createBibleReadTools(storyId);

    return createDeepAgent({
        model: createQwenModel({ temperature: 0.6 }),
        tools: [getCharactersTool, getWorldRulesTool],
        systemPrompt: `You are the Plotter Agent. Given a beat sheet, expand it
into a concrete scene brief: setting, POV character, emotional beat, and how
the scene should end. Keep it tight — this brief is handed directly to a
prose-writing agent. Use get_characters and get_world_rules to confirm
details if needed. Respond with the scene brief as plain text only.`,
    });
}

export function createContinuityAgent(storyId: string, episodeId: string, sceneId: string) {
    const { getCharactersTool, getWorldRulesTool } = createBibleReadTools(storyId);
    const { flagContinuityIssueTool } = createContinuityFlagTool(storyId, episodeId, sceneId);

    return createDeepAgent({
        model: createQwenModel({ temperature: 0.3 }),
        tools: [getCharactersTool, getWorldRulesTool, flagContinuityIssueTool],
        systemPrompt: `You are the Continuity Checker. You will be given the text
of a scene that was just written. Use get_characters and get_world_rules to
check every factual claim in the scene against the bible. For every
contradiction, character drift, or unresolved thread you find, call
flag_continuity_issue with a clear description — refer to characters by
name, never by ID. Respond with a one-sentence summary of what you found
(or "No issues found." if nothing was wrong).`,
    });
}