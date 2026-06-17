import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(80,120,255,0.25),_transparent_40%)]" />
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-8 px-6 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm">
          <Sparkles className="h-4 w-4 text-primary" /> AI-Powered Support Operations
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
          Classify Support Tickets with Enterprise-Grade AI
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Intelligent ticket triage with confidence scoring, model transparency, and real-time health monitoring.
        </p>
        <Link href="/dashboard">
          <Button size="lg">
            Open Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>
    </main>
  );
}
