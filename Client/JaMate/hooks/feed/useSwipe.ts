import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export type SwipePayload = {
  profile_id: number;
  direction: "skip" | "jam";
};

export function useSwipe() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SwipePayload) => {
      const res = await apiClient.post("/feed/swipe", payload);
      return res.data.data as {
        matched: boolean;
        conversation_id?: number;
      };
    },

    onSuccess: (data) => {
      if (data.matched) {
        qc.invalidateQueries({ queryKey: ["matches"] });
      }
    },
  });
}
