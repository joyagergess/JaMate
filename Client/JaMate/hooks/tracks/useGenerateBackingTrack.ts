import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

export function useGenerateBackingTrack() {
  return useMutation({
    mutationFn: async (trackId: number) => {
      const res = await apiClient.post(
        `/tracks/${trackId}/generate-backing`
      );
      return res.data;
    },
  });
}
