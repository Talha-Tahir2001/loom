// // components/loom/top-bar.tsx
// import { Button } from "@/components/ui/button";
// import { StatusPill } from "@/components/loom/status-pill";
// import type { Episode } from "@/lib/types";
// // import { ChevronRight, Sparkles } from "lucide-react";
// import { IconChevronRight, IconSparkles } from "@tabler/icons-react";

// interface TopBarProps {
//     storyTitle: string;
//     episode: Episode;
//     onGenerateNext?: () => void;
//     isGenerating?: boolean;
// }

// export function TopBar({ storyTitle, episode, onGenerateNext, isGenerating }: TopBarProps) {
//     return (
//         <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
//             <div className="flex min-w-0 items-center gap-1.5 text-sm">
//                 <span className="truncate text-muted-foreground">{storyTitle}</span>
//                 <IconChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
//                 <span className="truncate font-heading tracking-wide">
//                     Ep. {episode.episodeNumber}: {episode.title}
//                 </span>
//             </div>

//             <div className="flex shrink-0 items-center gap-3">
//                 <StatusPill status={episode.status} />
//                 <Button size="sm" onClick={onGenerateNext} disabled={isGenerating}>
//                     <IconSparkles className="h-4 w-4" />
//                     {isGenerating ? "Generating…" : "Generate next scene"}
//                 </Button>
//             </div>
//         </header>
//     );
// }

// components/loom/top-bar.tsx
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/loom/status-pill";
import type { Episode } from "@/lib/types";
import { IconChevronRight, IconSparkles } from "@tabler/icons-react";

interface TopBarProps {
    storyTitle: string;
    episode: Episode;
    onGenerateNext?: () => void;
    isGenerating?: boolean;
    tokensUsed?: number;
}

export function TopBar({ storyTitle, episode, onGenerateNext, isGenerating, tokensUsed }: TopBarProps) {
    return (
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
            <div className="flex min-w-0 items-center gap-1.5 text-sm">
                <span className="truncate text-muted-foreground">{storyTitle}</span>
                <IconChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate font-heading tracking-wide">
                    Ep. {episode.episodeNumber}: {episode.title}
                </span>
            </div>

            <div className="flex shrink-0 items-center gap-3">
                {typeof tokensUsed === "number" && tokensUsed > 0 && (
                    <span
                        className="font-heading text-[10px] uppercase tracking-widest text-muted-foreground"
                        title="Total tokens used across the writers' room for this scene"
                    >
                        {tokensUsed.toLocaleString()} tokens
                    </span>
                )}
                <StatusPill status={episode.status} />
                <Button size="sm" onClick={onGenerateNext} disabled={isGenerating}>
                    <IconSparkles className="h-4 w-4" />
                    {isGenerating ? "Generating…" : "Generate next scene"}
                </Button>
            </div>
        </header>
    );
}