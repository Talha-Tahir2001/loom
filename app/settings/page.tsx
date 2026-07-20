// app/settings/page.tsx
import { UserProfile } from "@clerk/nextjs";
import { NavRail } from "@/components/loom/nav-rail";

export default function SettingsPage() {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <NavRail activeItem="settings" />

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-14 shrink-0 items-center border-b border-border px-6">
                    <h1 className="font-heading text-sm uppercase tracking-widest text-muted-foreground">
                        Settings
                    </h1>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    <UserProfile routing="hash" />
                </main>
            </div>
        </div>
    );
}