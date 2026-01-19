import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export function useDeleteTrack() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (trackId: number) => {
      await apiClient.delete(`/tracks/${trackId}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-tracks"] });
    },
  });
}
