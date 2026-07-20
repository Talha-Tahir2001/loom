// components/loom/story-bible-panel.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Character, WorldRule } from "@/lib/types";

interface StoryBiblePanelProps {
    characters: Character[];
    worldRules: WorldRule[];
}

export function StoryBiblePanel({ characters, worldRules }: StoryBiblePanelProps) {
    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
            <h2 className="mb-3 font-heading text-xs uppercase tracking-widest text-muted-foreground">
                Story Bible
            </h2>
            <Tabs defaultValue="characters" className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <TabsList className="w-full">
                    <TabsTrigger value="characters" className="flex-1">
                        Characters
                    </TabsTrigger>
                    <TabsTrigger value="rules" className="flex-1">
                        World Rules
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="characters" className="min-h-0 flex-1 space-y-2 overflow-y-auto pt-2">
                    {characters.map((c) => (
                        <div key={c.id} className="rounded-md border border-border bg-card p-3">
                            <p className="font-heading text-sm tracking-wide text-card-foreground">{c.name}</p>
                            {c.arcSummary && (
                                <p className="mt-1 text-xs text-muted-foreground">{c.arcSummary}</p>
                            )}
                        </div>
                    ))}
                    {characters.length === 0 && (
                        <p className="text-xs text-muted-foreground">No characters recorded yet.</p>
                    )}
                </TabsContent>

                <TabsContent value="rules" className="min-h-0 flex-1 space-y-2 overflow-y-auto pt-2">
                    {worldRules.map((r) => (
                        <div key={r.id} className="rounded-md border border-border bg-card p-3">
                            <p className="font-heading text-[10px] uppercase tracking-widest text-muted-foreground">
                                {r.category}
                            </p>
                            <p className="mt-1 text-xs text-card-foreground">{r.ruleText}</p>
                        </div>
                    ))}
                    {worldRules.length === 0 && (
                        <p className="text-xs text-muted-foreground">No world rules established yet.</p>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
