// app/stories/page.tsx
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { stories as storiesTable, episodes as episodesTable } from "@/db/schemas";
import { NavRail } from "@/components/loom/nav-rail";

import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { StoryCard } from "@/components/loom/story-card";

export default async function StoriesPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const userStories = await db
        .select()
        .from(storiesTable)
        .where(eq(storiesTable.clerkUserId, userId))
        .orderBy(desc(storiesTable.updatedAt));

    // One query per story to find its latest episode — fine at hackathon
    // scale (a handful of stories per user). Worth collapsing into a single
    // query with a window function (DISTINCT ON / ROW_NUMBER) if this ever
    // needs to handle many stories per user.
    const storyCards = await Promise.all(
        userStories.map(async (story) => {
            const storyEpisodes = await db
                .select()
                .from(episodesTable)
                .where(eq(episodesTable.storyId, story.id))
                .orderBy(desc(episodesTable.episodeNumber));

            return {
                story: {
                    ...story,
                    createdAt: story.createdAt.toISOString(),
                    updatedAt: story.updatedAt.toISOString(),
                },
                episodeCount: storyEpisodes.length,
                latestEpisode: storyEpisodes[0] ? { id: storyEpisodes[0].id } : null,
            };
        })
    );

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <NavRail activeItem="episodes" />

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
                    <h1 className="font-heading text-sm uppercase tracking-widest text-muted-foreground">
                        Your stories
                    </h1>
                    <Button size="sm">
                        <Link href="/stories/new" className="inline-flex items-center gap-1.5">
                            <IconPlus className="h-4 w-4" />
                            New story
                        </Link>
                    </Button>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    {storyCards.length === 0 ? (
                        <div className="mx-auto max-w-md py-24 text-center">
                            <p className="mb-2 font-serif text-lg">No stories yet</p>
                            <p className="mb-6 text-sm text-muted-foreground">
                                Start your first story and the writers&apos; room will take it from there.
                            </p>
                            <Button>
                                <Link href="/stories/new">
                                    <IconPlus className="h-4 w-4" />
                                    Start your first story
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {storyCards.map(({ story, episodeCount, latestEpisode }) => (
                                <StoryCard
                                    key={story.id}
                                    story={story}
                                    episodeCount={episodeCount}
                                    latestEpisode={latestEpisode}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}