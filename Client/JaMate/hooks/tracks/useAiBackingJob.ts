import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

export function useAiBackingJob(jobId: number | null) {
  return useQuery({
    queryKey: ["ai-backing-job", jobId],
    enabled: !!jobId,
    refetchInterval: (query) => {
      if (!query.state.data) return 2000;
      if (query.state.data.status === "done") return false;
      if (query.state.data.status === "failed") return false;
      return 2000; 
    },
    queryFn: async () => {
      const res = await apiClient.get(
        `/ai-backing-jobs/${jobId}`
      );
      return res.data;
    },
  });
}
