import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  IconArrowRight,
  IconBook,
  IconGitBranch,
  IconMessageDots,
  IconPencil,
  IconRoute,
  IconSparkles,
  IconUsers,
} from '@tabler/icons-react'
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

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

const WORKFLOW = [
  {
    number: "01",
    title: "Bring the premise",
    description: "Start with a title and a spark. Loom turns your premise into a living story bible.",
  },
  {
    number: "02",
    title: "Let the room build",
    description: "Concept and Plotter shape the next beat while Dialogue turns it into a scene you can read immediately.",
  },
  {
    number: "03",
    title: "Choose what happens next",
    description: "Pick a direction, create a new story path, and keep every alternate timeline available to revisit.",
  },
];

const ROOM_NOTES = [
  { icon: IconMessageDots, label: "Live handoffs", text: "Watch each agent pass its work to the next." },
  { icon: IconRoute, label: "Branching paths", text: "Turn reader choices into persistent timelines." },
  { icon: IconSparkles, label: "Qwen-powered", text: "Fast, expressive generation for every scene." },
];

export default async function LandingPage() {
  const { userId } = await auth();
  const getStartedLink = userId ? "/stories" : "/sign-up";

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
            <Link href={getStartedLink} className="inline-flex items-center gap-1.5">
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

      {/* How it works */}
      <section className="border-y border-border bg-card/40 px-6 py-20 md:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 max-w-xl">
            <p className="mb-3 font-heading text-[10px] uppercase tracking-widest text-primary">
              From spark to story
            </p>
            <h2 className="font-serif text-3xl leading-tight md:text-4xl">
              A creative process you can actually watch.
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Loom makes the invisible parts of writing visible: the handoffs, the disagreements,
              the continuity checks, and the moment a reader changes the direction of the story.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
            {WORKFLOW.map((step) => (
              <div key={step.number} className="bg-background p-6">
                <p className="mb-8 font-heading text-xs tracking-widest text-primary">{step.number}</p>
                <h3 className="mb-2 font-heading text-sm tracking-wide">{step.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product promises */}
      <section className="mx-auto max-w-4xl px-6 py-20 md:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <p className="mb-3 font-heading text-[10px] uppercase tracking-widest text-primary">
              Built for stories with a memory
            </p>
            <h2 className="font-serif text-3xl leading-tight md:text-4xl">
              Your world keeps its promises.
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Characters, setting facts, and unresolved threads become part of the bible as the room
              writes. When something drifts, Continuity marks it directly in the manuscript.
            </p>
            <Button className="mt-6" variant="outline">
              <Link href={getStartedLink} className="inline-flex items-center gap-1.5">
                Build a world
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            {ROOM_NOTES.map(({ icon: Icon, label, text }) => (
              <div key={label} className="flex items-start gap-4 rounded-lg border border-border bg-card p-4">
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-sm tracking-wide">{label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-4xl px-6 pb-24 md:px-10">
        <div className="rounded-xl border border-border bg-card px-6 py-12 text-center md:px-12">
          <p className="mb-3 font-heading text-[10px] uppercase tracking-widest text-primary">
            The room is waiting
          </p>
          <h2 className="font-serif text-3xl leading-tight md:text-4xl">
            Give your next story somewhere to go.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
            Start with one premise. Follow the branches. Keep the world intact.
          </p>
          <Button size="lg" className="mt-7">
            <Link href={getStartedLink} className="inline-flex items-center gap-1.5">
              Start writing with Loom
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted-foreground md:px-10">
        Loom — built for the Global AI Hackathon with Qwen Cloud.
      </footer>
    </div>
  );
}
