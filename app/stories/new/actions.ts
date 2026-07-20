// app/stories/new/actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { stories, episodes } from "@/db/schemas";

export async function createStoryAction(formData: FormData) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const title = String(formData.get("title") ?? "").trim();
    const premise = String(formData.get("premise") ?? "").trim();

    if (!title) {
        // Thrown errors from a server action surface via the nearest error
        // boundary. Fine for a hackathon MVP; swap for inline field validation
        // (e.g. with a form library) if you want a nicer failure state later.
        throw new Error("Title is required");
    }

    const [story] = await db
        .insert(stories)
        .values({
            clerkUserId: userId,
            title,
            premise: premise || null,
        })
        .returning();

    const [episode] = await db
        .insert(episodes)
        .values({
            storyId: story.id,
            episodeNumber: 1,
            title: "Pilot",
            status: "drafting",
        })
        .returning();

    redirect(`/stories/${story.id}/episodes/${episode.id}`);
}