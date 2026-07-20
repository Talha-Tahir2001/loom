// app/stories/new/page.tsx
import Link from "next/link";
import { IconArrowLeft } from '@tabler/icons-react'
import { Button } from "@/components/ui/button";
import { createStoryAction } from "./actions";
import { Textarea } from "@/components/ui/textarea";

export default function NewStoryPage() {
    return (
        <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
            <Link
                href="/stories"
                className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
                <IconArrowLeft className="h-4 w-4" />
                Back to stories
            </Link>

            <h1 className="mb-2 font-serif text-2xl">Start a new story</h1>
            <p className="mb-8 text-sm text-muted-foreground">
                Give your writers&apos; room a premise to work from — you can expand the
                story bible with characters and world rules once the room gets going.
            </p>

            <form action={createStoryAction} className="space-y-5">
                <div className="space-y-1.5">
                    <label
                        htmlFor="title"
                        className="font-heading text-xs uppercase tracking-widest text-muted-foreground"
                    >
                        Title
                    </label>
                    <input
                        id="title"
                        name="title"
                        required
                        placeholder="The Long Hallway"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 font-serif text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>

                <div className="space-y-1.5">
                    <label
                        htmlFor="premise"
                        className="font-heading text-xs uppercase tracking-widest text-muted-foreground"
                    >
                        Premise <span className="normal-case text-muted-foreground/70">(optional)</span>
                    </label>
                    <Textarea
                        id="premise"
                        name="premise"
                        rows={5}
                        placeholder="A detective investigates a hallway that grows a new door every night she isn't looking."
                        className="w-full rounded-md border border-input bg-background px-3 py-2 font-serif text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>

                <Button type="submit" size="lg" className="w-full">
                    Create story &amp; write Episode 1
                </Button>
            </form>
        </div>
    );
}