import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { FeedItem } from "../../types/feed";

export type SwipePayload = {
  profile_id: number;
  direction: "skip" | "jam";
};

type SwipeContext = {
  prev?: FeedItem[];
};

export function useSwipe() {
  const qc = useQueryClient();

  return useMutation<any, Error, SwipePayload, SwipeContext>({
    mutationFn: async (payload) => {
      const res = await apiClient.post("/feed/swipe", payload);
      return res.data.data;
    },

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["feed"] });

      const prev = qc.getQueryData<FeedItem[]>(["feed"]);

      qc.setQueryData<FeedItem[]>(["feed"], (old) =>
        old ? old.slice(1) : []
      );

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(["feed"], ctx.prev);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}
