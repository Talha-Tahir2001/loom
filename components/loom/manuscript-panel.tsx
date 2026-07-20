
import { ContinuityFlagMarker } from "@/components/loom/continuity-flag-marker";
import type { ContinuityFlag, Scene } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ManuscriptPanelProps {
    scenes: Scene[];
    flagsBySceneId: Record<string, ContinuityFlag[]>;
    onChoose?: (choice: string) => void;
    isGenerating?: boolean;
}

export function ManuscriptPanel({ scenes, flagsBySceneId, onChoose, isGenerating }: ManuscriptPanelProps) {
    const lastScene = scenes[scenes.length - 1];
    // Only the most recent, fully-persisted scene's choices are shown — never
    // while a new scene is actively streaming (its ephemeral id is
    // "__streaming__" and it has no choices yet regardless).
    const showChoices =
        Boolean(onChoose) &&
        !isGenerating &&
        lastScene &&
        lastScene.id !== "__streaming__" &&
        (lastScene.nextChoices?.length ?? 0) > 0;

    return (
        <div className="mx-auto max-w-2xl px-8 py-10">
            {scenes.map((scene) => {
                const flags = flagsBySceneId[scene.id] ?? [];
                return (
                    <article key={scene.id} className="mb-10">
                        <p className="mb-2 font-heading text-[10px] uppercase tracking-widest text-muted-foreground">
                            Scene {scene.sceneNumber}
                        </p>
                        <div
                            className={cn(
                                "font-serif text-base leading-8 text-foreground",
                                scene.isStreaming && "after:ml-0.5 after:inline-block after:animate-pulse after:content-['▍']"
                            )}
                        >
                            {scene.content}
                            {flags.map((flag) => (
                                <ContinuityFlagMarker key={flag.id} flag={flag} />
                            ))}
                        </div>
                    </article>
                );
            })}

            {showChoices && (
                <div className="mt-2 space-y-2.5 border-t border-dashed border-border pt-6">
                    <p className="font-heading text-[10px] uppercase tracking-widest text-muted-foreground">
                        Where does the story go next?
                    </p>
                    <div className="flex flex-col gap-2">
                        {lastScene!.nextChoices!.map((choice, i) => (
                            <button
                                key={i}
                                onClick={() => onChoose!(choice)}
                                className="rounded-md border border-border bg-card px-3 py-2.5 text-left font-serif text-sm text-card-foreground transition-colors hover:border-primary/60 hover:bg-primary/5"
                            >
                                {choice}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {scenes.length === 0 && (
                <div className="rounded-lg border border-dashed border-border py-16 text-center">
                    <p className="font-heading text-sm uppercase tracking-wide text-muted-foreground">
                        No scenes yet
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Generate the first scene to begin this episode.
                    </p>
                </div>
            )}
        </div>
    );
}