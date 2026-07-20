import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconUsers, IconPencil, IconGitBranch, IconBook, IconArrowRight } from '@tabler/icons-react'
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

const FEATURES = [
  {
    icon: IconUsers,
    title: "A writers' room, not a prompt box",
    description:
      "Concept, Plotter, Dialogue, and Continuity agents work in sequence like a real writers' table — each with its own focus, handing off scenes as they go.",
  },
  {
    icon: IconGitBranch,
    title: "Continuity that actually holds",
    description:
      "Every scene is checked against your story bible as it's written. Contradictions surface as inline notes, not silent plot holes discovered three episodes later.",
  },
  {
    icon: IconBook,
    title: "A story bible that grows itself",
    description:
      "Characters, world rules, and arcs are extracted and indexed automatically, so the world stays consistent without you maintaining a spreadsheet by hand.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="flex h-16 items-center justify-between border-b border-border px-6 md:px-10">
        <div className="flex items-center gap-2">
          <IconPencil className="h-5 w-5 text-primary" />
          <span className="font-heading text-sm tracking-widest">LOOM</span>
        </div>
        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">Get started</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Button size="sm" variant="ghost">
              <Link href="/stories">Go to dashboard</Link>
            </Button>
            <UserButton />
          </Show>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-20 text-center md:px-10">
        <p className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-heading uppercase tracking-widest text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Multi-agent writers&apos; room
        </p>
        <h1 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
          Interactive fiction, written by a room of agents that don&apos;t forget the last episode.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
          Loom drafts, plots, and writes episodic stories scene by scene — while a
          dedicated Continuity Checker keeps characters and world rules from
          quietly contradicting themselves.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button size="lg">
            <Link href="/sign-up">
              Start a story
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline">
            <Link href="#preview">See how it works</Link>
          </Button>
        </div>
      </section>

      {/* Product preview */}
      <section id="preview" className="mx-auto max-w-4xl px-6 pb-20 md:px-10">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="ml-3 font-heading text-xs tracking-wide text-muted-foreground">
              Ep. 3: The Long Hallway — Writing
            </span>
          </div>
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[1fr_200px]">
            <div className="font-serif text-sm leading-7 text-foreground">
              <p className="mb-1 font-heading text-[10px] uppercase tracking-widest text-muted-foreground">
                Scene 2
              </p>
              The hallway stretched further than the blueprints allowed, its walls
              lined with doors that hadn&apos;t existed yesterday.{" "}
              <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[oklch(0.55_0.15_35)] align-top text-[9px] text-[oklch(0.98_0.01_90)]">
                !
              </span>
              <span className="after:ml-0.5 after:inline-block after:animate-pulse after:content-['▍']" />
            </div>
            <div className="space-y-2 border-t border-border pt-4 text-xs md:border-l md:border-t-0 md:pl-6 md:pt-0">
              <p className="font-heading uppercase tracking-widest text-muted-foreground">
                Writers Table
              </p>
              <p className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-chart-2" /> Concept
              </p>
              <p className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-chart-2" /> Plotter
              </p>
              <p className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Dialogue
              </p>
              <p className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" /> Continuity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-4xl px-6 pb-24 md:px-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-lg border border-border bg-card p-5">
              <Icon className="mb-3 h-5 w-5 text-primary" />
              <h3 className="mb-1.5 font-heading text-sm tracking-wide">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted-foreground md:px-10">
        Loom — built for the Global AI Hackathon with Qwen Cloud.
      </footer>
    </div>
  );
}