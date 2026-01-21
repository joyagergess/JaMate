import { useState } from "react";
import { apiClient } from "@/api/client";

export type JamLabels = {
  trackALabel: string;
  trackBLabel: string;
};

export function useJamAnalyze() {
  const [result, setResult] = useState<any>(null);
  const [labels, setLabels] = useState<JamLabels | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (
    trackAId: number,
    trackBId: number,
    jamLabels: JamLabels
  ) => {
    try {
      setLoading(true);
      setError(null);
      setLabels(jamLabels);

      const res = await apiClient.post("/jams/analyze", {
        track_a_id: trackAId,
        track_b_id: trackBId,
      });

      setResult(res.data.data);
    } catch (e: any) {
      console.error("Jam analysis failed:", e?.response ?? e);
      setError("Failed to analyze jam");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setLabels(null);
    setError(null);
    setLoading(false);
  };

  return {
    analyze,
    result,
    labels,
    loading,
    error,
    reset,
  };
}
