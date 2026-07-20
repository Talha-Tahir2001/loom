import { eq, and, asc, inArray } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import {
    episodes,
    stories,
    scenes as scenesTable,
    characters as charactersTable,
    worldRules as worldRulesTable,
    continuityFlags as continuityFlagsTable,
} from "@/db/schemas";
import { EpisodeWorkspace } from "@/components/loom/episode-workspace";
import type { ContinuityFlag } from "@/lib/types";

interface PageProps {
    params: Promise<{ storyId: string; episodeId: string }>;
}

export default async function EpisodePage({ params }: PageProps) {
    const { storyId, episodeId } = await params;
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const [episodeRow] = await db
        .select({ episode: episodes, story: stories })
        .from(episodes)
        .innerJoin(stories, eq(episodes.storyId, stories.id))
        .where(and(eq(episodes.id, episodeId), eq(stories.id, storyId)));

    if (!episodeRow || episodeRow.story.clerkUserId !== userId) {
        notFound();
    }

    const { episode, story } = episodeRow;

    const [episodeScenes, storyCharacters, storyWorldRules] = await Promise.all([
        db
            .select()
            .from(scenesTable)
            .where(eq(scenesTable.episodeId, episode.id))
            .orderBy(asc(scenesTable.sceneNumber)),
        db.select().from(charactersTable).where(eq(charactersTable.storyId, story.id)),
        db.select().from(worldRulesTable).where(eq(worldRulesTable.storyId, story.id)),
    ]);

    const sceneIds = episodeScenes.map((s) => s.id);
    const flagRows =
        sceneIds.length > 0
            ? await db
                .select()
                .from(continuityFlagsTable)
                .where(inArray(continuityFlagsTable.sceneId, sceneIds))
            : [];

    // Serialize DB Date objects to strings to match lib/types.ts shapes
    // (and because that's what's safe to pass across the server/client boundary).
    const flagsBySceneId = flagRows.reduce<Record<string, ContinuityFlag[]>>((acc, row) => {
        const flag: ContinuityFlag = { ...row, createdAt: row.createdAt.toISOString() };
        (acc[row.sceneId] ??= []).push(flag);
        return acc;
    }, {});

    return (
        <EpisodeWorkspace
            story={{
                ...story,
                createdAt: story.createdAt.toISOString(),
                updatedAt: story.updatedAt.toISOString(),
            }}
            episode={{ ...episode, createdAt: episode.createdAt.toISOString() }}
            scenes={episodeScenes}
            flagsBySceneId={flagsBySceneId}
            characters={storyCharacters.map((c) => ({ ...c, traits: c.traits ?? {} }))}
            worldRules={storyWorldRules}
        />
    );
}