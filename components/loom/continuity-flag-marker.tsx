// components/loom/continuity-flag-marker.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ContinuityFlag } from "@/lib/types";
import { IconPencil } from "@tabler/icons-react"

// Rendered as a small sienna pin in the manuscript margin; expands on click
// like a tracked-changes comment. Deliberately not a toast/banner — the
// manuscript stays a document, not a dashboard with alerts layered on top.
export function ContinuityFlagMarker({ flag }: { flag: ContinuityFlag }) {
    const [open, setOpen] = useState(false);

    return (
        <span className="relative inline-block align-top">
            <button
                onClick={() => setOpen((o) => !o)}
                aria-label="View continuity note"
                className={cn(
                    "ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full",
                    "bg-[oklch(0.55_0.15_35)] text-[oklch(0.98_0.01_90)]",
                    "hover:scale-110 transition-transform"
                )}
            >
                <IconPencil className="h-2.5 w-2.5" />
            </button>

            {open && (
                <div
                    className={cn(
                        "absolute left-5 top-0 z-10 w-64 rounded-md border border-border",
                        "bg-popover p-3 text-xs text-popover-foreground shadow-md"
                    )}
                >
                    <p className="mb-1 font-heading uppercase tracking-wide text-[10px] text-muted-foreground">
                        {flag.flagType === "contradiction" ? "Contradiction" : flag.flagType === "drift" ? "Character drift" : "Unresolved thread"}
                    </p>
                    <p>{flag.description}</p>
                </div>
            )}
        </span>
    );
}