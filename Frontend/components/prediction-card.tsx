"use client";

import { motion } from "framer-motion";

import type { PredictionResponse } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function PredictionCard({ prediction }: { prediction: PredictionResponse }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Prediction</h3>
          <Badge>{prediction.priority.toUpperCase()}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Category: {prediction.category}</p>
        <div className="space-y-1">
          <p className="text-sm">Confidence {(prediction.confidence * 100).toFixed(2)}%</p>
          <Progress value={prediction.confidence * 100} />
        </div>
        <div className="rounded-md border border-border bg-background/40 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Agent Solution</p>
          <p className="mt-1 text-sm leading-6">{prediction.agent_solution}</p>
        </div>
        <div className="min-h-44 rounded-md border border-border bg-background/40 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Customer Reply</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7">{prediction.customer_reply}</p>
        </div>
        <p className="text-xs text-muted-foreground">Model used: {prediction.model_used}</p>
        <p className="text-xs text-muted-foreground">Vectorizer used: {prediction.vectorizer_used}</p>
      </Card>
    </motion.div>
  );
}
