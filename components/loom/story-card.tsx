// components/loom/story-card.tsx
import Link from "next/link";
import { IconBook, IconArrowRight } from "@tabler/icons-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
        <Link href={href} className="group block h-full">
            <Card className="h-full border border-border shadow-none transition-colors group-hover:border-primary/50">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2 font-heading text-[10px] uppercase tracking-widest">
                        <IconBook className="h-4 w-4" />
                        {episodeCount} {episodeCount === 1 ? "episode" : "episodes"}
                    </CardDescription>
                    <CardTitle className="font-serif text-lg text-card-foreground">
                        {story.title}
                    </CardTitle>
                </CardHeader>
                {story.premise && (
                    <CardContent>
                        <p className="line-clamp-2 text-sm text-muted-foreground">{story.premise}</p>
                    </CardContent>
                )}
                <CardFooter className="mt-auto justify-end gap-1 font-heading text-xs uppercase tracking-widest text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Continue
                    <IconArrowRight className="h-3 w-3" />
                </CardFooter>
            </Card>
        </Link>
    );
}
