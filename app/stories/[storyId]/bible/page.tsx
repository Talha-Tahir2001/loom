// app/stories/[storyId]/bible/page.tsx
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { stories, characters as charactersTable, worldRules as worldRulesTable } from "@/db/schemas";
import { NavRail } from "@/components/loom/nav-rail";
import { StoryBiblePanel } from "@/components/loom/story-bible-panel";

interface PageProps {
    params: Promise<{ storyId: string }>;
}

export default async function StoryBiblePage({ params }: PageProps) {
    const { storyId } = await params;
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const [story] = await db.select().from(stories).where(eq(stories.id, storyId));
    if (!story || story.clerkUserId !== userId) notFound();

    const [storyCharacters, storyWorldRules] = await Promise.all([
        db.select().from(charactersTable).where(eq(charactersTable.storyId, storyId)),
        db.select().from(worldRulesTable).where(eq(worldRulesTable.storyId, storyId)),
    ]);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <NavRail activeItem="bible" storyId={storyId} />

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-14 shrink-0 items-center border-b border-border px-6">
                    <h1 className="truncate font-heading text-sm uppercase tracking-widest text-muted-foreground">
                        {story.title} — Story Bible
                    </h1>
                </header>

                <main className="flex-1 overflow-hidden">
                    <div className="mx-auto h-full max-w-2xl p-6">
                        <StoryBiblePanel
                            characters={storyCharacters.map((c) => ({ ...c, traits: c.traits ?? {} }))}
                            worldRules={storyWorldRules}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}