import type { PredictionResponse } from "@/lib/types";
import { Card } from "@/components/ui/card";

export function RecentPredictions({ items }: { items: PredictionResponse[] }) {
  return (
    <Card className="space-y-3">
      <h3 className="text-sm font-semibold">Recent Predictions</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No predictions yet.</p>
      ) : (
        <div className="space-y-2">
          {items.slice(0, 5).map((item, idx) => (
            <div className="rounded-md border border-border p-2 text-sm" key={`${item.category}-${idx}`}>
              <p>{item.category}</p>
              <p className="text-xs text-muted-foreground">
                {item.priority} - {(item.confidence * 100).toFixed(1)}%
              </p>
              <p className="line-clamp-2 text-xs text-muted-foreground">{item.customer_reply}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
