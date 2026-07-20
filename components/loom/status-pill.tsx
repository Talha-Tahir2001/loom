// components/loom/status-pill.tsx
import { cn } from "@/lib/utils";
import type { EpisodeStatus } from "@/lib/types";

const STATUS_CONFIG: Record<EpisodeStatus, { label: string; dotClassName: string }> = {
    drafting: { label: "Drafting", dotClassName: "bg-muted-foreground" },
    writing: { label: "Writing", dotClassName: "bg-primary animate-pulse" },
    reviewing: { label: "Reviewing", dotClassName: "bg-primary animate-pulse" },
    complete: { label: "Complete", dotClassName: "bg-chart-2" },
    flagged: { label: "Flagged", dotClassName: "bg-destructive" },
};

export function StatusPill({ status }: { status: EpisodeStatus }) {
    const config = STATUS_CONFIG[status];
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-heading tracking-wide text-card-foreground">
            <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClassName)} />
            {config.label}
        </span>
    );
}