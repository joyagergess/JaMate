import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export function useAcceptBandSuggestion() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (suggestionId: number) => {
      console.log("🚀 [ACCEPT] sending request", suggestionId);

      const res = await apiClient.post(
        `/bands/suggestions/${suggestionId}/accept`
      );

      console.log("✅ [ACCEPT] response", res.data);
      return res.data;
    },

    onSuccess: async () => {
      console.log("🔄 [ACCEPT] invalidating queries");

      await qc.invalidateQueries({ queryKey: ["band-suggestions"] });
      await qc.invalidateQueries({ queryKey: ["conversations"] });
    },

    onError: (err: any) => {
      console.error("❌ [ACCEPT] error", err?.response?.data || err);
    },

    onSettled: () => {
      console.log("🟡 [ACCEPT] settled");
    },
  });
}
