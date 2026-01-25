import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

type AiBackingJob = {
  id: number;
  status: "pending" | "processing" | "done" | "failed";
};

export function useAiBackingJob(jobId: number | null) {
  return useQuery<AiBackingJob>({
    queryKey: ["ai-backing-job", jobId],
    queryFn: async () => {
      const res = await apiClient.get(`/ai-backing-jobs/${jobId}`);
      return res.data.data;
    },
    enabled: !!jobId,
    refetchInterval: 3000,
    refetchOnWindowFocus: false,
  });
}
