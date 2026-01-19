import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export function useUpdateTrackTitle() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      trackId,
      title,
    }: {
      trackId: number;
      title: string;
    }) => {
      const { data } = await apiClient.patch(
        `/tracks/${trackId}/title`,
        { title }
      );
      return data.track;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-tracks"] });
    },
  });
}
