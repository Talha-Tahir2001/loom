import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { episodes, scenes, stories, continuityFlags } from "@/db/schemas";
import { createConceptAgent, createPlotterAgent, createContinuityAgent } from "@/lib/agents/showrunner";
import { createQwenModel } from "@/lib/qwen";

// Protocol upgrade from the old prose||METADATA_SPLIT||{json} convention:
// this now emits newline-delimited JSON events, because a single delimiter
// can't carry per-agent live status alongside streamed prose. Each line is
// one JSON object: {type:"status",...} | {type:"prose",...} |
// {type:"final",...} | {type:"error",...}.

function extractText(content: unknown): string {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
        return content
            .map((block) =>
                typeof block === "object" && block && "text" in block
                    ? String((block as { text: unknown }).text)
                    : ""
            )
            .join("");
    }
    return "";
}

function truncate(text: string, max: number): string {
    const trimmed = text.trim();
    return trimmed.length > max ? `${trimmed.slice(0, max)}…` : trimmed;
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ episodeId: string }> }
) {
    const { episodeId } = await params;
    const { userId } = await auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const [episodeRow] = await db
        .select({ episode: episodes, story: stories })
        .from(episodes)
        .innerJoin(stories, eq(episodes.storyId, stories.id))
        .where(eq(episodes.id, episodeId));

    if (!episodeRow || episodeRow.story.clerkUserId !== userId) {
        return new Response("Not found", { status: 404 });
    }

    const { episode, story } = episodeRow;
    const priorScenes = await db.select().from(scenes).where(eq(scenes.episodeId, episode.id));

    let choice: string | undefined;
    try {
        const body = await req.json();
        if (typeof body?.choice === "string" && body.choice.trim()) {
            choice = body.choice.trim();
        }
    } catch {
        // No/invalid JSON body — fine, generation proceeds without a steer.
    }

    await db.update(episodes).set({ status: "writing" }).where(eq(episodes.id, episode.id));

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const send = (event: Record<string, unknown>) => {
                controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
            };

            // Best-effort token tracking, surfaced in the UI so "maximizing
            // output quality under a limited token budget" (a track judging
            // criterion) is something visible, not just claimed. Exact field
            // availability depends on what Qwen's OpenAI-compatible endpoint
            // actually returns via usage_metadata — this degrades to 0 rather
            // than crashing if it's absent.
            let totalTokens = 0;
            const trackUsage = (msg: unknown) => {
                const t = (msg as { usage_metadata?: { total_tokens?: number } } | undefined)?.usage_metadata
                    ?.total_tokens;
                if (typeof t === "number") totalTokens += t;
            };

            try {
                const baseContext = `Story premise: ${story.premise ?? "(none provided)"}
Episode ${episode.episodeNumber}: "${episode.title}"
Scenes written so far in this episode: ${priorScenes.length}${choice ? `\n\nThe reader chose this direction for what happens next: "${choice}". Build the beat sheet around this direction.` : ""
                    }`;

                // 1. Concept
                send({ type: "status", agent: "concept", status: "thinking" });
                const conceptAgent = createConceptAgent(story.id);
                const conceptResult = await conceptAgent.invoke({
                    messages: [
                        { role: "user", content: `${baseContext}\n\nPropose the beat sheet for the next scene.` },
                    ],
                });
                const conceptMessage = conceptResult.messages.at(-1);
                const beatSheet = extractText(conceptMessage?.content);
                trackUsage(conceptMessage);
                send({ type: "status", agent: "concept", status: "done", summary: truncate(beatSheet, 140) });

                // 2. Plotter
                send({ type: "status", agent: "plotter", status: "thinking" });
                const plotterAgent = createPlotterAgent(story.id);
                const plotterResult = await plotterAgent.invoke({
                    messages: [
                        { role: "user", content: `Beat sheet:\n${beatSheet}\n\nExpand this into a scene brief.` },
                    ],
                });
                const plotterMessage = plotterResult.messages.at(-1);
                const sceneBrief = extractText(plotterMessage?.content);
                trackUsage(plotterMessage);
                send({ type: "status", agent: "plotter", status: "done", summary: truncate(sceneBrief, 140) });

                // 3. Dialogue — direct streaming call, not a deep-agent invocation,
                // so raw prose tokens reach the client live.
                send({ type: "status", agent: "dialogue", status: "writing" });
                const dialogueModel = createQwenModel({ temperature: 0.9 });
                const sceneNumber = priorScenes.length + 1;

                const dialogueStream = await dialogueModel.stream([
                    {
                        role: "system",
                        content:
                            "You are the Dialogue Agent in a writers' room. Write vivid, close-third-person prose for the next scene of an episodic story, following the given scene brief closely. Output prose only — no headers, no metadata, no scene numbers.",
                    },
                    { role: "user", content: sceneBrief },
                ]);

                let sceneContent = "";
                for await (const chunk of dialogueStream) {
                    const text = typeof chunk.content === "string" ? chunk.content : "";
                    if (text) {
                        sceneContent += text;
                        send({ type: "prose", text });
                    }
                    trackUsage(chunk);
                }
                send({ type: "status", agent: "dialogue", status: "done" });

                const [savedScene] = await db
                    .insert(scenes)
                    .values({
                        episodeId: episode.id,
                        sceneNumber,
                        content: sceneContent,
                        agentAuthor: "dialogue",
                    })
                    .returning();

                // Propose 3 reader-facing "what happens next" directions, based on
                // what was actually written (not the pre-written brief, which may
                // have drifted slightly during prose generation). This is treated
                // as a nice-to-have: if it fails for any reason, generation still
                // succeeds without choices rather than failing the whole request.
                send({ type: "status", agent: "concept", status: "thinking", summary: "Proposing what happens next" });
                let nextChoices: string[] = [];
                try {
                    const choiceModel = createQwenModel({ temperature: 0.9 }).withStructuredOutput(
                        z.object({ choices: z.array(z.string()).length(3) }),
                        { name: "propose_choices" }
                    );
                    const choiceResult = await choiceModel.invoke([
                        {
                            role: "system",
                            content:
                                "You are the Concept Agent. Given the scene that was just written, propose exactly 3 short, distinct, compelling directions (5-12 words each) the story could take next. Write them as reader-facing options, not instructions to an agent.",
                        },
                        { role: "user", content: sceneContent },
                    ]);
                    nextChoices = choiceResult.choices;
                    await db.update(scenes).set({ nextChoices }).where(eq(scenes.id, savedScene.id));
                } catch {
                    // Leave nextChoices empty — the "Generate next scene" button
                    // still works as an unsteered fallback either way.
                }
                send({
                    type: "status",
                    agent: "concept",
                    status: "done",
                    summary: nextChoices.length ? `Proposed ${nextChoices.length} directions` : "No choices proposed",
                });

                // 4. Continuity
                send({ type: "status", agent: "continuity", status: "reviewing" });
                const continuityAgent = createContinuityAgent(story.id, episode.id, savedScene.id);
                const continuityResult = await continuityAgent.invoke({
                    messages: [
                        {
                            role: "user",
                            content: `Review this newly written scene for continuity issues.\n\nScene content:\n${sceneContent}`,
                        },
                    ],
                });
                const continuityMessage = continuityResult.messages.at(-1);
                trackUsage(continuityMessage);

                const flags = await db
                    .select()
                    .from(continuityFlags)
                    .where(eq(continuityFlags.sceneId, savedScene.id));

                const finalStatus = flags.length > 0 ? "flagged" : "complete";
                await db.update(episodes).set({ status: finalStatus }).where(eq(episodes.id, episode.id));

                send({
                    type: "status",
                    agent: "continuity",
                    status: "done",
                    summary: truncate(extractText(continuityMessage?.content), 140),
                });

                send({
                    type: "final",
                    sceneId: savedScene.id,
                    status: finalStatus,
                    continuityFlags: flags.map((f) => ({
                        id: f.id,
                        description: f.description,
                        flagType: f.flagType,
                    })),
                    totalTokens,
                });
            } catch (err) {
                const message = err instanceof Error ? err.message : "Generation failed";
                send({ type: "error", message });
                await db.update(episodes).set({ status: "drafting" }).where(eq(episodes.id, episode.id));
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "application/x-ndjson; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
        },
    });
}