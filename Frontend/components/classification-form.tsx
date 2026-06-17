"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { classifyTicket } from "@/lib/api";
import type { PredictionResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ClassificationForm({
  onPrediction,
  loading,
  setLoading
}: {
  onPrediction: (value: PredictionResponse) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (title.trim().length < 3 || description.trim().length < 5) {
      toast.error("Please provide a meaningful title and description.");
      return;
    }
    setLoading(true);
    try {
      const prediction = await classifyTicket({ title, description });
      onPrediction(prediction);
      toast.success("Ticket classified successfully.");
    } catch (error) {
      toast.error("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input onChange={(e) => setTitle(e.target.value)} placeholder="Ticket title" value={title} />
        <Textarea
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue in detail..."
          value={description}
        />
        <Button className="w-full" disabled={loading} type="submit">
          {loading ? "Classifying..." : "Classify Ticket"}
        </Button>
      </form>
    </Card>
  );
}
