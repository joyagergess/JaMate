import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export function useAiBackingJob(jobId: number | null) {
  return useQuery({
    queryKey: ["ai-backing-job", jobId],
    queryFn: () => apiClient.get(`/ai-backing-jobs/${jobId}`).then(r => r.data),
    enabled: !!jobId,            
    refetchInterval: 3000,         
    refetchOnWindowFocus: false,
  });
}
