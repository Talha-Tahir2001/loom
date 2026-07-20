"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { NavRail } from "@/components/loom/nav-rail";
import { TopBar } from "@/components/loom/top-bar";
import { ManuscriptPanel } from "@/components/loom/manuscript-panel";
import { WritersTable } from "@/components/loom/writers-table";
import { StoryBiblePanel } from "@/components/loom/story-bible-panel";
import { useSceneStream } from "@/hooks/use-scene-stream";
import type {
    AgentName,
    AgentSeat,
    Character,
    ContinuityFlag,
    Episode,
    Scene,
    Story,
    WorldRule,
} from "@/lib/types";

interface EpisodeWorkspaceProps {
    story: Story;
    episode: Episode;
    scenes: Scene[];
    flagsBySceneId: Record<string, ContinuityFlag[]>;
    characters: Character[];
    worldRules: WorldRule[];
}

const AGENT_LABELS: Record<AgentName, string> = {
    concept: "Concept Agent",
    plotter: "Plotter Agent",
    dialogue: "Dialogue Agent",
    continuity: "Continuity Checker",
    showrunner: "Showrunner",
};

const AGENT_ORDER: AgentName[] = ["concept", "plotter", "dialogue", "continuity"];

export function EpisodeWorkspace({
    story,
    episode,
    scenes,
    flagsBySceneId,
    characters,
    worldRules,
}: EpisodeWorkspaceProps) {
    const router = useRouter();
    const { content, agentEvents, final, isStreaming, error, start, reset } = useSceneStream();

    useEffect(() => {
        if (!isStreaming && final && !error) {
            router.refresh();
            reset();
        }
    }, [isStreaming, final, error, router, reset]);

    const displayScenes = useMemo(() => {
        if (!isStreaming && !content) return scenes;
        const streamingScene: Scene = {
            id: "__streaming__",
            episodeId: episode.id,
            sceneNumber: scenes.length + 1,
            content,
            agentAuthor: "dialogue",
            isStreaming,
            nextChoices: null,
        };
        return [...scenes, streamingScene];
    }, [scenes, content, isStreaming, episode.id]);

    // Built directly from real server-pushed events — an honest live view of
    // the pipeline, not a client-side guess based on isStreaming/content.
    const seats: AgentSeat[] = useMemo(
        () =>
            AGENT_ORDER.map((name) => {
                const event = agentEvents[name];
                return {
                    name,
                    label: AGENT_LABELS[name],
                    status: event?.status ?? "idle",
                    lastActivity: event?.summary,
                };
            }),
        [agentEvents]
    );

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <NavRail activeItem="episodes" storyId={story.id} />

            <div className="flex flex-1 flex-col overflow-hidden">
                <TopBar
                    storyTitle={story.title}
                    episode={episode}
                    isGenerating={isStreaming}
                    onGenerateNext={() => start(episode.id)}
                    tokensUsed={final?.totalTokens}
                />

                {error && (
                    <p className="border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-xs text-destructive">
                        Generation failed: {error}
                    </p>
                )}

                <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
                    <main className="flex-1 overflow-y-auto">
                        <ManuscriptPanel
                            scenes={displayScenes}
                            flagsBySceneId={flagsBySceneId}
                            onChoose={(choice) => start(episode.id, choice)}
                            isGenerating={isStreaming}
                        />
                    </main>

                    <aside className="flex max-h-64 shrink-0 flex-col overflow-y-auto border-t border-border lg:h-auto lg:max-h-none lg:w-72 lg:border-l lg:border-t-0">
                        <WritersTable seats={seats} />
                        <StoryBiblePanel characters={characters} worldRules={worldRules} />
                    </aside>
                </div>
            </div>
        </div>
    );
}