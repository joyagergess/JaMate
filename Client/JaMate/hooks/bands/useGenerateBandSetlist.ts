import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export function useGenerateBandSetlist(
  bandId?: number,
  onStart?: () => void
) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!bandId) throw new Error("Missing bandId");
      return apiClient.post(`/bands/${bandId}/setlist/generate`);
    },
    onMutate: () => {
      onStart?.(); 
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["band-setlist", bandId],
      });
    },
  });
}
