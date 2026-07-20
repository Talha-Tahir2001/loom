// components/loom/story-card.tsx
import Link from "next/link";
import { IconBook, IconArrowRight } from "@tabler/icons-react";
import type { Story } from "@/lib/types";

interface StoryCardProps {
    story: Story;
    episodeCount: number;
    // Only the id is needed here — kept intentionally minimal rather than
    // the full Episode type, so this component doesn't force callers to
    // serialize fields it never uses.
    latestEpisode: { id: string } | null;
}

export function StoryCard({ story, episodeCount, latestEpisode }: StoryCardProps) {
    const href = latestEpisode
        ? `/stories/${story.id}/episodes/${latestEpisode.id}`
        : `/stories/${story.id}`;

    return (
        <Link
            href={href}
            className="group flex flex-col justify-between rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50"
        >
            <div>
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                    <IconBook className="h-4 w-4" />
                    <span className="font-heading text-[10px] uppercase tracking-widest">
                        {episodeCount} {episodeCount === 1 ? "episode" : "episodes"}
                    </span>
                </div>
                <h2 className="mb-1.5 font-serif text-lg text-card-foreground">{story.title}</h2>
                {story.premise && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">{story.premise}</p>
                )}
            </div>
            <div className="mt-4 flex items-center gap-1 font-heading text-xs uppercase tracking-widest text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Continue
                <IconArrowRight className="h-3 w-3" />
            </div>
        </Link>
    );
}