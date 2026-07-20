"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconBook, IconStack2, IconSettings, IconPencil } from "@tabler/icons-react";

interface NavRailProps {
    activeItem?: "episodes" | "bible" | "settings";
    // Needed to build the Story Bible link, which is scoped to one story.
    // Omit this (e.g. on the /stories dashboard, where no single story is
    // selected) and that nav item renders disabled instead of dead.
    storyId?: string;
}

const NAV_ITEMS = [
    { key: "episodes" as const, label: "Episodes", icon: IconBook, href: () => "/stories" },
    {
        key: "bible" as const,
        label: "Story Bible",
        icon: IconStack2,
        href: (storyId?: string) => (storyId ? `/stories/${storyId}/bible` : null),
    },
    { key: "settings" as const, label: "Settings", icon: IconSettings, href: () => "/settings" },
];

export function NavRail({ activeItem = "episodes", storyId }: NavRailProps) {
    return (
        <nav className="flex h-full w-16 flex-col items-center gap-1 border-r border-border bg-sidebar py-4 md:w-52 md:items-stretch md:px-3">
            <div className="mb-6 flex items-center gap-2 px-2">
                <IconPencil className="h-5 w-5 shrink-0 text-primary" />
                <span className="hidden font-heading text-sm tracking-wide text-sidebar-foreground md:inline">
                    LOOM
                </span>
            </div>

            {NAV_ITEMS.map(({ key, label, icon: Icon, href }) => {
                const isActive = key === activeItem;
                const resolvedHref = href(storyId);
                const className = cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    resolvedHref
                        ? "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        : "cursor-not-allowed opacity-40",
                    isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70"
                );

                if (!resolvedHref) {
                    return (
                        <span key={key} className={className} title="Open a story to access this">
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="hidden md:inline">{label}</span>
                        </span>
                    );
                }

                return (
                    <Link key={key} href={resolvedHref} className={className}>
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="hidden md:inline">{label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}