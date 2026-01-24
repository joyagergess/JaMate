import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export function useAcceptBandSuggestion() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (suggestionId: number) => {

      const res = await apiClient.post(
        `/bands/suggestions/${suggestionId}/accept`
      );

      return res.data;
    },

    onSuccess: async () => {

      await qc.invalidateQueries({ queryKey: ["band-suggestions"] });
      await qc.invalidateQueries({ queryKey: ["conversations"] });
    },

  });
}
