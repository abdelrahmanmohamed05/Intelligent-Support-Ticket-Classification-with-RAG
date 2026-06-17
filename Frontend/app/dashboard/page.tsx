"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { ClassificationForm } from "@/components/classification-form";
import { HealthIndicator } from "@/components/health-indicator";
import { ModelInfoPanel } from "@/components/model-info-panel";
import { PredictionCard } from "@/components/prediction-card";
import { RecentPredictions } from "@/components/recent-predictions";
import { SidebarNav } from "@/components/sidebar-nav";
import { Skeleton } from "@/components/ui/skeleton";
import type { PredictionResponse } from "@/lib/types";

export default function DashboardPage() {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [history, setHistory] = useState<PredictionResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const handlePrediction = (result: PredictionResponse) => {
    setPrediction(result);
    setHistory((prev) => [result, ...prev].slice(0, 10));
  };

  return (
    <main className="min-h-screen bg-background p-4 text-foreground md:p-8">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[260px_1fr]">
        <SidebarNav />
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-2">
            <HealthIndicator />
            <ModelInfoPanel />
          </motion.div>

          <ClassificationForm loading={loading} onPrediction={handlePrediction} setLoading={setLoading} />

          {loading && <Skeleton className="h-36 w-full" />}
          {!loading && prediction && <PredictionCard prediction={prediction} />}

          <RecentPredictions items={history} />
        </div>
      </div>
    </main>
  );
}
