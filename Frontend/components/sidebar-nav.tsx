"use client";

import Link from "next/link";
import { Bot, LayoutDashboard } from "lucide-react";

import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export function SidebarNav() {
  return (
    <Card className="h-fit space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <p className="font-semibold">AI Ops Desk</p>
        </div>
        <ThemeToggle />
      </div>
      <div className="space-y-2">
        <Link className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted/70" href="/">
          <Bot className="h-4 w-4" /> Landing
        </Link>
        <Link className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted/70" href="/dashboard">
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </Link>
      </div>
    </Card>
  );
}
