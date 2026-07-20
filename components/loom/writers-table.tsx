// components/loom/writers-table.tsx
import { cn } from "@/lib/utils";
import type { AgentSeat, AgentStatus } from "@/lib/types";

const STATUS_STYLES: Record<AgentStatus, string> = {
    idle: "bg-muted-foreground/40",
    thinking: "bg-primary/60 animate-pulse",
    writing: "bg-primary animate-pulse",
    reviewing: "bg-primary animate-pulse",
    done: "bg-chart-2",
    error: "bg-destructive",
};

export function WritersTable({ seats }: { seats: AgentSeat[] }) {
    return (
        <div className="border-b border-border p-4">
            <h2 className="mb-3 font-heading text-xs uppercase tracking-widest text-muted-foreground">
                Writers Table
            </h2>
            <ul className="space-y-2.5">
                {seats.map((seat) => (
                    <li key={seat.name} className="flex items-start gap-2.5">
                        <span
                            className={cn(
                                "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                                STATUS_STYLES[seat.status]
                            )}
                            aria-hidden
                        />
                        <div className="min-w-0">
                            <p className="truncate text-sm text-card-foreground">{seat.label}</p>
                            {seat.lastActivity && (
                                <p className="truncate text-xs text-muted-foreground">{seat.lastActivity}</p>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}