import Link from "next/link";
import { Target, Shield, Zap } from "lucide-react";
import { PrimaryButton } from "@/components/PrimaryButton";

const PILLARS = [
  {
    title: "Spend future money carefully.",
    copy: "Commit to saving, not spending.",
    icon: Target,
  },
  {
    title: "Build safety before growth.",
    copy: "Emergency funds protect your future.",
    icon: Shield,
  },
  {
    title: "Automate once you can.",
    copy: "Make smart money habits effortless.",
    icon: Zap,
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="px-6 pt-16 text-center">
        <div className="mx-auto max-w-xl space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
            <Target className="h-8 w-8 text-primary" aria-hidden />
          </div>
          <div className="space-y-3">
            <h1 className="font-display text-4xl text-foreground">
              NextStep Money
            </h1>
            <p className="text-base text-muted-foreground">
              Take control in 60 seconds.
            </p>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-12">
        <div className="w-full max-w-xl space-y-8">
          <Link href="/intake/1" aria-label="Start your plan" className="block">
            <PrimaryButton className="h-14 text-lg">Start →</PrimaryButton>
          </Link>
          <section className="space-y-4">
            {PILLARS.map((pillar) => (
              <article
                key={pillar.title}
                className="flex items-start gap-3 rounded-2xl border border-input bg-card/90 p-5 shadow-sm"
              >
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <pillar.icon className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {pillar.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {pillar.copy}
                  </p>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>

      <footer className="border-t border-input bg-card/80 px-6 py-6">
        <nav className="mx-auto flex max-w-md items-center justify-center gap-6 text-sm text-muted-foreground">
          <Link
            href="/privacy"
            className="rounded-full px-1 transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Privacy
          </Link>
          <a
            href="mailto:hello@nextstepmoney.com"
            className="rounded-full px-1 transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Contact
          </a>
        </nav>
      </footer>
    </div>
  );
}
