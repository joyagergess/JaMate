import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export function useDeleteProfileMedia() {
  return useMutation({
    mutationFn: async (mediaId: number) => {
      const res = await apiClient.delete(
        `/profile/media/destroy/${mediaId}`
      );

      return res.data;
    },
  });
}
