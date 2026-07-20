"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NavRail } from "@/components/loom/nav-rail";
import { TopBar } from "@/components/loom/top-bar";
import { ManuscriptPanel } from "@/components/loom/manuscript-panel";
import { WritersTable } from "@/components/loom/writers-table";
import { StoryBiblePanel } from "@/components/loom/story-bible-panel";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSceneStream } from "@/hooks/use-scene-stream";
import { cn } from "@/lib/utils";
import type {
    AgentName,
    AgentSeat,
    Character,
    ContinuityFlag,
    Episode,
    Scene,
    Story,
    StoryBranch,
    WorldRule,
} from "@/lib/types";

interface EpisodeWorkspaceProps {
    story: Story;
    episode: Episode;
    scenes: Scene[];
    flagsBySceneId: Record<string, ContinuityFlag[]>;
    characters: Character[];
    worldRules: WorldRule[];
    branches: StoryBranch[];
    activeBranchId: string | null;
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
    branches,
    activeBranchId,
}: EpisodeWorkspaceProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarPanel, setSidebarPanel] = useState<"writers" | "bible">("writers");
    const selectedBranch = branches.find((branch) => branch.id === activeBranchId);
    const { content, agentEvents, final, isStreaming, error, start, reset } = useSceneStream();

    useEffect(() => {
        if (!isStreaming && final && !error) {
            if (final.branchId) router.replace(`${pathname}?branch=${final.branchId}`);
            router.refresh();
            reset();
        }
    }, [isStreaming, final, error, pathname, router, reset]);

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
            branchId: activeBranchId,
            parentSceneId: scenes.length ? scenes[scenes.length - 1].id : null,
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
                    onGenerateNext={() => start(episode.id, undefined, activeBranchId ?? undefined)}
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
                            onChoose={(choice) => start(episode.id, choice, activeBranchId ?? undefined)}
                            isGenerating={isStreaming}
                        />
                    </main>

                    <aside className="flex max-h-[50vh] shrink-0 flex-col overflow-y-auto border-t border-border lg:h-auto lg:max-h-none lg:w-72 lg:border-l lg:border-t-0 lg:overflow-hidden">
                        {branches.length > 0 && (
                            <div className="border-b border-border p-4">
                                <label htmlFor="branch-select" className="mb-2 block font-heading text-[10px] uppercase tracking-widest text-muted-foreground">
                                    Story paths
                                </label>
                                <Select
                                    value={activeBranchId ?? undefined}
                                    onValueChange={(nextBranchId) => {
                                        if (nextBranchId) router.push(`${pathname}?branch=${nextBranchId}`);
                                    }}
                                >
                                    <SelectTrigger id="branch-select" size="sm" className="w-full text-xs">
                                        <SelectValue className="truncate">
                                            {selectedBranch?.choice ?? "Original timeline"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                    {branches.map((branch) => (
                                        <SelectItem key={branch.id} value={branch.id} className="text-xs">
                                            {branch.choice ? branch.choice : "Original timeline"}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className="flex border-b border-border">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setSidebarPanel("writers")}
                                className={cn(
                                    "flex-1 rounded-none px-4 py-3 font-heading text-[10px] uppercase tracking-widest focus-visible:border-transparent focus-visible:ring-0",
                                    sidebarPanel === "writers"
                                        ? "border-b-2 border-primary text-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                Writers Table
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setSidebarPanel("bible")}
                                className={cn(
                                    "flex-1 rounded-none px-4 py-3 font-heading text-[10px] uppercase tracking-widest focus-visible:border-transparent focus-visible:ring-0",
                                    sidebarPanel === "bible"
                                        ? "border-b-2 border-primary text-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                Story Bible
                            </Button>
                        </div>
                        <div className={cn(sidebarPanel === "writers" ? "block" : "hidden")}>
                            <WritersTable seats={seats} />
                        </div>
                        <div className={cn(sidebarPanel === "bible" ? "flex min-h-0 flex-1" : "hidden")}>
                            <StoryBiblePanel characters={characters} worldRules={worldRules} />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
