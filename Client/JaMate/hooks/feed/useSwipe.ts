import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export type SwipePayload = {
  profile_id: number;
  direction: "skip" | "jam";
};

export function useSwipe() {
  return useMutation({
    mutationFn: async (payload: SwipePayload) => {
      const res = await apiClient.post("/feed/swipe", payload);
      return res.data.data;
    },
  });
}
